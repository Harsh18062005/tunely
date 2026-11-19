import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const likes = await prisma.likedSong.findMany({
      include: {
        song: true,
      },
      orderBy: {
        likedAt: "desc",
      },
    });

    const formatted = likes.map((l) => ({
      ...l.song,
      likedAt: l.likedAt,
      isLiked: true,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Error fetching liked songs:", error);
    return NextResponse.json({ error: "Failed to fetch liked songs" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { songId } = body;

    if (!songId) {
      return NextResponse.json({ error: "songId is required" }, { status: 400 });
    }

    const existing = await prisma.likedSong.findUnique({
      where: { songId },
    });

    if (existing) {
      await prisma.likedSong.delete({
        where: { songId },
      });
      return NextResponse.json({ liked: false });
    } else {
      await prisma.likedSong.create({
        data: { songId },
      });
      return NextResponse.json({ liked: true });
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    return NextResponse.json({ error: "Failed to toggle like" }, { status: 500 });
  }
}
