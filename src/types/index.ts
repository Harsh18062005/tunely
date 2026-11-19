export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  audioUrl: string;
  coverUrl: string;
  category: string;
  plays: number;
  createdAt?: string;
  isLiked?: boolean;
  addedAt?: string;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string | null;
  coverUrl?: string | null;
  songCount?: number;
  createdAt?: string;
  updatedAt?: string;
  songs?: Song[];
}
