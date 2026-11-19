import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SONGS = [
  {
    title: "Midnight City Lights",
    artist: "Aura Nova",
    album: "Neon Horizons",
    duration: 372,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    coverUrl: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&auto=format&fit=crop&q=80",
    category: "Synthwave",
    plays: 2450300,
  },
  {
    title: "Sunset Chords",
    artist: "Komorebi",
    album: "Coffee & Rain",
    duration: 423,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    coverUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80",
    category: "Lo-Fi",
    plays: 1890200,
  },
  {
    title: "Golden Hour Bloom",
    artist: "Luna Sol",
    album: "Ethereal Echoes",
    duration: 350,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    coverUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80",
    category: "Pop",
    plays: 3201400,
  },
  {
    title: "Velocity",
    artist: "Cyber Pulse",
    album: "Grid Runner",
    duration: 302,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    coverUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500&auto=format&fit=crop&q=80",
    category: "Electronic",
    plays: 1540100,
  },
  {
    title: "Coffee Shop Rain",
    artist: "Chillhop Society",
    album: "Tokyo Streets",
    duration: 345,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    coverUrl: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=500&auto=format&fit=crop&q=80",
    category: "Lo-Fi",
    plays: 980400,
  },
  {
    title: "Electric Dreams",
    artist: "Echo Drift",
    album: "Starlight Drive",
    duration: 391,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
    coverUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80",
    category: "Synthwave",
    plays: 2110500,
  },
  {
    title: "Deep Focus Flow",
    artist: "Mind Garden",
    album: "Zenith Flow",
    duration: 410,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
    coverUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=500&auto=format&fit=crop&q=80",
    category: "Chill",
    plays: 1420000,
  },
  {
    title: "Urban Rhythm",
    artist: "Metro Collective",
    album: "Concrete Jungle",
    duration: 318,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    coverUrl: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=500&auto=format&fit=crop&q=80",
    category: "Hip-Hop",
    plays: 2890600,
  },
  {
    title: "Stardust Serenade",
    artist: "Cosmic Odyssey",
    album: "Infinite Voyage",
    duration: 442,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
    coverUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500&auto=format&fit=crop&q=80",
    category: "Chill",
    plays: 1104300,
  },
  {
    title: "After Hours Groove",
    artist: "Velvet Lounge",
    album: "Midnight Sessions",
    duration: 367,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
    coverUrl: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=500&auto=format&fit=crop&q=80",
    category: "Pop",
    plays: 1750200,
  },
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

const PLAYLISTS = [
  {
    name: "This Is Karan Aujla",
    description: "The essential tracks and greatest hits by Karan Aujla including Softly, Winning Speech, Tauba Tauba, and more.",
    coverUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&auto=format&fit=crop&q=80",
    songIndices: [10, 11, 12, 13, 14, 15],
  },
  {
    name: "Today's Top Hits",
    description: "The hottest tracks right now across pop, electronic, and synthwave.",
    coverUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80",
    songIndices: [0, 2, 3, 7, 9],
  },
  {
    name: "Lo-Fi Beats to Relax / Study to",
    description: "Peaceful beats, rain sounds and warm piano chords to keep you focused.",
    coverUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80",
    songIndices: [1, 4, 6, 8],
  },
  {
    name: "Synthwave Retro Drive",
    description: "Neon vibes, 80s analog synthesizers, and midnight expressway cruise.",
    coverUrl: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&auto=format&fit=crop&q=80",
    songIndices: [0, 3, 5],
  },
  {
    name: "Deep Focus & Code",
    description: "Atmospheric textures and electronic flow states for deep creative work.",
    coverUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500&auto=format&fit=crop&q=80",
    songIndices: [1, 6, 8, 4],
  },
];

async function main() {
  console.log("Clearing old data...");
  await prisma.likedSong.deleteMany();
  await prisma.playlistSong.deleteMany();
  await prisma.playlist.deleteMany();
  await prisma.song.deleteMany();

  console.log("Seeding songs...");
  const createdSongs = [];
  for (const song of SONGS) {
    const s = await prisma.song.create({ data: song });
    createdSongs.push(s);
  }
  console.log(`Created ${createdSongs.length} songs.`);

  console.log("Seeding playlists...");
  for (const p of PLAYLISTS) {
    const playlist = await prisma.playlist.create({
      data: {
        name: p.name,
        description: p.description,
        coverUrl: p.coverUrl,
      },
    });

    for (const idx of p.songIndices) {
      if (createdSongs[idx]) {
        await prisma.playlistSong.create({
          data: {
            playlistId: playlist.id,
            songId: createdSongs[idx].id,
          },
        });
      }
    }
  }

  console.log("Seeding initial liked songs...");
  // Like the first two songs by default
  await prisma.likedSong.create({
    data: {
      songId: createdSongs[0].id,
    },
  });
  await prisma.likedSong.create({
    data: {
      songId: createdSongs[1].id,
    },
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
