"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import PlayerBar from "@/components/PlayerBar";
import HomeView from "@/components/HomeView";
import SearchView from "@/components/SearchView";
import PlaylistView from "@/components/PlaylistView";
import LikedSongsView from "@/components/LikedSongsView";
import CreatePlaylistModal from "@/components/CreatePlaylistModal";
import AddToPlaylistModal from "@/components/AddToPlaylistModal";
import UploadSongModal from "@/components/UploadSongModal";

export default function TunelyApp() {
  const [activeView, setActiveView] = useState<string>("home");
  const [activePlaylistId, setActivePlaylistId] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [addToPlaylistSongId, setAddToPlaylistSongId] = useState<string | null>(null);

  const handleSelectPlaylist = (id: string) => {
    setActivePlaylistId(id);
    setActiveView("playlist");
  };

  const handlePlaylistDeleted = () => {
    setActivePlaylistId(null);
    setActiveView("home");
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-black text-white overflow-hidden font-sans">
      {/* Top Workspace (Sidebar + Main View) */}
      <div className="flex flex-1 overflow-hidden p-2 gap-2">
        <Sidebar
          activeView={activeView}
          setActiveView={setActiveView}
          activePlaylistId={activePlaylistId}
          setActivePlaylistId={setActivePlaylistId}
          openCreatePlaylist={() => setIsCreateOpen(true)}
          openUploadSong={() => setIsUploadOpen(true)}
        />

        {/* Main Content Window */}
        <main className="flex-1 bg-[#121212] rounded-lg overflow-hidden flex flex-col relative shadow-xl">
          {activeView === "home" && !activePlaylistId && (
            <HomeView
              onSelectPlaylist={handleSelectPlaylist}
              onOpenAddToPlaylist={(songId) => setAddToPlaylistSongId(songId)}
            />
          )}

          {activeView === "search" && (
            <SearchView
              onOpenAddToPlaylist={(songId) => setAddToPlaylistSongId(songId)}
            />
          )}

          {activeView === "liked" && <LikedSongsView />}

          {activeView === "playlist" && activePlaylistId && (
            <PlaylistView
              playlistId={activePlaylistId}
              onDeleteSuccess={handlePlaylistDeleted}
            />
          )}
        </main>
      </div>

      {/* Persistent Bottom Player Bar */}
      <PlayerBar
        onOpenAddToPlaylist={(songId) => setAddToPlaylistSongId(songId)}
      />

      {/* Modals */}
      <CreatePlaylistModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={(id) => {
          setActivePlaylistId(id);
          setActiveView("playlist");
        }}
      />

      <AddToPlaylistModal
        isOpen={!!addToPlaylistSongId}
        songId={addToPlaylistSongId}
        onClose={() => setAddToPlaylistSongId(null)}
      />

      <UploadSongModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSuccess={() => {
          setActiveView("home");
        }}
      />
    </div>
  );
}
