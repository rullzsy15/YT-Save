import { NextRequest, NextResponse } from "next/server";
import { getVideoMetadata, VideoMetadata } from "@/lib/youtube";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      );
    }

    // Validate YouTube URL
    const youtubeUrlRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=|shorts\/|embed\/)?([a-zA-Z0-9_-]{11}).*$/;
    if (!youtubeUrlRegex.test(url)) {
      return NextResponse.json(
        { error: "Invalid YouTube URL" },
        { status: 400 }
      );
    }

    // Get video metadata
    const metadata: VideoMetadata = await getVideoMetadata(url);

    // Cache the formats in the database
    // For now, we'll just return the metadata

    return NextResponse.json({ metadata }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching metadata:", error);

    if (error.message.includes("Private video")) {
      return NextResponse.json(
        { error: "This video is private and cannot be accessed." },
        { status: 403 }
      );
    }

    if (error.message.includes("Age-restricted")) {
      return NextResponse.json(
        { error: "This video is age-restricted and requires authentication." },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch video metadata. Please check the URL and try again." },
      { status: 500 }
    );
  }
}
