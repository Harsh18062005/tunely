import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const playlists = await prisma.playlist.findMany({
      include: {
        songs: {
          include: {
            song: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    const formattedPlaylists = playlists.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      coverUrl: p.coverUrl || (p.songs[0]?.song.coverUrl ?? null),
      songCount: p.songs.length,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));

    return NextResponse.json(formattedPlaylists);
  } catch (error) {
    console.error("Error fetching playlists:", error);
    return NextResponse.json({ error: "Failed to fetch playlists" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, coverUrl } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const defaultCovers = [
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80",
    ];
    const randomCover = defaultCovers[Math.floor(Math.random() * defaultCovers.length)];

    const playlist = await prisma.playlist.create({
      data: {
        name: name.trim(),
        description: description?.trim() || "A custom Tunely playlist",
        coverUrl: coverUrl || randomCover,
      },
    });

    return NextResponse.json(playlist, { status: 201 });
  } catch (error) {
    console.error("Error creating playlist:", error);
    return NextResponse.json({ error: "Failed to create playlist" }, { status: 500 });
  }
}
