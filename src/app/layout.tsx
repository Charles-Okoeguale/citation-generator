import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CitationEditProvider } from "@/lib/citation/contexts/citation-edit-context";
import { Providers } from "./providers";

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
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Dark mode script - executed before React hydration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                let isDarkMode = false;
                // Check localStorage first
                if (localStorage.getItem('theme') === 'dark') {
                  isDarkMode = true;
                } 
                // Then check system preference if not set in localStorage
                else if (localStorage.getItem('theme') === null && 
                         window.matchMedia('(prefers-color-scheme: dark)').matches) {
                  isDarkMode = true;
                }

                // Apply the correct theme class
                if (isDarkMode) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {
                // Fail silently
              }
            `,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
        <CitationEditProvider>
          <Providers>
            {children}
          </Providers>
        </CitationEditProvider> 
      </body>
    </html>
  );
}
