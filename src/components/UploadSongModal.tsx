"use client";

import React, { useState } from "react";
import { X, Upload, Music, Check } from "lucide-react";
import { usePlayer } from "@/context/PlayerContext";

interface UploadSongModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function UploadSongModal({
  isOpen,
  onClose,
  onSuccess,
}: UploadSongModalProps) {
  const { playSong } = usePlayer();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [album, setAlbum] = useState("");
  const [category, setCategory] = useState("Punjabi");
  const [coverUrl, setCoverUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      // Auto-populate title from filename if title empty
      if (!title) {
        const rawName = selected.name.replace(/\.[^/.]+$/, "");
        setTitle(rawName);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please select an audio file (.mp3, .m4a, .wav)");
      return;
    }
    if (!title.trim() || !artist.trim()) {
      setError("Please provide a song title and artist name");
      return;
    }

    setIsUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title.trim());
      formData.append("artist", artist.trim());
      formData.append("album", album.trim() || "Single");
      formData.append("category", category);
      if (coverUrl.trim()) {
        formData.append("coverUrl", coverUrl.trim());
      }

      const res = await fetch("/api/songs/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      const createdSong = await res.json();
      playSong(createdSong);
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      setError("Failed to upload track. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#282828] w-full max-w-md rounded-lg shadow-2xl p-6 border border-[#3e3e3e] text-white animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-[#1db954]" />
            <h2 className="text-xl font-bold">Upload Custom Track</h2>
          </div>
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

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {/* File Picker */}
          <div>
            <label className="text-xs text-[#b3b3b3] block mb-1 font-semibold">
              Audio File (.mp3, .m4a, .wav)
            </label>
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
              required
              className="w-full text-xs text-[#b3b3b3] file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#1db954] file:text-black hover:file:bg-[#1ed760] cursor-pointer bg-[#3e3e3e] p-2 rounded"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-[#b3b3b3] block mb-1 font-semibold">
                Song Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Softly"
                required
                className="w-full bg-[#3e3e3e] focus:bg-[#484848] text-white text-xs px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-white"
              />
            </div>

            <div>
              <label className="text-xs text-[#b3b3b3] block mb-1 font-semibold">
                Artist Name
              </label>
              <input
                type="text"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                placeholder="e.g. Karan Aujla"
                required
                className="w-full bg-[#3e3e3e] focus:bg-[#484848] text-white text-xs px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-[#b3b3b3] block mb-1 font-semibold">
                Album
              </label>
              <input
                type="text"
                value={album}
                onChange={(e) => setAlbum(e.target.value)}
                placeholder="Making Memories"
                className="w-full bg-[#3e3e3e] focus:bg-[#484848] text-white text-xs px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-white"
              />
            </div>

            <div>
              <label className="text-xs text-[#b3b3b3] block mb-1 font-semibold">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#3e3e3e] focus:bg-[#484848] text-white text-xs px-2.5 py-2 rounded focus:outline-none focus:ring-1 focus:ring-white"
              >
                <option value="Punjabi">Punjabi</option>
                <option value="Pop">Pop</option>
                <option value="Hip-Hop">Hip-Hop</option>
                <option value="Lo-Fi">Lo-Fi</option>
                <option value="Synthwave">Synthwave</option>
                <option value="Chill">Chill</option>
                <option value="Electronic">Electronic</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs text-[#b3b3b3] block mb-1 font-semibold">
              Cover Image URL (optional)
            </label>
            <input
              type="url"
              value={coverUrl}
              onChange={(e) => setCoverUrl(e.target.value)}
              placeholder="https://... (leave blank for preset)"
              className="w-full bg-[#3e3e3e] focus:bg-[#484848] text-white text-xs px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-white"
            />
          </div>

          <div className="flex items-center justify-end gap-3 mt-3">
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-bold px-4 py-2 text-white hover:scale-105 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="bg-[#1db954] hover:bg-[#1ed760] text-black text-xs font-bold px-5 py-2.5 rounded-full hover:scale-105 transition-all disabled:opacity-50 flex items-center gap-1.5"
            >
              <Upload className="w-4 h-4" />
              {isUploading ? "Uploading..." : "Upload & Play"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
