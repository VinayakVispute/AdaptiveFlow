"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import VideoPlayer from "./VideoPlayer";
import { Eye, Copy, Check } from "lucide-react";
import { Video } from "@prisma/client";

const VideoResolutionOption = ({ videoDetails }: { videoDetails: Video }) => {
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(videoDetails.videoUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 transition-all duration-300 hover:shadow-lg">
      <div className="flex items-center gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-600 text-white border-none hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
            >
              <Eye className="h-4 w-4 mr-2" />
              <span>View</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px] bg-blue-50">
            <VideoPlayer
              setIsShareOpen={setIsShareOpen}
              videoDetails={videoDetails}
            />
          </DialogContent>
        </Dialog>
      </div>
      <Dialog open={isShareOpen} onOpenChange={setIsShareOpen}>
        <DialogContent className="sm:max-w-[425px] bg-blue-50">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">
            Share Video
          </h2>
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={videoDetails.videoUrl}
                readOnly
                className="w-full p-2 border rounded bg-white text-blue-600"
              />
              <Button
                onClick={handleCopyLink}
                className={`min-w-[100px] ${isCopied
                  ? "bg-blue-600 text-white"
                  : "bg-white text-blue-600 border-blue-600"
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
