import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const song = await prisma.song.update({
      where: { id },
      data: { plays: { increment: 1 } },
    });
    return NextResponse.json({ success: true, plays: song.plays });
  } catch (error) {
    console.error("Error updating plays:", error);
    return NextResponse.json({ error: "Failed to record play" }, { status: 500 });
  }
}
