import { Card, CardContent } from "./ui/card";
import { formatDuration } from "@/lib/format";
import { Eye, Clock, User, Layers } from "lucide-react";
import Image from "next/image";

interface VideoMetadata {
  id: string;
  title: string;
  channel: string;
  thumbnail: string;
  duration: number;
  duration_string: string;
  upload_date: string;
  view_count?: number;
  formats: Array<{
    format_id: string;
    ext: string;
    resolution: string;
    fps?: number;
    has_audio: boolean;
    has_video: boolean;
    filesize?: number;
  }>;
}

interface PreviewCardProps {
  metadata: VideoMetadata;
}

export function PreviewCard({ metadata }: PreviewCardProps) {
  const duration = formatDuration(metadata.duration);
  const viewsFormatted = metadata.view_count
    ? metadata.view_count >= 1_000_000
      ? `${(metadata.view_count / 1_000_000).toFixed(1)}M`
      : metadata.view_count >= 1_000
      ? `${(metadata.view_count / 1_000).toFixed(0)}K`
      : metadata.view_count.toLocaleString()
    : null;

  const videoFormatsCount = metadata.formats.filter((f) => f.has_video).length;

  return (
    <Card className="w-full overflow-hidden animate-fade-in">
      {/* Thumbnail */}
      <div className="relative aspect-video bg-[hsl(var(--surface-2))] overflow-hidden">
        <Image
          src={metadata.thumbnail}
          alt={metadata.title}
          fill
          className="object-cover transition-transform duration-[300ms] ease-out hover:scale-[1.02]"
          priority
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        {/* Duration badge */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/75 backdrop-blur-sm text-white px-2.5 py-1 rounded-sm text-xs font-medium tracking-wide">
          <Clock className="w-3 h-3" />
          {duration}
        </div>
      </div>

      {/* Content */}
      <CardContent className="p-6">
        {/* Title */}
        <h3 className="text-base font-semibold text-[hsl(var(--text-primary))] leading-snug line-clamp-2 mb-3">
          {metadata.title}
        </h3>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {/* Channel */}
          <div className="flex items-center gap-1.5 text-sm text-[hsl(var(--text-secondary))]">
            <User className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="font-medium truncate max-w-[160px]">{metadata.channel}</span>
          </div>

          {/* Views */}
          {viewsFormatted && (
            <div className="flex items-center gap-1.5 text-sm text-[hsl(var(--text-secondary))]">
              <Eye className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{viewsFormatted} views</span>
            </div>
          )}

          {/* Format count */}
          <div className="flex items-center gap-1.5 text-sm text-[hsl(var(--text-secondary))]">
            <Layers className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{videoFormatsCount} formats</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
