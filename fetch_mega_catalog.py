import os
import subprocess
import sqlite3
import uuid
import datetime

NEW_TRACKS = [
    # Bhojpuri & Pawan Singh
    {
        "search": "ytsearch1:Lollypop Lagelu Pawan Singh official audio",
        "filename": "lollipop_lagelu.m4a",
        "title": "Lollipop Lagelu",
        "artist": "Pawan Singh",
        "album": "Lollipop Lagelu Hits",
        "category": "Bhojpuri",
        "coverUrl": "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&auto=format&fit=crop&q=80",
        "duration": 255,
        "plays": 480200500,
    },
    {
        "search": "ytsearch1:Pudina Ae Haseena Pawan Singh official audio",
        "filename": "pudina_ae_haseena.m4a",
        "title": "Pudina Ae Haseena",
        "artist": "Pawan Singh, Anupama Yadav",
        "album": "Pudina Ae Haseena",
        "category": "Bhojpuri",
        "coverUrl": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80",
        "duration": 220,
        "plays": 395100200,
    },
    {
        "search": "ytsearch1:Chhalakata Hamro Jawaniya Pawan Singh Priyanka Singh",
        "filename": "chhalakata_hamro_jawaniya.m4a",
        "title": "Chhalakata Hamro Jawaniya",
        "artist": "Pawan Singh, Priyanka Singh",
        "album": "Bhojpuri Blockbusters",
        "category": "Bhojpuri",
        "coverUrl": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80",
        "duration": 218,
        "plays": 560400100,
    },
    {
        "search": "ytsearch1:Nathuniya Khesari Lal Yadav Priyanka Singh official audio",
        "filename": "nathuniya.m4a",
        "title": "Nathuniya",
        "artist": "Khesari Lal Yadav, Priyanka Singh",
        "album": "Nathuniya Single",
        "category": "Bhojpuri",
        "coverUrl": "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=500&auto=format&fit=crop&q=80",
        "duration": 215,
        "plays": 320900100,
    },

    # Punjabi Most Listened
    {
        "search": "ytsearch1:295 Sidhu Moose Wala official audio",
        "filename": "295_sidhu.m4a",
        "title": "295",
        "artist": "Sidhu Moose Wala",
        "album": "Moosetape",
        "category": "Punjabi",
        "coverUrl": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=80",
        "duration": 270,
        "plays": 740500800,
    },
    {
        "search": "ytsearch1:Excuses AP Dhillon Gurinder Gill official audio",
        "filename": "excuses_ap.m4a",
        "title": "Excuses",
        "artist": "AP Dhillon, Gurinder Gill",
        "album": "Excuses",
        "category": "Punjabi",
        "coverUrl": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80",
        "duration": 176,
        "plays": 610200400,
    },
    {
        "search": "ytsearch1:Brown Munde AP Dhillon official audio",
        "filename": "brown_munde.m4a",
        "title": "Brown Munde",
        "artist": "AP Dhillon, Gurinder Gill, Shinda Kahlon",
        "album": "Brown Munde",
        "category": "Punjabi",
        "coverUrl": "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=500&auto=format&fit=crop&q=80",
        "duration": 268,
        "plays": 820100900,
    },
    {
        "search": "ytsearch1:Born to Shine Diljit Dosanjh official audio",
        "filename": "born_to_shine.m4a",
        "title": "Born to Shine",
        "artist": "Diljit Dosanjh",
        "album": "G.O.A.T.",
        "category": "Punjabi",
        "coverUrl": "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&auto=format&fit=crop&q=80",
        "duration": 213,
        "plays": 450300200,
    },

    # Bollywood Most Trending
    {
        "search": "ytsearch1:Kesariya Brahmastra Arijit Singh official audio",
        "filename": "kesariya.m4a",
        "title": "Kesariya",
        "artist": "Arijit Singh, Pritam",
        "album": "Brahmāstra",
        "category": "Bollywood",
        "coverUrl": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80",
        "duration": 268,
        "plays": 950800100,
    },
    {
        "search": "ytsearch1:Chaleya Jawan Arijit Singh Shilpa Rao official audio",
        "filename": "chaleya.m4a",
        "title": "Chaleya",
        "artist": "Arijit Singh, Shilpa Rao, Anirudh",
        "album": "Jawan",
        "category": "Bollywood",
        "coverUrl": "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&auto=format&fit=crop&q=80",
        "duration": 200,
        "plays": 710200300,
    },
    {
        "search": "ytsearch1:Apna Bana Le Bhediya Arijit Singh official audio",
        "filename": "apna_bana_le.m4a",
        "title": "Apna Bana Le",
        "artist": "Arijit Singh, Sachin-Jigar",
        "album": "Bhediya",
        "category": "Bollywood",
        "coverUrl": "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500&auto=format&fit=crop&q=80",
        "duration": 261,
        "plays": 630100200,
    },
    {
        "search": "ytsearch1:Pehle Bhi Main Animal Vishal Mishra official audio",
        "filename": "pehle_bhi_main.m4a",
        "title": "Pehle Bhi Main",
        "artist": "Vishal Mishra, Raj Shekhar",
        "album": "Animal",
        "category": "Bollywood",
        "coverUrl": "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=500&auto=format&fit=crop&q=80",
        "duration": 250,
        "plays": 580900400,
    },
]

