import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import localFont from "next/font/local";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const aeonik = localFont({
  src: [
    { path: "./fonts/AeonikPro-Regular.otf", weight: "400", style: "normal" },
    { path: "./fonts/AeonikPro-Bold.otf", weight: "700", style: "normal" },
  ],
  variable: "--font-aeonik",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "FX Conversion Hub",
  description:
    "Professional foreign exchange conversion platform with real-time rates and analytics",
  keywords: "forex, fx, currency conversion, exchange rates, dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${aeonik.variable} ${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 dark:bg-gray-900`}
      >
        <QueryProvider>
          <AuthProvider>{children}</AuthProvider>
        </QueryProvider>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
