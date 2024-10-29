import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Github, Linkedin, Briefcase, Twitter, FileText } from "lucide-react";

const socialLinks = [
    { name: "GitHub", href: "#", icon: Github, color: "text-gray-800 dark:text-white" },
    { name: "LinkedIn", href: "#", icon: Linkedin, color: "text-blue-600 dark:text-blue-400" },
    { name: "Portfolio", href: "#", icon: Briefcase, color: "text-green-600 dark:text-green-400" },
    { name: "Twitter", href: "#", icon: Twitter, color: "text-sky-500 dark:text-sky-400" },
    { name: "Resume", href: "#", icon: FileText, color: "text-red-600 dark:text-red-400" },
];

const Footer = () => {
    return (
        <footer className="overflow-hidden py-4 md:rounded-t-2xl xl:py-6">
            <div className="w-full space-y-4 sm:space-y-4">
                <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
                    <Link href="/" className="block max-w-fit">
                        <div className="inline-flex items-center space-x-2">
                            <Image
                                src="/assets/adaptiveflow-logo.svg"
                                alt="AdaptiveFlow Logo"
                                width={150}
                                height={40}
                            />
                        </div>
                    </Link>
                    <ul className="flex flex-wrap items-center justify-center space-x-4 mr-4">
                        {socialLinks.map((item) => {
                            const Icon = item.icon;
                            return (
                                <li key={item.name} className="group relative">
                                    <Link
                                        href={item.href}
                                        className={`block p-2 transition-colors duration-200 ${item.color} hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full`}
                                        aria-label={item.name}
                                    >
                                        <Icon className="h-6 w-6" />
                                    </Link>
                                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 dark:bg-gray-200 dark:text-gray-800">
                                        {item.name}
                                    </span>
                                </li>
                            );
                        })}
                    </ul>
                </div>
                <hr className="border-[#E4E4E7] dark:border-[#27272A]" />
                <p className="text-center text-sm leading-5 text-gray-600 dark:text-gray-300">
                    © {new Date().getFullYear()} Adaptive Flow. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;