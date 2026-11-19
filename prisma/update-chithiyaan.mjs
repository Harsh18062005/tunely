import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const wbb = await prisma.song.findFirst({
    where: { title: "White Brown Black" }
  });

  if (wbb) {
    await prisma.song.update({
      where: { id: wbb.id },
      data: {
        title: "Chithiyaan",
        artist: "Karan Aujla, Desi Crew",
        album: "Chithiyaan - Single",
        duration: 30,
        audioUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/ab/12/fa/ab12fada-e0fe-bfef-7811-f2c68d9635a4/mzaf_12787185916541499123.plus.aac.p.m4a",
        coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/14/c1/98/14c198e3-53d9-698e-e274-aaae83c27da4/5059552174381.jpg/600x600bb.jpg",
      }
    });
    console.log("Updated White Brown Black to Chithiyaan with actual Karan Aujla audio!");
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
