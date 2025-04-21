import type { Metadata } from "next";
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
// import Script from "next/script"; // Script likely not needed if GSI commented out
import "./globals.css";
import { Providers } from "@/components/providers";
// Removed Navbar and Sidebar imports as they are handled in LayoutClient
// Removed cn import
import LayoutClient from "@/components/LayoutClient"; // Import the new client component

// Configure fonts
const geistSans = GeistSans;
const geistMono = GeistMono;

// Metadata export remains here in the Server Component
export const metadata: Metadata = {
  title: "Seamless",
  description: "A seamless experience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Removed state and toggle function

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* <Script
          src="https://accounts.google.com/gsi/client"
          async
          strategy="afterInteractive"
        /> */}
        {/* Commented out Google script as it might not be needed now */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <Providers>
          {/* Use LayoutClient to wrap the children and manage the interactive parts */}
          <LayoutClient>{children}</LayoutClient>
        </Providers>
      </body>
    </html>
  );
}
