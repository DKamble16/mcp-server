import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NextChatSDKBootstrap } from "@/components/NextChatSDKBootstrap";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const resolveBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "";
};

const baseUrl = resolveBaseUrl();

export const metadata: Metadata = {
  title: "Hello World ChatGPT App",
  description: "Minimal OpenAI Apps ready Next.js starter",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {baseUrl ? (
          <NextChatSDKBootstrap baseUrl={baseUrl} />
        ) : (
          <div className="banner">
            Set NEXT_PUBLIC_BASE_URL to enable ChatGPT iframe support.
          </div>
        )}
        {children}
      </body>
    </html>
  );
}
