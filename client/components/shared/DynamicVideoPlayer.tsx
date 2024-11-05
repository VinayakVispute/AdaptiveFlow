"use client";

import React, { useEffect, useRef } from "react";
import { Video } from "@prisma/client";
import Hls from "hls.js";
import Plyr from "plyr";
import "plyr/dist/plyr.css";

interface DynamicVideoPlayerProps {
  videoDetails: Video;
  setIsLoaded: React.Dispatch<React.SetStateAction<boolean>>;
  setQualityLevels: React.Dispatch<React.SetStateAction<QualityLevel[]>>;
  setCurrentQuality: React.Dispatch<React.SetStateAction<number>>;
}

interface QualityLevel {
  height: number;
  width: number;
  bitrate: number;
  codec: string;
}

export default function DynamicVideoPlayer({
  videoDetails,
  setIsLoaded,
  setQualityLevels,
  setCurrentQuality,
}: DynamicVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<Plyr | null>(null);
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const defaultOptions = {
      controls: [
        "play-large",
        "restart",
        "rewind",
        "play",
        "fast-forward",
        "progress",
        "current-time",
        "duration",
        "mute",
        "volume",
        "captions",
        "settings",
        "pip",
        "airplay",
        "download",
        "fullscreen",
      ],
    };

    if (Hls.isSupported()) {
      const hls = new Hls();
      hlsRef.current = hls;

      hls.loadSource(videoDetails.videoUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
        console.log("hls.levels", hls.levels);
        const qualities = hls.levels.map((level) => {
          console.log(level.codecs);
          return {
            height: level.height,
            width: level.width,
            bitrate: level.bitrate,
            codec: level.codecs || "unknown",
          };
        });
        setQualityLevels(qualities);

        const plyrOptions = {
          ...defaultOptions,
          quality: {
            default: qualities[0].height,
            options: qualities.map((q) => q.height),
            forced: true,
            onChange: (quality: number) => updateQuality(quality),
          },
        };

        playerRef.current = new Plyr(video, plyrOptions);
        setIsLoaded(true);
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
        setCurrentQuality(data.level);
      });

      return () => {
        if (playerRef.current) {
          playerRef.current.destroy();
        }
        if (hlsRef.current) {
          hlsRef.current.destroy();
        }
      };
    }
  }, [videoDetails.videoUrl, setIsLoaded, setQualityLevels, setCurrentQuality]);

  const updateQuality = (newQuality: number) => {
    if (hlsRef.current) {
      hlsRef.current.levels.forEach((level, levelIndex) => {
        if (level.height === newQuality) {
          hlsRef.current!.currentLevel = levelIndex;
        }
      });
    }
  };

  return <video ref={videoRef} className="plyr-react plyr" />;
}
