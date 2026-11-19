"use client";

import React from "react";
import { Play, Pause, Clock, Heart } from "lucide-react";
import { usePlayer } from "@/context/PlayerContext";
import { formatTime, formatDate } from "@/lib/utils";

export default function LikedSongsView() {
  const {
    likedSongs,
    playSong,
    currentSong,
    isPlaying,
    togglePlay,
    toggleLike,
  } = usePlayer();

  const isLikedPlaying =
    isPlaying && likedSongs.some((s) => s.id === currentSong?.id);

  const totalDuration = likedSongs.reduce(
    (acc, s) => acc + (s.duration || 0),
    0
  );

  return (
    <div className="flex-1 bg-gradient-to-b from-indigo-900 via-[#121212] to-[#121212] overflow-y-auto text-white pb-28">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-end gap-6 p-8 pb-6">
        <div className="w-52 h-52 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded shadow-2xl flex items-center justify-center flex-shrink-0">
          <Heart className="w-24 h-24 text-white fill-current shadow-lg" />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold uppercase tracking-wider">
            Playlist
          </span>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight">
            Liked Songs
          </h1>
          <div className="flex items-center gap-2 text-xs text-[#b3b3b3] mt-2 font-medium">
            <span className="text-white font-bold">Tunely</span>
            <span>•</span>
            <span>{likedSongs.length} songs</span>
            {totalDuration > 0 && (
              <>
                <span>•</span>
                <span>{Math.floor(totalDuration / 60)} min</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Action Play Button */}
      <div className="flex items-center gap-6 px-8 py-4 bg-black/20 backdrop-blur-sm">
        <button
          onClick={() => {
            if (likedSongs.length === 0) return;
            if (isLikedPlaying) {
              togglePlay();
            } else {
              playSong(likedSongs[0], likedSongs);
            }
          }}
          disabled={likedSongs.length === 0}
          className={`w-14 h-14 rounded-full bg-[#1db954] text-black flex items-center justify-center hover:scale-105 transition-transform shadow-xl ${
            likedSongs.length === 0 ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLikedPlaying ? (
            <Pause className="w-6 h-6 fill-current" />
          ) : (
            <Play className="w-6 h-6 fill-current ml-1" />
          )}
        </button>
      </div>

      {/* Table */}
      <div className="px-8 mt-4">
        {likedSongs.length === 0 ? (
          <div className="py-16 text-center text-[#b3b3b3]">
            <p className="text-lg font-semibold mb-2">Songs you like will appear here</p>
            <p className="text-sm">Save songs by tapping the heart icon on any song.</p>
          </div>
        ) : (
          <table className="w-full text-left text-sm text-[#b3b3b3]">
            <thead className="border-b border-[#282828] text-xs uppercase tracking-wider">
              <tr>
                <th className="py-2.5 w-10 text-center">#</th>
                <th className="py-2.5">Title</th>
                <th className="py-2.5 hidden md:table-cell">Album</th>
                <th className="py-2.5 hidden lg:table-cell">Date added</th>
                <th className="py-2.5 w-16 text-center">
                  <Clock className="w-4 h-4 mx-auto" />
                </th>
                <th className="py-2.5 w-10 text-right"></th>
              </tr>
            </thead>
            <tbody>
              {likedSongs.map((song, index) => {
                const isCurrent = currentSong?.id === song.id;

                return (
                  <tr
                    key={song.id}
                    onClick={() => playSong(song, likedSongs)}
                    className="group hover:bg-[#ffffff]/10 rounded-md cursor-pointer transition-colors"
                  >
                    <td className="py-3 text-center w-10">
                      <span className="group-hover:hidden text-xs">
                        {index + 1}
                      </span>
                      <button className="hidden group-hover:inline-flex items-center justify-center text-white">
                        {isCurrent && isPlaying ? (
                          <Pause className="w-4 h-4 fill-current text-[#1db954]" />
                        ) : (
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        )}
                      </button>
                    </td>

                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={song.coverUrl}
                          alt={song.title}
                          className="w-10 h-10 rounded object-cover flex-shrink-0"
                        />
                        <div className="flex flex-col truncate">
                          <span
                            className={`font-semibold text-sm truncate ${
                              isCurrent ? "text-[#1db954]" : "text-white"
                            }`}
                          >
                            {song.title}
                          </span>
                          <span className="text-xs text-[#b3b3b3] truncate">
                            {song.artist}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 hidden md:table-cell text-xs truncate max-w-[150px]">
                      {song.album}
                    </td>

                    <td className="py-3 hidden lg:table-cell text-xs">
                      {formatDate(song.addedAt)}
                    </td>

                    <td className="py-3 text-center text-xs">
                      {formatTime(song.duration)}
                    </td>

                    <td className="py-3 text-right pr-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLike(song.id);
                        }}
                        className="text-[#1db954] hover:scale-110 transition-transform"
                      >
                        <Heart className="w-4 h-4 fill-current" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
