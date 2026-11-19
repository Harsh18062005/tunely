import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const KARAN_AUJLA_SONGS = [
  {
    title: "Softly",
    artist: "Karan Aujla, Ikky",
    album: "Making Memories",
    duration: 156,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3",
    coverUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&auto=format&fit=crop&q=80",
    category: "Punjabi",
    plays: 89400200,
  },
  {
    title: "Winning Speech",
    artist: "Karan Aujla, MXRCI",
    album: "Street Dreams",
    duration: 198,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3",
    coverUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=80",
    category: "Punjabi",
    plays: 64200100,
  },
  {
    title: "Tauba Tauba",
    artist: "Karan Aujla",
    album: "Bad Newz",
    duration: 208,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3",
    coverUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80",
    category: "Punjabi",
    plays: 120500300,
  },
  {
    title: "Admirin' You",
    artist: "Karan Aujla, Preston Pablo, Ikky",
    album: "Making Memories",
    duration: 214,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3",
    coverUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80",
    category: "Punjabi",
    plays: 51200400,
  },
  {
    title: "52 Bars",
    artist: "Karan Aujla, Ikky",
    album: "Four You",
    duration: 202,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3",
    coverUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80",
    category: "Punjabi",
    plays: 78100900,
  },
  {
    title: "White Brown Black",
    artist: "Karan Aujla, Avvy Sra",
    album: "White Brown Black",
    duration: 182,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3",
    coverUrl: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&auto=format&fit=crop&q=80",
    category: "Punjabi",
    plays: 95400100,
  },
];

async function main() {
  console.log("Adding Karan Aujla tracks...");

  const createdSongIds = [];

  for (const songData of KARAN_AUJLA_SONGS) {
    // Check if song already exists
    const existing = await prisma.song.findFirst({
      where: { title: songData.title, artist: songData.artist },
    });

    if (existing) {
      console.log(`Song "${songData.title}" already exists, skipping.`);
      createdSongIds.push(existing.id);
    } else {
      const created = await prisma.song.create({ data: songData });
      console.log(`Added "${created.title}" by ${created.artist}`);
      createdSongIds.push(created.id);
    }
  }

  // Create or update "This Is Karan Aujla" playlist
  let playlist = await prisma.playlist.findFirst({
    where: { name: "This Is Karan Aujla" },
  });

  if (!playlist) {
    playlist = await prisma.playlist.create({
      data: {
        name: "This Is Karan Aujla",
        description: "The essential tracks and greatest hits by Karan Aujla including Softly, Winning Speech, Tauba Tauba, and more.",
        coverUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&auto=format&fit=crop&q=80",
      },
    });
    console.log("Created 'This Is Karan Aujla' playlist.");
  }

  for (const songId of createdSongIds) {
    const existingEntry = await prisma.playlistSong.findUnique({
      where: {
        playlistId_songId: {
          playlistId: playlist.id,
          songId,
        },
      },
    });

    if (!existingEntry) {
      await prisma.playlistSong.create({
        data: {
          playlistId: playlist.id,
          songId,
        },
      });
    }
  }

  console.log("Successfully added Karan Aujla songs to 'This Is Karan Aujla' playlist!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
