const dotenv = require("dotenv");
const path = require("node:path");
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const axios = require("axios");
const { BlobServiceClient } = require("@azure/storage-blob");
dotenv.config();

type Resolution = {
  name: string;
  width: number;
  height: number;
};

const RESOLUTIONS: Resolution[] = [
  {
    name: "360p",
    width: 640,
    height: 360,
  },
  {
    name: "480p",
    width: 854,
    height: 480,
  },
  {
    name: "720p",
    width: 1280,
    height: 720,
  },
  {
    name: "1080p",
    width: 1920,
    height: 1080,
  },
];

const AZURE_STORAGE_CONNECTION_STRING =
  process.env.AZURE_STORAGE_CONNECTION_STRING;
const BUCKET_NAME = process.env.BUCKET_NAME;
const INPUT_VIDEO = process.env.INPUT_VIDEO;
const OUTPUT_VIDEO_BUCKET = process.env.OUTPUT_VIDEO_BUCKET;
const WEBHOOK_URL = process.env.WEBHOOK_URL;
if (
  !AZURE_STORAGE_CONNECTION_STRING ||
  !BUCKET_NAME ||
  !WEBHOOK_URL ||
  !INPUT_VIDEO
) {
  throw new Error(
    "AZURE_STORAGE_CONNECTION_STRING, BUCKET_NAME, or INPUT_VIDEO is not defined in environment variables."
  );
}

const blobServiceClient = BlobServiceClient.fromConnectionString(
  AZURE_STORAGE_CONNECTION_STRING
);

const sanitizeFileName = (fileName: string): string => {
  return fileName
    .replace(/[^\w\s]/g, "_") // Replace all non-alphanumeric characters with '_'
    .replace(/\s+/g, "_") // Replace spaces with '_'
    .replace(/_+/g, "_") // Replace multiple '_' with a single '_'
    .replace(/^_+|_+$/g, ""); // Remove leading and trailing '_'
};

async function processVideo(
  resolution: Resolution,
  originalVideo: string,
  transcodedVideos: any[],
  masterPlaylist: string[]
) {
  return new Promise<void>((resolve, reject) => {
    const inputVideoName = sanitizeFileName(path.parse(INPUT_VIDEO).name);
    const outputDir = path.join(__dirname, `${inputVideoName}-transcoded`);
    if (!fs.existsSync(outputDir)) {
      console.log(`Creating output directory: ${outputDir}`);
      fs.mkdirSync(outputDir, { recursive: true });
    } else {
      console.log(`Output directory already exists: ${outputDir}`);
    }

    const resolutionOutputDir = path.join(outputDir, resolution.name); // Dynamic directory based on resolution

    if (!fs.existsSync(resolutionOutputDir)) {
      console.log(`Creating output directory: ${resolutionOutputDir}`);
      fs.mkdirSync(resolutionOutputDir, { recursive: true });
    } else {
      console.log(`Output directory already exists: ${resolutionOutputDir}`);
    }
    const hlsPath = `${resolutionOutputDir}/playlist.m3u8`; // HLS playlist output path
    const segmentPath = `${resolutionOutputDir}/segment%03d.ts`; // Segment naming
    console.log("This is the segment path", segmentPath);
    console.log(`Transcoding video to ${resolution.name}...`);
    console.log("This is hlsPath", hlsPath);

    ffmpeg(originalVideo)
      .withVideoCodec("libx264")
      .withAudioCodec("aac")
      // Set resolution dynamically
      .outputOptions([
        "-hls_time 10",
        "-hls_playlist_type vod",
        `-hls_segment_filename ${segmentPath}`,
        `-vf scale=${resolution.width}:${resolution.height}`, // Explicitly set resolution
        "-start_number 0",
        "-loglevel verbose", // Add debug log level
      ])
      .output(hlsPath)
      .on("progress", (progress: any) => {
        console.log(`Processing ${resolution.name}: ${progress.percent}% done`);
      })
      .on("error", (err: any) => {
        console.error(`Error transcoding video to ${resolution.name}:`, err);
        reject(err);
      })
      .on("end", async () => {
        console.log(`Processing ${resolution.name} finished`);

        const bandwidth = resolution.width * resolution.height * 1.5; // Simple approximation for bandwidth
        const playlistEntry = `#EXT-X-STREAM-INF:BANDWIDTH=${Math.round(
          bandwidth
        )},RESOLUTION=${resolution.width}x${resolution.height}\n${
          resolution.name
        }/playlist.m3u8\n`;

        masterPlaylist.push(playlistEntry); // Add this resolution's playlist to the master playlist

        resolve();
      })
      .run();
  });
}

