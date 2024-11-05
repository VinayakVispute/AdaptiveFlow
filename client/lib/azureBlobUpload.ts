import {
  BlockBlobClient,
  BlockBlobParallelUploadOptions,
} from "@azure/storage-blob";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { createdUploadedVideoInDb } from "./action/video.action";
import { sanitizeFileName } from "./utils";
import toast from "react-hot-toast";
import { isUserEligibleForUpload } from "./action/user.action";
// import { createdUploadedVideoInDb } from "./action/video.action";

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
    console.log("videoFileName", videoFileName);
    const fileExtension = videoFileName.split(".").pop() || "";

    if (!fileExtension || fileExtension !== "mp4") {
      console.log("Invalid file extension", fileExtension);
      throw new Error("Invalid file extension");
    }

    const baseName =
      videoFileName.substring(0, videoFileName.lastIndexOf(".")) ||
      videoFileName;
    const uniqueVideoName = `${sanitizeFileName(
      baseName
    )}_${uniqueId}.${fileExtension}`;
    console.log(`Generated unique video name: ${uniqueVideoName}`);
    console.log({
      fileExtension: fileExtension,
      baseName: baseName,
      uniqueVideoName: uniqueVideoName,
    });

    const videoSizeInMB = videoFile.size / (1024 * 1024);
    console.log(`Video size: ${videoSizeInMB} MB`);

    await isUserEligibleForUpload(videoSizeInMB);

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
        uniqueId: uniqueId,
        resolution: videoResolution,
      },
      onProgress: (ev) => {
        if (ev.loadedBytes && videoFile.size) {
          const progress = ev.loadedBytes / videoFile.size;
          console.log(`Upload progress: ${(progress * 100).toFixed(2)}%`);
          onProgress(progress);
        }
      },
      blockSize: 4 * 1024 * 1024, // 4MB block size
      concurrency: 20, // Increased number of parallel uploads for potentially faster upload
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
    });

    console.log("Video record created in database");

    return {
      success: true,
      url: blockBlobClient.url,
    };
  } catch (error: any) {
    console.error("Azure Blob direct upload failed:", error.message || error);

    let errorMessage = "Azure Blob direct upload failed.";

    if (error.message && error.message.includes("MAX_VIDEO_SIZE_EXCEEDED")) {
      errorMessage =
        "Video size exceeds the allowed limit. Please upload a smaller video.";
    } else if (
      error.message &&
      error.message.includes("MAXIMUM_VIDEOS_REACHED")
    ) {
      errorMessage = "You have reached the maximum allowed video uploads.";
    } else if (
      error.message &&
      error.message.includes("Failed to get user id")
    ) {
      errorMessage = "Failed to get user ID.";
    } else if (
      error.message &&
      error.message.includes("Invalid file extension")
    ) {
      errorMessage =
        "Invalid file extension. Please upload a valid video file.";
    } else if (
      error.message &&
      error.message.includes("Failed to fetch SAS token")
    ) {
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
