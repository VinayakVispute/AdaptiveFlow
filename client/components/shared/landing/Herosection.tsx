"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, MotionValue, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import LogoCarousel from "./LogoCarousel";

const icons = [
  { label: "Azure", sourcePath: "/assets/Microsoft_Azure.svg" },
  { label: "Next.js", sourcePath: "/assets/Nextjs-logo.svg" },
  { label: "TypeScript", sourcePath: "/assets/ts-logo-256.svg" },
  { label: "NodeJs", sourcePath: "/assets/nodejsStackedDark.svg" },
  { label: "Prisma", sourcePath: "/assets/Prisma-IndigoLogo.svg" },
  { label: "PostgreSQL", sourcePath: "/assets/postgresql-ar21.svg" },
  { label: "Docker", sourcePath: "/assets/docker-logo-blue.svg" },
  { label: "ClerkJs", sourcePath: "/assets/clerk-logo-dark-accent.svg" },
  {
    label: "Pusher",
    sourcePath: "/assets/pusher-logo-0576fd4af5c38706f96f632235f3124a.svg",
  },
];

const Hero = () => {
  return (
    <>
      <ContainerScroll
        titleComponent={
          <>
            <section>
              <div className="absolute inset-0 -z-10 h-[150vh] bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
              <Particles
                className="absolute inset-0 -z-20"
                quantity={100}
                color="#000000"
                ease={20}
                refresh
              />
              <div>
                <div className="flex h-full flex-col items-center justify-center">
                  <div className="mt-8 flex max-w-3xl flex-col items-center md:w-full">
                    <h1 className="text-center text-4xl font-bold text-[#1E293B] md:text-6xl">
                      Effortless Video Optimization{" "}
                      <span className="bg-gradient-to-r from-[#3B82F6] to-[#2563EB] bg-clip-text text-transparent">
                        {" "}
                        for Any Screen{" "}
                      </span>
                    </h1>
                    <p className="my-6 text-center text-base text-[#475569] md:text-lg">
                      AdaptiveFlow transcodes and segments your videos,
                      delivering adaptive streaming instantly
                    </p>

                    <button className="relative mt-4 cursor-pointer rounded-[16px] border-none bg-[radial-gradient(circle_80px_at_80%_-10%,#ffffff,#1E293B)] p-[2px] text-lg transition-all duration-150">
                      <div className="absolute bottom-0 left-0 h-full w-[70px] rounded-[16px] bg-[radial-gradient(circle_60px_at_0%_100%,#3B82F6,#2563EB,transparent)] shadow-[-10px_10px_30px_#2563EB66] transition-all duration-150" />
                      <div className="absolute right-0 top-0 z-[-1] h-3/5 w-[65%] rounded-[120px] shadow-[0_0_20px_#ffffff38] transition-all duration-150" />
                      <div className="relative z-[3] flex items-center gap-3 rounded-[14px] bg-[radial-gradient(circle_80px_at_80%_-50%,#475569,#1E293B)] px-4 py-2 text-white transition-all duration-150">
                        Get Started <ArrowRight className="size-5" />
                        <div className="absolute inset-0 rounded-[14px] bg-[radial-gradient(circle_60px_at_0%_100%,#3B82F61a,#2563EB11,transparent)] transition-all duration-150" />
                      </div>
                    </button>
                  </div>
                  <div className="relative flex w-full items-center px-4 py-10 md:py-20">
                    <div
                      style={{
                        background:
                          "conic-gradient(from 230.29deg at 51.63% 52.16%, #3B82F6 0deg, #2563EB 67.5deg, #3B82F6 198.75deg, #1D4ED8 251.25deg, #2563EB 301.88deg, #3B82F6 1turn)",
                      }}
                      className="absolute inset-0 left-1/2 top-1/2 -z-10 size-2/4 -translate-x-1/2 -translate-y-1/2 opacity-20 blur-[10rem]"
                    />
                  </div>
                </div>
              </div>
            </section>
          </>
        }
      >
        <Image
          alt="header"
          width={1920}
          height={1080}
          className="rounded-[20px]"
          style={{ color: "transparent" }}
          src={"https://ui.metamorix.com/hero.png"}
        />
      </ContainerScroll>
      <LogoCarousel icons={icons} />
    </>
  );
};

