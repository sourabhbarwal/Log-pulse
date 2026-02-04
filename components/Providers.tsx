"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { SocketProvider } from "@/context/SocketContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <SessionProvider>
        <SocketProvider>
          {children}
        </SocketProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
