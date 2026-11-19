# 🎶 Tunely — Modern Full-Stack Music Streaming Web Player

![Tunely Banner](https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&auto=format&fit=crop&q=80)

**Tunely** is a modern, high-performance music streaming web application built with **Next.js (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS**, and **Prisma ORM** with **SQLite**.

Featuring an authentic dark-mode streaming UI, real audio streaming engine, dynamic playlist curation, live instant search, and complete full-length audio tracks across Bhojpuri, Punjabi, Bollywood, Lo-Fi, and Pop genres.

---

## ✨ Features

- 🎧 **Interactive Audio Player Engine:**
  - Real-time HTML5 audio streaming with live time tracking and progress scrubbing.
  - Full playback controls: Play/Pause, Next, Previous, Shuffle, and Repeat (Off / All / Repeat One).
  - Smooth volume control slider with instant mute toggle.
  - Automatic play count analytics updated live in the database.

- 🗂️ **Playlist Management & Custom Library:**
  - Create custom playlists with personalized titles and descriptions.
  - Add or remove tracks to/from any playlist with one click.
  - Smart track recommendations at the bottom of every playlist.
  - Cascade deletion support for clean relational database management.

- ❤️ **Favorites & Liked Songs:**
  - Save any track to your personal **Liked Songs** station with the heart icon.
  - Dedicated hero view for all saved favorite tracks.

- 🔍 **Real-Time Live Search & Genre Explorer:**
  - Instant live filter matching across song titles, artists, and album names.
  - Spotify-style **Top Result** card showcasing primary search hits.
  - Visual category browse tiles for **Bhojpuri**, **Punjabi**, **Bollywood**, **Pop**, **Lo-Fi**, **Synthwave**, and **Chill**.

- 📤 **Custom Audio Upload Station:**
  - Upload your own `.mp3`, `.m4a`, or `.wav` songs directly from your machine.
  - Metadata management (Title, Artist, Album, Category, Cover Image).

---

## 🎵 Featured Music Catalog (Full-Length Audio)

Tunely comes pre-seeded with full-length complete audio tracks across trending categories:

- **🪕 Bhojpuri Hits:** Pawan Singh (*Lollipop Lagelu*, *Pudina Ae Haseena*, *Chhalakata Hamro Jawaniya*, *Raja Ji Re*), Khesari Lal Yadav (*Nathuniya*, *Dhan Dhua Ho Jai*, *Coca Cola*), Ritesh Pandey (*Piyawa Se Pahile*, *Hello Koun*), and Arvind Akela Kallu.
- **⚡ Punjabi Blockbusters:** Karan Aujla (*Softly*, *Tauba Tauba*, *Winning Speech*, *52 Bars*, *Admirin' You*, *Antidote*), Sidhu Moose Wala (*295*, *The Last Ride*, *So High*, *Same Beef*), AP Dhillon (*Brown Munde*, *Excuses*, *With You*), Diljit Dosanjh (*Born to Shine*, *Lover*, *Lemonade*), and Shubh (*Cheques*, *Baller*, *No Love*).
- **🎬 Bollywood Romance & Trending:** Arijit Singh (*Kesariya*, *Chaleya*, *Apna Bana Le*, *Tum Hi Ho*, *Satranga*, *O Maahi*, *Channa Mereya*), Vishal Mishra (*Pehle Bhi Main*), *Jhoome Jo Pathaan*, *Besharam Rang*, *Raataan Lambiyan*, and *Dil Diyan Gallan*.

---

## 🛠️ Architecture & Tech Stack

- **Frontend:** [Next.js](https://nextjs.org/) (App Router), [React 19](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/), [Lucide React](https://lucide.dev/)
- **Backend:** Next.js Route Handlers (`/api/songs`, `/api/playlists`, `/api/liked`, `/api/songs/upload`)
- **Database:** [SQLite](https://www.sqlite.org/) managed with [Prisma ORM](https://www.prisma.io/)
- **Audio Engine:** HTML5 Audio API with custom React Context state management

---

## 🚀 Quick Start Guide

### ⚡ One-Click Run (Windows)
Simply double-click **`launcher.bat`** in the project folder! It will automatically check dependencies, start the server, and open Tunely in your default web browser at `http://localhost:3000`.

---

### Manual Setup
### Prerequisites
- Node.js (v18 or newer)
- npm or pnpm

### 1. Clone the repository
```bash
git clone https://github.com/Harsh18062005/tunely.git
cd tunely
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup the database
```bash
npx prisma db push
```

### 4. (Optional) Re-seed catalog
To download and seed all trending songs:
```bash
python seed_20_each_category.py
```

### 5. Run development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📡 REST API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/songs` | Fetch songs with optional `?q=search` and `?category=genre` query params |
| `POST` | `/api/songs/[id]/play` | Record play count for a track |
| `POST` | `/api/songs/upload` | Upload a custom audio track with metadata |
| `GET` | `/api/playlists` | Fetch all playlists with track counts and preview thumbnails |
| `POST` | `/api/playlists` | Create a new playlist |
| `GET` | `/api/playlists/[id]` | Fetch playlist details with ordered tracklist |
| `DELETE` | `/api/playlists/[id]` | Delete a playlist |
| `POST` | `/api/playlists/[id]/songs` | Add a track to a playlist |
| `DELETE` | `/api/playlists/[id]/songs?songId=...` | Remove a track from a playlist |
| `GET` | `/api/liked` | Fetch all liked songs |
| `POST` | `/api/liked` | Toggle like status for a track |

---

## 📄 License
MIT License. Created by [Harsh Juneja](https://github.com/Harsh18062005).
