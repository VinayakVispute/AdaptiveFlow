"use client";

import { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { CloudUploadIcon, X } from "lucide-react";
import toast from "react-hot-toast";
import { uploadVideoToAzureDirectly } from "@/lib/azureBlobUpload";
import { motion, AnimatePresence } from "framer-motion";

const UploadVideoArea = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [videoResolution, setVideoResolution] = useState<string | null>(null);
  const [videoName, setVideoName] = useState<string | null>(null);
  const [percentage, setPercentage] = useState(0);
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
      setVideoName(file.name);
    }
  }, []);

  const removeVideo = () => {
    setVideoFile(null);
    setVideoPreview(null);
    setVideoResolution(null);
    setVideoName(null);
  };

  useEffect(() => {
    if (videoPreview) {
      const video = document.createElement("video");
      video.src = videoPreview;

      video.addEventListener("loadedmetadata", () => {
        const { videoWidth, videoHeight } = video;

        let quality = "Unknown";
        if (videoWidth < 640 && videoHeight < 360) {
          quality = "Less than 360p";
        } else if (videoWidth === 640 && videoHeight === 360) {
          quality = "360p";
        } else if (videoWidth === 854 && videoHeight === 480) {
          quality = "480p";
        } else if (videoWidth === 1280 && videoHeight === 720) {
          quality = "720p";
        } else if (videoWidth === 1920 && videoHeight === 1080) {
          quality = "1080p";
        } else if (videoWidth === 3840 && videoHeight === 2160) {
          quality = "4K";
        } else if (videoWidth > 3840 && videoHeight > 2160) {
          quality = "More than 4K";
        }

        setVideoResolution(quality);
      });
    }
  }, [videoPreview]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "video/mp4": [".mp4"],
      "video/x-matroska": [".mkv"],
    },
    multiple: false,
    disabled: videoFile !== null,
  });

  const isVideoResolutionDecodable = (resolution: string) => {
    return ["720p", "1080p", "4K"].includes(resolution);
  }

  const submitVideo = async () => {
    if (!videoFile || !videoName || !videoResolution) {
      toast.error("Please fill in all the fields.");
      return;
    }
    if (!isVideoResolutionDecodable(videoResolution)) {
      toast.error("Please upload a video with 720p, 1080p, or 4K resolution.");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Uploading video...");

    try {
      const videoId = `${Date.now()}-${videoName}`;
      const result = await uploadVideoToAzureDirectly(
        videoName,
        videoFile,
        videoResolution,
        videoId,
        (progress) => {
          setPercentage(Math.round(progress * 100));
        }
      );

      if (result.success) {
        toast.success("Video uploaded successfully", { id: toastId });
      } else {
        throw new Error(result.error || "Upload failed");
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "An unexpected error occurred during upload.", { id: toastId });
    } finally {
      setLoading(false);
      setVideoFile(null);
      setVideoPreview(null);
      setVideoResolution(null);
      setVideoName(null);
      setTimeout(() => {
        setPercentage(0);
      }, 5000);
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-orange-400 to-orange-600">
        <CardTitle className="text-white">Upload a Video</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6 p-6">

        {/* @ts-ignore */}
        <motion.div
          {...getRootProps()}
          className={`relative flex items-center justify-center border-2 border-dashed rounded-lg p-8 transition-colors ${isDragActive ? "border-orange-400" : "border-orange-200"
            }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <input {...getInputProps()} />
          <AnimatePresence mode="wait">
            {!videoPreview ? (
              <motion.div
                key="dropzone"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center flex flex-col gap-y-4 justify-center items-center"
              >
                <CloudUploadIcon className="w-12 h-12 text-orange-400" />
                <div className="text-orange-600 font-medium">Drag and drop your video here</div>
                <div className="text-sm text-orange-400">
                  or click to select a file
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="preview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative"
              >
                <video
                  src={videoPreview}
                  className="max-h-40 rounded-lg"
                  controls
                />
                <motion.button
                  onClick={removeVideo}
                  className="absolute top-2 right-2 p-1 bg-orange-500 bg-opacity-50 rounded-full hover:bg-opacity-75 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-5 h-5 text-white" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        {videoResolution && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-orange-600 font-medium"
          >
            Video Quality: {videoResolution}
          </motion.div>
        )}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="video-name" className="text-orange-600">
              Video Name
            </Label>
            <Input
              id="video-name"
              placeholder="Enter video name"
              className="border-orange-200 text-orange-600 focus:ring-orange-400"
              disabled={!videoFile}
              value={videoName || ""}
              onChange={(e) => setVideoName(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="video-resolution" className="text-orange-600">
              Video Resolution (Current Video)
            </Label>
            <Input
              id="video-resolution"
              value={videoResolution || "N/A"}
              className="border-orange-200 text-orange-600 bg-white"
              readOnly
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            className="bg-gradient-to-r from-orange-400 to-orange-600 text-white hover:from-orange-500 hover:to-orange-700"
            onClick={submitVideo}
            disabled={!videoFile || loading}
          >
            Upload
          </Button>
          <Button
            variant="outline"
            className="border-orange-400 text-orange-600 hover:bg-orange-50"
            onClick={removeVideo}
          >
            Clear
          </Button>
        </div>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full"
          >
            <Progress value={percentage} className="w-full" />
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default UploadVideoArea;