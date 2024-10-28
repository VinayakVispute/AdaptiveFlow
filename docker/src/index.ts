const dotenv = require("dotenv");
const path = require("node:path");
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const axios = require("axios");
const { BlobServiceClient } = require("@azure/storage-blob");
dotenv.config();

interface Resolution {
  name: string;
  width: number;
  height: number;
}

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
  throw new Error("Missing required environment variables");
}

const blobServiceClient = BlobServiceClient.fromConnectionString(
  AZURE_STORAGE_CONNECTION_STRING
);

async function uploadFileToBlob(
  filePath: string,
  containerClient: any,
  blobName: string
) {
  console.log(`Starting upload of ${filePath} to blob: ${blobName}`);
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  const fileStream = fs.createReadStream(filePath);
  const uploadOptions = { bufferSize: 4 * 1024 * 1024, maxBuffers: 20 };
  await blockBlobClient.uploadStream(
    fileStream,
    uploadOptions.bufferSize,
    uploadOptions.maxBuffers
  );
  console.log(
    `Successfully uploaded ${filePath} to Azure Storage as ${blobName}`
  );
}

const sanitizeFileName = (fileName: string): string =>
  fileName
    .replace(/[^\w\s]/g, "_")
    .replace(/\s+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");

async function processResolution({
  resolution,
  originalVideo,
  inputVideoName,
  outputDir,
  containerClient,
  masterPlaylist,
}: {
  resolution: Resolution;
  originalVideo: string;
  inputVideoName: string;
  outputDir: string;
  containerClient: any;
  masterPlaylist: string[];
}) {
  console.log(`Processing resolution: ${resolution.name}`);
  const resolutionOutputDir = path.join(outputDir, resolution.name);
  if (!fs.existsSync(resolutionOutputDir)) {
    console.log(`Creating directory: ${resolutionOutputDir}`);
    fs.mkdirSync(resolutionOutputDir, { recursive: true });
  }

  const hlsPath = `${resolutionOutputDir}/playlist.m3u8`;
  const segmentPath = `${resolutionOutputDir}/segment%03d.ts`;

  return new Promise((resolve, reject) => {
    console.log(`Starting transcoding for ${resolution.name}`);
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
      .on("error", (err: any) => {
        console.error(`Error during transcoding for ${resolution.name}:`, err);
        reject(err);
      })
      .on("end", async () => {
        console.log(`${resolution.name} transcoding finished`);

        const bandwidth = resolution.width * resolution.height * 1.5;
        masterPlaylist.push(
          `#EXT-X-STREAM-INF:BANDWIDTH=${Math.round(bandwidth)},RESOLUTION=${
            resolution.width
          }x${resolution.height}\n${resolution.name}/playlist.m3u8\n`
        );

        console.log(`Uploading HLS playlist for ${resolution.name}`);
        await uploadFileToBlob(
          hlsPath,
          containerClient,
          `${inputVideoName}-transcoded/${resolution.name}/playlist.m3u8`
        );

        for (const segmentFile of fs
          .readdirSync(resolutionOutputDir)
          .filter((f: string) => f.endsWith(".ts"))) {
          console.log(`Uploading segment file: ${segmentFile}`);
          await uploadFileToBlob(
            path.join(resolutionOutputDir, segmentFile),
            containerClient,
            `${inputVideoName}-transcoded/${resolution.name}/${segmentFile}`
          );
        }

        resolve(void 0);
      });
  });
}

async function init() {
  console.log("Initialization started.");
  const containerClient = blobServiceClient.getContainerClient(BUCKET_NAME);
  const inputVideoName = sanitizeFileName(path.parse(INPUT_VIDEO).name);
  const inputVideoExtension = path.parse(INPUT_VIDEO).ext;
  const downloadFilePath = path.join(
    __dirname,
    `original-video${inputVideoExtension}`
  );

  console.log(`Downloading video: ${INPUT_VIDEO}`);
  await blobServiceClient
    .getContainerClient(BUCKET_NAME)
    .getBlobClient(INPUT_VIDEO)
    .downloadToFile(downloadFilePath);
  console.log(`Video downloaded: ${downloadFilePath}`);

  const originalVideo = path.resolve(downloadFilePath);
  const outputDir = path.join(__dirname, `${inputVideoName}-transcoded`);
  const masterPlaylist: string[] = [];

  const outputContainerClient =
    blobServiceClient.getContainerClient(OUTPUT_VIDEO_BUCKET);
  console.log("Starting resolution processing.");
  await Promise.all(
    RESOLUTIONS.map((resolution) =>
      processResolution({
        resolution,
        originalVideo,
        inputVideoName,
        outputDir,
        containerClient: outputContainerClient,
        masterPlaylist,
      })
    )
  );

  const masterPlaylistPath = path.join(outputDir, "index.m3u8");
  console.log("Writing master playlist.");
  fs.writeFileSync(masterPlaylistPath, `#EXTM3U\n${masterPlaylist.join("")}`);
  console.log("Uploading master playlist.");
  await uploadFileToBlob(
    masterPlaylistPath,
    outputContainerClient,
    `${inputVideoName}-transcoded/index.m3u8`
  );

  console.log("All files uploaded.");
}

init().catch(console.error);
