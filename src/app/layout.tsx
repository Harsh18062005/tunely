import type { Metadata } from "next";
import "./globals.css";
import { PlayerProvider } from "@/context/PlayerContext";

export const metadata: Metadata = {
  title: "Tunely - Web Player: Music for everyone",
  description: "Tunely is a modern full-stack music streaming web application built with Next.js, Tailwind CSS, Prisma, and SQLite.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-black">
      <body className="h-full bg-black text-white antialiased overflow-hidden">
        <PlayerProvider>
          {children}
        </PlayerProvider>
      </body>
    </html>
  );
}
