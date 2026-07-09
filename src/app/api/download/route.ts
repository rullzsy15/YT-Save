import { NextRequest, NextResponse } from "next/server";
import { downloadVideo } from "@/lib/youtube";
import fs from "fs";
import path from "path";

// Download progress tracking (in-memory)
const downloadProgress: Record<string, any> = {};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  
  if (!id || !downloadProgress[id]) {
    return NextResponse.json({ error: "Download not found" }, { status: 404 });
  }
  
  return NextResponse.json(downloadProgress[id]);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { videoId, formatId, type, quality, title } = body;

    if (!videoId || !formatId || !type) {
      return NextResponse.json(
        { error: "videoId, formatId, and type are required" },
        { status: 400 }
      );
    }

    if (type !== "video" && type !== "audio") {
      return NextResponse.json(
        { error: "Type must be 'video' or 'audio'" },
        { status: 400 }
      );
    }

    const downloadId = `${videoId}_${formatId}_${Date.now()}`;
    
    downloadProgress[downloadId] = {
      progress: 0,
      status: "pending",
      message: "Starting download...",
    };

    runDownloadTask(downloadId, videoId, formatId, type, title).catch(console.error);

    return NextResponse.json(
      { downloadId, message: "Download started" },
      { status: 202 }
    );
  } catch (error) {
    console.error("Error starting download:", error);
    return NextResponse.json(
      { error: "Failed to start download" },
      { status: 500 }
    );
  }
}

async function runDownloadTask(
  downloadId: string, 
  videoId: string, 
  formatId: string, 
  type: string,
  title: string
) {
  try {
    const filename = await downloadVideo(videoId, formatId, type as "video" | "audio", title, downloadId, (progress) => {
      downloadProgress[downloadId] = {
        ...downloadProgress[downloadId],
        ...progress,
        downloadUrl: progress.status === "completed" ? `/api/file/${progress.filename}` : undefined
      };
    });

    downloadProgress[downloadId] = {
      ...downloadProgress[downloadId],
      status: "completed",
      message: "Download complete!",
    };
  } catch (error: any) {
    console.error("Download failed:", error);
    downloadProgress[downloadId] = {
      progress: 0,
      status: "error",
      errorMessage: error.message || "Unknown error",
    };
  }
}
