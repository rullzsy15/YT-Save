import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "YT Save — Download YouTube Videos in MP4 & MP3",
  description:
    "Download YouTube videos in MP4 or MP3 format with the highest quality. Supports 4K, 1080p60fps, and all popular audio bitrates. Fast, free, no registration.",
  keywords: ["youtube downloader", "mp4 download", "mp3 download", "youtube to mp3", "4K download", "YT Save"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="h-full flex flex-col bg-[hsl(var(--bg))] text-[hsl(var(--text-primary))]">
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {children}
        </main>
        
        {/* Footer */}
        <footer className="border-t border-[hsl(var(--border))] bg-[hsl(var(--surface))] py-6 px-4">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[hsl(var(--text-tertiary))] text-center md:text-left">
              © {new Date().getFullYear()} YT Save. For personal use only.
            </p>
            <div className="flex items-center gap-4">
              <a 
                href="/terms" 
                className="text-xs text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--text-primary))] transition-colors duration-150"
              >
                Terms & Ethics
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
