import os
import subprocess
import sqlite3
import uuid
import datetime
import concurrent.futures

BHOJPURI_TRACKS = [
    {"title": "Lollipop Lagelu", "artist": "Pawan Singh", "album": "Lollipop Lagelu Hits", "filename": "lollipop_lagelu.m4a", "duration": 255, "plays": 480200500, "cover": "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&auto=format&fit=crop&q=80", "search": "ytsearch1:Lollypop Lagelu Pawan Singh official audio"},
    {"title": "Pudina Ae Haseena", "artist": "Pawan Singh, Anupama Yadav", "album": "Pudina Ae Haseena", "filename": "pudina_ae_haseena.m4a", "duration": 220, "plays": 395100200, "cover": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80", "search": "ytsearch1:Pudina Ae Haseena Pawan Singh official audio"},
    {"title": "Chhalakata Hamro Jawaniya", "artist": "Pawan Singh, Priyanka Singh", "album": "Bhojpuri Blockbusters", "filename": "chhalakata_hamro_jawaniya.m4a", "duration": 218, "plays": 560400100, "cover": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80", "search": "ytsearch1:Chhalakata Hamro Jawaniya Pawan Singh Priyanka Singh"},
    {"title": "Nathuniya", "artist": "Khesari Lal Yadav, Priyanka Singh", "album": "Nathuniya Single", "filename": "nathuniya.m4a", "duration": 215, "plays": 320900100, "cover": "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=500&auto=format&fit=crop&q=80", "search": "ytsearch1:Nathuniya Khesari Lal Yadav Priyanka Singh official audio"},
    {"title": "Raja Ji Re", "artist": "Pawan Singh, Shivani Singh", "album": "Raja Ji Re Single", "filename": "raja_ji_re.m4a", "duration": 210, "plays": 280400100, "cover": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=80", "search": "ytsearch1:Raja Ji Re Pawan Singh Shivani Singh official audio"},
    {"title": "Lalki Tikuliya", "artist": "Pawan Singh, Shilpi Raj", "album": "Lalki Tikuliya", "filename": "lalki_tikuliya.m4a", "duration": 204, "plays": 290100300, "cover": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80", "search": "ytsearch1:Lalki Tikuliya Pawan Singh Shilpi Raj official audio"},
    {"title": "Kamariya Bole Lollipop Lagelu", "artist": "Pawan Singh", "album": "Kamariya", "filename": "kamariya_bole.m4a", "duration": 230, "plays": 340500200, "cover": "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&auto=format&fit=crop&q=80", "search": "ytsearch1:Kamariya Bole Lollipop Lagelu Pawan Singh"},
    {"title": "Dhan Dhua Ho Jai", "artist": "Khesari Lal Yadav, Shilpi Raj", "album": "Dhan Dhua", "filename": "dhan_dhua.m4a", "duration": 195, "plays": 260300400, "cover": "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=500&auto=format&fit=crop&q=80", "search": "ytsearch1:Dhan Dhua Ho Jai Khesari Lal Yadav Shilpi Raj"},
    {"title": "Le Le Aayi Coca Cola", "artist": "Khesari Lal Yadav, Shilpi Raj", "album": "Coca Cola", "filename": "coca_cola.m4a", "duration": 225, "plays": 310400500, "cover": "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500&auto=format&fit=crop&q=80", "search": "ytsearch1:Le Le Aayi Coca Cola Khesari Lal Yadav Shilpi Raj"},
    {"title": "Aara Ke Hothlali", "artist": "Pawan Singh", "album": "Aara Ke Hothlali", "filename": "aara_ke_hothlali.m4a", "duration": 185, "plays": 220100200, "cover": "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&auto=format&fit=crop&q=80", "search": "ytsearch1:Aara Ke Hothlali Pawan Singh official audio"},
    {"title": "Hari Hari Odhani", "artist": "Pawan Singh, Anupama Yadav", "album": "Hari Hari Odhani", "filename": "hari_hari_odhani.m4a", "duration": 212, "plays": 410900300, "cover": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80", "search": "ytsearch1:Hari Hari Odhani Pawan Singh Anupama Yadav"},
    {"title": "Piyawa Se Pahile", "artist": "Ritesh Pandey", "album": "Piyawa Se Pahile", "filename": "piyawa_se_pahile.m4a", "duration": 240, "plays": 380400100, "cover": "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=500&auto=format&fit=crop&q=80", "search": "ytsearch1:Piyawa Se Pahile Ritesh Pandey official audio"},
    {"title": "Hello Koun", "artist": "Ritesh Pandey, Sneh Upadhya", "album": "Hello Koun", "filename": "hello_koun.m4a", "duration": 218, "plays": 450100200, "cover": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80", "search": "ytsearch1:Hello Koun Ritesh Pandey Sneh Upadhya"},
    {"title": "Naach Re Patarki", "artist": "Arvind Akela Kallu, Shilpi Raj", "album": "Naach Re Patarki", "filename": "naach_re_patarki.m4a", "duration": 208, "plays": 270300200, "cover": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80", "search": "ytsearch1:Naach Re Patarki Arvind Akela Kallu Shilpi Raj"},
    {"title": "Dhibari Me Rahue Na Tel", "artist": "Pawan Singh", "album": "Dhibari Me", "filename": "dhibari_me.m4a", "duration": 196, "plays": 240100300, "cover": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=80", "search": "ytsearch1:Dhibari Me Rahue Na Tel Pawan Singh"},
    {"title": "Marad Abhi Bacha Ba", "artist": "Khesari Lal Yadav, Priyanka Singh", "album": "Marad Abhi Bacha Ba", "filename": "marad_abhi.m4a", "duration": 215, "plays": 330200100, "cover": "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=500&auto=format&fit=crop&q=80", "search": "ytsearch1:Marad Abhi Bacha Ba Khesari Lal Yadav Priyanka Singh"},
    {"title": "Lahanga Me AC", "artist": "Khesari Lal Yadav, Shilpi Raj", "album": "Lahanga Me AC", "filename": "lahanga_me_ac.m4a", "duration": 202, "plays": 295100400, "cover": "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&auto=format&fit=crop&q=80", "search": "ytsearch1:Lahanga Me AC Khesari Lal Yadav Shilpi Raj"},
    {"title": "Bhatar Ko Bhi Bhul Jaogi", "artist": "Pawan Singh", "album": "Bhatar Ko", "filename": "bhatar_ko.m4a", "duration": 190, "plays": 210400200, "cover": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80", "search": "ytsearch1:Bhatar Ko Bhi Bhul Jaogi Pawan Singh"},
    {"title": "Murugiya Tasali Me", "artist": "Arvind Akela Kallu", "album": "Murugiya Tasali Me", "filename": "murugiya_tasali.m4a", "duration": 188, "plays": 180200100, "cover": "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500&auto=format&fit=crop&q=80", "search": "ytsearch1:Murugiya Tasali Me Arvind Akela Kallu"},
    {"title": "Raja Ji Ke Dilwa", "artist": "Khesari Lal Yadav", "album": "Raja Ji Ke Dilwa", "filename": "raja_ji_ke_dilwa.m4a", "duration": 222, "plays": 250300100, "cover": "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=500&auto=format&fit=crop&q=80", "search": "ytsearch1:Raja Ji Ke Dilwa Khesari Lal Yadav"},
]

PUNJABI_TRACKS = [
    {"title": "Softly", "artist": "Karan Aujla, Ikky", "album": "Making Memories", "filename": "softly.m4a", "duration": 156, "plays": 89400200, "cover": "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&auto=format&fit=crop&q=80", "search": "ytsearch1:Karan Aujla Softly official audio"},
    {"title": "Tauba Tauba", "artist": "Karan Aujla", "album": "Bad Newz", "filename": "tauba_tauba.m4a", "duration": 208, "plays": 120500300, "cover": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80", "search": "ytsearch1:Tauba Tauba Karan Aujla Bad Newz official audio"},
    {"title": "Winning Speech", "artist": "Karan Aujla, MXRCI", "album": "Street Dreams", "filename": "winning_speech.m4a", "duration": 198, "plays": 64200100, "cover": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=80", "search": "ytsearch1:Winning Speech Karan Aujla official audio"},
    {"title": "52 Bars", "artist": "Karan Aujla, Ikky", "album": "Four You", "filename": "52_bars.m4a", "duration": 202, "plays": 78100900, "cover": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80", "search": "ytsearch1:52 Bars Karan Aujla official audio"},
    {"title": "Admirin' You", "artist": "Karan Aujla, Preston Pablo, Ikky", "album": "Making Memories", "filename": "admirin_you.m4a", "duration": 214, "plays": 51200400, "cover": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80", "search": "ytsearch1:Admirin You Karan Aujla official audio"},
    {"title": "Antidote", "artist": "Karan Aujla", "album": "Four You", "filename": "antidote.m4a", "duration": 195, "plays": 580100200, "cover": "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500&auto=format&fit=crop&q=80", "search": "ytsearch1:Antidote Karan Aujla official audio"},
    {"title": "295", "artist": "Sidhu Moose Wala", "album": "Moosetape", "filename": "295_sidhu.m4a", "duration": 270, "plays": 740500800, "cover": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=80", "search": "ytsearch1:295 Sidhu Moose Wala official audio"},
    {"title": "Excuses", "artist": "AP Dhillon, Gurinder Gill", "album": "Excuses", "filename": "excuses_ap.m4a", "duration": 176, "plays": 610200400, "cover": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80", "search": "ytsearch1:Excuses AP Dhillon Gurinder Gill official audio"},
    {"title": "Brown Munde", "artist": "AP Dhillon, Gurinder Gill, Shinda Kahlon", "album": "Brown Munde", "filename": "brown_munde.m4a", "duration": 268, "plays": 820100900, "cover": "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=500&auto=format&fit=crop&q=80", "search": "ytsearch1:Brown Munde AP Dhillon official audio"},
    {"title": "Born to Shine", "artist": "Diljit Dosanjh", "album": "G.O.A.T.", "filename": "born_to_shine.m4a", "duration": 213, "plays": 450300200, "cover": "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&auto=format&fit=crop&q=80", "search": "ytsearch1:Born to Shine Diljit Dosanjh official audio"},
    {"title": "The Last Ride", "artist": "Sidhu Moose Wala", "album": "The Last Ride", "filename": "last_ride_sidhu.m4a", "duration": 260, "plays": 510400100, "cover": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80", "search": "ytsearch1:The Last Ride Sidhu Moose Wala official audio"},
    {"title": "So High", "artist": "Sidhu Moose Wala", "album": "So High", "filename": "so_high_sidhu.m4a", "duration": 235, "plays": 620500200, "cover": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=80", "search": "ytsearch1:So High Sidhu Moose Wala official audio"},
    {"title": "Same Beef", "artist": "Sidhu Moose Wala, Bohemia", "album": "Same Beef", "filename": "same_beef_sidhu.m4a", "duration": 272, "plays": 430100200, "cover": "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=500&auto=format&fit=crop&q=80", "search": "ytsearch1:Same Beef Sidhu Moose Wala Bohemia official audio"},
    {"title": "With You", "artist": "AP Dhillon", "album": "With You", "filename": "with_you_ap.m4a", "duration": 154, "plays": 490200100, "cover": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80", "search": "ytsearch1:With You AP Dhillon official audio"},
    {"title": "Lover", "artist": "Diljit Dosanjh", "album": "MoonChild Era", "filename": "lover_diljit.m4a", "duration": 192, "plays": 520400300, "cover": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80", "search": "ytsearch1:Lover Diljit Dosanjh official audio"},
    {"title": "Lemonade", "artist": "Diljit Dosanjh", "album": "Drive", "filename": "lemonade_diljit.m4a", "duration": 188, "plays": 390100200, "cover": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80", "search": "ytsearch1:Lemonade Diljit Dosanjh official audio"},
    {"title": "Cheques", "artist": "Shubh", "album": "Still Rollin", "filename": "cheques_shubh.m4a", "duration": 183, "plays": 680200400, "cover": "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500&auto=format&fit=crop&q=80", "search": "ytsearch1:Cheques Shubh official audio"},
    {"title": "Baller", "artist": "Shubh", "album": "Baller", "filename": "baller_shubh.m4a", "duration": 148, "plays": 560100200, "cover": "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=500&auto=format&fit=crop&q=80", "search": "ytsearch1:Baller Shubh official audio"},
    {"title": "No Love", "artist": "Shubh", "album": "No Love", "filename": "no_love_shubh.m4a", "duration": 170, "plays": 480300100, "cover": "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=500&auto=format&fit=crop&q=80", "search": "ytsearch1:No Love Shubh official audio"},
    {"title": "Dope Shope", "artist": "Yo Yo Honey Singh, Deep Money", "album": "International Villager", "filename": "dope_shope.m4a", "duration": 190, "plays": 710900200, "cover": "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&auto=format&fit=crop&q=80", "search": "ytsearch1:Dope Shope Yo Yo Honey Singh Deep Money official audio"},
]

BOLLYWOOD_TRACKS = [
    {"title": "Kesariya", "artist": "Arijit Singh, Pritam", "album": "Brahmāstra", "filename": "kesariya.m4a", "duration": 268, "plays": 950800100, "cover": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80", "search": "ytsearch1:Kesariya Brahmastra Arijit Singh official audio"},
    {"title": "Chaleya", "artist": "Arijit Singh, Shilpa Rao, Anirudh", "album": "Jawan", "filename": "chaleya.m4a", "duration": 200, "plays": 710200300, "cover": "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&auto=format&fit=crop&q=80", "search": "ytsearch1:Chaleya Jawan Arijit Singh Shilpa Rao official audio"},
    {"title": "Apna Bana Le", "artist": "Arijit Singh, Sachin-Jigar", "album": "Bhediya", "filename": "apna_bana_le.m4a", "duration": 261, "plays": 630100200, "cover": "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500&auto=format&fit=crop&q=80", "search": "ytsearch1:Apna Bana Le Bhediya Arijit Singh official audio"},
    {"title": "Pehle Bhi Main", "artist": "Vishal Mishra, Raj Shekhar", "album": "Animal", "filename": "pehle_bhi_main.m4a", "duration": 250, "plays": 580900400, "cover": "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=500&auto=format&fit=crop&q=80", "search": "ytsearch1:Pehle Bhi Main Animal Vishal Mishra official audio"},
    {"title": "Tum Hi Ho", "artist": "Arijit Singh, Mithoon", "album": "Aashiqui 2", "filename": "tum_hi_ho.m4a", "duration": 262, "plays": 890400200, "cover": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80", "search": "ytsearch1:Tum Hi Ho Aashiqui 2 Arijit Singh official audio"},
    {"title": "Satranga", "artist": "Arijit Singh, Shreyas Puranik", "album": "Animal", "filename": "satranga.m4a", "duration": 271, "plays": 620100300, "cover": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=80", "search": "ytsearch1:Satranga Animal Arijit Singh official audio"},
    {"title": "O Maahi", "artist": "Arijit Singh, Pritam", "album": "Dunki", "filename": "o_maahi.m4a", "duration": 233, "plays": 540300100, "cover": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80", "search": "ytsearch1:O Maahi Dunki Arijit Singh official audio"},
    {"title": "Jhoome Jo Pathaan", "artist": "Arijit Singh, Sukriti Kakar, Vishal-Shekhar", "album": "Pathaan", "filename": "jhoome_jo_pathaan.m4a", "duration": 208, "plays": 780400200, "cover": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80", "search": "ytsearch1:Jhoome Jo Pathaan official audio"},
    {"title": "Besharam Rang", "artist": "Shilpa Rao, Caralisa Monteiro", "album": "Pathaan", "filename": "besharam_rang.m4a", "duration": 258, "plays": 690200100, "cover": "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=500&auto=format&fit=crop&q=80", "search": "ytsearch1:Besharam Rang Pathaan official audio"},
    {"title": "Raataan Lambiyan", "artist": "Jubin Nautiyal, Asees Kaur", "album": "Shershaah", "filename": "raataan_lambiyan.m4a", "duration": 230, "plays": 910200300, "cover": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80", "search": "ytsearch1:Raataan Lambiyan Shershaah official audio"},
    {"title": "Ranjha", "artist": "B Praak, Jasleen Royal", "album": "Shershaah", "filename": "ranjha.m4a", "duration": 228, "plays": 740100200, "cover": "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&auto=format&fit=crop&q=80", "search": "ytsearch1:Ranjha Shershaah B Praak official audio"},
    {"title": "Tujhe Kitna Chahne Lage", "artist": "Arijit Singh, Mithoon", "album": "Kabir Singh", "filename": "tujhe_kitna.m4a", "duration": 284, "plays": 830400500, "cover": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80", "search": "ytsearch1:Tujhe Kitna Chahne Lage Kabir Singh official audio"},
    {"title": "Bekhayali", "artist": "Sachet Tandon", "album": "Kabir Singh", "filename": "bekhayali.m4a", "duration": 371, "plays": 790300100, "cover": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=80", "search": "ytsearch1:Bekhayali Kabir Singh Sachet Tandon official audio"},
    {"title": "Ghungroo", "artist": "Arijit Singh, Shilpa Rao", "album": "War", "filename": "ghungroo.m4a", "duration": 302, "plays": 650200400, "cover": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80", "search": "ytsearch1:Ghungroo War Arijit Singh Shilpa Rao official audio"},
    {"title": "Dil Diyan Gallan", "artist": "Atif Aslam, Vishal-Shekhar", "album": "Tiger Zinda Hai", "filename": "dil_diyan_gallan.m4a", "duration": 320, "plays": 860100200, "cover": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80", "search": "ytsearch1:Dil Diyan Gallan Atif Aslam official audio"},
    {"title": "Kal Ho Naa Ho", "artist": "Sonu Nigam, Shankar-Ehsaan-Loy", "album": "Kal Ho Naa Ho", "filename": "kal_ho_naa_ho.m4a", "duration": 321, "plays": 940500100, "cover": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80", "search": "ytsearch1:Kal Ho Naa Ho Sonu Nigam official audio"},
    {"title": "Channa Mereya", "artist": "Arijit Singh, Pritam", "album": "Ae Dil Hai Mushkil", "filename": "channa_mereya.m4a", "duration": 289, "plays": 870200300, "cover": "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=500&auto=format&fit=crop&q=80", "search": "ytsearch1:Channa Mereya Arijit Singh official audio"},
    {"title": "Galti Se Mistake", "artist": "Arijit Singh, Amit Mishra", "album": "Jagga Jasoos", "filename": "galti_se_mistake.m4a", "duration": 203, "plays": 510400200, "cover": "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=500&auto=format&fit=crop&q=80", "search": "ytsearch1:Galti Se Mistake Arijit Singh official audio"},
    {"title": "Tere Vaaste", "artist": "Varun Jain, Sachin-Jigar, Shadab Faridi", "album": "Zara Hatke Zara Bachke", "filename": "tere_vaaste.m4a", "duration": 189, "plays": 620300400, "cover": "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500&auto=format&fit=crop&q=80", "search": "ytsearch1:Tere Vaaste Zara Hatke Zara Bachke official audio"},
    {"title": "Tum Se", "artist": "Sachin-Jigar, Raghav Chaitanya", "album": "Teri Baaton Mein Aisa Uljha Jiya", "filename": "tum_se.m4a", "duration": 264, "plays": 480100200, "cover": "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&auto=format&fit=crop&q=80", "search": "ytsearch1:Tum Se Sachin Jigar Raghav Chaitanya official audio"},
]

ALL_ITEMS = []
for t in BHOJPURI_TRACKS:
    t["category"] = "Bhojpuri"
    ALL_ITEMS.append(t)
for t in PUNJABI_TRACKS:
    t["category"] = "Punjabi"
    ALL_ITEMS.append(t)
for t in BOLLYWOOD_TRACKS:
    t["category"] = "Bollywood"
    ALL_ITEMS.append(t)

uploads_dir = os.path.join(os.getcwd(), "public", "uploads")
os.makedirs(uploads_dir, exist_ok=True)

def download_one(t):
    dest = os.path.join(uploads_dir, t["filename"])
    if os.path.exists(dest) and os.path.getsize(dest) > 100000:
        return t["title"], "cached"
    cmd = [
        "python", "-m", "yt_dlp",
        t["search"],
        "-f", "ba[ext=m4a]/ba",
        "-o", dest,
        "--no-playlist",
        "--quiet",
        "--no-warnings"
    ]
    res = subprocess.run(cmd)
    return t["title"], res.returncode

print(f"Beginning parallel download of {len(ALL_ITEMS)} songs across Bhojpuri, Punjabi, and Bollywood...")

with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
    futures = {executor.submit(download_one, t): t for t in ALL_ITEMS}
    for future in concurrent.futures.as_completed(futures):
        t = futures[future]
        try:
            title, status = future.result()
            print(f"[{t['category']}] {title} -> {status}")
        except Exception as e:
            print(f"[{t['category']}] {t['title']} error: {e}")

print("All downloads finished. Syncing SQLite database...")

conn = sqlite3.connect("prisma/dev.db")
c = conn.cursor()

now = datetime.datetime.now(datetime.timezone.utc).isoformat()

for t in ALL_ITEMS:
    audio_url = f"/uploads/{t['filename']}"
    c.execute("SELECT id FROM Song WHERE title = ? AND category = ?", (t["title"], t["category"]))
    row = c.fetchone()
    if row:
        c.execute("""
            UPDATE Song 
            SET audioUrl = ?, duration = ?, coverUrl = ?, artist = ?, album = ?, plays = ?
            WHERE id = ?
        """, (audio_url, t["duration"], t["cover"], t["artist"], t["album"], t["plays"], row[0]))
    else:
        song_id = f"song_{uuid.uuid4().hex[:12]}"
        c.execute("""
            INSERT INTO Song (id, title, artist, album, duration, audioUrl, coverUrl, category, plays, createdAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (song_id, t["title"], t["artist"], t["album"], t["duration"], audio_url, t["cover"], t["category"], t["plays"], now))

# Update playlists to include all 20 in each
PLAYLIST_MAP = [
    ("Bhojpuri Dhamaka & Pawan Singh", "Bhojpuri", BHOJPURI_TRACKS, "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&auto=format&fit=crop&q=80", "Top 20 Bhojpuri Chartbusters starring Pawan Singh, Khesari Lal Yadav, Arvind Akela Kallu & Shilpi Raj."),
    ("Punjabi Viral & Legends", "Punjabi", PUNJABI_TRACKS, "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=80", "Top 20 most listened Punjabi anthems by Karan Aujla, Sidhu Moose Wala, AP Dhillon, Diljit Dosanjh & Shubh."),
    ("Bollywood Trending & Romance", "Bollywood", BOLLYWOOD_TRACKS, "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80", "Top 20 Bollywood blockbuster soundtracks from Animal, Jawan, Brahmāstra, Kabir Singh, and Pathaan."),
]

for pl_name, cat, track_list, cover_url, desc in PLAYLIST_MAP:
    c.execute("SELECT id FROM Playlist WHERE name = ?", (pl_name,))
    row = c.fetchone()
    if row:
        pl_id = row[0]
        c.execute("UPDATE Playlist SET description = ?, coverUrl = ?, updatedAt = ? WHERE id = ?", (desc, cover_url, now, pl_id))
    else:
        pl_id = f"pl_{uuid.uuid4().hex[:12]}"
        c.execute("""
            INSERT INTO Playlist (id, name, description, coverUrl, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (pl_id, pl_name, desc, cover_url, now, now))

    # Add all 20 songs to this playlist
    for t in track_list:
        c.execute("SELECT id FROM Song WHERE title = ? AND category = ?", (t["title"], cat))
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

print("Successfully seeded 20 songs in Bhojpuri, Punjabi, and Bollywood! Total catalog updated.")
