"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  SignedOut,
  SignOutButton,
  UserButton,
  SignedIn,
  SignInButton,
} from "@clerk/nextjs"
import { Bell, MountainIcon, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import NotificationDashboard from "./NotificationDashboard"
import { useNotificationHistory } from "@/context/NotificationHistoryContext"
import { NotificationState } from "@/interface"

const DashboardNavbar = () => {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navItems = [
    { href: "/", label: "Home" },
    { href: "/History", label: "History" },
    { href: "/Profile", label: "Profile" },
    { href: "/Dashboard", label: "Dashboard" },
    { href: "/Policy", label: "Policy" }
  ]

  const { notifications }: { notifications: NotificationState[] | [] } = useNotificationHistory()

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
            <span className="text-lg font-bold tracking-tight">Video Processing</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative py-1 hover:text-blue-100 transition-all duration-300 group ${pathname === item.href ? "text-white font-medium" : "text-blue-50"
                  }`}
                prefetch={false}
              >
                {item.label}
                {pathname === item.href && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white rounded-full" />
                )}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-100 rounded-full transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>
        </nav>
        <div className="flex items-center gap-x-4">
          <SignedIn>
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative text-white hover:bg-blue-600/50 transition-colors duration-300"
                  >
                    <Bell className="h-5 w-5" />
                    {notifications.length > 0 && (
                      <span className="absolute -top-1 -right-1 flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 animate-pulse">
                        {notifications.length}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel className="text-blue-900">Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {notifications && (
                    <NotificationDashboard notifications={notifications} />
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "h-10 w-10 border-2 border-white/20 hover:border-white/40 transition-colors duration-300",
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
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 pb-4 border-t border-blue-400/30 animate-in slide-in-from-top duration-300">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block py-3 px-4 hover:bg-blue-600/50 transition-all duration-300 ${pathname === item.href
                ? "bg-blue-600/30 font-medium"
                : ""
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
  )
}

export default DashboardNavbar