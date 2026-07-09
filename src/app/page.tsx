"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SearchBar } from "@/components/SearchBar";
import { PreviewCard } from "@/components/PreviewCard";
import { QualitySelector } from "@/components/QualitySelector";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { Navbar } from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Video, Music, Download, ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

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
    tbr?: number;
  }>;
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay, ease: [0, 0, 0.2, 1] },
  }),
};

export default function Home() {
  const [url, setUrl] = useState("");
  const [metadata, setMetadata] = useState<VideoMetadata | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [type, setType] = useState<"video" | "audio">("video");
  const [selectedFormat, setSelectedFormat] = useState<any>(null);
  const [downloadStatus, setDownloadStatus] = useState<"idle" | "processing" | "completed" | "error">("idle");
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadMessage, setDownloadMessage] = useState("");
  const [downloadError, setDownloadError] = useState("");

  const handleSearch = async (searchUrl: string) => {
    setLoading(true);
    setError(null);
    setMetadata(null);
    setDownloadStatus("idle");
    setSelectedFormat(null);

    try {
      const response = await fetch("/api/metadata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: searchUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch video metadata");
      }

      setMetadata(data.metadata);
      setUrl(searchUrl);
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching the video.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!metadata || !selectedFormat) return;

    setDownloadStatus("processing");
    setDownloadProgress(0);
    setDownloadMessage("Starting download...");

    try {
      const response = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoId: metadata.id,
          formatId: selectedFormat.format_id,
          type,
          quality: selectedFormat.resolution,
          title: metadata.title,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Download failed");
      }

      const downloadId = data.downloadId;

      // Start polling
      const pollInterval = setInterval(async () => {
        try {
          const pollRes = await fetch(`/api/download?id=${downloadId}`);
          if (pollRes.ok) {
            const pollData = await pollRes.json();
            setDownloadProgress(pollData.progress);
            setDownloadMessage(pollData.message || pollData.currentOperation || "Downloading...");

            if (pollData.status === "completed") {
              clearInterval(pollInterval);
              setDownloadStatus("completed");
              setDownloadMessage("Download complete!");

              const fileUrl = pollData.downloadUrl;
              if (fileUrl) {
                const link = document.createElement("a");
                link.href = fileUrl;
                link.download = "";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }
            } else if (pollData.status === "error") {
              clearInterval(pollInterval);
              setDownloadStatus("error");
              setDownloadError(pollData.errorMessage || "An error occurred during download.");
            }
          }
        } catch (err) {
          console.error("Polling error:", err);
        }
      }, 1000);
    } catch (err: any) {
      setDownloadStatus("error");
      setDownloadError(err.message || "An error occurred during download.");
    }
  };

  const handleReset = () => {
    setMetadata(null);
    setUrl("");
    setDownloadStatus("idle");
    setSelectedFormat(null);
    setError(null);
    setDownloadError("");
    setDownloadProgress(0);
  };

  return (
    <div className="flex flex-col h-full overflow-auto">
      <Navbar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-start px-4 py-8 md:py-12">
        <div className="w-full max-w-2xl mx-auto">
          {/* Badge */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
            className="flex justify-center mb-6"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--surface))] text-xs font-medium text-[hsl(var(--text-secondary))] shadow-xs">
              <span className="flex h-1.5 w-1.5 rounded-full bg-[hsl(var(--success))]" />
              Free · No Ads
            </span>
          </motion.div>

          {/* Heading */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.1}
            className="text-center mb-8"
          >
            <h1 className="text-h2 md:text-h1 font-bold text-[hsl(var(--text-primary))] mb-3 tracking-tight leading-tight">
              Download YouTube
              <br />
              <span className="text-[hsl(var(--primary))]">in any format</span>
            </h1>
            <p className="text-sm md:text-base text-[hsl(var(--text-secondary))] leading-relaxed max-w-lg mx-auto">
              Convert YouTube videos to MP4 or MP3 with the highest quality.
              Supports 4K, 1080p60, and all popular formats.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.2}
            className="mb-6"
          >
            <SearchBar onSearch={handleSearch} defaultValue={url} isLoading={loading} />
          </motion.div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "mb-6 mx-auto max-w-2xl flex items-start gap-3 p-4 rounded-md text-sm",
                "border border-[hsl(var(--danger)/0.25)] bg-[hsl(var(--danger-light))]",
                "text-[hsl(var(--danger))]"
              )}
            >
              <span className="flex-shrink-0 mt-0.5">⚠</span>
              <span>{error}</span>
            </motion.div>
          )}

          {/* ── Video Result ── */}
          {metadata && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1, ease: [0, 0, 0.2, 1] }}
              className="mb-6"
            >
              {/* Card container */}
              <div className="card p-5 md:p-6">
                <PreviewCard metadata={metadata} />

                <div className="mt-5">
                  {/* Format type tabs */}
                  <Tabs value={type} onValueChange={(v) => { setType(v as "video" | "audio"); setSelectedFormat(null); }}>
                    <TabsList className="w-full grid grid-cols-2 mb-5">
                      <TabsTrigger value="video" className="gap-2 py-2.5">
                        <Video className="h-4 w-4" />
                        Video (MP4)
                      </TabsTrigger>
                      <TabsTrigger value="audio" className="gap-2 py-2.5">
                        <Music className="h-4 w-4" />
                        Audio (MP3)
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="video">
                      <QualitySelector
                        formats={metadata.formats}
                        type="video"
                        onSelect={setSelectedFormat}
                        selectedFormat={selectedFormat}
                      />
                    </TabsContent>

                    <TabsContent value="audio">
                      <QualitySelector
                        formats={metadata.formats}
                        type="audio"
                        onSelect={setSelectedFormat}
                        selectedFormat={selectedFormat}
                      />
                    </TabsContent>
                  </Tabs>

                  {/* Download CTA */}
                  {selectedFormat && downloadStatus === "idle" && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-5"
                    >
                      <Button
                        onClick={handleDownload}
                        variant="primary"
                        size="lg"
                        className="w-full gap-2.5"
                      >
                        <Download className="h-5 w-5" />
                        Download {type === "video" ? selectedFormat.resolution : "MP3"}
                        <ArrowRight className="h-4 w-4 ml-auto opacity-70" />
                      </Button>
                    </motion.div>
                  )}

                  {/* Progress */}
                  {downloadStatus !== "idle" && (
                    <div className="mt-5">
                      <ProgressIndicator
                        status={downloadStatus}
                        progress={downloadProgress}
                        message={downloadMessage}
                        errorMessage={downloadError}
                        onReset={handleReset}
                      />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
