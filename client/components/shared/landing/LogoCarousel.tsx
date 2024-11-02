"use client"

import React from "react"
import Image from "next/image"

interface Icon {
    label: string
    sourcePath: string
}

export default function LogoCarousel({ icons }: { icons: Icon[] }) {
    return (
        <div className="w-full overflow-hidden bg-background py-10">
            <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background to-transparent z-10"></div>
                <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent z-10"></div>
                <div className="flex animate-logo-cloud">
                    {[...icons, ...icons].map((icon, index) => (
                        <div
                            key={`${icon.label}-${index}`}
                            className="flex-none mx-8 w-[200px]"
                        >
                            <div className="h-20 w-full flex items-center justify-center">
                                <Image
                                    src={icon.sourcePath}
                                    alt={icon.label}
                                    width={160}
                                    height={80}
                                    className="max-h-16 w-auto object-contain"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}