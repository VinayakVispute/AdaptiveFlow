"use client";

import { useState } from "react";
import Link from "next/link";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import VideoPlayer from "./VideoPlayer";
import { Eye, Download, Copy, Check } from "lucide-react";
import { Video } from "@prisma/client";

const VideoResolutionOption = ({ videoDetails }: { videoDetails: Video }) => {
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(videoDetails.videoUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 transition-all duration-300 hover:shadow-lg">
      <div className="text-lg font-medium text-[#0ca678] mb-2">{videoDetails.resolution}</div>
      <div className="flex items-center gap-2">
        <Link
          href={videoDetails.videoUrl}
          className="text-sm text-[#12b886] hover:text-[#0ca678] transition-colors duration-300"
          prefetch={false}
        >
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </Link>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="w-full sm:w-auto bg-gradient-to-r from-[#0ca678] to-[#12b886] text-white border-none hover:from-[#12b886] hover:to-[#0ca678] transition-all duration-300"
            >
              <Eye className="h-4 w-4 mr-2" />
              <span>View</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px] bg-[#e6fcf5]">
            <VideoPlayer
              isVideoLoaded={isVideoLoaded}
              setIsVideoLoaded={setIsVideoLoaded}
              setIsShareOpen={setIsShareOpen}
              videoDetails={videoDetails}
            />
          </DialogContent>
        </Dialog>
      </div>
      <Dialog open={isShareOpen} onOpenChange={setIsShareOpen}>
        <DialogContent className="sm:max-w-[425px] bg-[#e6fcf5]">
          <h2 className="text-xl font-semibold mb-4 text-[#0ca678]">Share Video</h2>
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={videoDetails.videoUrl}
                readOnly
                className="w-full p-2 border rounded bg-white text-[#12b886]"
              />
              <Button
                onClick={handleCopyLink}
                className={`min-w-[100px] ${isCopied
                  ? "bg-[#0ca678] text-white"
                  : "bg-white text-[#0ca678] border-[#0ca678]"
                  } transition-all duration-300`}
              >
                {isCopied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VideoResolutionOption;