async function sendWebhook(params: {
  success: boolean;
  message: string;
  data: {
    transcodedVideos: any[];
    uniqueId: string | undefined;
  };
}) {
  const { success, message, data } = params;
  console.log("Sending webhook:", {
    success,
    message,
    data: JSON.stringify(data, null, 2),
  });
  if (!success || !message || !data) {
    throw new Error("Invalid webhook parameters");
  }

  try {
    const { transcodedVideos, uniqueId } = data;
    if (!uniqueId || !transcodedVideos) {
      throw new Error("Invalid webhook data parameters");
    }

    await axios.post(`${WEBHOOK_URL}/api/webhooks/update-status`, {
      success,
      message,
      data: {
        uniqueId,
        transcodedVideos,
      },
    });
    console.log("Webhook sent:", { success, message });
  } catch (error) {
    console.error("Error sending webhook:", error);
  }
}

async function createMasterPlaylist(
  inputVideoName: string,
  masterPlaylist: string[]
) {
  const masterPlaylistPath = path.join(
    __dirname,
    `${inputVideoName}-transcoded/index.m3u8`
  );
  const masterPlaylistContent = `#EXTM3U\n${masterPlaylist.join("")}`;
  fs.writeFileSync(masterPlaylistPath, masterPlaylistContent);
  console.log(`Master playlist created at ${masterPlaylistPath}`);
}

async function init() {
  const transcodedVideos: any[] = [];
  const masterPlaylist: string[] = [];
  let uniqueid: string | undefined;
  try {
    console.log("Downloading video from Azure Blob Storage...");

    const inputVideoName = path.parse(INPUT_VIDEO).name;
    const inputVideoExtension = path.parse(INPUT_VIDEO).ext;

    if (!inputVideoName || !inputVideoExtension) {
      throw new Error("Invalid input video file name or extension.");
    }

    const containerClient = blobServiceClient.getContainerClient(BUCKET_NAME);
    const blobClient = containerClient.getBlobClient(INPUT_VIDEO);
    const { metadata } = await blobClient.getProperties();

    // if (!metadata || !metadata.uniqueid) {
    //   throw new Error("No metadata found for the video");
    // }

    // const { uniqueid } = metadata;

    console.log("This is the metadata", metadata);
    console.log(`Downloading video from blob: ${INPUT_VIDEO}`);

    const downloadFilePath = path.join(
      __dirname,
      `original-video${inputVideoExtension}`
    );

    await blobClient.downloadToFile(downloadFilePath);
    console.log(`Download complete: ${downloadFilePath}`);

    const originalVideo = path.resolve(downloadFilePath);

    console.log("Starting transcoding...");

    const promises = RESOLUTIONS.map((resolution) =>
      processVideo(resolution, originalVideo, transcodedVideos, masterPlaylist)
    );
    await Promise.all(promises);
    console.log("All resolutions processed and uploaded.");
    await createMasterPlaylist(inputVideoName, masterPlaylist);

    console.log("Webhook sent successfully.");
    console.log(transcodedVideos);
    // await sendWebhook({
    //   success: true,
    //   message: "All videos transcoded and uploaded to Azure Storage",
    //   data: {
    //     transcodedVideos,
    //     uniqueId: uniqueid,
    //   },
    // });
  } catch (error: any) {
    console.error("Error processing video:", error);
    // await sendWebhook({
    //   success: false,
    //   message: `Error during video processing: ${error.message}`,
    //   data: {
    //     transcodedVideos: [],
    //     uniqueId: uniqueid,
    //   },
    // });
  }
}

init();

{
  /*      const outputContainerClient =
          blobServiceClient.getContainerClient(OUTPUT_VIDEO_BUCKET);
        const blobName = path.basename(hlsPath);
        const blockBlobClient = outputContainerClient.getBlobClient(blobName);
        transcodedVideos.push({
          name: blobName,
          url: blockBlobClient.url,
          resolution: resolution.name,
        });
        console.log(`Uploading transcoded video to blob: ${blobName}`);
        try {
          await blockBlobClient.uploadFile(hlsPath);
          console.log(`Uploaded to Azure Storage: ${hlsPath}`);
          resolve();
        } catch (uploadError) {
          console.error(`Error uploading ${blobName}:`, uploadError);
          reject(uploadError);
        } */
}
