import type { Metadata } from "next";
import "@fontsource/material-symbols-outlined";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { FAB } from "@/components/fab";

export const metadata: Metadata = {
  title: "Terra Lodge",
  description: "Terra Lodge: Experience Authentic Comfort",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground pb-24 md:pb-0">
        <Header />
        {children}
        <Footer />
        <FAB />
      </body>
    </html>
  );
}
