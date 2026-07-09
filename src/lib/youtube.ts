import { spawn, ChildProcess } from "child_process";
import { promises as fs } from "fs";
import path from "path";
import os from "os";

const TEMP_DIR = path.join(process.cwd(), "tmp", "downloads");

// Ensure temp directory exists
export async function ensureTempDir() {
  try {
    await fs.mkdir(TEMP_DIR, { recursive: true });
  } catch (error) {
    console.error("Error creating temp directory:", error);
  }
}

// Clean up old files (older than 15 minutes)
export async function cleanupOldFiles() {
  try {
    const files = await fs.readdir(TEMP_DIR);
    const now = Date.now();
    
    for (const file of files) {
      const filePath = path.join(TEMP_DIR, file);
      const stats = await fs.stat(filePath);
      const ageMinutes = (now - stats.mtime.getTime()) / 1000 / 60;
      
      if (ageMinutes > 15) {
        await fs.unlink(filePath);
        console.log(`Cleaned up old file: ${file}`);
      }
    }
  } catch (error) {
    console.error("Error cleaning up old files:", error);
  }
}

// Interval to clean up every 5 minutes
let cleanupInterval: NodeJS.Timeout | null = null;

export function startCleanupInterval() {
  if (cleanupInterval) {
    clearInterval(cleanupInterval);
  }
  cleanupInterval = setInterval(cleanupOldFiles, 5 * 60 * 1000);
}

export function stopCleanupInterval() {
  if (cleanupInterval) {
    clearInterval(cleanupInterval);
    cleanupInterval = null;
  }
}

// Get yt-dlp version
export function getYtDlpVersion(): Promise<string> {
  return new Promise((resolve, reject) => {
    const ytDlpPath = process.env.YT_DLP_PATH || "yt-dlp";
    const child = spawn(ytDlpPath, ["--version"]);
    
    let output = "";
    child.stdout.on("data", (data) => {
      output += data.toString();
    });
    
    child.on("close", (code) => {
      if (code === 0) {
        resolve(output.trim());
      } else {
        reject(new Error(`yt-dlp failed with code ${code}`));
      }
    });
    
    child.on("error", (error) => {
      reject(error);
    });
  });
}

// Get video metadata
export interface VideoMetadata {
  id: string;
  title: string;
  channel: string;
  channel_id: string;
  thumbnail: string;
  duration: number;
  duration_string: string;
  upload_date: string;
  view_count?: number;
  formats: FormatInfo[];
}

export interface FormatInfo {
  format_id: string;
  ext: string;
  resolution: string;
  fps?: number;
  vcodec?: string;
  acodec?: string;
  has_audio: boolean;
  has_video: boolean;
  filesize?: number;
  filesize_approx?: number;
  tbr?: number;
  width?: number;
  height?: number;
}

export async function getVideoMetadata(url: string): Promise<VideoMetadata> {
  return new Promise((resolve, reject) => {
    const ytDlpPath = process.env.YT_DLP_PATH || "yt-dlp";
    const child = spawn(ytDlpPath, ["-j", "--no-playlist", "--format", "all", url]);
    
    let output = "";
    let errorOutput = "";
    
    child.stdout.on("data", (data) => {
      output += data.toString();
    });
    
    child.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });
    
    child.on("close", (code) => {
      if (code === 0) {
        try {
          // Parse only the first line in case yt-dlp outputs multiple lines (e.g. warnings that leaked to stdout or playlist items)
          const jsonStr = output.trim().split('\n')[0];
          const metadata = JSON.parse(jsonStr);
          resolve(processMetadata(metadata));
        } catch (error) {
          reject(new Error(`Failed to parse metadata: ${errorOutput}`));
        }
      } else {
        reject(new Error(`yt-dlp failed with code ${code}: ${errorOutput}`));
      }
    });
    
    child.on("error", (error) => {
      reject(error);
    });
  });
}