export default Hero;

interface MousePosition {
  x: number;
  y: number;
}

function MousePosition(): MousePosition {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return mousePosition;
}

interface ParticlesProps {
  className?: string;
  quantity?: number;
  staticity?: number;
  ease?: number;
  size?: number;
  refresh?: boolean;
  color?: string;
  vx?: number;
  vy?: number;
}

function hexToRgb(hex: string): number[] {
  hex = hex.replace("#", "");

  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("");
  }

  const hexInt = parseInt(hex, 16);
  const red = (hexInt >> 16) & 255;
  const green = (hexInt >> 8) & 255;
  const blue = hexInt & 255;
  return [red, green, blue];
}

const Particles: React.FC<ParticlesProps> = ({
  className = "",
  quantity = 100,
  staticity = 50,
  ease = 50,
  size = 0.4,
  refresh = false,
  color = "#ffffff",
  vx = 0,
  vy = 0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const context = useRef<CanvasRenderingContext2D | null>(null);
  const circles = useRef<any[]>([]);
  const mousePosition = MousePosition();
  const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const canvasSize = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1;

  useEffect(() => {
    if (canvasRef.current) {
      context.current = canvasRef.current.getContext("2d");
    }
    initCanvas();
    animate();
    window.addEventListener("resize", initCanvas);

    return () => {
      window.removeEventListener("resize", initCanvas);
    };
  }, [color]);

  useEffect(() => {
    onMouseMove();
  }, [mousePosition.x, mousePosition.y]);

  useEffect(() => {
    initCanvas();
  }, [refresh]);

  const initCanvas = () => {
    resizeCanvas();
    drawParticles();
  };

  const onMouseMove = () => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const { w, h } = canvasSize.current;
      const x = mousePosition.x - rect.left - w / 2;
      const y = mousePosition.y - rect.top - h / 2;
      const inside = x < w / 2 && x > -w / 2 && y < h / 2 && y > -h / 2;
      if (inside) {
        mouse.current.x = x;
        mouse.current.y = y;
      }
    }
  };

  type Circle = {
    x: number;
    y: number;
    translateX: number;
    translateY: number;
    size: number;
    alpha: number;
    targetAlpha: number;
    dx: number;
    dy: number;
    magnetism: number;
  };

  const resizeCanvas = () => {
    if (canvasContainerRef.current && canvasRef.current && context.current) {
      circles.current.length = 0;
      canvasSize.current.w = canvasContainerRef.current.offsetWidth;
      canvasSize.current.h = canvasContainerRef.current.offsetHeight;
      canvasRef.current.width = canvasSize.current.w * dpr;
      canvasRef.current.height = canvasSize.current.h * dpr;
      canvasRef.current.style.width = `${canvasSize.current.w}px`;
      canvasRef.current.style.height = `${canvasSize.current.h}px`;
      context.current.scale(dpr, dpr);
    }
  };

  const circleParams = (): Circle => {
    const x = Math.floor(Math.random() * canvasSize.current.w);
    const y = Math.floor(Math.random() * canvasSize.current.h);
    const translateX = 0;
    const translateY = 0;
    const pSize = Math.floor(Math.random() * 2) + size;
    const alpha = 0;
    const targetAlpha = parseFloat((Math.random() * 0.6 + 0.1).toFixed(1));
    const dx = (Math.random() - 0.5) * 0.1;
    const dy = (Math.random() - 0.5) * 0.1;
    const magnetism = 0.1 + Math.random() * 4;
    return {
      x,
      y,
      translateX,
      translateY,
      size: pSize,
      alpha,
      targetAlpha,
      dx,
      dy,
      magnetism,
    };
  };

  const rgb = hexToRgb(color);

  const drawCircle = (circle: Circle, update = false) => {
    if (context.current) {
      const { x, y, translateX, translateY, size, alpha } = circle;
      context.current.translate(translateX, translateY);
      context.current.beginPath();
      context.current.arc(x, y, size, 0, 2 * Math.PI);
      context.current.fillStyle = `rgba(${rgb.join(", ")}, ${alpha})`;
      context.current.fill();
      context.current.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (!update) {
        circles.current.push(circle);
      }
    }
  };

  const clearContext = () => {
    if (context.current) {
      context.current.clearRect(
        0,
        0,
        canvasSize.current.w,
        canvasSize.current.h
      );
    }
  };

  const drawParticles = () => {
    clearContext();
    const particleCount = quantity;
    for (let i = 0; i < particleCount; i++) {
      const circle = circleParams();
      drawCircle(circle);
    }
  };

  const remapValue = (
    value: number,
    start1: number,
    end1: number,
    start2: number,
    end2: number
  ): number => {
    const remapped =
      ((value - start1) * (end2 - start2)) / (end1 - start1) + start2;
    return remapped > 0 ? remapped : 0;
  };

  const animate = () => {
    clearContext();
    circles.current.forEach((circle: Circle, i: number) => {
      const edge = [
        circle.x + circle.translateX - circle.size,
        canvasSize.current.w - circle.x - circle.translateX - circle.size,
        circle.y + circle.translateY - circle.size,
        canvasSize.current.h - circle.y - circle.translateY - circle.size,
      ];
      const closestEdge = edge.reduce((a, b) => Math.min(a, b));
      const remapClosestEdge = parseFloat(
        remapValue(closestEdge, 0, 20, 0, 1).toFixed(2)
      );
      if (remapClosestEdge > 1) {
        circle.alpha += 0.02;
        if (circle.alpha > circle.targetAlpha) {
          circle.alpha = circle.targetAlpha;
        }
      } else {
        circle.alpha = circle.targetAlpha * remapClosestEdge;
      }
      circle.x += circle.dx + vx;
      circle.y += circle.dy + vy;
      circle.translateX +=
        (mouse.current.x / (staticity / circle.magnetism) - circle.translateX) /
        ease;
      circle.translateY +=
        (mouse.current.y / (staticity / circle.magnetism) - circle.translateY) /
        ease;

      drawCircle(circle, true);

      if (
        circle.x < -circle.size ||
        circle.x > canvasSize.current.w + circle.size ||
        circle.y < -circle.size ||
        circle.y > canvasSize.current.h + circle.size
      ) {
        circles.current.splice(i, 1);
        const newCircle = circleParams();
        drawCircle(newCircle);
      }
    });
    window.requestAnimationFrame(animate);
  };

  return (
    <div className={className} ref={canvasContainerRef} aria-hidden="true">
      <canvas ref={canvasRef} className="size-full" />
    </div>
  );
};

