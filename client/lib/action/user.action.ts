"use server";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

interface isUserEligibleForUploadResponse {
  success: boolean;
  message?: string;
}

export const isUserEligibleForUpload = async (
  videoSizeInMB: number
): Promise<isUserEligibleForUploadResponse> => {
  const userDetails = await currentUser();
  if (
    !userDetails ||
    !userDetails.privateMetadata ||
    !userDetails.privateMetadata.userId
  ) {
    console.error("User authentication failed");
    // throw new Error("User not authenticated or userId not found");

    return {
      success: false,
      message: "User not authenticated",
    };
  }

  // Maximum allowed size per video in MB
  const MAX_VIDEO_SIZE_MB = parseInt(process.env.MAX_VIDEO_SIZE_MB || "100");

  // Check if video exceeds allowed size
  if (videoSizeInMB > MAX_VIDEO_SIZE_MB) {
    console.error("Video size exceeds the allowed limit");
    return {
      success: false,
      message:
        "Video size exceeds the allowed limit. Please upload a smaller video.",
    };
  }

  const userId: string = userDetails?.privateMetadata.userId as string;
  console.log("Received request from user ID:", userId);

  // Fetch user details from the database
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      videosUploaded: true,
      maxVideosAllowed: true,
    },
  });
  console.log(user, userId);

  // If user not found, or they have already uploaded the max allowed videos
  if (!user || user.videosUploaded >= user.maxVideosAllowed) {
    console.log(user?.maxVideosAllowed, user?.videosUploaded);
    console.error("User has reached the maximum allowed video uploads");
    return {
      success: false,
      message: "You have reached the maximum allowed video uploads.",
    };
  }

  // If user is eligible to upload, return true
  console.log("User is eligible to upload the video");
  return {
    success: true,
  };
};

export const checkUserAPIKey = async (userId: string) => {
  // Fetch user details from the database
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: {
      apiKey: true,
    },
  });

  // If user not found, or they don't have an API key set
  if (!user || !user.apiKey) {
    return {
      success: false,
      data: null,
    };
  }

  // If user has an API key set, return true
  return {
    success: true,
    data: user.apiKey,
  };
};
