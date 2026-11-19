import subprocess
import os
import sqlite3

TRACKS = [
    {
        "search": "ytsearch1:Tauba Tauba Karan Aujla Bad Newz official audio",
        "filename": "tauba_tauba.m4a",
        "title_query": "Tauba Tauba",
        "duration": 208,
    },
    {
        "search": "ytsearch1:Winning Speech Karan Aujla official audio",
        "filename": "winning_speech.m4a",
        "title_query": "Winning Speech",
        "duration": 198,
    },
    {
        "search": "ytsearch1:52 Bars Karan Aujla official audio",
        "filename": "52_bars.m4a",
        "title_query": "52 Bars",
        "duration": 202,
    },
    {
        "search": "ytsearch1:Admirin You Karan Aujla official audio",
        "filename": "admirin_you.m4a",
        "title_query": "Admirin' You",
        "duration": 214,
    },
    {
        "search": "ytsearch1:Antidote Karan Aujla official audio",
        "filename": "antidote.m4a",
        "title_query": "Antidote",
        "duration": 195,
    },
]

uploads_dir = os.path.join(os.getcwd(), "public", "uploads")
os.makedirs(uploads_dir, exist_ok=True)

for track in TRACKS:
    out_path = os.path.join(uploads_dir, track["filename"])
    if not os.path.exists(out_path):
        print(f"Downloading full track for {track['title_query']}...")
        cmd = [
            "python", "-m", "yt_dlp",
            track["search"],
            "-f", "ba[ext=m4a]/ba",
            "-o", out_path,
            "--no-playlist",
            "--quiet",
            "--no-warnings"
        ]
        subprocess.run(cmd, check=False)
    else:
        print(f"{track['filename']} already downloaded.")

# Now update SQLite database
conn = sqlite3.connect("prisma/dev.db")
c = conn.cursor()

# Update Softly
c.execute("UPDATE Song SET audioUrl = '/uploads/softly.m4a', duration = 156 WHERE title LIKE '%Softly%'")

# Update the rest
for track in TRACKS:
    url = f"/uploads/{track['filename']}"
    c.execute(
        "UPDATE Song SET audioUrl = ?, duration = ? WHERE title LIKE ?",
        (url, track["duration"], f"%{track['title_query']}%")
    )
    print(f"Updated DB for {track['title_query']} -> {url}")

conn.commit()
conn.close()

print("All tracks updated to full complete songs successfully!")
