import { ContainerClient } from "@azure/storage-blob";

const dotenv = require("dotenv");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const axios = require("axios");
const { BlobServiceClient } = require("@azure/storage-blob");

dotenv.config();

const RESOLUTIONS: Resolution[] = [
  { name: "360p", width: 640, height: 360 },
  { name: "480p", width: 854, height: 480 },
  // Additional resolutions can be added as needed
];

type Resolution = {
  name: string;
  width: number;
  height: number;
};

const {
  AZURE_STORAGE_CONNECTION_STRING,
  BUCKET_NAME,
  INPUT_VIDEO,
  OUTPUT_VIDEO_BUCKET,
  WEBHOOK_URL,
} = process.env;

if (
  !AZURE_STORAGE_CONNECTION_STRING ||
  !BUCKET_NAME ||
  !WEBHOOK_URL ||
  !INPUT_VIDEO
) {
  console.error(
    "Missing required environment variables. Please check your .env file."
  );
  throw new Error("Missing required environment variables");
}

const blobServiceClient = BlobServiceClient.fromConnectionString(
  AZURE_STORAGE_CONNECTION_STRING
);

const sanitizeFileName = (fileName: string) => {
  console.log(`Sanitizing file name: ${fileName}`);
  return fileName
    .replace(/[^\w\s]/g, "_")
    .replace(/\s+/g, "_")
    .replace(/_+/g, "_")
    .trim()
    .replace(/^_+|_+$/g, "");
};

function generateRandomNumericId(length = 10) {
  const timestamp = Date.now().toString();
  const randomNum = Math.floor(Math.random() * Math.pow(10, length));
  const combined = timestamp + randomNum.toString().padStart(length, "0");
  console.log(`Generated unique ID: ${combined.slice(-length)}`);
  return combined.slice(-length);
}

async function uploadFileToBlob(
  filePath: string,
  containerClient: ContainerClient,
  blobName: string
) {
  const randomId = generateRandomNumericId();
  const finalPath = path.join(randomId, filePath);
  console.log(
    `Initiating upload for file: ${finalPath} to Azure blob with name: ${blobName}`
  );
  const blockBlobClient = containerClient.getBlockBlobClient(finalPath);
  const fileStream = fs.createReadStream(filePath);
  const uploadOptions = { bufferSize: 4 * 1024 * 1024, maxBuffers: 20 };

  console.log(`Starting file upload: ${blobName} with options:`, uploadOptions);
  await blockBlobClient.uploadStream(
    fileStream,
    uploadOptions.bufferSize,
    uploadOptions.maxBuffers
  );
  console.log(`File ${blobName} successfully uploaded to Azure Storage`);
}

async function processVideo(
  resolution: Resolution,
  originalVideo: string,
  outputDir: string,
  containerClient: ContainerClient,
  inputVideoName: string
) {
  console.log(`Processing video for resolution: ${resolution.name}`);
  const resolutionOutputDir = path.join(outputDir, resolution.name);
  console.log({
    resolutionOutputDir,
    outputDir,
    resolution: resolution.name,
  });
  if (!fs.existsSync(resolutionOutputDir)) {
    console.log(`Creating directory: ${resolutionOutputDir}`);
    fs.mkdirSync(resolutionOutputDir, { recursive: true });
  }

  const hlsPath = path.join(resolutionOutputDir, "playlist.m3u8");
  const segmentPath = path.join(resolutionOutputDir, "segment%03d.ts");
  console.log({
    hlsPath,
    segmentPath,
  });
  if (!fs.existsSync(originalVideo)) {
    throw new Error(`Input video file not found at ${originalVideo}`);
  }
  if (!fs.existsSync(outputDir)) {
    throw new Error(`Output directory not found at ${outputDir}`);
  }

  return new Promise((resolve, reject) => {
    ffmpeg(originalVideo)
      .withVideoCodec("libx264")
      .withAudioCodec("aac")
      .outputOptions([
        "-hls_time 10",
        "-hls_playlist_type vod",
        `-hls_segment_filename ${segmentPath}`,
        `-vf scale=${resolution.width}:${resolution.height}`,
        "-start_number 0",
      ])
      .output(hlsPath)
      .on("progress", (progress: any) => {
        console.log(
          `Transcoding ${resolution.name}: ${progress.percent.toFixed(2)}% done`
        );
      })
      .on("stderr", (stderrLine: any) => console.log(stderrLine))
      .on("error", (error: any) => {
        console.error(
          `Error during ${resolution.name} transcoding: ${error.message}`
        );
        reject(error);
      })
      .on("end", async () => {
        console.log(`Completed transcoding for ${resolution.name}`);
        const bandwidth = resolution.width * resolution.height * 1.5;
        const playlistEntry = `#EXT-X-STREAM-INF:BANDWIDTH=${Math.round(
          bandwidth
        )},RESOLUTION=${resolution.width}x${resolution.height}\n${
          resolution.name
        }/playlist.m3u8\n`;

        console.log(`Uploading playlist for ${resolution.name}`);
        await uploadFileToBlob(
          hlsPath,
          containerClient,
          `${resolution.name}/playlist.m3u8`
        );

        for (const segmentFile of fs
          .readdirSync(resolutionOutputDir)
          .filter((f: any) => f.endsWith(".ts"))) {
          console.log(
            `Uploading segment file: ${segmentFile} for resolution: ${resolution.name}`
          );
          await uploadFileToBlob(
            path.join(resolutionOutputDir, segmentFile),
            containerClient,
            `${resolution.name}/${segmentFile}`
          );
        }

        resolve(playlistEntry);
      })
      .run();
  });
}