uploads_dir = os.path.join(os.getcwd(), "public", "uploads")
os.makedirs(uploads_dir, exist_ok=True)

print("Starting audio downloads for Bhojpuri, Punjabi, and Bollywood catalog...")

for t in NEW_TRACKS:
    dest = os.path.join(uploads_dir, t["filename"])
    if not os.path.exists(dest):
        print(f"Downloading: {t['title']} by {t['artist']}...")
        cmd = [
            "python", "-m", "yt_dlp",
            t["search"],
            "-f", "ba[ext=m4a]/ba",
            "-o", dest,
            "--no-playlist",
            "--quiet",
            "--no-warnings"
        ]
        subprocess.run(cmd, check=False)
    else:
        print(f"Already downloaded: {t['title']}")

print("All audio files ready! Inserting into SQLite database...")

conn = sqlite3.connect("prisma/dev.db")
c = conn.cursor()

created_song_map = {}

for t in NEW_TRACKS:
    audio_url = f"/uploads/{t['filename']}"
    c.execute("SELECT id FROM Song WHERE title = ? AND artist = ?", (t["title"], t["artist"]))
    row = c.fetchone()
    if row:
        song_id = row[0]
        c.execute("""
            UPDATE Song 
            SET audioUrl = ?, duration = ?, coverUrl = ?, category = ?, album = ?, plays = ?
            WHERE id = ?
        """, (audio_url, t["duration"], t["coverUrl"], t["category"], t["album"], t["plays"], song_id))
    else:
        song_id = f"song_{uuid.uuid4().hex[:12]}"
        now = datetime.datetime.now(datetime.timezone.utc).isoformat()
        c.execute("""
            INSERT INTO Song (id, title, artist, album, duration, audioUrl, coverUrl, category, plays, createdAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (song_id, t["title"], t["artist"], t["album"], t["duration"], audio_url, t["coverUrl"], t["category"], t["plays"], now))
    created_song_map[t["title"]] = song_id

# Playlists Definitions
PLAYLISTS_TO_CREATE = [
    {
        "name": "Bhojpuri Dhamaka & Pawan Singh",
        "description": "High energy Bhojpuri chartbusters starring Pawan Singh, Khesari Lal Yadav, and top viral anthems.",
        "coverUrl": "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&auto=format&fit=crop&q=80",
        "titles": ["Lollipop Lagelu", "Pudina Ae Haseena", "Chhalakata Hamro Jawaniya", "Nathuniya"],
    },
    {
        "name": "Punjabi Viral & Legends",
        "description": "The most streamed Punjabi anthems by Sidhu Moose Wala, AP Dhillon, Diljit Dosanjh, and Karan Aujla.",
        "coverUrl": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=80",
        "titles": ["295", "Excuses", "Brown Munde", "Born to Shine", "Softly", "Tauba Tauba", "Winning Speech"],
    },
    {
        "name": "Bollywood Trending & Romance",
        "description": "India's biggest blockbuster soundtracks from Brahmastra, Jawan, Bhediya, and Animal.",
        "coverUrl": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80",
        "titles": ["Kesariya", "Chaleya", "Apna Bana Le", "Pehle Bhi Main"],
    },
]

for pl in PLAYLISTS_TO_CREATE:
    c.execute("SELECT id FROM Playlist WHERE name = ?", (pl["name"],))
    row = c.fetchone()
    now = datetime.datetime.now(datetime.timezone.utc).isoformat()
    if row:
        pl_id = row[0]
        c.execute("UPDATE Playlist SET description = ?, coverUrl = ?, updatedAt = ? WHERE id = ?", (pl["description"], pl["coverUrl"], now, pl_id))
    else:
        pl_id = f"pl_{uuid.uuid4().hex[:12]}"
        c.execute("""
            INSERT INTO Playlist (id, name, description, coverUrl, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (pl_id, pl["name"], pl["description"], pl["coverUrl"], now, now))
    
    # Link songs
    for title in pl["titles"]:
        c.execute("SELECT id FROM Song WHERE title LIKE ?", (f"%{title}%",))
        s_row = c.fetchone()
        if s_row:
            s_id = s_row[0]
            ps_id = f"ps_{uuid.uuid4().hex[:12]}"
            c.execute("""
                INSERT OR IGNORE INTO PlaylistSong (id, playlistId, songId, addedAt)
                VALUES (?, ?, ?, ?)
            """, (ps_id, pl_id, s_id, now))

conn.commit()
conn.close()

print("Mega catalog seeded and playlists created successfully!")
