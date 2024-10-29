import React from "react";
import Image from "next/image";

const logos = [
    {
        name: "Babel",
        url: "https://svgl.app/library/babel.svg",
    },
    {
        name: "Ngrok",
        url: "https://svgl.app/library/ngrok-light.svg",
    },
    {
        name: "Webflow",
        url: "https://svgl.app/library/webflow.svg",
    },
    {
        name: "Perplexity",
        url: "https://svgl.app/library/perplexity_wordmark_light.svg",
    },
    {
        name: "Sanity",
        url: "https://svgl.app/library/sanity.svg",
    },
    {
        name: "Post CSS",
        url: "https://svgl.app/library/postcss_wordmark.svg",
    },
];

const LogoCloud = () => {
    return (
        <div className="w-full py-12">
            <div className="mx-auto w-full px-2 md:px-4">
                <div
                    className="group relative mt-6 flex gap-6 overflow-hidden p-2"
                    style={{
                        maskImage:
                            "linear-gradient(to left, transparent 0%, black 20%, black 80%, transparent 95%)",
                    }}
                >
                    {Array(5)
                        .fill(null)
                        .map((index) => (
                            <div
                                key={index}
                                className="flex shrink-0 animate-logo-cloud flex-row justify-around gap-6"
                            >
                                {logos.map((logo, key) => (
                                    <Image
                                        key={key}
                                        src={logo.url}
                                        className="h-10 w-28 px-2"
                                        alt={logo.name}
                                        width={100}
                                        height={100}
                                    />
                                ))}
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default LogoCloud;
