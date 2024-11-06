"use client";
import React, { useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import SectionHeader from "@/components/ui/SectionHeader";

interface AccordionItem {
  title: string;
  description: string;
}

interface AccordionProps {
  i: number;
  expanded: number | null;
  setExpanded: React.Dispatch<React.SetStateAction<number | null>>;
  title: string;
  description: string;
}

const accordionItems: AccordionItem[] = [
  {
    title: "What is Adaptive Bitrate Streaming?",
    description:
      "Adaptive Bitrate Streaming (ABR) is a technique used to enhance video playback quality by adjusting the bitrate of a video stream in real time based on the viewer's network conditions. It ensures a seamless viewing experience, avoiding buffering, by dynamically switching between different quality levels of the video stream as network speeds fluctuate.",
  },
  {
    title: "How does Adaptive Bitrate Streaming work?",
    description:
      "ABR works by encoding multiple versions of a video at different bitrates. As the video is delivered, the player's client detects the viewer's bandwidth and adjusts the stream to the most suitable bitrate. For instance, on a slow network, a lower bitrate version of the video will be played, while on a faster network, a higher-quality version is used. This process happens in real time without interrupting the viewer's experience.",
  },
  {
    title: "What are the advantages of using Adaptive Bitrate Streaming?",
    description:
      "The key advantage of ABR is that it reduces buffering and improves video quality by adapting to changing network conditions. This ensures viewers can continue watching without interruption, regardless of fluctuations in their Internet speed. It also makes streaming accessible to a wider audience across various devices and networks.",
  },
  {
    title: "How does ABR relate to HLS streaming?",
    description:
      "HTTP Live Streaming (HLS) is a popular protocol for ABR. HLS breaks down a video into small chunks and serves different quality versions of these chunks depending on the user's bandwidth. HLS is widely supported and used in platforms like Apple and other streaming services. It works well with adaptive bitrate techniques to improve video delivery.",
  },
  {
    title: "Can adaptive streaming improve live video streams?",
    description:
      "Yes, ABR significantly improves live video streams. It ensures that even during live streaming events, viewers with different internet speeds can access content without buffering or quality degradation. This is critical for large audiences accessing live events from various network conditions around the world.",
  },
];

const FAQ: React.FC = () => {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="mx-auto max-w-2xl py-16 sm:px-4">
      <SectionHeader
        title="Frequently asked"
        highlightedText="questions"
        description="Learn more about Adaptive Bitrate Streaming and how it improves video playback."
      />

      <div className="space-y-4">
        {accordionItems.map((item, i) => (
          <Accordion
            key={i}
            i={i}
            expanded={expanded}
            setExpanded={setExpanded}
            title={item.title}
            description={item.description}
          />
        ))}
      </div>
    </div>
  );
};

const Accordion: React.FC<AccordionProps> = ({
  i,
  expanded,
  setExpanded,
  title,
  description,
}) => {
  const isOpen = i === expanded;

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{
        delay: 0.2 * i,
        duration: 0.8,
      }}
      className="overflow-hidden rounded-lg border border-[#E2E8F0]"
    >
      <motion.header
        initial={false}
        animate={{
          backgroundColor: isOpen ? "#F1F5F9" : "#FFFFFF",
        }}
        onClick={() => setExpanded(isOpen ? null : i)}
        className="flex cursor-pointer items-center justify-between p-4"
      >
        <h3 className="text-lg font-medium text-[#1E293B]">{title}</h3>
        <div>
          <motion.svg
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="size-5 text-[#64748B]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </motion.svg>
        </div>
      </motion.header>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.section
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: "auto" },
              collapsed: { opacity: 0, height: 0 },
            }}
            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            <div className="bg-[#F8FAFC] p-4 text-[#475569]">{description}</div>
          </motion.section>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FAQ;
