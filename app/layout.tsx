import type { Metadata } from "next";
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import Script from "next/script";
import "./globals.css";
import { Providers } from "@/components/providers";
import Navbar from "@/components/ui/navbar";

// Configure fonts
const geistSans = GeistSans;
const geistMono = GeistMono;

export const metadata: Metadata = {
  title: "Seamless",
  description: "A seamless experience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          src="https://accounts.google.com/gsi/client"
          async
          strategy="afterInteractive"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <Providers>
          <main className="max-w-6xl mx-auto min-h-screen py-10 space-y-10">
            <Navbar />
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
