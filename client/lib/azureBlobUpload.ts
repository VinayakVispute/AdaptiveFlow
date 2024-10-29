import {
  BlockBlobClient,
  BlockBlobParallelUploadOptions,
} from "@azure/storage-blob";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { createdUploadedVideoInDb } from "./action/video.action";

interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export async function uploadVideoToAzureDirectly(
  videoFileName: string,
  videoFile: File,
  videoResolution: string,
  videoId: string,
  onProgress: (progress: number) => void
): Promise<UploadResult> {
  try {
    console.log("Starting upload process...");

    const uniqueId = uuidv4();
    console.log(`Generated unique ID: ${uniqueId}`);

    const fileExtension = videoFileName.split(".").pop() || "";
    const baseName =
      videoFileName.substring(0, videoFileName.lastIndexOf(".")) ||
      videoFileName;
    const uniqueVideoName = `${baseName}_${uniqueId}.${fileExtension}`;
    console.log(`Generated unique video name: ${uniqueVideoName}`);

    console.log("Requesting SAS token and upload URL from API...");
    const response = await axios.post("/api/authorize-blob", {
      fileName: uniqueVideoName,
    });

    if (!response.data.success) {
      console.error(
        "Failed to fetch SAS token from API:",
        response.data.message
      );
      throw new Error(response.data.message || "Failed to fetch SAS token");
    }

    const { uploadUrl } = response.data;
    console.log("SAS token and upload URL fetched successfully");

    const blockBlobClient = new BlockBlobClient(uploadUrl);
    console.log("Created BlockBlobClient");

    const uploadOptions: BlockBlobParallelUploadOptions = {
      blobHTTPHeaders: {
        blobContentType: videoFile.type,
      },
      metadata: {
        videoId: videoId,
        resolution: videoResolution,
      },
      onProgress: (ev: any) => {
        console.log("Upload progress:", ev, videoFile.size);
        if (ev.loadedBytes && videoFile.size) {
          const progress = ev.loadedBytes / videoFile.size;
          console.log(`Upload progress: ${(progress * 100).toFixed(2)}%`);
          onProgress(progress);
        }
      },
      blockSize: 4 * 1024 * 1024, // 4MB block size
      concurrency: 10, // Number of parallel uploads
    };

    console.log("Starting file upload...");
    await blockBlobClient.uploadData(videoFile, uploadOptions);
    console.log("File upload completed");

    // Ensure the progress reaches 100%
    onProgress(1);
    console.log("Progress set to 100%");

    console.log("Creating video record in database...");
    await createdUploadedVideoInDb({
      id: uniqueId,
      title: videoFileName,
      videoUrl: blockBlobClient.url,
      resolution: videoResolution as string,
    });
    console.log("Video record created in database");

    return {
      success: true,
      url: blockBlobClient.url,
    };
  } catch (error: any) {
    console.error("Azure Blob direct upload failed:", error.message || error);

    let errorMessage = "Azure Blob direct upload failed.";
    if (error.message && error.message.includes("Failed to fetch SAS token")) {
      errorMessage = "Failed to fetch SAS token. Please try again.";
    } else if (error.message && error.message.includes("upload")) {
      errorMessage =
        "Failed to upload video. Please check your connection and try again.";
    } else if (error.message && error.message.includes("database")) {
      errorMessage = "Failed to create video record in the database.";
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}
