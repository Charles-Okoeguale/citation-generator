import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "./components/landing/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Citation Generator - Create Perfect Citations in Seconds',
  description: 'Generate accurate citations in APA, MLA, Chicago, and 200+ other styles. Free citation generator for academic writing and research.',
  keywords: 'citation generator, citation tool, APA, MLA, Chicago style, academic writing',
  openGraph: {
    title: 'Citation Generator - Create Perfect Citations in Seconds',
    description: 'Generate accurate citations in APA, MLA, Chicago, and 200+ other styles.',
    images: ['/og-image.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
