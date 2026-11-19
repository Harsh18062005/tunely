"use client";

import React from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  VolumeX,
  Volume1,
  Heart,
  PlusCircle,
} from "lucide-react";
import { usePlayer } from "@/context/PlayerContext";
import { formatTime } from "@/lib/utils";

interface PlayerBarProps {
  onOpenAddToPlaylist?: (songId: string) => void;
}

export default function PlayerBar({ onOpenAddToPlaylist }: PlayerBarProps) {
  const {
    currentSong,
    isPlaying,
    progress,
    duration,
    volume,
    isMuted,
    isShuffle,
    repeatMode,
    togglePlay,
    playNext,
    playPrevious,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    toggleLike,
  } = usePlayer();

  if (!currentSong) {
    return (
      <footer className="h-20 bg-[#181818] border-t border-[#282828] px-4 flex items-center justify-between text-[#b3b3b3]">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 bg-[#282828] rounded flex items-center justify-center text-xs">
            No track
          </div>
          <div>
            <p className="text-sm text-[#ffffff] font-medium">Select a song to start listening</p>
            <p className="text-xs text-[#b3b3b3]">Tunely Music</p>
          </div>
        </div>
      </footer>
    );
  }

  const effectiveDuration = duration > 0 ? duration : currentSong.duration || 1;
  const progressPercent = Math.min(100, Math.max(0, (progress / effectiveDuration) * 100));

  return (
    <footer className="h-24 bg-[#181818] border-t border-[#282828] px-4 flex items-center justify-between text-white z-50 select-none">
      {/* Left: Song Info */}
      <div className="flex items-center gap-4 w-[30%] min-w-[200px]">
        <img
          src={currentSong.coverUrl}
          alt={currentSong.title}
          className="w-14 h-14 rounded object-cover shadow-lg flex-shrink-0"
        />
        <div className="flex flex-col truncate">
          <span className="text-sm font-medium hover:underline cursor-pointer truncate">
            {currentSong.title}
          </span>
          <span className="text-xs text-[#b3b3b3] hover:underline cursor-pointer truncate">
            {currentSong.artist} • {currentSong.album}
          </span>
        </div>

        <div className="flex items-center gap-2 ml-2">
          <button
            onClick={() => toggleLike(currentSong.id)}
            title={currentSong.isLiked ? "Remove from Liked Songs" : "Save to Liked Songs"}
            className="text-[#b3b3b3] hover:text-white transition-colors"
          >
            <Heart
              className={`w-5 h-5 ${
                currentSong.isLiked
                  ? "fill-[#1db954] text-[#1db954]"
                  : "hover:scale-110"
              }`}
            />
          </button>

          {onOpenAddToPlaylist && (
            <button
              onClick={() => onOpenAddToPlaylist(currentSong.id)}
              title="Add to Playlist"
              className="text-[#b3b3b3] hover:text-white transition-colors"
            >
              <PlusCircle className="w-5 h-5 hover:scale-110" />
            </button>
          )}
        </div>
      </div>

      {/* Center: Playback Controls */}
      <div className="flex flex-col items-center gap-2 w-[40%] max-w-[700px]">
        <div className="flex items-center gap-6">
          <button
            onClick={toggleShuffle}
            title={isShuffle ? "Shuffle on" : "Shuffle off"}
            className={`transition-colors relative ${
              isShuffle ? "text-[#1db954]" : "text-[#b3b3b3] hover:text-white"
            }`}
          >
            <Shuffle className="w-4 h-4" />
            {isShuffle && (
              <span className="w-1 h-1 bg-[#1db954] rounded-full absolute -bottom-1 left-1/2 -translate-x-1/2" />
            )}
          </button>

          <button
            onClick={playPrevious}
            title="Previous"
            className="text-[#b3b3b3] hover:text-white transition-colors"
          >
            <SkipBack className="w-5 h-5 fill-current" />
          </button>

          <button
            onClick={togglePlay}
            title={isPlaying ? "Pause" : "Play"}
            className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform shadow-md"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </button>

          <button
            onClick={playNext}
            title="Next"
            className="text-[#b3b3b3] hover:text-white transition-colors"
          >
            <SkipForward className="w-5 h-5 fill-current" />
          </button>

          <button
            onClick={toggleRepeat}
            title={`Repeat: ${repeatMode}`}
            className={`transition-colors relative ${
              repeatMode !== "off"
                ? "text-[#1db954]"
                : "text-[#b3b3b3] hover:text-white"
            }`}
          >
            {repeatMode === "one" ? (
              <Repeat1 className="w-4 h-4" />
            ) : (
              <Repeat className="w-4 h-4" />
            )}
            {repeatMode !== "off" && (
              <span className="w-1 h-1 bg-[#1db954] rounded-full absolute -bottom-1 left-1/2 -translate-x-1/2" />
            )}
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full flex items-center gap-2">
          <span className="text-xs text-[#b3b3b3] w-10 text-right">
            {formatTime(progress)}
          </span>

          <div className="relative flex-1 flex items-center group">
            <input
              type="range"
              min="0"
              max={effectiveDuration}
              step="0.1"
              value={progress}
              onChange={(e) => seek(parseFloat(e.target.value))}
              className="w-full h-1 bg-[#4d4d4d] rounded-lg appearance-none cursor-pointer focus:outline-none group-hover:h-1.5 transition-all"
            />
          </div>

          <span className="text-xs text-[#b3b3b3] w-10 text-left">
            {formatTime(effectiveDuration)}
          </span>
        </div>
      </div>

      {/* Right: Audio Volume & Category Badge */}
      <div className="flex items-center justify-end gap-3 w-[30%] min-w-[200px]">
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#282828] text-[#1db954] border border-[#3e3e3e]">
          {currentSong.category}
        </span>

        <button
          onClick={toggleMute}
          title={isMuted ? "Unmute" : "Mute"}
          className="text-[#b3b3b3] hover:text-white transition-colors"
        >
          {isMuted || volume === 0 ? (
            <VolumeX className="w-5 h-5" />
          ) : volume < 0.5 ? (
            <Volume1 className="w-5 h-5" />
          ) : (
            <Volume2 className="w-5 h-5" />
          )}
        </button>

        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={isMuted ? 0 : volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-24 h-1 bg-[#4d4d4d] rounded-lg appearance-none cursor-pointer hover:h-1.5 transition-all"
        />
      </div>
    </footer>
  );
}
