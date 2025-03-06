import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import TestBackground from "@/components/TestBackground";
import LoadUser from '@/components/LoadUser';
import { ThemeProvider } from '@/contexts/ThemeContext';
// Temporarily comment out the problematic component
// import SpaceBackground from "@/components/SpaceBackground";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cosmic Flights - Futuristic Flight Booking",
  description: "Book your next journey through the skies with our futuristic flight booking portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen bg-black text-white">
        <ThemeProvider>
          <LoadUser />
          {/* <SpaceBackground /> */}
          <TestBackground />
          <Navbar />
          <main className="pt-20 container mx-auto">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
