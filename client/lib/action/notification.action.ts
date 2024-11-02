"use server";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { EventStatus } from "@prisma/client";

export const createNotification = async ({
  uploadedVideoId,
  eventStatus,
}: {
  uploadedVideoId: string;
  eventStatus: EventStatus;
}) => {
  const response = await prisma.uploadedVideo.findUnique({
    where: { id: uploadedVideoId },
    select: {
      userId: true,
    },
  });
  if (!response || !response.userId) {
    console.error("Failed to get user id");
    return JSON.parse(
      JSON.stringify({
        success: false,
        message: "Failed to get user id",
      })
    );
  }
  const newCreatedNotification = await prisma.notifications.create({
    data: {
      userId: response.userId,
      uploadedVideoId: uploadedVideoId,
      event: eventStatus,
    },
  });
  if (!newCreatedNotification) {
    console.error("Failed to create new notification");
    return JSON.parse(
      JSON.stringify({
        success: false,
        message: "Failed to create new notification",
      })
    );
  }
  return JSON.parse(
    JSON.stringify({
      success: true,
      data: newCreatedNotification,
    })
  );
};

export const fetchNotifications = async () => {
  const user = await currentUser();
  if (!user || !user.privateMetadata || !user.privateMetadata.userId) {
    console.error("User authentication failed");
    return JSON.parse(
      JSON.stringify({
        success: false,
        message: "User authentication failed",
      })
    );
  }
  const userId = user.privateMetadata.userId as string;
  const notifications = await prisma.notifications.findMany({
    where: {
      userId: userId,
      read: false,
    },
    include: {
      uploadedVideo: {
        include: {
          video: {
            select: {
              title: true,
            },
          },
        },
      },
    },
    orderBy: [
      {
        createdAt: "desc",
      },
      {
        read: "asc", // Sort by read status in ascending order
      },
    ],
  });

  if (!notifications) {
    console.error("Failed to fetch notifications");
    return JSON.parse(
      JSON.stringify({
        success: false,
        message: "Failed to fetch notifications",
      })
    );
  }
  return JSON.parse(
    JSON.stringify({
      success: true,
      data: notifications,
    })
  );
};
