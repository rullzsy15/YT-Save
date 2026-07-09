"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Download, FileText, Youtube } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Downloader", icon: Download },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header
      className={cn(
        "sticky top-0 z-50 h-[64px] flex-shrink-0",
        "border-b border-[hsl(var(--border))]",
        "bg-[hsl(var(--surface)/0.9)] backdrop-blur-[12px]",
        "transition-all duration-[200ms] ease-out"
      )}
    >
      <div className="max-w-4xl mx-auto px-4 md:px-6 h-full flex items-center justify-between w-full">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group focus-visible:outline-none"
        >
          <div
            className={cn(
              "flex items-center justify-center w-8 h-8 rounded-md",
              "bg-[hsl(var(--primary))] text-white",
              "transition-transform duration-[150ms] ease-out group-hover:scale-105"
            )}
          >
            <Youtube className="w-4.5 h-4.5" strokeWidth={2} />
          </div>
          <span className="text-[14px] font-semibold text-[hsl(var(--text-primary))] tracking-tight">
            YT<span className="text-[hsl(var(--primary))]">Save</span>
          </span>
        </Link>

        {/* Nav Links */}
        <nav className="flex items-center gap-1">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium",
                  "transition-all duration-[150ms] ease-out",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--primary))] focus-visible:ring-offset-1",
                  isActive
                    ? "bg-[hsl(var(--primary-light))] text-[hsl(var(--primary))]"
                    : "text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--text-primary))] hover:bg-[hsl(var(--surface-2))]"
                )}
              >
                <Icon className="w-4 h-4" strokeWidth={isActive ? 2.5 : 2} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
