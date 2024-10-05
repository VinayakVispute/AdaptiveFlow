import { UserProfile } from "@clerk/nextjs"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white text-orange-600 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center text-orange-500 hover:text-orange-600 transition-colors duration-300"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Dashboard
                    </Link>
                </div>
                <div className="bg-white rounded-lg shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
                    <div className="bg-gradient-to-r from-orange-400 to-orange-600 p-4 md:p-6">
                        <h1 className="text-2xl md:text-3xl font-bold text-white">Your Profile</h1>
                    </div>
                    <div className="m-2 md:m-4 flex justify-center items-center">
                        <UserProfile />
                    </div>
                </div>
            </div>
        </div>
    )
}