const ContainerScroll = ({
  titleComponent,
  children,
}: {
  titleComponent: string | React.ReactNode;
  children: React.ReactNode;
}) => {
  const containerRef = useRef<any>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
  });
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const scaleDimensions = () => {
    return isMobile ? [0.7, 0.9] : [1.05, 1];
  };

  const rotate = useTransform(scrollYProgress, [0, 1], [20, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], scaleDimensions());
  const translate = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div
      className="relative flex items-center justify-center"
      ref={containerRef}
    >
      <div
        className="relative w-full py-10 md:py-40"
        style={{
          perspective: "1000px",
        }}
      >
        <Header translate={translate} titleComponent={titleComponent} />
        <Card rotate={rotate} translate={translate} scale={scale}>
          {children}
        </Card>
      </div>
    </div>
  );
};

const Header = ({ translate, titleComponent }: any) => {
  return (
    <motion.div
      style={{
        translateY: translate,
      }}
      className="div mx-auto max-w-5xl text-center"
    >
      {titleComponent}
    </motion.div>
  );
};

export const Card = ({
  rotate,
  scale,
  children,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  translate: MotionValue<number>;
  children: React.ReactNode;
}) => {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
      }}
      className="mx-auto -mt-12 h-auto w-full max-w-5xl rounded-[30px]"
    >
      <div className="relative mx-auto w-full rounded-[32px] border border-[#E2E8F0] bg-[#F8FAFC] p-2 opacity-100 backdrop-blur-lg will-change-auto md:p-4">
        {children}
      </div>
    </motion.div>
  );
};
