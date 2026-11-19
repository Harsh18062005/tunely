"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { Song, Playlist } from "@/types";

interface PlayerContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  queue: Song[];
  currentIndex: number;
  progress: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isShuffle: boolean;
  repeatMode: "off" | "all" | "one";
  playlists: Playlist[];
  likedSongs: Song[];
  playSong: (song: Song, newQueue?: Song[]) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrevious: () => void;
  seek: (seconds: number) => void;
  setVolume: (val: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  toggleLike: (songId: string) => Promise<void>;
  refreshPlaylists: () => Promise<void>;
  refreshLikedSongs: () => Promise<void>;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [queue, setQueue] = useState<Song[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [progress, setProgress] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolumeState] = useState<number>(0.7);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [repeatMode, setRepeatMode] = useState<"off" | "all" | "one">("off");
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [likedSongs, setLikedSongs] = useState<Song[]>([]);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize Audio
  useEffect(() => {
    if (typeof window !== "undefined") {
      const audio = new Audio();
      audioRef.current = audio;

      audio.volume = 0.7;

      audio.ontimeupdate = () => {
        setProgress(audio.currentTime);
      };

      audio.onloadedmetadata = () => {
        setDuration(audio.duration || 0);
      };

      audio.onended = () => {
        handleTrackEnded();
      };

      audio.onerror = (e) => {
        console.warn("Audio playback error:", e);
        setIsPlaying(false);
      };

      return () => {
        audio.pause();
        audio.src = "";
      };
    }
  }, []);

  // Fetch initial playlists and liked songs
  useEffect(() => {
    refreshPlaylists();
    refreshLikedSongs();
  }, []);

  const refreshPlaylists = async () => {
    try {
      const res = await fetch("/api/playlists");
      if (res.ok) {
        const data = await res.json();
        setPlaylists(data);
      }
    } catch (e) {
      console.error("Failed to load playlists", e);
    }
  };

  const refreshLikedSongs = async () => {
    try {
      const res = await fetch("/api/liked");
      if (res.ok) {
        const data = await res.json();
        setLikedSongs(data);
      }
    } catch (e) {
      console.error("Failed to load liked songs", e);
    }
  };

  const playSong = (song: Song, newQueue?: Song[]) => {
    if (!audioRef.current) return;

    if (newQueue && newQueue.length > 0) {
      setQueue(newQueue);
      const idx = newQueue.findIndex((s) => s.id === song.id);
      setCurrentIndex(idx !== -1 ? idx : 0);
    } else {
      if (!queue.some((s) => s.id === song.id)) {
        setQueue((prev) => [...prev, song]);
      }
      setCurrentIndex(queue.findIndex((s) => s.id === song.id));
    }

    setCurrentSong(song);
    audioRef.current.src = song.audioUrl;
    audioRef.current.play().then(() => {
      setIsPlaying(true);
      // Increment play count in background
      fetch(`/api/songs/${song.id}/play`, { method: "POST" }).catch(() => {});
    }).catch((err) => {
      console.warn("Autoplay was blocked or failed", err);
      setIsPlaying(false);
    });
  };

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (!currentSong) {
      if (queue.length > 0) {
        playSong(queue[0]);
      }
      return;
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((e) => console.warn(e));
    }
  };

  const playNext = () => {
    if (queue.length === 0) return;

    let nextIndex = 0;
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else {
      nextIndex = (currentIndex + 1) % queue.length;
    }

    const nextSong = queue[nextIndex];
    if (nextSong) {
      setCurrentIndex(nextIndex);
      playSong(nextSong);
    }
  };

  const playPrevious = () => {
    if (queue.length === 0) return;

    if (progress > 3 && audioRef.current) {
      audioRef.current.currentTime = 0;
      return;
    }

    let prevIndex = (currentIndex - 1 + queue.length) % queue.length;
    const prevSong = queue[prevIndex];
    if (prevSong) {
      setCurrentIndex(prevIndex);
      playSong(prevSong);
    }
  };

  const handleTrackEnded = () => {
    if (repeatMode === "one" && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      return;
    }

    if (repeatMode === "off" && currentIndex === queue.length - 1 && !isShuffle) {
      setIsPlaying(false);
      return;
    }

    playNext();
  };

  const seek = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = seconds;
      setProgress(seconds);
    }
  };

  const setVolume = (val: number) => {
    const clamped = Math.max(0, Math.min(1, val));
    setVolumeState(clamped);
    if (audioRef.current) {
      audioRef.current.volume = clamped;
    }
    if (clamped > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.volume = volume;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const toggleShuffle = () => {
    setIsShuffle((prev) => !prev);
  };

  const toggleRepeat = () => {
    setRepeatMode((prev) => {
      if (prev === "off") return "all";
      if (prev === "all") return "one";
      return "off";
    });
  };

  const toggleLike = async (songId: string) => {
    try {
      const res = await fetch("/api/liked", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ songId }),
      });
      const data = await res.json();
      const liked = data.liked;

      // Update currentSong if matches
      if (currentSong && currentSong.id === songId) {
        setCurrentSong({ ...currentSong, isLiked: liked });
      }

      // Update queue
      setQueue((prev) =>
        prev.map((s) => (s.id === songId ? { ...s, isLiked: liked } : s))
      );

      // Refresh liked songs list
      await refreshLikedSongs();
    } catch (e) {
      console.error("Failed to toggle like", e);
    }
  };

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        queue,
        currentIndex,
        progress,
        duration,
        volume,
        isMuted,
        isShuffle,
        repeatMode,
        playlists,
        likedSongs,
        playSong,
        togglePlay,
        playNext,
        playPrevious,
        seek,
        setVolume,
        toggleMute,
        toggleShuffle,
        toggleRepeat,
        toggleLike,
        refreshPlaylists,
        refreshLikedSongs,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
}
