import { Check } from "lucide-react";
import Image from "next/image";

export default function CTA() {
    return (
        <section className="block items-center justify-between gap-10 md:flex">
            <div className="mx-auto md:mt-0 md:w-1/2">
                <h1 className="text-balance text-center text-4xl font-bold md:text-left lg:max-w-3xl lg:text-5xl">
                    Enhance your{" "}
                    <span className="bg-gradient-to-r from-[#3B82F6] to-[#2563EB] bg-clip-text text-transparent">
                        video streaming
                    </span>{" "}
                    with adaptive bitrate
                </h1>
                <ul className="my-8 space-y-4">
                    {[
                        "Widens access to viewers with slower connections",
                        "Improves user experience by decreasing buffering",
                        "Enables seamless mobile viewing with fewer interruptions",
                    ].map((pointer: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                            <div>
                                <Check className="size-6 rounded-full border-2 border-[#3B82F6] p-0.5 text-[#3B82F6]" />
                            </div>
                            <span className="text-[#475569]">
                                {pointer}
                            </span>
                        </li>
                    ))}
                </ul>

                <div className="flex items-center gap-6">
                    <a href="/learn-more">
                        <button className="group h-10 select-none rounded-lg bg-[#3B82F6] px-3 text-sm leading-8 text-[#F8FAFC] shadow-[inset_0_1px_0px_0px_#60A5FA] hover:bg-[#2563EB] active:bg-[#1D4ED8] active:shadow-[-1px_0px_1px_0px_rgba(0,0,0,.2)_inset,1px_0px_1px_0px_rgba(0,0,0,.2)_inset,0px_0.125rem_0px_0px_rgba(0,0,0,.6)_inset]">
                            <span className="block group-active:[transform:translate3d(0,1px,0)]">
                                Learn More
                            </span>
                        </button>
                    </a>
                    <button
                        role="link"
                        className="relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-left after:scale-x-100 after:bg-[#1E293B] after:transition-transform after:duration-150 after:ease-in-out hover:after:origin-bottom-right hover:after:scale-x-0"
                    >
                        Get Started
                    </button>
                </div>
            </div>
            <div className="mt-10 md:mt-0 md:w-1/2">
                <div className="w-fit rounded-lg bg-[#F1F5F9] p-2 ring-1 ring-inset ring-[#E2E8F0] lg:rounded-2xl lg:p-3">
                    <Image
                        src="https://ui.metamorix.com/dashboard.png"
                        width={500}
                        height={500}
                        alt="Video Streaming Dashboard"
                        className="w-full rounded-lg bg-[#F8FAFC] ring-1 ring-[#E2E8F0]"
                    />
                </div>
            </div>
        </section>
    );
}