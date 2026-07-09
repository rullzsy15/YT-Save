# YouTube Downloader

A full-stack YouTube video downloader built with Next.js 14+, TypeScript, Tailwind CSS, and shadcn/ui.

## Features

- Download YouTube videos in MP4 format (up to 4K resolution)
- Extract audio as MP3 (up to 320kbps)
- Support for 1080p60fps and 4K videos
- Real-time download progress tracking
- Clean, modern UI with custom fonts (Clash Display + Satoshi)
- Responsive design for mobile and desktop
- Download history tracking with MySQL database

## Tech Stack

- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS, shadcn/ui, Framer Motion
- **Backend**: Next.js API Routes
- **Database**: MySQL with Prisma ORM
- **Video Processing**: yt-dlp + ffmpeg

## Prerequisites

Before running this project, make sure you have:

1. **Node.js** 18+ installed
2. **MySQL** server running (default: `root` user, no password)
3. **yt-dlp** installed and available in PATH
   - Windows: `pip install yt-dlp` or download from [GitHub](https://github.com/yt-dlp/yt-dlp/releases)
   - macOS: `brew install yt-dlp`
   - Linux: `pip install yt-dlp` or use your package manager
4. **ffmpeg** installed and available in PATH
   - Windows: Download from [ffmpeg.org](https://ffmpeg.org/download.html) and add to PATH
   - macOS: `brew install ffmpeg`
   - Linux: `sudo apt install ffmpeg` (Ubuntu/Debian) or `sudo yum install ffmpeg` (RHEL/CentOS)

## Installation

1. **Clone or download the project**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   # Create MySQL database
   mysql -u root -e "CREATE DATABASE yt_downloader;"
   
   # Run Prisma migrations
   npx prisma migrate dev
   ```

4. **Configure environment variables**
   ```bash
   # Copy .env.example to .env.local
   cp .env.example .env.local
   
   # Edit .env.local with your settings (database URL, paths, etc.)
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open [http://localhost:3000](http://localhost:3000) in your browser**

## Project Structure

```
yt-downloader-app/
├── app/
│   ├── page.tsx                # Main landing page
│   ├── api/
│   │   ├── metadata/route.ts   # Fetch video metadata
│   │   └── download/route.ts   # Process download
├── components/
│   ├── SearchBar.tsx           # URL input component
│   ├── PreviewCard.tsx         # Video preview card
│   ├── QualitySelector.tsx     # Format/quality selector
│   ├── ProgressIndicator.tsx   # Download progress
│   └── ui/                     # shadcn/ui components
├── lib/
│   ├── utils.ts                # Utility functions
│   └── youtube.ts              # YouTube/yt-dlp wrapper
├── prisma/
│   └── schema.prisma           # Database schema
└── public/                     # Static assets
```

## API Routes

### `POST /api/metadata`

Fetches video metadata from a YouTube URL.

**Request body:**
```json
{
  "url": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

**Response:**
```json
{
  "metadata": {
    "id": "VIDEO_ID",
    "title": "Video Title",
    "channel": "Channel Name",
    "thumbnail": "https://...",
    "duration": 123,
    "formats": [...]
  }
}
```

### `POST /api/download`

Starts a video download.

**Request body:**
```json
{
  "videoId": "VIDEO_ID",
  "formatId": "FORMAT_ID",
  "type": "video",
  "quality": "1080p60"
}
```

**Response:**
```json
{
  "downloadId": "DOWNLOAD_ID",
  "message": "Download started"
}
```

## Database Schema

### DownloadHistory

Stores download history for analytics and user reference.

| Field | Type | Description |
|-------|------|-------------|
| id | Int | Primary key |
| youtubeUrl | String | Original YouTube URL |
| videoId | String | YouTube video ID |
| title | String | Video title |
| channel | String | Channel name |
| thumbnail | String | Thumbnail URL |
| duration | Int | Duration in seconds |
| type | String | "video" or "audio" |
| quality | String | Resolution/bitrate |
| fileSizeMB | Float | File size in MB |
| status | String | pending/processing/done/failed |
| createdAt | DateTime | Download timestamp |

### VideoQualityCache

Caches available formats for each video.

| Field | Type | Description |
|-------|------|-------------|
| id | Int | Primary key |
| videoId | String | YouTube video ID |
| formatId | String | yt-dlp format ID |
| resolution | String | Resolution string |
| fps | Int | Frame rate |
| ext | String | File extension |
| hasAudio | Boolean | Has audio stream |
| filesizeMB | Float | File size in MB |

## Legal Disclaimer

This tool is for personal use only. Users are responsible for respecting:
- Copyright laws
- YouTube's Terms of Service
- Content creator's rights

Do not distribute downloaded content without permission.

## License

MIT License - See LICENSE file for details.
