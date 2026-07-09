"use client";

import { Navbar } from "@/components/NavbarTerms";
import { motion } from "framer-motion";
import { Shield, Lock, Cpu, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

const sections = [
  {
    icon: Shield,
    title: "About YT Save",
    content: (
      <>
        <p className="text-[hsl(var(--text-secondary))] leading-relaxed mb-4">
          YT Save is a free, open-source YouTube downloader that allows you to download videos and audio from YouTube in various formats and qualities.
        </p>
        <p className="text-[hsl(var(--text-secondary))] leading-relaxed mb-4">
          Our mission is to provide a simple, fast, and privacy-focused tool for personal use. We believe in giving users control over their content without compromising their privacy or security.
        </p>
        <p className="text-[hsl(var(--text-secondary))] leading-relaxed">
          This service is provided as-is, completely free of charge, with no registration required and no watermarks added to downloaded content.
        </p>
      </>
    ),
  },
  {
    icon: Lock,
    title: "Privacy Policy",
    content: (
      <>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-[hsl(var(--text-primary))] mb-2">No Data Collection</h4>
            <p className="text-[hsl(var(--text-secondary))] text-sm leading-relaxed">
              We do not collect, store, or share any personal data. Your downloads are processed in real-time and are not logged or tracked.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[hsl(var(--text-primary))] mb-2">No Cookies</h4>
            <p className="text-[hsl(var(--text-secondary))] text-sm leading-relaxed">
              This website does not use cookies or any tracking technologies. Your browsing experience is completely anonymous.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[hsl(var(--text-primary))] mb-2">Local Processing</h4>
            <p className="text-[hsl(var(--text-secondary))] text-sm leading-relaxed">
              All video processing happens on our servers and files are delivered directly to your device. Downloaded files are stored only on your local device.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[hsl(var(--text-primary))] mb-2">No Third-Party Analytics</h4>
            <p className="text-[hsl(var(--text-secondary))] text-sm leading-relaxed">
              We do not use Google Analytics, Facebook Pixel, or any other third-party tracking services.
            </p>
          </div>
        </div>
      </>
    ),
  },
  {
    icon: Cpu,
    title: "Tech Stack",
    content: (
      <>
        <p className="text-[hsl(var(--text-secondary))] leading-relaxed mb-5">
          YT Save is built with modern, open-source technologies:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={cn(
            "p-4 rounded-lg border border-[hsl(var(--border))]",
            "bg-[hsl(var(--surface))]"
          )}>
            <h4 className="text-sm font-semibold text-[hsl(var(--text-primary))] mb-1">Frontend</h4>
            <p className="text-xs text-[hsl(var(--text-secondary))]">Next.js 14, React 18, TypeScript, Tailwind CSS, Shadcn/UI</p>
          </div>
          <div className={cn(
            "p-4 rounded-lg border border-[hsl(var(--border))]",
            "bg-[hsl(var(--surface))]"
          )}>
            <h4 className="text-sm font-semibold text-[hsl(var(--text-primary))] mb-1">Backend</h4>
            <p className="text-xs text-[hsl(var(--text-secondary))]">Next.js API Routes, Node.js</p>
          </div>
          <div className={cn(
            "p-4 rounded-lg border border-[hsl(var(--border))]",
            "bg-[hsl(var(--surface))]"
          )}>
            <h4 className="text-sm font-semibold text-[hsl(var(--text-primary))] mb-1">Video Processing</h4>
            <p className="text-xs text-[hsl(var(--text-secondary))]">yt-dlp, FFmpeg</p>
          </div>
          <div className={cn(
            "p-4 rounded-lg border border-[hsl(var(--border))]",
            "bg-[hsl(var(--surface))]"
          )}>
            <h4 className="text-sm font-semibold text-[hsl(var(--text-primary))] mb-1">Deployment</h4>
            <p className="text-xs text-[hsl(var(--text-secondary))]">Vercel (Serverless)</p>
          </div>
        </div>
      </>
    ),
  },
  {
    icon: AlertTriangle,
    title: "Disclaimer",
    content: (
      <>
        <div className="space-y-4">
          <div className="p-4 rounded-md bg-[hsl(var(--warning-light))] border border-[hsl(var(--warning)/0.2)]">
            <p className="text-sm text-[hsl(var(--text-primary))] leading-relaxed">
              <strong className="font-semibold">Important:</strong> This tool is intended for personal, educational, and fair-use purposes only.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[hsl(var(--text-primary))] mb-2">Copyright Responsibility</h4>
            <p className="text-[hsl(var(--text-secondary))] text-sm leading-relaxed">
              Users are solely responsible for ensuring they have the right to download and use the content. We do not encourage or condone copyright infringement. Please respect the intellectual property rights of content creators.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[hsl(var(--text-primary))] mb-2">YouTube Terms of Service</h4>
            <p className="text-[hsl(var(--text-secondary))] text-sm leading-relaxed">
              Downloading videos from YouTube may violate YouTube&apos;s Terms of Service. By using this tool, you acknowledge that you are responsible for complying with all applicable terms and laws.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[hsl(var(--text-primary))] mb-2">No Warranty</h4>
            <p className="text-[hsl(var(--text-secondary))] text-sm leading-relaxed">
              This service is provided &quot;as is&quot; without any warranties, express or implied. We do not guarantee the availability, accuracy, or quality of downloads.
            </p>
          </div>
        </div>
      </>
    ),
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay, ease: [0, 0, 0.2, 1] },
  }),
};

export default function TermsPage() {
  return (
    <div className="flex flex-col h-full overflow-auto">
      <Navbar />

      <div className="flex-1 flex flex-col items-center justify-start px-4 py-8 md:py-12">
        <div className="w-full max-w-2xl mx-auto">
          {/* Header */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
            className="mb-8"
          >
            <h1 className="text-h2 font-bold text-[hsl(var(--text-primary))] mb-3 tracking-tight">
              Terms & Ethics
            </h1>
            <p className="text-sm text-[hsl(var(--text-secondary))] leading-relaxed">
              Transparency about how YT Save works, our privacy practices, and your responsibilities as a user.
            </p>
          </motion.div>

          {/* Sections */}
          <div className="space-y-6">
            {sections.map(({ icon: Icon, title, content }, i) => (
              <motion.div
                key={title}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={0.1 + i * 0.05}
                className={cn(
                  "card p-5 md:p-6",
                  "hover:border-[hsl(var(--border-strong))]",
                  "transition-all duration-[200ms] ease-out"
                )}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-md",
                    "bg-[hsl(var(--primary-light))]"
                  )}>
                    <Icon className="h-5 w-5 text-[hsl(var(--primary))]" />
                  </div>
                  <h2 className="text-h4 font-semibold text-[hsl(var(--text-primary))]">
                    {title}
                  </h2>
                </div>
                <div>
                  {content}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Footer */}
        </div>
      </div>
    </div>
  );
}
