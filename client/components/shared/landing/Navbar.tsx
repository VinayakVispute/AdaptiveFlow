"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, useScroll, useMotionValueEvent } from "framer-motion"
import { Menu, Sun, Moon, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"
import Image from "next/image"
import { SignedOut, SignedIn, SignInButton, SignUpButton, useClerk } from "@clerk/nextjs"

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [currentPage, setCurrentPage] = useState("/")
    const [isDarkMode, setIsDarkMode] = useState(false)
    const { scrollY } = useScroll()
    const { signOut } = useClerk()

    useMotionValueEvent(scrollY, "change", (latest) => {
        setIsScrolled(latest > 50)
    })

    useEffect(() => {
        setCurrentPage(window.location.pathname)
    }, [])

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode)
    }

    const navItems = [
        { name: "How It Works", link: "/how-it-works" },
        { name: "Technology", link: "/technology" },
        { name: "Portfolio", link: "/portfolio" }
    ]

    const colors = {
        primary: '#3B82F6',
        secondary: '#14B8A6',
        background: '#FFFFFF',
        text: '#1E293B',
    }

    const handleLogout = () => {
        signOut()
    }

    return (
        <motion.nav
            className={`fixed top-0 left-0 right-0 z-50 ${isScrolled
                ? `bg-opacity-80 backdrop-blur-md shadow-md`
                : "bg-transparent"
                } transition-all duration-300`}
            style={{ backgroundColor: isScrolled ? colors.background : 'transparent' }}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <Link href="/" className="flex items-center space-x-2">
                        <Image
                            src="/assets/adaptiveflow-logo.svg"
                            alt="AdaptiveFlow Logo"
                            width={150}
                            height={40}
                        />
                    </Link>

                    <div className="hidden md:flex space-x-4">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.link}
                                className={`transition-colors ${currentPage === item.link ? `font-semibold` : ``
                                    }`}
                                style={{
                                    color: currentPage === item.link ? colors.primary : colors.text
                                }}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
                    <SignedOut>
                        <div className="hidden md:flex items-center space-x-2">
                            <SignInButton>
                                <Button
                                    variant="ghost"
                                    className="transition-colors"
                                    style={{ color: colors.text }}
                                >
                                    Log in
                                </Button>
                            </SignInButton>
                            <SignUpButton>
                                <Button
                                    className="transition-colors"
                                    style={{
                                        backgroundColor: colors.primary,
                                        color: colors.background
                                    }}
                                >
                                    Sign up
                                </Button>
                            </SignUpButton>
                        </div>
                    </SignedOut>
                    <SignedIn>
                        <div className="hidden md:flex items-center space-x-2">
                            <Link href="/Dashboard">
                                <Button
                                    className="transition-colors"
                                    style={{
                                        backgroundColor: colors.primary,
                                        color: colors.background
                                    }}
                                >
                                    Dashboard
                                </Button>
                            </Link>
                            <Link href="/Profile">
                                <Button
                                    variant="ghost"
                                    className="transition-colors"
                                    style={{ color: colors.text }}
                                >
                                    Profile
                                </Button>
                            </Link>
                            <Button
                                onClick={handleLogout}
                                variant="ghost"
                                className="transition-colors"
                                style={{ color: colors.text }}
                            >
                                <LogOut className="h-5 w-5 mr-2" />
                                Logout
                            </Button>
                        </div>
                    </SignedIn>
                    <Button
                        onClick={toggleTheme}
                        variant="ghost"
                        size="icon"
                        className="ml-2"
                        aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
                    >
                        {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </Button>
                    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden">
                                <Menu className="h-6 w-6" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" style={{ backgroundColor: colors.background }}>
                            <div className="flex flex-col space-y-4 mt-4">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.link}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <Button
                                            variant="ghost"
                                            className={`w-full justify-start transition-colors ${currentPage === item.link ? `font-semibold` : ``
                                                }`}
                                            style={{
                                                color: currentPage === item.link ? colors.primary : colors.text
                                            }}
                                        >
                                            {item.name}
                                        </Button>
                                    </Link>
                                ))}
                                <SignedOut>
                                    <SignInButton>
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start transition-colors"
                                            style={{ color: colors.text }}
                                        >
                                            Log in
                                        </Button>
                                    </SignInButton>
                                    <SignUpButton>
                                        <Button
                                            className="w-full justify-start transition-colors"
                                            style={{
                                                backgroundColor: colors.primary,
                                                color: colors.background
                                            }}
                                        >
                                            Sign up
                                        </Button>
                                    </SignUpButton>
                                </SignedOut>
                                <SignedIn>
                                    <Link href="/Dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                                        <Button
                                            className="w-full justify-start transition-colors"
                                            style={{
                                                backgroundColor: colors.primary,
                                                color: colors.background
                                            }}
                                        >
                                            Dashboard
                                        </Button>
                                    </Link>
                                    <Link href="/Profile" onClick={() => setIsMobileMenuOpen(false)}>
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start transition-colors"
                                            style={{ color: colors.text }}
                                        >
                                            Profile
                                        </Button>
                                    </Link>
                                    <Button
                                        onClick={handleLogout}
                                        variant="ghost"
                                        className="w-full justify-start transition-colors"
                                        style={{ color: colors.text }}
                                    >
                                        <LogOut className="h-5 w-5 mr-2" />
                                        Logout
                                    </Button>
                                </SignedIn>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </motion.nav>
    )
}