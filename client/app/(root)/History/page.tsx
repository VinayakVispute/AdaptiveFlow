'use client'

import { Button } from "@/components/ui/button"
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog"
import { RefreshCw, FileDown, Eye } from "lucide-react"
import { UploadedVideo, VideoDialogProps } from "@/interface"
import { statusColor } from "@/lib/utils"
import VideoResolutionOption from "@/components/shared/VideoResolutionOption"
import { useNotificationHistory } from "@/context/NotificationHistoryContext"
import { Video } from "@prisma/client"

const VideoDialog = ({ TranscodedVideos, VideoDetails }: VideoDialogProps) => {
    return (
        <DialogContent className="sm:max-w-[800px] bg-gradient-to-br from-blue-50 to-white">
            <div className="grid gap-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <div className="text-lg font-medium text-blue-900">{VideoDetails.video.title}</div>
                        <div className="text-sm text-blue-600">
                            Transcoded at: {new Date(VideoDetails.uploadedAt).toLocaleString()}
                        </div>
                    </div>
                    <Badge variant="secondary" className={`${statusColor[VideoDetails.status]} shadow-md`}>
                        {VideoDetails.status}
                    </Badge>
                </div>
                <div className="grid gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {TranscodedVideos.map((singleTranscodedVideo) => (
                            <VideoResolutionOption
                                key={singleTranscodedVideo.id}
                                videoDetails={singleTranscodedVideo.video}
                            />
                        ))}
                    </div>
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" className="bg-blue-600 text-white hover:bg-blue-700 transition-all hover:scale-105">Close</Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    )
}

export default function History() {
    const { isLoading, error, videoData, fetchVideos } = useNotificationHistory()

    const emptyRows = Array(5).fill(null)

    return (
        <div className="flex flex-col w-full min-h-screen bg-gradient-to-br from-blue-50 to-white">
            <header className="bg-[#4285F4] text-white px-6 py-8 shadow-lg">
                <div className="container mx-auto flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-bold mb-4">Video Processing History</h2>
                        <div className="flex items-center gap-4">
                            <Button variant="secondary" size="lg" className="bg-white text-[#4285F4] hover:bg-blue-50 transition-all hover:scale-105">
                                <FileDown className="h-5 w-5 mr-2" />
                                <span>Export</span>
                            </Button>
                            <Button variant="secondary" size="lg" className="bg-white text-[#4285F4] hover:bg-blue-50 transition-all hover:scale-105" onClick={fetchVideos}>
                                <RefreshCw className="h-5 w-5 mr-2" />
                                <span>Refresh</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </header>
            <main className="flex-1 p-6 md:p-10">
                <div className="container mx-auto bg-white rounded-xl shadow-xl overflow-hidden transition-all hover:shadow-2xl">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-[#4285F4] text-white">
                                <TableHead className="font-bold">Sr. No.</TableHead>
                                <TableHead className="font-bold">Title</TableHead>
                                <TableHead className="font-bold">Uploaded At</TableHead>
                                <TableHead className="font-bold">Resolution</TableHead>
                                <TableHead className="font-bold">Status</TableHead>
                                <TableHead className="font-bold">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                emptyRows.map((_, index) => (
                                    <TableRow key={index} className="animate-pulse">
                                        <TableCell colSpan={6}>
                                            <div className="h-8 bg-blue-100 rounded"></div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : error ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center text-red-500">
                                        Error: {error}
                                    </TableCell>
                                </TableRow>
                            ) : !videoData || videoData.uploadedVideos.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center text-blue-600">
                                        No videos uploaded yet
                                    </TableCell>
                                </TableRow>
                            ) : (
                                videoData.uploadedVideos.map((video: UploadedVideo, index: number) => (
                                    <TableRow key={video.id} className="hover:bg-blue-50 transition-colors">
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell className="font-medium">{video.video.title}</TableCell>
                                        <TableCell>{new Date(video.video.uploadedAt).toLocaleString()}</TableCell>
                                        <TableCell>{video.video.resolution}</TableCell>
                                        <TableCell>
                                            <Badge className={`${statusColor[video.status]} shadow-md`}>
                                                {video.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        disabled={video.status !== "FINISHED"}
                                                        className="bg-[#4285F4] text-white hover:bg-blue-700 transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                                                    >
                                                        <Eye className="h-4 w-4 mr-2" />
                                                        View Transcoded Video
                                                    </Button>
                                                </DialogTrigger>
                                                <VideoDialog
                                                    TranscodedVideos={video.TranscodedVideo}
                                                    VideoDetails={video}
                                                />
                                            </Dialog>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </main>
            <footer className="bg-[#4285F4] py-6 px-4 md:px-6 text-white">
                <div className="container mx-auto text-center">
                    <p>&copy; 2024 Video Processing. All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}