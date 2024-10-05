import { SignUp } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function SignUpPage() {
    return (
        <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
            <div className="flex items-center justify-center py-12">
                <div className="mx-auto w-[350px] space-y-6">
                    <Link href="/" className="inline-flex items-center text-sm text-orange-500 hover:text-orange-600">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Home
                    </Link>
                    <div className="space-y-2 text-center">
                        <h1 className="text-3xl font-bold">Sign Up</h1>
                        <p className="text-balance text-muted-foreground">
                            Create your account to get started
                        </p>
                    </div>
                    <SignUp
                        appearance={{
                            elements: {
                                formButtonPrimary: 'bg-gradient-to-r from-orange-400 to-orange-600 text-white hover:from-orange-500 hover:to-orange-700 w-full',
                                formButtonSecondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90 w-full',
                                card: 'bg-transparent shadow-none',
                                headerTitle: 'hidden',
                                headerSubtitle: 'hidden',
                                socialButtonsBlockButton: 'w-full',
                                formFieldInput: 'bg-background',
                                footer: 'hidden',
                            },
                        }}
                    />
                    <div className="text-center text-sm">
                        Already have an account?{" "}
                        <Link href="/sign-in" className="underline hover:text-orange-500">
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>
            <div className="hidden bg-muted lg:block">
                <Image
                    src="https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80"
                    alt="Colorful abstract art"
                    width={1000}
                    height={1080}
                    className="h-full w-full object-cover"
                />
            </div>
        </div>
    );
}