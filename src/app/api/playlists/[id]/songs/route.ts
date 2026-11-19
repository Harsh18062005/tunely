import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { songId } = body;

    if (!songId) {
      return NextResponse.json({ error: "songId is required" }, { status: 400 });
    }

    // Check if song already in playlist
    const existing = await prisma.playlistSong.findUnique({
      where: {
        playlistId_songId: {
          playlistId: id,
          songId,
        },
      },
    });

    if (existing) {
      return NextResponse.json({ message: "Song already in playlist" });
    }

    const playlistSong = await prisma.playlistSong.create({
      data: {
        playlistId: id,
        songId,
      },
      include: {
        song: true,
      },
    });

    // Touch playlist updatedAt
    await prisma.playlist.update({
      where: { id },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json(playlistSong, { status: 201 });
  } catch (error) {
    console.error("Error adding song to playlist:", error);
    return NextResponse.json({ error: "Failed to add song to playlist" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const { searchParams } = new URL(request.url);
    const songId = searchParams.get("songId");

    if (!songId) {
      return NextResponse.json({ error: "songId parameter required" }, { status: 400 });
    }

    await prisma.playlistSong.delete({
      where: {
        playlistId_songId: {
          playlistId: id,
          songId,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing song from playlist:", error);
    return NextResponse.json({ error: "Failed to remove song" }, { status: 500 });
  }
}
