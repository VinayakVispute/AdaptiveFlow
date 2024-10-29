import { lazy, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Download, Share2, Play } from "lucide-react";
import { Video } from "@prisma/client";
const ReactPlayer = lazy(() => import("react-player/lazy"));

function VideoSkeleton() {
  return (
    <div className="aspect-video bg-gradient-to-br from-[#e6fcf5] to-[#0ca678] animate-pulse flex items-center justify-center rounded-lg shadow-lg transition-all duration-300">
      <Play className="w-16 h-16 text-white opacity-50" />
    </div>
  );
}

const VideoPlayer = ({
  isVideoLoaded,
  setIsVideoLoaded,
  setIsShareOpen,
  videoDetails,
}: {
  isVideoLoaded: boolean;
  setIsVideoLoaded: React.Dispatch<React.SetStateAction<boolean>>;
  setIsShareOpen: React.Dispatch<React.SetStateAction<boolean>>;
  videoDetails: Video
}) => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = videoDetails.videoUrl;
    link.download = "video.mp4";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col space-y-6 bg-white rounded-xl shadow-xl p-6 transition-all duration-300 hover:shadow-2xl">
      <h2 className="text-2xl font-bold text-[#0ca678]">{videoDetails.title}</h2>
      <div className="aspect-video rounded-lg overflow-hidden shadow-md">
        <Suspense fallback={<VideoSkeleton />}>
          {!isVideoLoaded && <VideoSkeleton />}
          <ReactPlayer
            url={videoDetails.videoUrl}
            width="100%"
            height="100%"
            controls
            onReady={() => setIsVideoLoaded(true)}
            style={{ display: isVideoLoaded ? "block" : "none" }}
            config={{
              file: {
                attributes: {
                  controlsList: 'nodownload'
                }
              }
            }}
          />
        </Suspense>
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <span className="text-sm text-[#12b886] bg-[#e6fcf5] px-3 py-1 rounded-full font-medium">
          Resolution: {videoDetails.resolution}
        </span>
        <div className="flex space-x-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            className="flex-1 sm:flex-none bg-gradient-to-r from-[#0ca678] to-[#12b886] text-white border-none hover:from-[#12b886] hover:to-[#0ca678] transition-all duration-300"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsShareOpen(true)}
            className="flex-1 sm:flex-none bg-white text-[#0ca678] border-[#0ca678] hover:bg-[#e6fcf5] transition-all duration-300"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;