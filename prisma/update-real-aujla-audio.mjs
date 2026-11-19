import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const REAL_AUJLA_TRACKS = [
  {
    title: "Softly",
    artist: "Karan Aujla, Ikky",
    album: "Making Memories",
    duration: 30, // 30s official stream preview
    audioUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/5f/6f/01/5f6f0130-6567-22d4-bc1a-5ccb359c3fac/mzaf_5497113703334703756.plus.aac.p.m4a",
    coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/d3/08/bc/d308bc6a-20e1-6532-d933-35d1b429210e/5054197755538.jpg/600x600bb.jpg",
    category: "Punjabi",
  },
  {
    title: "Tauba Tauba",
    artist: "Karan Aujla",
    album: "Bad Newz",
    duration: 30,
    audioUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/34/8d/63/348d6342-2c35-bf31-8131-2c8b3cfe3c09/mzaf_15374551219149804677.plus.aac.p.m4a",
    coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/79/d2/01/79d201d2-e54d-5604-81fb-313f30db7219/198588533581.jpg/600x600bb.jpg",
    category: "Punjabi",
  },
  {
    title: "Winning Speech",
    artist: "Karan Aujla, MXRCI",
    album: "Street Dreams",
    duration: 30,
    audioUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/e3/ae/b6/e3aeb64f-cadd-5830-c39f-6af51cd91670/mzaf_6001527501800958065.plus.aac.p.m4a",
    coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/48/7c/36/487c3668-f7a4-4b1a-e09e-c74dae124dd9/5063483578089_cover.jpg/600x600bb.jpg",
    category: "Punjabi",
  },
  {
    title: "Admirin' You",
    artist: "Karan Aujla, Preston Pablo, Ikky",
    album: "Making Memories",
    duration: 30,
    audioUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/1e/93/c4/1e93c4d4-0367-c423-6faa-51af078e501b/mzaf_2676653675471599457.plus.aac.p.m4a",
    coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/d3/08/bc/d308bc6a-20e1-6532-d933-35d1b429210e/5054197755538.jpg/600x600bb.jpg",
    category: "Punjabi",
  },
  {
    title: "52 Bars",
    artist: "Karan Aujla, Ikky",
    album: "Four You",
    duration: 30,
    audioUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/52/c9/1c/52c91c69-352d-cb4e-3706-265dc01067d0/mzaf_17387125942915601585.plus.aac.p.m4a",
    coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/fc/bc/64/fcbc6417-8a88-7b5e-4490-8f53e537ffb0/859770181552_cover.jpg/600x600bb.jpg",
    category: "Punjabi",
  },
  {
    title: "Antidote",
    artist: "Karan Aujla",
    album: "Four You",
    duration: 30,
    audioUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/83/fd/0a/83fd0a07-7fc9-e07e-520f-ce8ca4327acc/mzaf_14841514026491120213.plus.aac.p.m4a",
    coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/c2/ce/a0/c2cea088-dbde-43db-346f-e536058fdcfb/5063483978438_cover.jpg/600x600bb.jpg",
    category: "Punjabi",
  },
  {
    title: "Wavy",
    artist: "Karan Aujla",
    album: "Wavy - Single",
    duration: 30,
    audioUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/5f/5e/84/5f5e8495-bd71-97f1-bc2d-8e9bf4591868/mzaf_11556782856079892040.plus.aac.p.m4a",
    coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/cd/df/5a/cddf5a8c-464e-3958-cf4a-7fac9e490aa5/5063616597178_cover.jpg/600x600bb.jpg",
    category: "Punjabi",
  },
];

async function main() {
  console.log("Updating Karan Aujla tracks with real audio and official artwork...");

  for (const track of REAL_AUJLA_TRACKS) {
    // Find song by title
    const existing = await prisma.song.findFirst({
      where: {
        title: { contains: track.title },
        artist: { contains: "Aujla" },
      },
    });

    if (existing) {
      await prisma.song.update({
        where: { id: existing.id },
        data: {
          audioUrl: track.audioUrl,
          coverUrl: track.coverUrl,
          duration: track.duration,
          artist: track.artist,
          album: track.album,
          category: track.category,
        },
      });
      console.log(`Updated real audio for: ${track.title}`);
    } else {
      const created = await prisma.song.create({
        data: {
          ...track,
          plays: 75000000,
        },
      });
      console.log(`Created new track with real audio: ${created.title}`);
    }
  }

  // Update playlist cover with official Softly artwork
  const playlist = await prisma.playlist.findFirst({
    where: { name: "This Is Karan Aujla" },
  });

  if (playlist) {
    await prisma.playlist.update({
      where: { id: playlist.id },
      data: {
        coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/d3/08/bc/d308bc6a-20e1-6532-d933-35d1b429210e/5054197755538.jpg/600x600bb.jpg",
      },
    });
    console.log("Updated playlist cover.");
  }

  console.log("All Karan Aujla songs updated with actual music tracks!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