async function sendWebhook({
  success,
  message,
  data,
}: {
  success: boolean;
  message: string;
  data: any;
}) {
  console.log("Preparing to send webhook notification", {
    success,
    message,
    data,
  });
  try {
    await axios.post(`${WEBHOOK_URL}/api/webhooks/update-status`, {
      success,
      message,
      data,
    });
    console.log("Webhook successfully sent.");
  } catch (error: any) {
    console.error("Error while sending webhook:", error.message);
  }
}

async function createMasterPlaylist(
  inputVideoName: string,
  masterPlaylist: string[],
  outputContainerClient: ContainerClient
) {
  const masterPlaylistPath = path.join(
    __dirname,
    `${inputVideoName}-transcoded/index.m3u8`
  );
  const masterPlaylistContent = `#EXTM3U\n${masterPlaylist.join("")}`;

  console.log(`Creating master playlist for video: ${inputVideoName}`);

  await fs.promises.writeFile(masterPlaylistPath, masterPlaylistContent);
  await uploadFileToBlob(
    masterPlaylistPath,
    outputContainerClient,
    `index.m3u8`
  );
  console.log("Master playlist uploaded successfully.");
}

async function init() {
  console.log("Starting video processing pipeline...");
  const transcodedVideos: string[] = [];
  const masterPlaylist: string[] = [];
  let uniqueId: string;

  try {
    const inputVideoName = path.parse(INPUT_VIDEO).name;
    console.log(`Processing input video: ${INPUT_VIDEO} as ${inputVideoName}`);
    uniqueId = generateRandomNumericId();

    const downloadFilePath = path.join(
      __dirname,
      `original-video${path.parse(INPUT_VIDEO).ext}`
    );
    console.log("Downloading video from Azure to path:", downloadFilePath);
    const containerClient = blobServiceClient.getContainerClient(BUCKET_NAME);
    const blobClient = containerClient.getBlobClient(INPUT_VIDEO);
    await blobClient.downloadToFile(downloadFilePath);
    console.log("Video downloaded successfully.");

    const outputDir = path.join(
      __dirname,
      `${sanitizeFileName(inputVideoName)}-transcoded`
    );
    console.log("Output directory for transcoded videos:", outputDir);
    await fs.promises.mkdir(outputDir, { recursive: true });

    const outputContainerClient =
      blobServiceClient.getContainerClient(OUTPUT_VIDEO_BUCKET);
    console.log(
      "Beginning transcoding for resolutions:",
      RESOLUTIONS.map((r) => r.name).join(", ")
    );
    console.log({
      RESOLUTIONS,
      downloadFilePath,
      outputDir,
      outputContainerClient,
      inputVideoName,
    });
    const playlistEntries = await Promise.all(
      RESOLUTIONS.map((resolution) =>
        processVideo(
          resolution,
          downloadFilePath,
          outputDir,
          outputContainerClient,
          inputVideoName
        )
      )
    );

    masterPlaylist.push(...(playlistEntries as string[]));
    console.log("All resolutions processed. Creating master playlist...");

    await createMasterPlaylist(
      inputVideoName,
      masterPlaylist,
      outputContainerClient
    );
    console.log("All videos transcoded and master playlist created.");

    await sendWebhook({
      success: true,
      message: "Video processing completed successfully",
      data: { transcodedVideos, uniqueId },
    });
  } catch (error: any) {
    console.error("An error occurred during processing:", error.message);
    await sendWebhook({
      success: false,
      message: `Error during video processing: ${error.message}`,
      // @ts-ignore
      data: { transcodedVideos, uniqueId },
    });
  }
}

init();
console.log("Video processing script has started.");
