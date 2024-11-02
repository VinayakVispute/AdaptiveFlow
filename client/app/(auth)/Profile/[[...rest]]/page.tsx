

import { UserProfile } from "@clerk/nextjs"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#EFF6FF] to-[#FFFFFF] text-[#3B82F6] p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <Link
                        href="/Dashboard"
                        className="inline-flex items-center text-[#3B82F6] hover:text-[#2563EB] transition-colors duration-300"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Dashboard
                    </Link>
                </div>
                <div className="bg-white rounded-lg shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
                    <div className="bg-gradient-to-r from-[#3B82F6] to-[#2563EB] p-4 md:p-6">
                        <h1 className="text-2xl md:text-3xl font-bold text-white">Your Profile</h1>
                    </div>
                    <div className="m-2 md:m-4 flex justify-center items-center">
                        <UserProfile
                            appearance={{
                                elements: {
                                    card: 'bg-transparent shadow-none',
                                    navbar: 'bg-[#F1F5F9]',
                                    navbarButton: 'text-[#1E293B] hover:bg-[#E2E8F0]',
                                    headerTitle: 'text-[#1E293B]',
                                    headerSubtitle: 'text-[#475569]',
                                    profileSectionTitleText: 'text-[#1E293B]',
                                    formButtonPrimary: 'bg-[#3B82F6] hover:bg-[#2563EB]',
                                    formButtonReset: 'text-[#3B82F6] hover:text-[#2563EB]',
                                    formFieldInput: 'bg-[#F8FAFC] border-[#E2E8F0]',
                                    formFieldLabel: 'text-[#475569]',
                                },
                            }}
                        />
                    </div>
                </div>
            </div>

        </div>
    )
}