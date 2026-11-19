"use client";

import React, { useState } from "react";
import { X, Music } from "lucide-react";
import { usePlayer } from "@/context/PlayerContext";

interface CreatePlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newPlaylistId: string) => void;
}

export default function CreatePlaylistModal({
  isOpen,
  onClose,
  onSuccess,
}: CreatePlaylistModalProps) {
  const { refreshPlaylists } = usePlayer();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter a playlist name");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/playlists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create playlist");
      }

      const created = await res.json();
      await refreshPlaylists();
      setName("");
      setDescription("");
      onSuccess(created.id);
      onClose();
    } catch (err) {
      setError("Could not create playlist. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#282828] w-full max-w-md rounded-lg shadow-2xl p-6 border border-[#3e3e3e] text-white animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Create playlist</h2>
          <button
            onClick={onClose}
            className="text-[#b3b3b3] hover:text-white p-1 rounded-full hover:bg-[#333333]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <p className="text-red-400 text-xs mb-3 bg-red-900/30 p-2 rounded">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex gap-4">
            <div className="w-28 h-28 bg-[#181818] rounded flex items-center justify-center text-[#b3b3b3] flex-shrink-0 shadow">
              <Music className="w-10 h-10" />
            </div>

            <div className="flex-1 flex flex-col gap-3">
              <div>
                <label className="text-xs text-[#b3b3b3] block mb-1 font-semibold">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="My Playlist #1"
                  required
                  className="w-full bg-[#3e3e3e] focus:bg-[#484848] text-white text-sm px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-white transition-all"
                />
              </div>

              <div>
                <label className="text-xs text-[#b3b3b3] block mb-1 font-semibold">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Give your playlist a catchy description"
                  rows={2}
                  className="w-full bg-[#3e3e3e] focus:bg-[#484848] text-white text-xs px-3 py-1.5 rounded focus:outline-none focus:ring-1 focus:ring-white transition-all resize-none"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-bold px-4 py-2 text-white hover:scale-105 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#1db954] hover:bg-[#1ed760] text-black text-xs font-bold px-6 py-2.5 rounded-full hover:scale-105 transition-all disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
