"use client";

import React from "react";
import { Home, Search, Library, Plus, Heart, Music, Trash2, Upload } from "lucide-react";
import { usePlayer } from "@/context/PlayerContext";
import { Playlist } from "@/types";

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  activePlaylistId: string | null;
  setActivePlaylistId: (id: string | null) => void;
  openCreatePlaylist: () => void;
  openUploadSong: () => void;
}

export default function Sidebar({
  activeView,
  setActiveView,
  activePlaylistId,
  setActivePlaylistId,
  openCreatePlaylist,
  openUploadSong,
}: SidebarProps) {
  const { playlists, likedSongs } = usePlayer();

  return (
    <aside className="w-64 bg-black h-full flex flex-col p-2 gap-2 text-[#b3b3b3] select-none flex-shrink-0">
      {/* Top Nav Block */}
      <div className="bg-[#121212] rounded-lg p-4 flex flex-col gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2.5 text-white font-extrabold text-2xl px-2 py-1 cursor-pointer tracking-tight" onClick={() => { setActiveView("home"); setActivePlaylistId(null); }}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#1db954] to-emerald-400 flex items-center justify-center text-black shadow-lg">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
          </div>
          <span className="bg-gradient-to-r from-white via-neutral-100 to-neutral-400 bg-clip-text text-transparent">Tunely</span>
        </div>

        {/* Links */}
        <nav className="flex flex-col gap-1">
          <button
            onClick={() => {
              setActiveView("home");
              setActivePlaylistId(null);
            }}
            className={`flex items-center gap-4 px-3 py-2 rounded-md font-semibold text-sm transition-colors ${
              activeView === "home" && !activePlaylistId
                ? "text-white bg-[#282828]"
                : "hover:text-white"
            }`}
          >
            <Home className="w-6 h-6" />
            <span>Home</span>
          </button>

          <button
            onClick={() => {
              setActiveView("search");
              setActivePlaylistId(null);
            }}
            className={`flex items-center gap-4 px-3 py-2 rounded-md font-semibold text-sm transition-colors ${
              activeView === "search"
                ? "text-white bg-[#282828]"
                : "hover:text-white"
            }`}
          >
            <Search className="w-6 h-6" />
            <span>Search</span>
          </button>
        </nav>
      </div>

      {/* Library Block */}
      <div className="bg-[#121212] rounded-lg p-2 flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between px-3 py-2">
          <div className="flex items-center gap-2 font-semibold text-sm hover:text-white transition-colors cursor-pointer">
            <Library className="w-6 h-6" />
            <span>Your Library</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={openUploadSong}
              title="Upload Custom MP3"
              className="p-1 rounded-full hover:bg-[#282828] hover:text-[#1db954] transition-colors"
            >
              <Upload className="w-4 h-4" />
            </button>
            <button
              onClick={openCreatePlaylist}
              title="Create Playlist"
              className="p-1 rounded-full hover:bg-[#282828] hover:text-white transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Liked Songs Tile */}
        <div className="mt-2 px-1">
          <button
            onClick={() => {
              setActiveView("liked");
              setActivePlaylistId(null);
            }}
            className={`w-full flex items-center gap-3 p-2 rounded-md text-left transition-colors ${
              activeView === "liked"
                ? "bg-[#282828] text-white"
                : "hover:bg-[#1a1a1a] text-white"
            }`}
          >
            <div className="w-12 h-12 rounded bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white flex-shrink-0 shadow-md">
              <Heart className="w-6 h-6 fill-current" />
            </div>
            <div className="flex flex-col truncate">
              <span className="font-semibold text-sm truncate">Liked Songs</span>
              <span className="text-xs text-[#b3b3b3]">
                Playlist • {likedSongs.length} songs
              </span>
            </div>
          </button>
        </div>

        {/* Playlists List */}
        <div className="mt-2 flex-1 overflow-y-auto px-1 flex flex-col gap-1">
          {playlists.map((playlist) => {
            const isSelected =
              activeView === "playlist" && activePlaylistId === playlist.id;

            return (
              <button
                key={playlist.id}
                onClick={() => {
                  setActivePlaylistId(playlist.id);
                  setActiveView("playlist");
                }}
                className={`w-full flex items-center gap-3 p-2 rounded-md text-left transition-colors group ${
                  isSelected
                    ? "bg-[#282828] text-white"
                    : "hover:bg-[#1a1a1a] text-[#e0e0e0] hover:text-white"
                }`}
              >
                {playlist.coverUrl ? (
                  <img
                    src={playlist.coverUrl}
                    alt={playlist.name}
                    className="w-12 h-12 rounded object-cover flex-shrink-0 shadow"
                  />
                ) : (
                  <div className="w-12 h-12 rounded bg-[#282828] flex items-center justify-center text-[#b3b3b3] flex-shrink-0">
                    <Music className="w-6 h-6" />
                  </div>
                )}

                <div className="flex flex-col truncate flex-1 min-w-0">
                  <span className="font-medium text-sm truncate">
                    {playlist.name}
                  </span>
                  <span className="text-xs text-[#b3b3b3]">
                    Playlist • {playlist.songCount || 0} songs
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
