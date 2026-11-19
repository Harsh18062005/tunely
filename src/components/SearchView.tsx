"use client";

import React, { useState, useEffect } from "react";
import { Search as SearchIcon, X, Play, Pause, Heart, PlusCircle, Music } from "lucide-react";
import { usePlayer } from "@/context/PlayerContext";
import { Song } from "@/types";
import { formatTime } from "@/lib/utils";

interface SearchViewProps {
  onOpenAddToPlaylist: (songId: string) => void;
}

const GENRE_CARDS = [
  { name: "Bhojpuri", color: "from-red-600 to-amber-700" },
  { name: "Bollywood", color: "from-pink-600 to-rose-900" },
  { name: "Punjabi", color: "from-orange-600 to-amber-800" },
  { name: "Lo-Fi", color: "from-amber-600 to-orange-800" },
  { name: "Pop", color: "from-blue-600 to-indigo-800" },
  { name: "Synthwave", color: "from-fuchsia-600 to-purple-900" },
  { name: "Chill", color: "from-emerald-600 to-teal-800" },
  { name: "Electronic", color: "from-rose-600 to-red-900" },
  { name: "Hip-Hop", color: "from-amber-700 to-yellow-900" },
  { name: "Acoustic", color: "from-cyan-600 to-blue-800" },
  { name: "Focus & Code", color: "from-violet-600 to-purple-950" },
];

export default function SearchView({ onOpenAddToPlaylist }: SearchViewProps) {
  const { playSong, currentSong, isPlaying, togglePlay, toggleLike } = usePlayer();
  const [query, setQuery] = useState<string>("");
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchSearch = async () => {
      setIsLoading(true);
      try {
        const url = query.trim()
          ? `/api/songs?q=${encodeURIComponent(query.trim())}`
          : "/api/songs";
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setSongs(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(fetchSearch, 200);
    return () => clearTimeout(timer);
  }, [query]);

  const topResult = songs.length > 0 ? songs[0] : null;

  return (
    <div className="flex-1 bg-[#121212] overflow-y-auto p-6 text-white pb-28">
      {/* Search Input Box */}
      <div className="max-w-md relative mb-8">
        <SearchIcon className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#b3b3b3]" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What do you want to play?"
          className="w-full bg-[#242424] hover:bg-[#2a2a2a] focus:bg-[#2a2a2a] text-white placeholder-[#757575] rounded-full pl-11 pr-10 py-3 text-sm font-medium border border-transparent focus:border-white/20 focus:outline-none transition-all shadow-inner"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#b3b3b3] hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Query Search Results View */}
      {query.trim() ? (
        <div>
          {isLoading ? (
            <p className="text-[#b3b3b3]">Searching tracks...</p>
          ) : songs.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="text-xl font-bold mb-2">No results found for &quot;{query}&quot;</h3>
              <p className="text-sm text-[#b3b3b3]">
                Please check your spelling or try searching for an artist, album, or genre.
              </p>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-6 mb-8">
              {/* Top Result Card */}
              {topResult && (
                <div className="lg:w-2/5">
                  <h2 className="text-2xl font-bold mb-4">Top result</h2>
                  <div
                    onClick={() => playSong(topResult, songs)}
                    className="group bg-[#181818] hover:bg-[#282828] p-5 rounded-lg cursor-pointer transition-all relative flex flex-col justify-between h-60 shadow-lg"
                  >
                    <div>
                      <img
                        src={topResult.coverUrl}
                        alt={topResult.title}
                        className="w-24 h-24 rounded-md object-cover mb-4 shadow-md"
                      />
                      <h3 className="text-2xl font-bold truncate mb-1">
                        {topResult.title}
                      </h3>
                      <p className="text-sm text-[#b3b3b3] truncate">
                        {topResult.artist} • <span className="text-white font-medium bg-[#282828] px-2 py-0.5 rounded-full text-xs">Song</span>
                      </p>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (currentSong?.id === topResult.id) {
                          togglePlay();
                        } else {
                          playSong(topResult, songs);
                        }
                      }}
                      className="absolute right-6 bottom-6 w-12 h-12 rounded-full bg-[#1db954] text-black flex items-center justify-center shadow-xl opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-200"
                    >
                      {currentSong?.id === topResult.id && isPlaying ? (
                        <Pause className="w-6 h-6 fill-current" />
                      ) : (
                        <Play className="w-6 h-6 fill-current ml-0.5" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Matching Songs List */}
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-4">Songs</h2>
                <div className="flex flex-col gap-1">
                  {songs.slice(0, 5).map((song) => {
                    const isCurrent = currentSong?.id === song.id;

                    return (
                      <div
                        key={song.id}
                        onClick={() => playSong(song, songs)}
                        className={`group flex items-center justify-between p-2 rounded-md hover:bg-[#282828] transition-colors cursor-pointer ${
                          isCurrent ? "bg-[#282828]/50" : ""
                        }`}
                      >
                        <div className="flex items-center gap-3 truncate flex-1 min-w-0">
                          <div className="relative w-11 h-11 flex-shrink-0 rounded overflow-hidden">
                            <img
                              src={song.coverUrl}
                              alt={song.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              {isCurrent && isPlaying ? (
                                <Pause className="w-4 h-4 fill-white text-white" />
                              ) : (
                                <Play className="w-4 h-4 fill-white text-white ml-0.5" />
                              )}
                            </div>
                          </div>

                          <div className="truncate flex-1">
                            <p
                              className={`text-sm font-semibold truncate ${
                                isCurrent ? "text-[#1db954]" : "text-white"
                              }`}
                            >
                              {song.title}
                            </p>
                            <p className="text-xs text-[#b3b3b3] truncate">
                              {song.artist}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-[#b3b3b3] ml-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleLike(song.id);
                            }}
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
                            className="text-[#b3b3b3] hover:text-white"
                          >
                            <PlusCircle className="w-4 h-4" />
                          </button>

                          <span>{formatTime(song.duration)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Browse All Categories Grid */
        <div>
          <h2 className="text-2xl font-bold mb-4">Browse all</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
            {GENRE_CARDS.map((genre) => (
              <div
                key={genre.name}
                onClick={() => setQuery(genre.name)}
                className={`h-40 rounded-lg p-4 font-bold text-xl cursor-pointer bg-gradient-to-br ${genre.color} shadow-lg hover:scale-[1.02] transition-transform duration-200 relative overflow-hidden flex flex-col justify-between`}
              >
                <span>{genre.name}</span>
                <div className="self-end opacity-20">
                  <Music className="w-16 h-16 rotate-12" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
