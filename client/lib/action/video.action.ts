"use server";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { createUploadVideoInDbParams, UploadedVideo } from "@/interface";
import { EventStatus, Status } from "@prisma/client";
import { createNotification } from "./notification.action";

// TODO: Implement revalidation and error handling

export const createdUploadedVideoInDb = async (
  params: createUploadVideoInDbParams
) => {
  try {
    const user = await currentUser();

    if (!user || !user.privateMetadata || !user.privateMetadata.userId) {
      console.error("User authentication failed");
      return {
        success: false,
        message: "User authentication failed",
      };
    }
    const userId = user.privateMetadata.userId as string;
    const { id, title, videoUrl, resolution } = params;

    // Use a transaction to combine both operations atomically
    const result = await prisma.$transaction(async (prisma) => {
      // Create the new video
      const newVideo = await prisma.video.create({
        data: {
          title: title,
          videoUrl: videoUrl,
          resolution: resolution,
        },
      });

      // Create the uploaded video linked to the user and new video
      const newUploadedVideo = await prisma.uploadedVideo.create({
        data: {
          id: id,
          userId: userId,
          status: "PENDING",
          videoId: newVideo.id, // Link the newly created Video
        },
      });

      // Increment videos uploaded by the user
      const incrementResponse = await prisma.user.update({
        where: { id: userId },
        data: {
          videosUploaded: { increment: 1 },
        },
      });
      console.log("incrementResponse", incrementResponse);
      return newUploadedVideo;
    });

    return {
      success: true,
      data: result,
      message: "Video uploaded and user video count updated successfully",
    };
  } catch (error) {
    console.error("An error occurred:", error);
    return {
      success: false,
      message: "Failed to upload video and update user",
    };
  }
};

export const fetchUploadedVideos = async (): Promise<{
  success: boolean;
  data: UploadedVideo[];
  message: string;
}> => {
  try {
    const user = await currentUser();

    if (!user || !user.privateMetadata || !user.privateMetadata.userId) {
      console.error("User authentication failed");
      return JSON.parse(
        JSON.stringify({
          success: false,
          message: "User authentication failed",
          data: [],
        })
      );
    }
    const userId = user.privateMetadata.userId as string;

    const uploadedVideos = await prisma.uploadedVideo.findMany({
      where: {
        userId: userId,
      },
      include: {
        video: true,
        TranscodedVideo: {
          include: {
            video: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return JSON.parse(
      JSON.stringify({
        success: true,
        data: uploadedVideos,
        message: "Uploaded videos fetched successfully",
      })
    );
  } catch (error) {
    console.error("An error occurred:", error);
    return JSON.parse(
      JSON.stringify({
        success: false,
        message: "Failed to fetch uploaded videos",
        data: [],
      })
    );
  }
};

export const createAndLinkTranscodedVideos = async (
  uniqueId: string,
  status: Status,
  videoData: Array<{ name: string; url: string; resolution: string }>
) => {
  try {
    const uploadedVideo = await prisma.uploadedVideo.findUnique({
      where: { id: uniqueId },
      include: {
        user: {
          select: {
            clerkId: true,
          },
        },
      },
    });

    if (!uploadedVideo || !uploadedVideo.userId) {
      throw new Error("Failed to get user id");
    }
    const userId = uploadedVideo.user?.clerkId;

    const createdVideos = await prisma.video.createManyAndReturn({
      data: videoData.map((video) => ({
        title: video.name,
        videoUrl: video.url,
        resolution: video.resolution,
      })),
      select: {
        id: true,
      },
    });

    console.log("createdVideos", createdVideos);

    if (!createdVideos || createdVideos.length === 0) {
      throw new Error("Failed to create videos");
    }

    // Extract the video IDs (this will depend on the database being used)
    const videoIds = createdVideos.map((video) => video.id);
    console.log("videoIds", videoIds);

    // Step 2: Create multiple TranscodedVideo records referencing the video IDs

    const transcodedVideosData = videoIds.map((videoId) => ({
      sourceVideoId: uniqueId,
      videoId: videoId,
    }));

    console.log("transcodedVideosData", transcodedVideosData);
    const { count } = await prisma.transcodedVideo.createMany({
      data: transcodedVideosData,
    });

    if (count === 0) {
      throw new Error("Failed to create transcoded videos");
    }

    // Step 3: Update the status of UploadedVideo
    const updatedUploadedVideo = await prisma.uploadedVideo.update({
      where: { id: uniqueId },
      data: {
        status: status,
      },
      include: {
        video: {
          select: {
            title: true,
          },
        },
      },
    });

    if (!updatedUploadedVideo) {
      throw new Error("Failed to update the uploaded video status");
    }
    await createNotification({
      uploadedVideoId: uniqueId,
      eventStatus: EventStatus.FINISHED,
    });

    return {
      success: true,
      message:
        "Transcoded videos created and uploaded video updated successfully",
      data: userId,
    };
  } catch (error: any) {
    console.error("Error in createAndLinkTranscodedVideos:", error);
    await createNotification({
      uploadedVideoId: uniqueId,
      eventStatus: EventStatus.FINISHED,
    });
    return { success: false, message: error.message, data: null };
  }
};
