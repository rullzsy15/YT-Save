import { NextRequest } from "next/server";
import fs from "fs";
import path from "path";

const TEMP_DIR = path.join(process.cwd(), "tmp", "downloads");

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const resolvedParams = await params;
    const filename = resolvedParams.filename;

    if (!filename) {
      return new Response("File not found", { status: 404 });
    }

    // Sanitize filename to prevent directory traversal
    const sanitizedFilename = path.basename(filename);
    const filePath = path.join(TEMP_DIR, sanitizedFilename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return new Response("File not found", { status: 404 });
    }

    // Determine content type based on file extension
    const ext = path.extname(sanitizedFilename).toLowerCase();
    const contentType = ext === ".mp3" ? "audio/mpeg" : "video/mp4";

    // Read file and create blob
    const fileBuffer = fs.readFileSync(filePath);
    
    // Return file with appropriate headers
    return new Response(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${sanitizedFilename}"`,
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("Error serving file:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
