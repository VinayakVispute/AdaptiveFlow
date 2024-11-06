"use client";
import React from "react";
import Navbar from "@/components/shared/landing/Navbar";
import Hero from "@/components/shared/landing/Herosection";
import CTA from "@/components/shared/landing/CTA";
import FAQ from "@/components/shared/landing/FAQs";
import Footer from "@/components/shared/landing/Footer";
import { Features } from "@/components/shared/landing/Features";

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      <Navbar />
      <Hero />
      <main className="min-h-screen px-4 sm:px-6 lg:px-8">
        <Features />
        <div className="my-10">
          <CTA />
        </div>
        <FAQ />
        <Footer />
      </main>
    </div>
  );
}
