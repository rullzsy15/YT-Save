# YT-Save - YouTube Video & Audio Downloader

A modern, fast, and beautiful web application for downloading YouTube videos (MP4) and audio (MP3) in the highest available quality. Built with Next.js and powered by [yt-dlp](https://github.com/yt-dlp/yt-dlp).

## Screenshot

![YT-Save Screenshot](https://i.imgur.com/AREZ0Il.png)

## Features

- **Download Videos** - Save YouTube videos in MP4 format with resolutions up to 4K
- **Download Audio** - Extract audio from YouTube videos and save as MP3
- **Multiple Quality Options** - Choose from various resolutions (360p, 480p, 720p, 1080p, 1440p, 4K) and bitrates
- **Real-time Progress Tracking** - Visual progress indicator during download
- **Video Preview** - See video title, thumbnail, channel info, duration, and view count before downloading
- **Modern UI** - Clean, responsive interface built with Tailwind CSS and Framer Motion animations
- **Dark/Light Theme** - Support for both light and dark modes
- **Auto Cleanup** - Temporary downloaded files are automatically removed after 15 minutes

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | [Next.js 14](https://nextjs.org/) (App Router) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **UI Framework** | [Tailwind CSS](https://tailwindcss.com/) |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **UI Components** | [Radix UI](https://www.radix-ui.com/) |
| **Video Processing** | [yt-dlp](https://github.com/yt-dlp/yt-dlp) |
| **Validation** | [Zod](https://zod.dev/) |

## Prerequisites

Before running this project, make sure you have the following installed:

| Software | Minimum Version | Purpose |
|----------|----------------|---------|
| [Node.js](https://nodejs.org/) | 18.x or higher | JavaScript runtime |
| [yt-dlp](https://github.com/yt-dlp/yt-dlp) | Latest | YouTube video/audio extraction |
| [FFmpeg](https://ffmpeg.org/) | Latest | Audio/video merging & format conversion |
| [npm](https://www.npmjs.com/) / [pnpm](https://pnpm.io/) / [yarn](https://yarnpkg.com/) | Latest | Package manager |

> **Important:** `yt-dlp` and `FFmpeg` are **required** for the download functionality to work. They are NOT installed via npm - they must be installed system-wide.

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/rullzsy15/YT-Save.git
cd YT-Save
```

### 2. Install Node.js Dependencies

```bash
# Using npm
npm install

# Using pnpm
pnpm install

# Using yarn
yarn install
```

### 3. Install System Dependencies

#### yt-dlp

**Windows:**
```bash
# Using Chocolatey
choco install yt-dlp

# Or download directly from https://github.com/yt-dlp/yt-dlp/releases
# Download yt-dlp.exe and place it in your PATH (e.g., C:\Windows\)
```

**macOS:**
```bash
# Using Homebrew
brew install yt-dlp
```

**Linux:**
```bash
# Ubuntu/Debian
sudo apt update && sudo apt install yt-dlp

# Fedora
sudo dnf install yt-dlp

# Arch Linux
sudo pacman -S yt-dlp

# Or install via pip
pip install yt-dlp
```

#### FFmpeg

**Windows:**
```bash
# Using Chocolatey
choco install ffmpeg

# Or download from https://ffmpeg.org/download.html
# Extract and add the bin folder to your system PATH
```

**macOS:**
```bash
brew install ffmpeg
```

**Linux:**
```bash
# Ubuntu/Debian
sudo apt install ffmpeg

# Fedora
sudo dnf install ffmpeg

# Arch Linux
sudo pacman -S ffmpeg
```

> **Verify installation:** After installing, verify both tools are available by running:
> ```bash
> yt-dlp --version
> ffmpeg -version
> ```

## Running the Project

### Development Mode

Run the local development server with hot-reload:

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

Build the application for production:

```bash
npm run build
# or
pnpm build
# or
yarn build
```

Start the production server:

```bash
npm start
# or
pnpm start
# or
yarn start
```

The production server will be available at [http://localhost:3000](http://localhost:3000).

### Linting

Check code quality:

```bash
npm run lint
# or
pnpm lint
# or
yarn lint
```

## Project Structure

```
YT-Save/
├── src/
│   ├── app/
│   │   ├── api/                    # API Routes
│   │   │   ├── download/           # Download endpoint with progress tracking
│   │   │   ├── file/               # File serving endpoint
│   │   │   └── metadata/           # Video metadata fetch endpoint
│   │   ├── terms/                  # Terms of Service page
│   │   ├── layout.tsx              # Root layout
│   │   ├── page.tsx                # Main page (home)
│   │   ├── globals.css             # Global styles (Tailwind)
│   │   └── favicon.ico
│   ├── components/
│   │   ├── ui/                     # Shadcn/Radix UI primitive components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── progress.tsx
│   │   │   ├── select.tsx
│   │   │   └── tabs.tsx
│   │   ├── Navbar.tsx              # Navigation bar
│   │   ├── NavbarTerms.tsx         # Terms page navigation bar
│   │   ├── PreviewCard.tsx         # Video info & thumbnail display
│   │   ├── ProgressIndicator.tsx   # Download progress display
│   │   ├── QualitySelector.tsx     # Resolution/format selection
│   │   └── SearchBar.tsx           # YouTube URL input
│   └── lib/
│       ├── youtube.ts              # Core yt-dlp integration
│       ├── format.ts               # File size formatting
│       └── utils.ts                # Utility functions
├── public/                         # Static assets
├── package.json
├── tailwind.config.mjs             # Tailwind CSS configuration
├── next.config.mjs                 # Next.js configuration
├── tsconfig.json                   # TypeScript configuration
└── README.md
```

## How It Works

1. **Search** - Paste a YouTube URL into the search bar
2. **Fetch Metadata** - The app queries `yt-dlp` to get video info (title, thumbnail, available formats)
3. **Choose Quality** - Select the desired video resolution or audio bitrate
4. **Download** - The backend uses `yt-dlp` to download and process the file
5. **Auto Download** - When complete, the file is automatically downloaded to your device

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/metadata` | Fetch video metadata from a YouTube URL |
| POST | `/api/download` | Start a download task |
| GET | `/api/download?id=<id>` | Poll download progress |
| GET | `/api/file/<filename>` | Download the finished file |

## Environment Variables (Optional)

You can create a `.env.local` file in the root directory:

```env
# Optional: Custom path to yt-dlp binary if it's not in system PATH
# YT_DLP_PATH=/usr/local/bin/yt-dlp
```

## Built With

- **Next.js** - React full-stack framework
- **Tailwind CSS** - Utility-first CSS framework
- **yt-dlp** - Superior YouTube downloader
- **Framer Motion** - Animation library
- **Radix UI** - Accessible component primitives
- **Lucide Icons** - Beautiful icon library
- **TypeScript** - Type-safe JavaScript

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Disclaimer

This project is for educational purposes only. Please respect YouTube's Terms of Service and copyright laws in your country. Only download content you have permission to download.

---

Made with by [YOUR_USERNAME](https://github.com/YOUR_USERNAME)
