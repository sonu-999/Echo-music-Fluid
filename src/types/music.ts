export interface LyricLine {
  time: number; // in seconds
  text: string;
}

export interface SongDNA {
  story: string;
  bpm: number;
  key: string;
  producers: string;
  source: 'Genius & Wikipedia' | 'Echo Engine';
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // seconds
  coverUrl: string;
  audioUrl?: string; // audio source or synthesized
  dominantColor: string; // e.g. '#8B5CF6'
  secondaryColor: string;
  quality: 'Lossless 24-bit/192kHz' | '320 kbps FLAC' | '320 kbps AAC';
  releaseYear: number;
  lyrics: LyricLine[];
  dna: SongDNA;
  genre: string;
  isLiked?: boolean;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  coverUrl: string;
  curator: string;
  trackIds: string[];
}

export type PlayerTheme = 'liquid-glass' | 'apple-style' | 'material-expressive';

export type PlayerViewMode = 'art' | 'lyrics' | 'visualizer';

export type NavTab = 'home' | 'search' | 'flow' | 'library' | 'settings';
