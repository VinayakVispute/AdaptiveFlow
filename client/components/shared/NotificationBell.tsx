"use client";

import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useNotificationHistory } from "@/context/NotificationHistoryContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface NotificationState {
  id: string;
  event: string;
  uploadedVideo: {
    video: {
      title: string;
    };
  };
}

function StatusIndicator({ status }: { status: string }) {
  if (status.toLowerCase() === "finished") {
    return <CheckCircle className="h-5 w-5 text-green-500" />;
  }
  if (status.toLowerCase() === "failed") {
    return <XCircle className="h-5 w-5 text-red-500" />;
  }
  return <AlertCircle className="h-5 w-5 text-yellow-500" />;
}

function NotificationItem({
  notification,
}: {
  notification: NotificationState;
}) {
  const isFinished = notification.event.toLowerCase() === "finished";
  const isFailed = notification.event.toLowerCase() === "failed";

  return (
    <div
      className={cn(
        "flex items-start gap-4 p-4 transition-colors",
        isFinished && "hover:bg-green-50",
        isFailed && "hover:bg-red-50",
        !isFinished && !isFailed && "hover:bg-blue-50"
      )}
    >
      <StatusIndicator status={notification.event} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {notification.uploadedVideo.video.title}
        </p>
        <p
          className={cn(
            "text-sm",
            isFinished && "text-green-600",
            isFailed && "text-red-600",
            !isFinished && !isFailed && "text-blue-600"
          )}
        >
          {notification.event}
        </p>
      </div>
    </div>
  );
}

export default function NotificationBell() {
  const { notifications } = useNotificationHistory();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-white hover:bg-blue-600/50 transition-colors duration-300"
        >
          <Bell className="h-5 w-5" />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white animate-pulse">
              {notifications.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 p-0 bg-white shadow-lg rounded-md border border-gray-200"
        align="end"
        sideOffset={8}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
          <h2 className="text-sm font-semibold text-gray-900">Notifications</h2>
          {notifications.length > 0 && (
            <span className="text-xs text-gray-500">
              {notifications.length} new
            </span>
          )}
        </div>
        <ScrollArea className="max-h-[300px] bg-white">
          {notifications.length === 0 ? (
            <div className="py-8 px-4 text-center text-sm text-gray-500 bg-white">
              No notifications
            </div>
          ) : (
            <div className="divide-y divide-gray-200 bg-white">
              {notifications.map((notification: NotificationState) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
