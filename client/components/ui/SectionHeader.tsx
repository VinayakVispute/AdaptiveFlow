import React from 'react';

interface SectionHeaderProps {
    title: string;
    highlightedText: string;
    description: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, highlightedText, description }) => {
    return (
        <div className="mx-auto mb-16 max-w-4xl text-center">
            <h1 className="mb-6 text-3xl font-bold md:text-5xl">
                {title}{" "}
                <span className="bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                    {highlightedText}
                </span>
            </h1>
            <p className="text-base text-gray-600 dark:text-gray-300 md:text-xl">
                {description}
            </p>
        </div>
    );
};

export default SectionHeader;