"use client";

import React, { useState, useEffect } from "react";
import { Play, Pause, Heart, Sparkles, PlusCircle } from "lucide-react";
import { usePlayer } from "@/context/PlayerContext";
import { Song, Playlist } from "@/types";
import { formatPlays } from "@/lib/utils";

interface HomeViewProps {
  onSelectPlaylist: (playlistId: string) => void;
  onOpenAddToPlaylist: (songId: string) => void;
}

export default function HomeView({
  onSelectPlaylist,
  onOpenAddToPlaylist,
}: HomeViewProps) {
  const {
    playSong,
    currentSong,
    isPlaying,
    togglePlay,
    toggleLike,
    playlists,
  } = usePlayer();

  const [songs, setSongs] = useState<Song[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [greeting, setGreeting] = useState<string>("Welcome");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  useEffect(() => {
    const fetchSongs = async () => {
      setIsLoading(true);
      try {
        const url =
          selectedCategory === "All"
            ? "/api/songs"
            : `/api/songs?category=${encodeURIComponent(selectedCategory)}`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setSongs(data);
        }
      } catch (err) {
        console.error("Error fetching songs:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSongs();
  }, [selectedCategory]);

  const categories = [
    "All",
    "Bhojpuri",
    "Punjabi",
    "Bollywood",
    "Pop",
    "Lo-Fi",
    "Synthwave",
    "Chill",
    "Electronic",
    "Hip-Hop",
  ];

  return (
    <div className="flex-1 bg-gradient-to-b from-[#202020] via-[#121212] to-[#121212] overflow-y-auto p-6 text-white pb-28">
      {/* Top Greeting */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight">{greeting}</h1>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-[#282828] text-emerald-400 border border-emerald-500/20 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            Tunely Premium
          </span>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-black font-bold text-xs shadow-md">
            U
          </div>
        </div>
      </div>

      {/* Quick Play Grid (Top 6 items) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
        {songs.slice(0, 6).map((song) => {
          const isCurrent = currentSong?.id === song.id;

          return (
            <div
              key={song.id}
              onClick={() => {
                if (isCurrent) {
                  togglePlay();
                } else {
                  playSong(song, songs);
                }
              }}
              className="group flex items-center bg-[#282828]/60 hover:bg-[#282828] rounded overflow-hidden cursor-pointer transition-all duration-200 shadow hover:shadow-lg relative"
            >
              <img
                src={song.coverUrl}
                alt={song.title}
                className="w-16 h-16 object-cover flex-shrink-0"
              />
              <span className="font-bold text-sm px-4 truncate flex-1">
                {song.title}
              </span>
              <button
                className={`w-10 h-10 rounded-full bg-[#1db954] text-black flex items-center justify-center mr-4 shadow-xl transition-all duration-200 transform ${
                  isCurrent && isPlaying
                    ? "opacity-100 scale-100"
                    : "opacity-0 group-hover:opacity-100 group-hover:scale-100 scale-75"
                }`}
              >
                {isCurrent && isPlaying ? (
                  <Pause className="w-5 h-5 fill-current" />
                ) : (
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? "bg-white text-black font-bold"
                : "bg-[#282828] text-white hover:bg-[#333333]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Featured Playlists Section */}
      {playlists.length > 0 && selectedCategory === "All" && (
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold tracking-tight hover:underline cursor-pointer">
              Featured Playlists
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {playlists.map((playlist) => (
              <div
                key={playlist.id}
                onClick={() => onSelectPlaylist(playlist.id)}
                className="group bg-[#181818] hover:bg-[#282828] p-3 rounded-lg cursor-pointer transition-all duration-200 flex flex-col relative"
              >
                <div className="relative aspect-square w-full mb-3 rounded-md overflow-hidden shadow-lg">
                  <img
                    src={
                      playlist.coverUrl ||
                      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80"
                    }
                    alt={playlist.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute right-2 bottom-2 w-11 h-11 rounded-full bg-[#1db954] text-black flex items-center justify-center shadow-xl opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2 transition-all duration-300">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                </div>

                <h3 className="font-bold text-sm truncate mb-1">
                  {playlist.name}
                </h3>
                <p className="text-xs text-[#b3b3b3] line-clamp-2 leading-relaxed">
                  {playlist.description || "Curated Tunely playlist"}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Popular Tracks Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold tracking-tight">
            {selectedCategory === "All"
              ? "Popular Releases & Top Tracks"
              : `${selectedCategory} Tracks`}
          </h2>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-[#181818] p-3 rounded-lg animate-pulse h-60" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {songs.map((song) => {
              const isCurrent = currentSong?.id === song.id;

              return (
                <div
                  key={song.id}
                  className="group bg-[#181818] hover:bg-[#282828] p-3 rounded-lg cursor-pointer transition-all duration-200 flex flex-col relative"
                >
                  <div
                    className="relative aspect-square w-full mb-3 rounded-md overflow-hidden shadow-lg"
                    onClick={() => {
                      if (isCurrent) {
                        togglePlay();
                      } else {
                        playSong(song, songs);
                      }
                    }}
                  >
                    <img
                      src={song.coverUrl}
                      alt={song.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <button
                      className={`absolute right-2 bottom-2 w-11 h-11 rounded-full bg-[#1db954] text-black flex items-center justify-center shadow-xl transition-all duration-300 ${
                        isCurrent && isPlaying
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2"
                      }`}
                    >
                      {isCurrent && isPlaying ? (
                        <Pause className="w-5 h-5 fill-current" />
                      ) : (
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-start justify-between gap-1 mb-1">
                    <h3
                      className={`font-bold text-sm truncate flex-1 ${
                        isCurrent ? "text-[#1db954]" : "text-white"
                      }`}
                      onClick={() => playSong(song, songs)}
                    >
                      {song.title}
                    </h3>

                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLike(song.id);
                        }}
                        title={song.isLiked ? "Unlike" : "Like"}
                        className="text-[#b3b3b3] hover:text-white"
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            song.isLiked ? "fill-[#1db954] text-[#1db954]" : ""
                          }`}
                        />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenAddToPlaylist(song.id);
                        }}
                        title="Add to playlist"
                        className="text-[#b3b3b3] hover:text-white"
                      >
                        <PlusCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-[#b3b3b3] truncate">
                    {song.artist}
                  </p>
                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#282828] text-[11px] text-[#808080]">
                    <span>{song.category}</span>
                    <span>{formatPlays(song.plays)} plays</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
