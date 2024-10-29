"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, useScroll, useMotionValueEvent } from "framer-motion"
import { Menu, Laptop } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"
import Image from "next/image"
import { SignedOut, SignedIn, SignInButton, SignUpButton } from "@clerk/nextjs"

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [currentPage, setCurrentPage] = useState("/")
    const { scrollY } = useScroll()

    useMotionValueEvent(scrollY, "change", (latest) => {
        setIsScrolled(latest > 50)
    })

    useEffect(() => {
        setCurrentPage(window.location.pathname)
    }, [])

    const navItems = [
        { name: "How It Works", link: "/how-it-works" },
        { name: "Technology", link: "/technology" },
        { name: "Portfolio", link: "/portfolio" }
    ]

    return (
        <motion.nav
            className={`fixed top-0 left-0 right-0 z-50 ${isScrolled ? "bg-white/80 backdrop-blur-md shadow-md" : "bg-transparent"
                } transition-all duration-300`}
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
                                className={`text-gray-600 hover:text-orange-500 transition-colors ${currentPage === item.link ? "text-orange-500 font-semibold" : ""
                                    }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
                    <SignedOut>
                        <div className="hidden md:flex items-center space-x-2">
                            <SignInButton>
                                <Button variant="ghost" className="text-gray-600 hover:text-orange-500 transition-colors">Log in</Button>
                            </SignInButton>
                            <SignUpButton>
                                <Button className="bg-gradient-to-r from-orange-500 to-red-600 text-white hover:from-orange-600 hover:to-red-700 transition-colors">Sign up</Button>
                            </SignUpButton>
                        </div>
                    </SignedOut>
                    <SignedIn>
                        <div className="hidden md:flex items-center space-x-2">
                            <Link href="/dashboard">
                                <Button className="bg-gradient-to-r from-orange-500 to-red-600 text-white hover:from-orange-600 hover:to-red-700 transition-colors">
                                    Dashboard
                                </Button>
                            </Link>
                            <Link href="/profile">
                                <Button variant="ghost" className="text-gray-600 hover:text-orange-500 transition-colors">
                                    Profile
                                </Button>
                            </Link>
                        </div>
                    </SignedIn>
                    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden">
                                <Menu className="h-6 w-6" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right">
                            <div className="flex flex-col space-y-4 mt-4">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.link}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <Button
                                            variant="ghost"
                                            className={`w-full justify-start transition-colors ${currentPage === item.link
                                                ? "text-orange-500 font-semibold"
                                                : "text-gray-600 hover:text-orange-500"
                                                }`}
                                        >
                                            {item.name}
                                        </Button>
                                    </Link>
                                ))}
                                <SignedOut>
                                    <SignInButton>
                                        <Button variant="ghost" className="w-full justify-start text-gray-600 hover:text-orange-500 transition-colors">Log in</Button>
                                    </SignInButton>
                                    <SignUpButton>
                                        <Button className="w-full justify-start bg-gradient-to-r from-orange-500 to-red-600 text-white hover:from-orange-600 hover:to-red-700 transition-colors">Sign up</Button>
                                    </SignUpButton>
                                </SignedOut>
                                <SignedIn>
                                    <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                                        <Button className="w-full justify-start bg-gradient-to-r from-orange-500 to-red-600 text-white hover:from-orange-600 hover:to-red-700 transition-colors">
                                            Dashboard
                                        </Button>
                                    </Link>
                                    <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                                        <Button variant="ghost" className="w-full justify-start text-gray-600 hover:text-orange-500 transition-colors">
                                            Profile
                                        </Button>
                                    </Link>
                                </SignedIn>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </motion.nav>
    )
}