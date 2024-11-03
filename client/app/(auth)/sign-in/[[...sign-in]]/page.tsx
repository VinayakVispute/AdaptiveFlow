import { SignIn } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto w-[350px] space-y-6">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-[#3B82F6] hover:text-[#2563EB]"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold text-[#1E293B]">Sign In</h1>
            <p className="text-balance text-[#475569]">
              Welcome back! Please sign in to your account
            </p>
          </div>
          <SignIn
            appearance={{
              elements: {
                formButtonPrimary:
                  "bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white hover:from-[#2563EB] hover:to-[#1D4ED8] w-full",
                formButtonSecondary:
                  "bg-[#F1F5F9] text-[#1E293B] hover:bg-[#E2E8F0] w-full",
                card: "bg-transparent shadow-none",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton: "w-full",
                formFieldInput: "bg-[#F8FAFC]",
                footer: "hidden",
              },
            }}
            signUpUrl="/sign-up"
            afterSignInUrl="/Dashboard"
          />
          <div className="text-center text-sm text-[#475569]">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="underline hover:text-[#3B82F6]">
              Sign up
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-[#F1F5F9] lg:block">
        <Image
          src="https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80"
          alt="Misty forest landscape"
          width={1000}
          height={1080}
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
}
