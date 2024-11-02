"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react'

const colors = {
    primary: {
        light: '#3B82F6', // Blue-500
        dark: '#2563EB',  // Blue-600
    },
    secondary: {
        light: '#14B8A6', // Teal-500
        dark: '#0D9488',  // Teal-600
    },
    accent: {
        light: '#7DD3FC', // Sky-300
        dark: '#0EA5E9',  // Sky-500
    },
    background: {
        light: '#FFFFFF',
        dark: '#0F172A',  // Slate-900
    },
    text: {
        light: '#1E293B', // Slate-800
        dark: '#E2E8F0',  // Slate-200
    }
}

interface ThemeContextType {
    isDarkMode: boolean;
    toggleTheme: () => void;
    colors: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
        text: string;
    };
}

const ThemeContext = createContext<ThemeContextType | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [isDarkMode, setIsDarkMode] = useState(false)

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode)
    }

    const theme: ThemeContextType = {
        isDarkMode,
        toggleTheme,
        colors: isDarkMode ?
            {
                primary: colors.primary.dark,
                secondary: colors.secondary.dark,
                accent: colors.accent.dark,
                background: colors.background.dark,
                text: colors.text.dark,
            } :
            {
                primary: colors.primary.light,
                secondary: colors.secondary.light,
                accent: colors.accent.light,
                background: colors.background.light,
                text: colors.text.light,
            }
    }

    return (
        <ThemeContext.Provider value={theme}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext)
    if (context === null) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return context
}