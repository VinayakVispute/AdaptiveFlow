"use client";

import { NotificationState, UploadedVideo } from "@/interface";
import { fetchNotifications } from "@/lib/action/notification.action";
import { fetchUploadedVideos } from "@/lib/action/video.action";
import { Status } from "@prisma/client";
import Pusher from "pusher-js";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "@clerk/nextjs";
import toast from "react-hot-toast";

interface NotificationHistoryContextType {
  videoData: { uploadedVideos: UploadedVideo[] } | null;
  notifications: NotificationState[];
  error: string | null;
  isLoading: boolean;
  fetchVideos: () => Promise<void>;
}

const NotificationHistoryContext =
  createContext<NotificationHistoryContextType | null>(null);

export const NotificationHistoryProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [videoData, setVideoData] = useState<{
    uploadedVideos: UploadedVideo[];
  } | null>(null);
  const [notifications, setNotifications] = useState<NotificationState[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { userId, isSignedIn } = useAuth();

  const pusher_Key = process.env.NEXT_PUBLIC_PUSHER_PUSHER_KEY || "";
  const pusher_Cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "";

  const fetchData = async () => {
    console.log("Fetching video and notification data...");
    setIsLoading(true);
    setError(null);

    try {
      const [videoResponse, notificationResponse] = await Promise.all([
        fetchUploadedVideos(),
        fetchNotifications(),
      ]);

      if (!videoResponse.success) {
        console.error("Video fetch error:", videoResponse.message);
        setError(videoResponse.message);
      } else {
        console.log("Videos fetched successfully:", videoResponse.data);
        setVideoData({ uploadedVideos: videoResponse.data });
      }

      if (!notificationResponse.success) {
        console.error(
          "Notification fetch error:",
          notificationResponse.message
        );
        setNotifications([]);
      } else {
        console.log(
          "Notifications fetched successfully:",
          notificationResponse.data
        );
        setNotifications(notificationResponse.data);
      }
    } catch (error: any) {
      console.error("Error during fetch:", error.message);
      setError(error.message);
    } finally {
      console.log("Finished fetching data");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isSignedIn) {
      console.log("useEffect for initial data fetch triggered");
      fetchData();
    }

    return () => {
      console.log("Cleaning up data and notifications...");
      setVideoData(null);
      setNotifications([]);
    };
  }, [isSignedIn]);

  useEffect(() => {
    if (!isSignedIn || !userId) return;

    console.log("useEffect for Pusher subscription triggered");

    const pusher = new Pusher(pusher_Key, {
      cluster: pusher_Cluster,
    });

    const channel = pusher.subscribe(userId);
    console.log("Subscribed to Pusher channel:", userId);

    channel.bind("statusUpdate", async (update: any) => {
      console.log("Received update from Pusher:", update);

      setVideoData((prevData) => {
        if (!prevData) return prevData;

        const updatedVideos = prevData.uploadedVideos.map((video) => {
          if (video.id === update.data.uniqueId) {
            console.log(`Updating video ${video.id} with new status`);
            return {
              ...video,
              status: update.success ? Status.FINISHED : Status.FAILED,
            };
          }
          return video;
        });

        return { uploadedVideos: updatedVideos };
      });

      const notificationResponse = await fetchNotifications();
      if (notificationResponse.success) {
        console.log("Notifications updated after status update");
        setNotifications(notificationResponse.data);
        toast("New Notification", {
          icon: "🔔",
        });
      } else {
        console.error(
          "Error fetching notifications after status update:",
          notificationResponse.message
        );
        setNotifications([]);
      }
    });

    return () => {
      console.log("Unsubscribing from Pusher channel:", userId);
      pusher.unsubscribe(userId);
    };
  }, [isSignedIn, userId, pusher_Key, pusher_Cluster]);

  if (!isSignedIn) {
    return null;
  }

  return (
    <NotificationHistoryContext.Provider
      value={{
        videoData,
        notifications,
        error,
        isLoading,
        fetchVideos: fetchData,
      }}
    >
      {children}
    </NotificationHistoryContext.Provider>
  );
};

export const useNotificationHistory = () => {
  const context = useContext(NotificationHistoryContext);
  if (!context)
    throw new Error(
      "useNotificationHistory must be used within a NotificationHistoryProvider"
    );
  return context;
};
