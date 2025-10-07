import "@/styles/globals.css";
import {
  Space_Grotesk as FontSans,
  JetBrains_Mono as FontMono,
} from "next/font/google";
import { Analytics } from "@vercel/analytics/react";

import { cn } from "@/lib/utils";
import { Viewport } from "next";
import type { Metadata } from "next";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans text-foreground antialiased",
          fontSans.variable,
          fontMono.variable,
        )}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: {
    default: "Stinky Pointing Poker | Realtime Agile Planning Poker",
    template: "%s | Stinky Pointing Poker",
  },
  description:
    "Stinky Pointing Poker is a realtime planning poker app for agile teams. Host estimation sessions, reveal votes together, and keep everyone aligned from sprint kickoff to delivery.",
  keywords: [
    "planning poker",
    "agile estimation",
    "scrum planning",
    "remote team collaboration",
    "story points",
    "pointing poker",
    "product management",
    "supabase realtime",
  ],
  authors: [{ name: "Stinky Pointing Poker" }],
  openGraph: {
    title: "Stinky Pointing Poker | Lightning-fast Agile Estimation",
    description:
      "Run focused planning poker sessions with realtime collaboration, presence indicators, and a UI your team will actually enjoy using.",
    url: "https://stinky-pointing-poker.vercel.app",
    siteName: "Stinky Pointing Poker",
    images: [
      {
        url: "https://stinky-pointing-poker.vercel.app/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Stinky Pointing Poker – realtime planning poker for agile teams",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stinky Pointing Poker",
    description:
      "Realtime planning poker app for agile teams. Run estimation rounds, reveal votes instantly, and keep everyone in sync.",
    images: ["https://stinky-pointing-poker.vercel.app/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  alternates: { canonical: "https://stinky-pointing-poker.vercel.app" },
};
