"use client";

import { useState, useEffect } from "react";
import {
  Key,
  ShieldCheck,
  CheckCircle,
  XCircle,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { checkUserAPIKey } from "@/lib/action/user.action";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PolicyPage() {
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userId, isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    const checkApiKey = async () => {
      if (!userId || !isSignedIn) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await checkUserAPIKey(userId);
        setHasApiKey(response.success);
      } catch (err) {
        setError("Failed to check API key status. Please try again later.");
        console.error("Error checking API key:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (isLoaded) {
      checkApiKey();
    }

    return () => {
      setHasApiKey(null);
      setError(null);
    };
  }, [userId, isSignedIn, isLoaded]);

  const policies = {
    newAccount: [
      "1 video (max 50MB)",
      "Deleted after 24 hours",
      "Limited processing options",
    ],
    withApiKey: [
      "Up to 3 videos (50MB each)",
      "Deleted after 24 hours",
      "Full range of processing options",
      "Priority support",
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Main Content */}
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center">
              <h1 className="text-4xl font-bold text-indigo-800">
                Account Policies
              </h1>
              <p className="mt-2 text-xl text-indigo-600">
                Review your account status and policies
              </p>
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "8rem",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
              </motion.div>
            ) : error ? (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="flex items-center bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md">
                  <AlertTriangle className="h-6 w-6 mr-2" />
                  <p>
                    <strong className="font-bold">Error: </strong> {error}
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="content"
                style={{
                  marginTop: "2rem",
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {/* API Key Status */}
                <div className="bg-white p-6 rounded-xl shadow-lg border border-indigo-200">
                  <h2 className="text-2xl font-semibold text-indigo-800 mb-4 flex items-center">
                    <Key className="h-6 w-6 mr-2 text-indigo-600" />
                    API Key Status
                  </h2>
                  <div className="flex items-center space-x-2 p-4 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50">
                    {hasApiKey ? (
                      <>
                        <CheckCircle className="h-6 w-6 text-green-500" />
                        <span className="text-lg font-medium text-green-700">
                          API Key is set
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-6 w-6 text-red-500" />
                        <span className="text-lg font-medium text-red-700">
                          No API Key set
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Account Policies */}
                <div className="bg-white p-6 rounded-xl shadow-lg border border-indigo-200">
                  <h2 className="text-2xl font-semibold text-indigo-800 mb-6 flex items-center">
                    <ShieldCheck className="h-6 w-6 mr-2 text-indigo-600" />
                    Account Policies
                  </h2>
                  <div className="grid md:grid-cols-2 gap-8">
                    {["newAccount", "withApiKey"].map((accountType) => (
                      <div
                        key={accountType}
                        className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-lg"
                      >
                        <h3 className="text-xl font-semibold text-indigo-700 mb-4">
                          {accountType === "newAccount"
                            ? "New Account"
                            : "With API Key"}
                        </h3>
                        <ul className="space-y-3">
                          {policies[accountType as keyof typeof policies].map(
                            (policy, index) => (
                              <motion.li
                                key={index}
                                style={{
                                  display: "flex",
                                  alignItems: "flex-start",
                                }}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                              >
                                <span className="flex-shrink-0 h-5 w-5 rounded-full bg-indigo-200 flex items-center justify-center mr-3">
                                  <span className="text-indigo-700 text-xs font-semibold">
                                    {index + 1}
                                  </span>
                                </span>
                                <span className="text-indigo-900">
                                  {policy}
                                </span>
                              </motion.li>
                            )
                          )}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 mt-auto">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <p className="text-indigo-700">
            For any questions or to upgrade your account, please contact
            support.
          </p>
          <Button
            asChild
            className="bg-indigo-600 hover:bg-indigo-700 text-white transition duration-300 ease-in-out transform hover:scale-105"
          >
            <Link href="/contact">Contact Support</Link>
          </Button>
        </div>
      </footer>
    </div>
  );
}
