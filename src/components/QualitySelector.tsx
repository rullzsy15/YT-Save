import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface FormatInfo {
  format_id: string;
  ext: string;
  resolution: string;
  fps?: number;
  has_audio: boolean;
  has_video: boolean;
  filesize?: number;
  tbr?: number;
}

interface QualitySelectorProps {
  formats: FormatInfo[];
  type: "video" | "audio";
  onSelect: (format: FormatInfo) => void;
  selectedFormat?: FormatInfo;
}

/* ── Helpers ── */
function getFileSizeLabel(format: FormatInfo): string {
  if (!format.filesize) return "";
  const mb = format.filesize / (1024 * 1024);
  if (mb < 1) return `${Math.round(format.filesize / 1024)} KB`;
  return `${mb.toFixed(1)} MB`;
}

function getQualityBadge(format: FormatInfo, type: "video" | "audio"): string {
  if (type === "audio") return "MP3";
  const h = parseInt(format.resolution) || 0;
  if (h >= 2160) return "4K";
  if (h >= 1440) return "2K";
  if (h >= 1080) return "FHD";
  if (h >= 720) return "HD";
  if (h >= 480) return "SD";
  return "LOW";
}

function getQualityBadgeColor(badge: string): string {
  switch (badge) {
    case "4K":   return "bg-purple-500/15 text-purple-400 border-purple-500/25";
    case "2K":   return "bg-blue-500/15 text-blue-400 border-blue-500/25";
    case "FHD":  return "bg-[hsl(var(--primary-light))] text-[hsl(var(--primary))] border-[hsl(var(--primary)/0.25)]";
    case "HD":   return "bg-emerald-500/15 text-emerald-400 border-emerald-500/25";
    case "MP3":  return "bg-emerald-500/15 text-emerald-400 border-emerald-500/25";
    default:     return "bg-[hsl(var(--surface-2))] text-[hsl(var(--text-tertiary))] border-[hsl(var(--border))]";
  }
}

function getResolutionLabel(format: FormatInfo, type: "video" | "audio"): string {
  if (type === "audio") {
    const br = format.tbr ? Math.round(format.tbr) : 320;
    return `${br} kbps`;
  }
  let label = format.resolution;
  if (format.fps && format.fps > 30) label += `@${format.fps}`;
  return label;
}

/* ── Deduplication: best (prefer MP4, then highest filesize) per resolution ── */
function deduplicateFormats(formats: FormatInfo[], type: "video" | "audio"): FormatInfo[] {
  if (type === "audio") {
    // Deduplicate audio by bitrate
    const seen = new Map<number, FormatInfo>();
    formats.forEach((f) => {
      const br = Math.round(f.tbr || 0);
      if (!br) return;
      const existing = seen.get(br);
      if (!existing || (f.filesize || 0) > (existing.filesize || 0)) {
        seen.set(br, f);
      }
    });
    return Array.from(seen.values()).sort((a, b) => (b.tbr || 0) - (a.tbr || 0));
  }

  // Deduplicate video by resolution height
  const seen = new Map<number, FormatInfo>();
  formats.forEach((f) => {
    const h = parseInt(f.resolution) || 0;
    if (!h) return;
    const existing = seen.get(h);
    if (!existing) {
      seen.set(h, f);
    } else {
      // Prefer MP4 over WEBM
      const curMp4 = f.ext === "mp4";
      const exMp4 = existing.ext === "mp4";
      if (curMp4 && !exMp4) {
        seen.set(h, f);
      } else if (curMp4 === exMp4 && (f.filesize || 0) > (existing.filesize || 0)) {
        seen.set(h, f);
      }
    }
  });
  return Array.from(seen.values())
    .sort((a, b) => (parseInt(b.resolution) || 0) - (parseInt(a.resolution) || 0));
}

