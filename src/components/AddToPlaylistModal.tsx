"use client";

import React, { useState } from "react";
import { X, Check, Music } from "lucide-react";
import { usePlayer } from "@/context/PlayerContext";

interface AddToPlaylistModalProps {
  isOpen: boolean;
  songId: string | null;
  onClose: () => void;
}

export default function AddToPlaylistModal({
  isOpen,
  songId,
  onClose,
}: AddToPlaylistModalProps) {
  const { playlists, refreshPlaylists } = usePlayer();
  const [successMsg, setSuccessMsg] = useState("");

  if (!isOpen || !songId) return null;

  const handleAdd = async (playlistId: string, playlistName: string) => {
    try {
      const res = await fetch(`/api/playlists/${playlistId}/songs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ songId }),
      });

      if (res.ok) {
        setSuccessMsg(`Added to "${playlistName}"!`);
        await refreshPlaylists();
        setTimeout(() => {
          setSuccessMsg("");
          onClose();
        }, 1200);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#282828] w-full max-w-sm rounded-lg shadow-2xl p-6 border border-[#3e3e3e] text-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Add to playlist</h2>
          <button
            onClick={onClose}
            className="text-[#b3b3b3] hover:text-white p-1 rounded-full hover:bg-[#333333]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {successMsg && (
          <div className="flex items-center gap-2 bg-[#1db954]/20 border border-[#1db954] text-[#1db954] text-xs px-3 py-2 rounded mb-3">
            <Check className="w-4 h-4" />
            <span>{successMsg}</span>
          </div>
        )}

        <div className="max-h-60 overflow-y-auto flex flex-col gap-1 pr-1">
          {playlists.length === 0 ? (
            <p className="text-xs text-[#b3b3b3] py-4 text-center">
              No playlists found. Create one first!
            </p>
          ) : (
            playlists.map((p) => (
              <button
                key={p.id}
                onClick={() => handleAdd(p.id, p.name)}
                className="flex items-center gap-3 p-2 rounded hover:bg-[#333333] transition-colors text-left group"
              >
                {p.coverUrl ? (
                  <img
                    src={p.coverUrl}
                    alt={p.name}
                    className="w-10 h-10 rounded object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded bg-[#181818] flex items-center justify-center text-[#b3b3b3] flex-shrink-0">
                    <Music className="w-5 h-5" />
                  </div>
                )}
                <div className="flex flex-col truncate flex-1 min-w-0">
                  <span className="text-sm font-medium truncate text-white group-hover:text-[#1db954]">
                    {p.name}
                  </span>
                  <span className="text-xs text-[#b3b3b3]">
                    {p.songCount || 0} songs
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
