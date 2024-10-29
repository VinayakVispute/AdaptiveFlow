import { CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

type Notification = {
    id: string
    event: string
    uploadedVideo: {
        video: {
            title: string
        }
    }
}

function StatusIndicator({ status }: { status: string }) {
    if (status.toLowerCase() === 'finished') {
        return <CheckCircle className="h-5 w-5 text-green-500" />
    }
    if (status.toLowerCase() === 'failed') {
        return <XCircle className="h-5 w-5 text-red-500" />
    }
    return <AlertCircle className="h-5 w-5 text-yellow-500" />
}

function NotificationItem({ notification }: { notification: Notification }) {
    const isFinished = notification.event.toLowerCase() === 'finished'
    const isFailed = notification.event.toLowerCase() === 'failed'

    return (
        <div className={cn(
            "p-4 mb-2 rounded-lg transition-colors",
            isFinished && "bg-green-50 hover:bg-green-100",
            isFailed && "bg-red-50 hover:bg-red-100",
            !isFinished && !isFailed && "bg-gray-50 hover:bg-gray-100"
        )}>
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <h3 className="font-medium text-gray-900 truncate">{notification.uploadedVideo.video.title}</h3>
                    <p className={cn(
                        "text-sm",
                        isFinished && "text-green-600",
                        isFailed && "text-red-600",
                        !isFinished && !isFailed && "text-gray-500"
                    )}>
                        {notification.event.charAt(0).toUpperCase() + notification.event.slice(1).toLowerCase()}
                    </p>
                </div>
                <StatusIndicator status={notification.event} />
            </div>
        </div>
    )
}

export default function Component({ notifications }: { notifications: Notification[] }) {
    console.log("Vinayak", notifications, notifications.length)
    if (!notifications) {
        return <ErrorMessage message="Failed to fetch notifications" />
    }

    return (
        <div className="h-[300px] w-[350px] rounded-md border">
            {notifications.length === 0 ? (
                <EmptyMessage message="No notifications currently" />
            ) : (
                <ScrollArea className="h-full w-full p-4">
                    <div className="space-y-4">
                        {notifications.map((notification) => (
                            <NotificationItem key={notification.id} notification={notification} />
                        ))}
                    </div>
                </ScrollArea>
            )}
        </div>
    )
}

function ErrorMessage({ message }: { message: string }) {
    return (
        <div className="p-4 text-center text-red-500">
            <AlertCircle className="h-5 w-5 mx-auto mb-2" />
            {message}
        </div>
    )
}

function EmptyMessage({ message }: { message: string }) {
    return (
        <div className="h-full flex items-center justify-center text-gray-500">
            {message}
        </div>
    )
}