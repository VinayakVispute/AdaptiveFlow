import React from 'react';

interface SectionHeaderProps {
    title: string;
    highlightedText: string;
    description: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, highlightedText, description }) => {
    return (
        <div className="mx-auto mb-16 max-w-4xl text-center">
            <h1 className="mb-6 text-3xl font-bold md:text-5xl text-[#1E293B]">
                {title}{" "}
                <span className="bg-gradient-to-r from-[#3B82F6] to-[#2563EB] bg-clip-text text-transparent">
                    {highlightedText}
                </span>
            </h1>
            <p className="text-base text-[#475569] md:text-xl">
                {description}
            </p>
        </div>
    );
};

export default SectionHeader;