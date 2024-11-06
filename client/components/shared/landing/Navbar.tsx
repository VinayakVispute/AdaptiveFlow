"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, Sun, Moon, LogOut, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Image from "next/image";
import {
  SignedOut,
  SignedIn,
  SignInButton,
  SignUpButton,
  useClerk,
  useAuth,
} from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("/");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { scrollY } = useScroll();
  const { signOut } = useAuth();
  const router = useRouter();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  useEffect(() => {
    setCurrentPage(window.location.pathname);
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const navItems = [
    { name: "How It Works", link: "/How-It-Works" },
    { name: "Technology", link: "/Technology" },
    {
      name: "Portfolio",
      link: "https://www.visputevinayak.co/",
      target: "_blank",
    },
    { name: "Workflow", link: "/assets/header-workflow.svg", target: "_blank" },
    {
      name: "Github",
      link: "https://github.com/VinayakVispute/AdaptiveFlow",
      target: "_blank",
    },
  ];

  const colors = {
    primary: "#3B82F6",
    secondary: "#14B8A6",
    background: "#FFFFFF",
    text: "#1E293B",
  };

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      router.push("/");
      await signOut();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <motion.nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        backgroundColor: isScrolled ? colors.background : "transparent",
        backdropFilter: isScrolled ? "blur(10px)" : "none", // blur effect for backdrop-blur-md
        boxShadow: isScrolled ? "0px 4px 6px rgba(0, 0, 0, 0.1)" : "none", // shadow-md approximation
        transition: "all 0.3s ease", // transition-all and duration-300
        opacity: isScrolled ? 0.8 : 1, // bg-opacity-80 approximation
      }}
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
                className={`transition-colors ${
                  currentPage === item.link ? `font-semibold` : ``
                }`}
                style={{
                  color:
                    currentPage === item.link ? colors.primary : colors.text,
                }}
                target={item.target ? item.target : undefined}
                rel={
                  item.target === "_blank" ? "noopener noreferrer" : undefined
                }
              >
                {item.name}
              </Link>
            ))}
          </div>
          <SignedOut>
            <div className="hidden md:flex items-center space-x-2">
              <SignInButton forceRedirectUrl="/Dashboard">
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
                    color: colors.background,
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
                    color: colors.background,
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
                disabled={isLoggingOut}
              >
                {isLoggingOut ? (
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                ) : (
                  <LogOut className="h-5 w-5 mr-2" />
                )}
                {isLoggingOut ? "Logging out..." : "Logout"}
              </Button>
            </div>
          </SignedIn>
          <Button
            onClick={toggleTheme}
            variant="ghost"
            size="icon"
            className="ml-2"
            aria-label={
              isDarkMode ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              style={{ backgroundColor: colors.background }}
            >
              <div className="flex flex-col space-y-4 mt-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.link}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button
                      variant="ghost"
                      className={`w-full justify-start transition-colors ${
                        currentPage === item.link ? `font-semibold` : ``
                      }`}
                      style={{
                        color:
                          currentPage === item.link
                            ? colors.primary
                            : colors.text,
                      }}
                    >
                      {item.name}
                    </Button>
                  </Link>
                ))}
                <SignedOut>
                  <SignInButton forceRedirectUrl="/Dashboard">
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
                        color: colors.background,
                      }}
                    >
                      Sign up
                    </Button>
                  </SignUpButton>
                </SignedOut>
                <SignedIn>
                  <Link
                    href="/Dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button
                      className="w-full justify-start transition-colors"
                      style={{
                        backgroundColor: colors.primary,
                        color: colors.background,
                      }}
                    >
                      Dashboard
                    </Button>
                  </Link>
                  <Link
                    href="/Profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
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
                    disabled={isLoggingOut}
                  >
                    {isLoggingOut ? (
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    ) : (
                      <LogOut className="h-5 w-5 mr-2" />
                    )}
                    {isLoggingOut ? "Logging out..." : "Logout"}
                  </Button>
                </SignedIn>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.nav>
  );
}