/* ── Component ── */
export function QualitySelector({ formats, type, onSelect, selectedFormat }: QualitySelectorProps) {
  const [showAll, setShowAll] = useState(false);
  const VISIBLE_COUNT = 5;

  // Filter by type
  const filtered = formats.filter((f) =>
    type === "video" ? f.has_video : f.has_audio && !f.has_video
  );

  // Deduplicate
  const deduplicated = deduplicateFormats(filtered, type);

  // Visible slice
  const visible = showAll ? deduplicated : deduplicated.slice(0, VISIBLE_COUNT);
  const hasMore = deduplicated.length > VISIBLE_COUNT;

  if (deduplicated.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-[hsl(var(--text-tertiary))]">
        No {type} formats available
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-[hsl(var(--text-secondary))]">
          {type === "video" ? "Select quality" : "Select bitrate"}
        </p>
        <span className="text-xs text-[hsl(var(--text-tertiary))]">
          {deduplicated.length} options
        </span>
      </div>

      {/* Radio list */}
      <div className="rounded-lg border border-[hsl(var(--border))] overflow-hidden bg-[hsl(var(--surface))]">
        {visible.map((format, idx) => {
          const isSelected = selectedFormat?.format_id === format.format_id;
          const badge = getQualityBadge(format, type);
          const badgeColor = getQualityBadgeColor(badge);
          const fileSize = getFileSizeLabel(format);
          const resLabel = getResolutionLabel(format, type);

          return (
            <button
              key={format.format_id}
              type="button"
              onClick={() => onSelect(format)}
              className={cn(
                "w-full flex items-center gap-4 px-4 py-3 text-left",
                "transition-colors duration-[150ms] ease-out",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[hsl(var(--primary))]",
                idx !== 0 && "border-t border-[hsl(var(--border))]",
                isSelected
                  ? "bg-[hsl(var(--primary-light))]"
                  : "hover:bg-[hsl(var(--surface-2))]"
              )}
            >
              {/* Radio circle */}
              <div
                className={cn(
                  "flex-shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-[150ms]",
                  isSelected
                    ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary))]"
                    : "border-[hsl(var(--border-strong))]"
                )}
              >
                {isSelected && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </div>

              {/* Resolution / bitrate */}
              <span
                className={cn(
                  "flex-shrink-0 text-[15px] font-semibold tracking-tight min-w-[56px]",
                  isSelected ? "text-[hsl(var(--primary))]" : "text-[hsl(var(--text-primary))]"
                )}
              >
                {resLabel}
              </span>

              {/* Quality badge */}
              <span
                className={cn(
                  "flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-sm border tracking-wider uppercase",
                  badgeColor
                )}
              >
                {badge}
              </span>

              {/* Spacer */}
              <span className="flex-1" />

              {/* Format ext */}
              <span className="flex-shrink-0 text-[11px] font-medium text-[hsl(var(--text-tertiary))] uppercase tracking-wide">
                {format.ext}
              </span>

              {/* File size */}
              {fileSize && (
                <span className="flex-shrink-0 text-[11px] text-[hsl(var(--text-tertiary))] w-16 text-right tabular-nums">
                  {fileSize}
                </span>
              )}

              {/* Selected check */}
              {isSelected && (
                <Check className="flex-shrink-0 w-4 h-4 text-[hsl(var(--primary))]" strokeWidth={2.5} />
              )}
            </button>
          );
        })}

        {/* Show more / Show less toggle */}
        {hasMore && (
          <button
            type="button"
            onClick={() => setShowAll(!showAll)}
            className={cn(
              "w-full flex items-center justify-center gap-2 px-4 py-2.5",
              "border-t border-[hsl(var(--border))]",
              "text-xs font-medium text-[hsl(var(--text-secondary))]",
              "hover:bg-[hsl(var(--surface-2))] hover:text-[hsl(var(--text-primary))]",
              "transition-colors duration-[150ms]"
            )}
          >
            {showAll ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" />
                Show less
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5" />
                Show {deduplicated.length - VISIBLE_COUNT} more options
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