function processMetadata(metadata: any): VideoMetadata {
  // Extract video ID from URL or metadata
  const videoId = metadata.id;
  
  // Process formats
  const formats = (metadata.formats || []).map((fmt: any) => {
    // Determine if this is a video-only or audio-only format
    const hasVideo = fmt.vcodec && fmt.vcodec !== "none";
    const hasAudio = fmt.acodec && fmt.acodec !== "none";
    
    // Build resolution string
    let resolution = "";
    if (hasVideo && fmt.height) {
      resolution = `${fmt.height}p`;
      if (fmt.fps && fmt.fps > 30) {
        resolution += `${fmt.fps}`;
      }
    } else if (hasAudio) {
      resolution = "Audio";
    }
    
    // Estimate bitrate
    let bitrate = "";
    if (hasAudio && fmt.tbr) {
      bitrate = `${Math.round(fmt.tbr)}kbps`;
    }
    
    return {
      format_id: fmt.format_id,
      ext: fmt.ext || "mp4",
      resolution: resolution,
      fps: fmt.fps,
      vcodec: fmt.vcodec,
      acodec: fmt.acodec,
      has_audio: hasAudio,
      has_video: hasVideo,
      filesize: fmt.filesize,
      filesize_approx: fmt.filesize_approx,
      tbr: fmt.tbr,
      width: fmt.width,
      height: fmt.height,
    };
  });

  // Sort formats by quality (descending)
  formats.sort((a: FormatInfo, b: FormatInfo) => {
    // Extract height from resolution
    const getHeight = (res: string) => {
      const match = res.match(/(\d+)p/);
      return match ? parseInt(match[1]) : 0;
    };
    
    const aHeight = getHeight(a.resolution);
    const bHeight = getHeight(b.resolution);
    
    if (aHeight !== bHeight) {
      return bHeight - aHeight;
    }
    
    // For same resolution, prefer video+audio over separate streams
    if (a.has_video && a.has_audio && !(b.has_video && b.has_audio)) {
      return -1;
    }
    if (b.has_video && b.has_audio && !(a.has_video && a.has_audio)) {
      return 1;
    }
    
    return 0;
  });

  return {
    id: videoId,
    title: metadata.title || "Unknown Title",
    channel: metadata.uploader || "Unknown Channel",
    channel_id: metadata.channel_id || "",
    thumbnail: metadata.thumbnail || "",
    duration: metadata.duration || 0,
    duration_string: metadata.duration_string || "",
    upload_date: metadata.upload_date || "",
    view_count: metadata.view_count,
    formats,
  };
}

export interface DownloadProgress {
  progress: number;
  status: "pending" | "processing" | "completed" | "error";
  message: string;
  filename?: string;
  errorMessage?: string;
}

export type ProgressCallback = (progress: DownloadProgress) => void;

export async function downloadVideo(
  videoId: string,
  formatId: string,
  type: "video" | "audio",
  title: string,
  downloadId: string,
  onProgress: ProgressCallback
): Promise<string> {
  await ensureTempDir();
  return new Promise((resolve, reject) => {
    const ytDlpPath = process.env.YT_DLP_PATH || "yt-dlp";
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    const ext = type === "audio" ? "mp3" : "mp4";
    
    // Sanitize title for filename: replace invalid chars, limit length
    const safeTitle = title
      .replace(/[^a-zA-Z0-9\-_\u4e00-\u9fff\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af\s]/g, "_")
      .replace(/\s+/g, "_")
      .substring(0, 80);
    
    const filename = `${safeTitle}_${downloadId}.${ext}`;
    const outputPath = path.join(TEMP_DIR, filename);

    let args: string[] = [];
    if (type === "audio") {
      args = ["-f", "bestaudio", "-x", "--audio-format", "mp3", "--newline", "-o", outputPath, url];
    } else {
      args = ["-f", `${formatId}+bestaudio[ext=m4a]/${formatId}+bestaudio/best`, "--merge-output-format", "mp4", "--newline", "-o", outputPath, url];
    }

    const child = spawn(ytDlpPath, args);

    onProgress({ progress: 0, status: "processing", message: "Starting download..." });

    child.stdout.on("data", (data) => {
      const output = data.toString();
      const progressMatch = output.match(/\[download\]\s+(\d+\.\d+)%/);
      if (progressMatch) {
        const percent = parseFloat(progressMatch[1]);
        onProgress({ progress: percent, status: "processing", message: "Downloading..." });
      } else if (output.includes("[Merger]")) {
        onProgress({ progress: 95, status: "processing", message: "Merging video and audio..." });
      } else if (output.includes("[ExtractAudio]")) {
        onProgress({ progress: 95, status: "processing", message: "Extracting audio..." });
      }
    });

    let errorOutput = "";
    child.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    child.on("close", (code) => {
      if (code === 0) {
        onProgress({ progress: 100, status: "completed", message: "Download complete!", filename });
        resolve(filename);
      } else {
        const err = new Error(`yt-dlp failed: ${errorOutput}`);
        onProgress({ progress: 0, status: "error", message: "Download failed", errorMessage: errorOutput || "Unknown error" });
        reject(err);
      }
    });

    child.on("error", (error) => {
      onProgress({ progress: 0, status: "error", message: "Failed to start yt-dlp", errorMessage: error.message });
      reject(error);
    });
  });
}
