import { EventStatus, Status, Video } from "@prisma/client";

export interface createUploadVideoInDbParams {
  id: string;
  title: string;
  videoUrl: string;
}

export interface ITranscodedVideo {
  id: string;
  transcodedAt: Date;
  sourceVideoId: string;
  VideoId: string;
  uploadedAt: Date;
  video: Video;
}
export interface UploadedVideo {
  id: number;
  userId: number;
  status: Status;
  videoId: number;
  uploadedAt: Date;
  createdAt: Date;
  video: Video;
  TranscodedVideo: ITranscodedVideo;
}

export interface VideoResolutionOptionProps {
  resolution: string;
}

export interface VideoDialogProps {
  VideoDetails: UploadedVideo;
  TranscodedVideo: ITranscodedVideo;
}

interface transcodedVideoWebhook {
  name: string;
  url: string;
  resolution: string;
}

export interface UpdateStatusWebhookBody {
  success: boolean;
  message: string;
  data: {
    uniqueId: string;
    transcodedVideo: { name: string; url: string } | null;
  };
}

export interface fetchNotificationsParams {
  userId: string;
}

export type NotificationState = {
  id: string;
  userId: string;
  uploadedVideoId: string;
  event: EventStatus;
  read: boolean;
  createdAt: Date;
  uploadedVideo: UploadedVideo;
};
