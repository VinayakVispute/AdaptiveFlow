"use client"
import { cn } from "@/lib/utils";
import SectionHeader from "@/components/ui/SectionHeader";
import {
    IconAdjustmentsBolt,
    IconCloud,
    IconCurrencyDollar,
    IconEaseInOut,
    IconHeart,
    IconRouteAltLeft,
    IconTerminal2,
} from "@tabler/icons-react";

export function Features() {

    const features = [
        {
            title: "Adaptive Bitrate Streaming",
            description:
                "HLS dynamically adjusts video quality to fit the user's screen size and network speed, ensuring smooth playback.",
            icon: <IconEaseInOut />,
        },
        {
            title: "Optimized for Variable Network Conditions",
            description:
                "Provides high-quality streaming by adapting to fluctuating bandwidth, minimizing buffering and enhancing the viewer experience.",
            icon: <IconCloud />,
        },
        {
            title: "Scalable Cloud Storage with Azure Blob",
            description:
                "Azure Blob Storage provides scalable and reliable storage, essential for handling large video files in HLS segments.",
            icon: <IconCloud />,
        },
        {
            title: "Efficient Video Processing",
            description:
                "Uses Docker and Azure Queue for efficient video segmenting, leveraging containers for rapid and isolated task execution.",
            icon: <IconAdjustmentsBolt />,
        },
        {
            title: "Content Delivery Optimization",
            description:
                "Azure Content Delivery Network ensures faster delivery of video content globally, reducing latency.",
            icon: <IconRouteAltLeft />,
        },
        {
            title: "Enhanced Video Playback",
            description:
                "Ensures smooth video playback on all devices by transcoding videos into multiple resolutions and formats.",
            icon: <IconTerminal2 />,
        },
        {
            title: "Modern Tech Stack",
            description:
                "Built with the MERN stack and Prisma ORM for a seamless, full-stack JavaScript environment backed by PostgreSQL.",
            icon: <IconCurrencyDollar />,
        },
        {
            title: "Advanced Security",
            description:
                "Uses Azure’s built-in security features to protect video assets and user data during processing and storage.",
            icon: <IconHeart />,
        },
    ];


    return (
        <section className="py-16 bg-white dark:bg-gray-900">
            <div className="w-full px-4">
                <SectionHeader
                    title="Features & Benefits"
                    highlightedText="Showcased"
                    description="Explore the advanced streaming capabilities and technical skills demonstrated in AdaptiveFlow, focusing on HLS streaming and a robust backend architecture."
                />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10 py-10 w-full">
                    {features.map((feature, index) => (
                        <Feature key={feature.title} {...feature} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}

const Feature = ({
    title,
    description,
    icon,
    index,
}: {
    title: string;
    description: string;
    icon: React.ReactNode;
    index: number;
}) => {
    return (
        <div
            className={cn(
                "flex flex-col lg:border-r  py-10 relative group/feature dark:border-neutral-800",
                (index === 0 || index === 4) && "lg:border-l dark:border-neutral-800",
                index < 4 && "lg:border-b dark:border-neutral-800"
            )}>
            <div className="mb-4 relative z-10 px-10 text-neutral-600 dark:text-neutral-400">
                {icon}
            </div>
            <div className="text-lg font-bold mb-2 relative z-10 px-10">
                <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-blue-500 transition-all duration-200 origin-center" />
                <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800 dark:text-neutral-100">
                    {title}
                </span>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-xs relative z-10 px-10">
                {description}
            </p>
        </div>
    );
};
