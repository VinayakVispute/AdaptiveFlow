"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  SignedOut,
  SignOutButton,
  UserButton,
  SignedIn,
  SignInButton,
} from "@clerk/nextjs";
import { Bell, MountainIcon, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import NotificationDashboard from "./NotificationDashboard";
import { useNotificationHistory } from "@/context/NotificationHistoryContext";
import { NotificationState } from "@/interface";

const DashboardNavbar = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navItems = [
    { href: "/", label: "Home" },
    { href: "/History", label: "History" },
    { href: "/Profile", label: "Profile" },
    { href: "/Dashboard", label: "Dashboard" },
    {
      href: "/Policy", label: "Policy"
    }
  ];

  const { notifications
  }: { notifications: NotificationState[] | [] } = useNotificationHistory()


  console.log(notifications, notifications.length)

  return (
    <header className="bg-gradient-to-r from-[#0ca678] to-[#12b886] text-white sticky top-0 z-20 px-4 sm:px-6 py-3 shadow-md transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <nav className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105" prefetch={false}>
            <MountainIcon className="h-6 w-6" />
            <span className="text-lg font-bold">Video Processing</span>
          </Link>
          <div className="hidden md:flex items-center gap-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`hover:text-[#e6fcf5] transition-colors duration-300 ${pathname === item.href ? "text-[#e6fcf5] font-medium" : ""
                  }`}
                prefetch={false}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
        <div className="flex items-center gap-x-4">
          <SignedIn>
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative text-whi te hover:bg-[#0ca678]/20">
                    <Bell className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4">
                      {notifications.length >= 0 ? notifications.length : 0}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" >
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {notifications && (
                    <NotificationDashboard notifications={notifications} />
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "h-10 w-10",
                  },
                }}
              />
              <SignOutButton>
                <Button variant="ghost" className="text-white hover:bg-[#0ca678]/20">
                  Sign out
                </Button>
              </SignOutButton>
            </div>
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="ghost" className="text-white hover:bg-[#0ca678]/20">
                Sign in
              </Button>
            </SignInButton>
          </SignedOut>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white hover:bg-[#0ca678]/20"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 pb-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block py-2 px-4 hover:bg-[#0ca678]/20 transition-colors duration-300 ${pathname === item.href ? "bg-[#0ca678]/20 font-medium" : ""
                }`}
              prefetch={false}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};

export default DashboardNavbar;