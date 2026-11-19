"use client";

import React, { useState, useEffect } from "react";
import {
  Play,
  Pause,
  Clock,
  Heart,
  Trash2,
  Plus,
  Music,
  Check,
} from "lucide-react";
import { usePlayer } from "@/context/PlayerContext";
import { Playlist, Song } from "@/types";
import { formatTime, formatDate } from "@/lib/utils";

interface PlaylistViewProps {
  playlistId: string;
  onDeleteSuccess: () => void;
}

export default function PlaylistView({
  playlistId,
  onDeleteSuccess,
}: PlaylistViewProps) {
  const {
    playSong,
    currentSong,
    isPlaying,
    togglePlay,
    toggleLike,
    refreshPlaylists,
  } = usePlayer();

  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [allSongs, setAllSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchPlaylist = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/playlists/${playlistId}`);
      if (res.ok) {
        const data = await res.json();
        setPlaylist(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllSongs = async () => {
    try {
      const res = await fetch("/api/songs");
      if (res.ok) {
        const data = await res.json();
        setAllSongs(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (playlistId) {
      fetchPlaylist();
      fetchAllSongs();
    }
  }, [playlistId]);

  const handleAddSong = async (songId: string) => {
    try {
      const res = await fetch(`/api/playlists/${playlistId}/songs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ songId }),
      });
      if (res.ok) {
        await fetchPlaylist();
        await refreshPlaylists();
      }
    } catch (e) {
      console.error("Error adding song:", e);
    }
  };

  const handleRemoveSong = async (songId: string) => {
    try {
      const res = await fetch(
        `/api/playlists/${playlistId}/songs?songId=${songId}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        await fetchPlaylist();
        await refreshPlaylists();
      }
    } catch (e) {
      console.error("Error removing song:", e);
    }
  };

  const handleDeletePlaylist = async () => {
    if (!confirm("Are you sure you want to delete this playlist?")) return;
    try {
      const res = await fetch(`/api/playlists/${playlistId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        await refreshPlaylists();
        onDeleteSuccess();
      }
    } catch (e) {
      console.error("Error deleting playlist:", e);
    }
  };

  if (isLoading || !playlist) {
    return (
      <div className="flex-1 bg-[#121212] p-8 text-white flex items-center justify-center">
        <p className="text-[#b3b3b3]">Loading playlist...</p>
      </div>
    );
  }

  const songs = playlist.songs || [];
  const totalDuration = songs.reduce((acc, s) => acc + (s.duration || 0), 0);
  const isPlaylistPlaying =
    isPlaying && songs.some((s) => s.id === currentSong?.id);

  // Filter recommendations (songs not in this playlist)
  const existingSongIds = new Set(songs.map((s) => s.id));
  const recommendedSongs = allSongs.filter((s) => !existingSongIds.has(s.id));

  return (
    <div className="flex-1 bg-gradient-to-b from-[#3a3a3a] via-[#121212] to-[#121212] overflow-y-auto text-white pb-28">
      {/* Hero Header */}
      <div className="flex flex-col sm:flex-row items-end gap-6 p-8 pb-6">
        <div className="w-52 h-52 bg-[#282828] rounded shadow-2xl flex-shrink-0 overflow-hidden">
          {playlist.coverUrl ? (
            <img
              src={playlist.coverUrl}
              alt={playlist.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#b3b3b3]">
              <Music className="w-20 h-20" />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold uppercase tracking-wider">
            Playlist
          </span>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight line-clamp-2">
            {playlist.name}
          </h1>
          <p className="text-sm text-[#b3b3b3] mt-1">{playlist.description}</p>
          <div className="flex items-center gap-2 text-xs text-[#b3b3b3] mt-2 font-medium">
            <span className="text-white font-bold">Tunely</span>
            <span>•</span>
            <span>{songs.length} songs</span>
            {totalDuration > 0 && (
              <>
                <span>•</span>
                <span>{Math.floor(totalDuration / 60)} min</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center justify-between px-8 py-4 bg-black/20 backdrop-blur-sm">
        <div className="flex items-center gap-6">
          <button
            onClick={() => {
              if (songs.length === 0) return;
              if (isPlaylistPlaying) {
                togglePlay();
              } else {
                playSong(songs[0], songs);
              }
            }}
            disabled={songs.length === 0}
            className={`w-14 h-14 rounded-full bg-[#1db954] text-black flex items-center justify-center hover:scale-105 transition-transform shadow-xl ${
              songs.length === 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isPlaylistPlaying ? (
              <Pause className="w-6 h-6 fill-current" />
            ) : (
              <Play className="w-6 h-6 fill-current ml-1" />
            )}
          </button>

          <button
            onClick={handleDeletePlaylist}
            title="Delete Playlist"
            className="text-[#b3b3b3] hover:text-red-500 transition-colors p-2 rounded-full hover:bg-[#282828]"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Songs Table */}
      <div className="px-8 mt-4">
        {songs.length === 0 ? (
          <div className="py-12 text-center text-[#b3b3b3]">
            <p className="text-lg font-semibold mb-2">It&apos;s a bit empty here</p>
            <p className="text-sm">
              Add some songs from the recommendations below to get started!
            </p>
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
                <th className="py-2.5 w-12 text-right"></th>
              </tr>
            </thead>
            <tbody>
              {songs.map((song, index) => {
                const isCurrent = currentSong?.id === song.id;

                return (
                  <tr
                    key={song.id}
                    onClick={() => playSong(song, songs)}
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
                      <div className="flex items-center justify-end gap-2">
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
                            handleRemoveSong(song.id);
                          }}
                          title="Remove from playlist"
                          className="text-[#b3b3b3] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Recommended Songs section */}
      {recommendedSongs.length > 0 && (
        <div className="px-8 mt-12">
          <h2 className="text-xl font-bold mb-1">Recommended</h2>
          <p className="text-xs text-[#b3b3b3] mb-4">
            Based on what&apos;s in this playlist
          </p>

          <div className="flex flex-col gap-2">
            {recommendedSongs.slice(0, 5).map((song) => (
              <div
                key={song.id}
                className="flex items-center justify-between p-2 rounded-md hover:bg-[#ffffff]/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={song.coverUrl}
                    alt={song.title}
                    className="w-10 h-10 rounded object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold">{song.title}</p>
                    <p className="text-xs text-[#b3b3b3]">{song.artist}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-xs text-[#b3b3b3]">
                    {song.album}
                  </span>
                  <button
                    onClick={() => handleAddSong(song.id)}
                    className="px-4 py-1.5 rounded-full border border-[#808080] hover:border-white text-xs font-bold hover:scale-105 transition-all"
                  >
                    Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
