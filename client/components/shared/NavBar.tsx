import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MenuIcon, MountainIcon } from "lucide-react"
import { SignedIn, SignedOut, SignInButton, SignOutButton, UserButton } from "@clerk/nextjs"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"

const NavBar = () => {
    const navBarConstants = [
        { name: "How It Works", link: "/How-it-works" },
        { name: "Technology", link: "/Technology" }
    ]
    return (
        <header className="w-full bg-[#0ca678] text-white py-4 px-6 md:px-12 shadow-md">
            <div className="container mx-auto flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <MountainIcon className="h-6 w-6" />
                    <span className="text-lg font-bold">Video Processing</span>
                </Link>
                <nav className="hidden md:flex items-center gap-6">
                    {navBarConstants.map((item) => (
                        <Link
                            key={item.name}
                            href={item.link}
                            className="text-sm font-medium hover:text-[#e6fcf5] transition-colors"
                        >
                            {item.name}
                        </Link>
                    ))}
                    <SignedIn>
                        <Link
                            href="/Profile"
                            className="text-sm font-medium hover:text-[#e6fcf5] transition-colors"
                        >
                            Profile
                        </Link>
                        <Link
                            href="/Dashboard"
                            className="bg-[#ff6b6b] hover:bg-[#fa5252] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                            Dashboard
                        </Link>
                        <UserButton
                            appearance={{
                                elements: {
                                    avatarBox: "w-10 h-10",
                                    userButtonAvatarBox: "w-10 h-10"
                                }
                            }}
                        />
                        <SignOutButton>
                            <Button variant="ghost" className="text-white hover:text-[#e6fcf5] hover:bg-[#12b886]">
                                Sign out
                            </Button>
                        </SignOutButton>
                    </SignedIn>
                    <SignedOut>
                        <SignInButton mode="modal">
                            <Button variant="ghost" className="text-white hover:text-[#e6fcf5] hover:bg-[#12b886]">
                                Sign in
                            </Button>
                        </SignInButton>
                    </SignedOut>
                </nav>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="md:hidden text-white hover:text-[#e6fcf5] hover:bg-[#12b886]">
                            <MenuIcon className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-[#0ca678]">
                        <nav className="flex flex-col gap-4">
                            {["How It Works", "Features", "Benefits", "Technology"].map((item) => (
                                <Link
                                    key={item}
                                    href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                                    className="text-white hover:text-[#e6fcf5] transition-colors"
                                >
                                    {item}
                                </Link>
                            ))}
                            <SignedIn>
                                <Link
                                    href="/profile"
                                    className="text-white hover:text-[#e6fcf5] transition-colors"
                                >
                                    Profile
                                </Link>
                                <Link
                                    href="/dashboard"
                                    className="bg-[#ff6b6b] hover:bg-[#fa5252] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    Dashboard
                                </Link>
                                <UserButton
                                    appearance={{
                                        elements: {
                                            avatarBox: "w-10 h-10",
                                            userButtonAvatarBox: "w-10 h-10"
                                        }
                                    }}
                                />
                                <SignOutButton>
                                    <Button variant="ghost" className="text-white hover:text-[#e6fcf5] hover:bg-[#12b886]">
                                        Sign out
                                    </Button>
                                </SignOutButton>
                            </SignedIn>
                            <SignedOut>
                                <SignInButton mode="modal">
                                    <Button variant="ghost" className="text-white hover:text-[#e6fcf5] hover:bg-[#12b886]">
                                        Sign in
                                    </Button>
                                </SignInButton>
                            </SignedOut>
                        </nav>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    )
}

export default NavBar