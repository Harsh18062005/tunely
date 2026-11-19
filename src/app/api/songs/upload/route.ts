import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const title = (formData.get("title") as string) || "Untitled Track";
    const artist = (formData.get("artist") as string) || "Unknown Artist";
    const album = (formData.get("album") as string) || "Single";
    const category = (formData.get("category") as string) || "Pop";
    const coverUrl =
      (formData.get("coverUrl") as string) ||
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80";

    if (!file) {
      return NextResponse.json({ error: "Audio file is required" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const safeFilename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const filePath = path.join(uploadsDir, safeFilename);
    fs.writeFileSync(filePath, buffer);

    const audioUrl = `/uploads/${safeFilename}`;

    const newSong = await prisma.song.create({
      data: {
        title: title.trim(),
        artist: artist.trim(),
        album: album.trim(),
        category: category.trim(),
        duration: 180, // default estimate; audio metadata will adjust in player
        audioUrl,
        coverUrl,
        plays: 0,
      },
    });

    return NextResponse.json(newSong, { status: 201 });
  } catch (error) {
    console.error("Error uploading track:", error);
    return NextResponse.json({ error: "Failed to upload song" }, { status: 500 });
  }
}
