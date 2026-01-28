import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LogPulse | Real-Time Monitoring",
  description: "Distributed Log Monitoring & Alerting System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
        <Toaster 
          position="top-center" 
          richColors 
          closeButton 
          toastOptions={{
            className: "min-w-[450px] !w-full",
            style: {
              width: "100%",
              maxWidth: "600px"
            }
          }}
        />
      </body>
    </html>
  );
}
