"use client";

import { Search, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  onSearch: (url: string) => void;
  defaultValue?: string;
  isLoading?: boolean;
}

export function SearchBar({ onSearch, defaultValue = "", isLoading = false }: SearchBarProps) {
  const [url, setUrl] = useState(defaultValue);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onSearch(url.trim());
    }
  };

  useEffect(() => {
    if (defaultValue && inputRef.current) {
      inputRef.current.focus();
    }
  }, [defaultValue]);

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div
        className={cn(
          "flex items-stretch rounded-lg overflow-hidden border-2",
          "bg-[hsl(var(--surface))]",
          "transition-all duration-[200ms] ease-out",
          isFocused
            ? "border-[hsl(var(--primary))] shadow-[0_0_0_3px_hsl(var(--primary)/0.12),0_4px_16px_hsl(220_14%_10%/0.08)]"
            : "border-[hsl(var(--border))] shadow-[0_2px_8px_hsl(220_14%_10%/0.06)]"
        )}
      >
        {/* Search icon — pinned left, vertically centered */}
        <div className="flex items-center justify-center w-12 flex-shrink-0">
          <Search
            className={cn(
              "w-4 h-4 transition-colors duration-[150ms]",
              isFocused ? "text-[hsl(var(--primary))]" : "text-[hsl(var(--text-tertiary))]"
            )}
          />
        </div>

        {/* Input */}
        <input
          ref={inputRef}
          type="url"
          placeholder="Paste YouTube URL here..."
          className={cn(
            "flex-1 h-14 pr-2 text-[15px] bg-transparent border-0 outline-none ring-0",
            "focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none",
            "text-[hsl(var(--text-primary))] placeholder:text-[hsl(var(--text-tertiary))]",
            "font-normal"
          )}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          required
        />

        {/* Submit button */}
        <div className="flex items-center p-2 flex-shrink-0">
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={isLoading || !url.trim()}
            className={cn(
              "gap-2 px-5",
              "border-0 ring-0 outline-none",
              "focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
            )}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="hidden sm:inline">Fetching...</span>
              </>
            ) : (
              <>
                <span>Analyze</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Helper text */}
      <p className="mt-2.5 text-xs text-[hsl(var(--text-tertiary))] text-center">
        Supports youtube.com and youtu.be links
      </p>
    </form>
  );
}