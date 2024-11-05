"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";
import { Video } from "@prisma/client";
import dynamic from "next/dynamic";

interface VideoPlayerProps {
  setIsShareOpen: React.Dispatch<React.SetStateAction<boolean>>;
  videoDetails: Video;
}

interface QualityLevel {
  height: number;
  width: number;
  bitrate: number;
  codec: string;
}

const DynamicVideoPlayer = dynamic(() => import("./DynamicVideoPlayer"), {
  ssr: false,
});

export default function VideoPlayer({
  setIsShareOpen,
  videoDetails,
}: VideoPlayerProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [qualityLevels, setQualityLevels] = useState<QualityLevel[]>([]);
  const [currentQuality, setCurrentQuality] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const handleDownload = () => {
    if (typeof window !== "undefined") {
      const link = document.createElement("a");
      link.href = videoDetails.videoUrl;
      link.download = `${videoDetails.title}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (error) {
    return <div>Error loading video: {error.message}</div>;
  }

  return (
    <div className="flex flex-col space-y-6 bg-white rounded-xl shadow-xl p-6 transition-all duration-300 hover:shadow-2xl">
      <h2 className="text-2xl font-bold text-blue-600">{videoDetails.title}</h2>

      <div className="aspect-video rounded-lg overflow-hidden shadow-md relative">
        {isLoading && (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-500 animate-pulse flex items-center justify-center">
            <svg
              className="w-16 h-16 text-white opacity-50"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        )}
        <DynamicVideoPlayer
          videoDetails={videoDetails}
          setIsLoaded={setIsLoaded}
          setQualityLevels={setQualityLevels}
          setCurrentQuality={setCurrentQuality}
        />
      </div>

      {qualityLevels.length > 0 && (
        <div className="bg-blue-50 p-4 rounded-lg text-sm">
          <h3 className="font-semibold text-blue-700 mb-2">Quality Levels</h3>
          <div className="space-y-2">
            {qualityLevels.map((level, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-2 rounded ${currentQuality === index
                  ? "bg-blue-100 text-blue-700"
                  : "text-blue-600"
                  }`}
              >
                <span>{`${level.height}p (${Math.round(
                  level.bitrate / 1024
                )}kb/s)`}</span>
                <span className="text-xs">{level.codec}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div className="flex space-x-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            className="flex-1 sm:flex-none bg-gradient-to-r from-blue-500 to-blue-600 text-white border-none hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsShareOpen(true)}
            className="flex-1 sm:flex-none bg-white text-blue-600 border-blue-600 hover:bg-blue-50 transition-all duration-300"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </div>
    </div>
  );
}
