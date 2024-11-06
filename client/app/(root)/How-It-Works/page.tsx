import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowRight,
  Upload,
  Database,
  Cloud,
  Play,
  Cog,
  Bell,
} from "lucide-react";
import Link from "next/link";

export default function AdaptiveFlowPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <header className="text-center mb-16">
          <Image
            src="/assets/adaptiveflow-logo.svg"
            alt="AdaptiveFlow Logo"
            width={200}
            height={50}
            className="mx-auto mb-6"
          />
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            AdaptiveFlow: Seamless Video Streaming
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Optimize your video content for any device or network condition with
            our advanced adaptive streaming platform.
          </p>
        </header>
        <section className="mb-20">
          <Image
            src="/assets/header-workflow.svg"
            alt="AdaptiveFlow Banner"
            width={800}
            height={400}
            className="rounded-lg shadow-2xl mx-auto"
          />
        </section>
        <section className="mb-20">
          <h2 className="text-3xl font-semibold mb-8 text-center text-gray-800 dark:text-white">
            How AdaptiveFlow Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <WorkflowStep
              icon={<Upload className="h-10 w-10 text-blue-500" />}
              title="1. Video Upload"
              description="Upload your video through our Next.js client. We'll save the metadata in PostgreSQL with a 'pending' status."
            />
            <WorkflowStep
              icon={<Cloud className="h-10 w-10 text-purple-500" />}
              title="2. Cloud Storage"
              description="Your video is securely stored in Azure Blob Storage with a unique identifier to prevent overwriting."
            />
            <WorkflowStep
              icon={<Cog className="h-10 w-10 text-green-500" />}
              title="3. Transcoding"
              description="Our TypeScript worker uses FFmpeg in Docker containers to transcode your video into multiple resolutions."
            />
            <WorkflowStep
              icon={<Play className="h-10 w-10 text-red-500" />}
              title="4. Adaptive Streaming"
              description="The transcoded video is prepared for HLS streaming, ensuring smooth playback on any device."
            />
          </div>
        </section>

        <section className="mb-20 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
          <h2 className="text-3xl font-semibold mb-8 text-center text-gray-800 dark:text-white">
            Technology Stack
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            <TechLogo src="/assets/nextjs-logo.svg" alt="Next.js" />
            <TechLogo src="/assets/Microsoft_Azure.svg" alt="Microsoft Azure" />
            <TechLogo src="/assets/ts-logo-256.svg" alt="TypeScript" />
            <TechLogo src="/assets/docker-logo-blue.svg" alt="Docker" />
            <TechLogo src="/assets/ffmpeg.svg" alt="FFmpeg" />
          </div>
        </section>

        <section className="mb-20">
          <h2 className="text-3xl font-semibold mb-8 text-center text-gray-800 dark:text-white">
            Key Benefits
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <BenefitCard
              icon={<Database className="h-8 w-8 text-blue-500" />}
              title="Scalable Infrastructure"
              description="Leverage Azure's cloud services to handle growing audience demands without compromising performance."
            />
            <BenefitCard
              icon={<Play className="h-8 w-8 text-green-500" />}
              title="Smooth Playback"
              description="Adaptive bitrate streaming ensures buffer-free video playback across various network conditions."
            />
            <BenefitCard
              icon={<Bell className="h-8 w-8 text-purple-500" />}
              title="Real-time Updates"
              description="Keep users informed about video processing status with WebSocket notifications."
            />
          </div>
        </section>

        <section className="mb-20 text-center">
          <h2 className="text-3xl font-semibold mb-8 text-gray-800 dark:text-white">
            Ready to Optimize Your Video Streaming?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Join content creators and businesses already leveraging AdaptiveFlow
            for unparalleled video experiences.
          </p>
          <Link href={"/"} passHref>
            <Button
              size="lg"
              className="text-lg bg-blue-600 hover:bg-blue-700 text-white"
            >
              Get Started with AdaptiveFlow
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </section>

        <footer className="text-center text-gray-500 dark:text-gray-400">
          <p>© 2024 AdaptiveFlow. All rights reserved.</p>
          <p className="mt-2">
            Made with <span className="text-red-500">❤️</span> by Vinayak
            Vispute
          </p>
        </footer>
      </div>
    </div>
  );
}

function WorkflowStep({
  icon,
  title,
  description,
}: {
  icon: JSX.Element;
  title: string;
  description: string;
}) {
  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4 mx-auto">
          {icon}
        </div>
        <CardTitle className="text-xl font-semibold text-center text-gray-800 dark:text-white">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 dark:text-gray-300 text-center">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}

function TechLogo({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="flex items-center justify-center">
      <Image
        src={src}
        alt={alt}
        width={80}
        height={80}
        className="object-contain"
      />
    </div>
  );
}

function BenefitCard({
  icon,
  title,
  description,
}: {
  icon: JSX.Element;
  title: string;
  description: string;
}) {
  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4 mx-auto">
          {icon}
        </div>
        <CardTitle className="text-xl font-semibold text-center text-gray-800 dark:text-white">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 dark:text-gray-300 text-center">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
