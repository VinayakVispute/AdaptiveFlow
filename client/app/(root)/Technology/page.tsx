import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowUpRight,
  Cloud,
  Code2,
  Database,
  FileVideo,
  Lock,
  Play,
  Server,
  Zap,
} from "lucide-react";
import Link from "next/link";

export default function AdaptiveFlowPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <header className="text-center mb-16">
          <Image
            src="/assets/adaptiveflow-logo.svg"
            alt="AdaptiveFlow Logo"
            width={200}
            height={50}
            className="mx-auto mb-6"
          />
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            AdaptiveFlow
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Your go-to solution for adaptive video streaming and seamless
            playback across devices. Leveraging cloud scalability for
            high-quality, buffer-free streaming optimized for all network
            conditions.
          </p>
        </header>

        <section className="mb-20 relative">
          <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900 opacity-50 rounded-3xl transform -skew-y-3"></div>
          <Image
            src="/assets/header-worflow.svg"
            alt="AdaptiveFlow Workflow"
            width={800}
            height={400}
            className="rounded-2xl shadow-2xl mx-auto relative z-10"
          />
        </section>

        <section className="mb-20">
          <h2 className="text-3xl font-semibold mb-8 text-center">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Play className="h-8 w-8 text-blue-500" />}
              title="Adaptive Bitrate Streaming"
              description="HLS-based streaming adjusts video quality based on network speed and device capabilities, ensuring smooth playback."
            />
            <FeatureCard
              icon={<Server className="h-8 w-8 text-green-500" />}
              title="Scalable Video Processing"
              description="Efficient, scalable transcoding powered by Docker and Azure for optimal performance."
            />
            <FeatureCard
              icon={<Cloud className="h-8 w-8 text-purple-500" />}
              title="Cloud Storage"
              description="Secure and reliable storage with Azure Blob Storage, ensuring your content is always available."
            />
            <FeatureCard
              icon={<Lock className="h-8 w-8 text-yellow-500" />}
              title="Enhanced Security"
              description="Robust protection for video assets and user data, leveraging Azure 's advanced security features."
            />
            <FeatureCard
              icon={<Zap className="h-8 w-8 text-orange-500" />}
              title="Real-time Updates"
              description="WebSocket notifications keep users informed about video processing status instantly."
            />
            <FeatureCard
              icon={<FileVideo className="h-8 w-8 text-red-500" />}
              title="Advanced Video Encoding"
              description="Utilize FFmpeg for high-quality video encoding and transcoding to support various formats and resolutions."
            />
          </div>
        </section>

        <section className="mb-20">
          <h2 className="text-3xl font-semibold mb-8 text-center">
            Technologies
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 items-center justify-items-center">
            <TechLogo src="/assets/Nextjs-logo.svg" alt="Next.js" />
            <TechLogo src="/assets/ts-logo-256.svg" alt="TypeScript" />
            <TechLogo src="/assets/nodejsStackedDark.svg" alt="Node.js" />
            <TechLogo src="/assets/Prisma-IndigoLogo.svg" alt="Prisma" />
            <TechLogo src="/assets/postgresql-ar21.svg" alt="PostgreSQL" />
            <TechLogo src="/assets/Microsoft_Azure.svg" alt="Microsoft Azure" />
            <TechLogo src="/assets/docker-logo-blue.svg" alt="Docker" />
            <TechLogo
              src="/assets/pusher-logo-0576fd4af5c38706f96f632235f3124a.svg"
              alt="Pusher"
            />
            <TechLogo src="/assets/clerk-logo-dark-accent.svg" alt="Clerk" />
            <TechLogo src="/assets/ffmpeg.svg" alt="FFmpeg" />
          </div>
        </section>

        <section className="mb-20">
          <h2 className="text-3xl font-semibold mb-8 text-center">
            Architecture Overview
          </h2>
          <Tabs defaultValue="frontend" className="w-full">
            <TabsList className="grid w-full grid-cols-1 md:grid-cols-4 bg-blue-100 dark:bg-blue-900 p-1 rounded-lg">
              <TabsTrigger
                value="frontend"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800"
              >
                Frontend
              </TabsTrigger>
              <TabsTrigger
                value="storage"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800"
              >
                Storage & Queue
              </TabsTrigger>
              <TabsTrigger
                value="processing"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800"
              >
                Processing
              </TabsTrigger>
              <TabsTrigger
                value="database"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800"
              >
                Database & Webhooks
              </TabsTrigger>
            </TabsList>
            <TabsContent value="frontend">
              <ArchitectureCard
                title="Frontend (Next.js Client)"
                description="Intuitive and responsive UI/UX powered by Next.js, React, and Tailwind CSS. Manages video metadata with PostgreSQL, setting 'pending' status upon upload."
                icon={<Code2 className="h-8 w-8 text-blue-500" />}
              />
            </TabsContent>
            <TabsContent value="storage">
              <ArchitectureCard
                title="Azure Blob Storage & Queue"
                description="Securely stores uploaded videos with unique filenames. Azure Queue manages processing tasks, triggering transcoding operations asynchronously."
                icon={<Cloud className="h-8 w-8 text-purple-500" />}
              />
            </TabsContent>
            <TabsContent value="processing">
              <ArchitectureCard
                title="TypeScript Worker & Azure Container Instances"
                description="TypeScript Worker listens to Azure Queue messages, initiating video processing. Azure Container Instances run Docker containers with FFmpeg for scalable, on-demand transcoding."
                icon={<Server className="h-8 w-8 text-green-500" />}
              />
            </TabsContent>
            <TabsContent value="database">
              <ArchitectureCard
                title="Database and Webhooks"
                description="Stores transcoded video URLs in PostgreSQL. Utilizes WebSockets for real-time client notifications on processing status and updates."
                icon={<Database className="h-8 w-8 text-red-500" />}
              />
            </TabsContent>
          </Tabs>
        </section>

        <section className="mb-20">
          <h2 className="text-3xl font-semibold mb-8 text-center">
            Why Choose AdaptiveFlow?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 border-none shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-600 dark:text-blue-300">
                  <ArrowUpRight className="h-6 w-6 mr-2" />
                  Seamless Streaming Experience
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300">
                  AdaptiveFlow ensures buffer-free playback across devices and
                  network conditions, providing your audience with a top-notch
                  viewing experience.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900 dark:to-teal-900 border-none shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-green-600 dark:text-green-300">
                  <Server className="h-6 w-6 mr-2" />
                  Scalable Cloud Infrastructure
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300">
                  Built on Azure&apos;s robust cloud services, AdaptiveFlow
                  scales effortlessly to meet your growing audience demands
                  without compromising performance.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900 dark:to-amber-900 border-none shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-yellow-600 dark:text-yellow-300">
                  <Lock className="h-6 w-6 mr-2" />
                  Enhanced Security
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300">
                  Protect your valuable content with advanced security features,
                  ensuring that your videos are accessible only to authorized
                  viewers.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900 dark:to-red-900 border-none shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-orange-600 dark:text-orange-300">
                  <Zap className="h-6 w-6 mr-2" />
                  Real-time Processing Updates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300">
                  Keep your users informed with instant notifications about
                  video processing status, enhancing overall user experience and
                  engagement.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-20 text-center">
          <h2 className="text-3xl font-semibold mb-8">
            Ready to Elevate Your Video Streaming?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Join the ranks of content creators and businesses leveraging
            AdaptiveFlow for unparalleled video streaming experiences.
          </p>
          <Link href="/" passHref>
            <Button
              size="lg"
              className="text-lg bg-blue-600 hover:bg-blue-700 text-white"
            >
              Get Started with AdaptiveFlow
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

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: JSX.Element;
  title: string;
  description: string;
}) {
  return (
    <Card className="flex flex-col h-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
          {icon}
        </div>
        <CardTitle className="text-xl font-semibold text-gray-800 dark:text-white">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-gray-600 dark:text-gray-300">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}

function TechLogo({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="flex items-center justify-center w-32 h-32 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <Image
        src={src}
        alt={alt}
        width={100}
        height={100}
        className="object-contain"
      />
    </div>
  );
}

function ArchitectureCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: JSX.Element;
}) {
  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="flex items-center text-xl font-semibold text-gray-800 dark:text-white">
          {icon}
          <span className="ml-2">{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-gray-600 dark:text-gray-300">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}
