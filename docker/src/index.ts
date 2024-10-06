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
    name: "480p",
    width: 854,
    height: 480,
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

async function processVideo(
  resolution: Resolution,
  originalVideo: string,
  transcodedVideos: any[]
) {
  return new Promise<void>((resolve, reject) => {
    const fileName = path.basename(originalVideo, path.extname(originalVideo));
    const outputDir = path.join(__dirname, `${fileName}-transcoded`);
    if (!fs.existsSync(outputDir)) {
      console.log(`Creating output directory: ${outputDir}`);
      fs.mkdirSync(outputDir, { recursive: true });
    } else {
      console.log(`Output directory already exists: ${outputDir}`);
    }

    const hlsPath = `${outputDir}/${resolution.name}/playlist.m3u8`; // HLS playlist output path
    const segmentPath = `${outputDir}/${resolution.name}/segment%03d.ts`; // Segment naming
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
        const outputContainerClient =
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
        }
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

async function init() {
  const transcodedVideos: any[] = [];
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
      processVideo(resolution, originalVideo, transcodedVideos)
    );
    await Promise.all(promises);
    console.log("All resolutions processed and uploaded.");
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
