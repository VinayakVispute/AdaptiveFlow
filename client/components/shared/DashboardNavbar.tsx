"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SignedOut,
  SignOutButton,
  UserButton,
  SignedIn,
  SignInButton,
} from "@clerk/nextjs";
import { MountainIcon, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import NotificationBell from "./NotificationBell";
import MobileMenu from "./MobileMenu";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/History", label: "History" },
  { href: "/Profile", label: "Profile" },
  { href: "/Dashboard", label: "Dashboard" },
  { href: "/Policy", label: "Policy" },
];

export default function DashboardNavbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-[#4285F4] text-white sticky top-0 z-20 px-4 sm:px-6 py-4 shadow-lg transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <nav className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:text-blue-100"
            prefetch={false}
          >
            <MountainIcon className="h-6 w-6" />
            <span className="text-lg font-bold tracking-tight">
              Video Processing
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <NavLink key={item.href} {...item} pathname={pathname} />
            ))}
          </div>
        </nav>
        <div className="flex items-center gap-x-4">
          <SignedIn>
            <div className="flex items-center gap-4">
              <NotificationBell />
              <UserButton
                appearance={{
                  elements: {
                    avatarBox:
                      "h-10 w-10 border-2 border-white/20 hover:border-white/40 transition-colors duration-300",
                  },
                }}
              />
              <SignOutButton>
                <Button
                  variant="ghost"
                  className="text-white hover:bg-blue-600/50 transition-all duration-300 hover:scale-105"
                >
                  Sign out
                </Button>
              </SignOutButton>
            </div>
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <Button
                variant="ghost"
                className="text-white hover:bg-blue-600/50 transition-all duration-300 hover:scale-105"
              >
                Sign in
              </Button>
            </SignInButton>
          </SignedOut>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white hover:bg-blue-600/50"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
      <MobileMenu
        isOpen={isMobileMenuOpen}
        setIsOpen={setIsMobileMenuOpen}
        navItems={navItems}
        pathname={pathname}
      />
    </header>
  );
}

function NavLink({
  href,
  label,
  pathname,
}: {
  href: string;
  label: string;
  pathname: string;
}) {
  return (
    <Link
      href={href}
      className={`relative py-1 hover:text-blue-100 transition-all duration-300 group ${
        pathname === href ? "text-white font-medium" : "text-blue-50"
      }`}
      prefetch={false}
    >
      {label}
      {pathname === href && (
        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white rounded-full" />
      )}
      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-100 rounded-full transition-all duration-300 group-hover:w-full" />
    </Link>
  );
}
