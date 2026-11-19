import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const category = searchParams.get("category");

    const where: any = {};

    if (query) {
      where.OR = [
        { title: { contains: query } },
        { artist: { contains: query } },
        { album: { contains: query } },
      ];
    }

    if (category && category !== "All") {
      where.category = category;
    }

    const songs = await prisma.song.findMany({
      where,
      include: {
        likes: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const formattedSongs = songs.map((s) => ({
      ...s,
      isLiked: s.likes.length > 0,
      likes: undefined,
    }));

    return NextResponse.json(formattedSongs);
  } catch (error) {
    console.error("Error fetching songs:", error);
    return NextResponse.json({ error: "Failed to fetch songs" }, { status: 500 });
  }
}
