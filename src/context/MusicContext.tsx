import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Track, Playlist, PlayerTheme, PlayerViewMode, NavTab } from '../types/music';
import { INITIAL_TRACKS, CURATED_PLAYLISTS } from '../data/musicData';
import { audioEngine, EQBands } from '../services/audioEngine';

interface MusicContextType {
  tracks: Track[];
  currentTrack: Track;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  queue: Track[];
  queueIndex: number;
  isShuffle: boolean;
  repeatMode: 'off' | 'all' | 'one';
  volume: number;
  isMuted: boolean;
  playerTheme: PlayerTheme;
  isPlayerOpen: boolean;
  playerViewMode: PlayerViewMode;
  eqBands: EQBands;
  eqPreset: string;
  playbackSpeed: number;
  isLosslessMode: boolean;
  activeTab: NavTab;
  likedTrackIds: Set<string>;
  playlists: Playlist[];
  searchQuery: string;
  
  // Actions
  setActiveTab: (tab: NavTab) => void;
  playTrack: (track: Track, newQueue?: Track[]) => void;
  togglePlay: () => void;
  seek: (seconds: number) => void;
  nextTrack: () => void;
  previousTrack: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  setVolume: (val: number) => void;
  toggleLike: (trackId: string) => void;
  setPlayerTheme: (theme: PlayerTheme) => void;
  setIsPlayerOpen: (open: boolean) => void;
  setPlayerViewMode: (mode: PlayerViewMode) => void;
  setEQPreset: (presetName: string) => void;
  setEQBands: (bands: EQBands) => void;
  setPlaybackSpeed: (speed: number) => void;
  toggleLosslessMode: () => void;
  addToQueue: (track: Track) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  setSearchQuery: (query: string) => void;
  importUserAudio: (file: File) => void;
}

const EQ_PRESETS: Record<string, EQBands> = {
  'Flat': { bass: 0, lowMid: 0, mid: 0, highMid: 0, treble: 0 },
  'Bass Boost': { bass: 8, lowMid: 4, mid: -1, highMid: 0, treble: 2 },
  'Vocal Clarity': { bass: -2, lowMid: 1, mid: 5, highMid: 4, treble: 2 },
  'Electronic': { bass: 7, lowMid: 2, mid: -2, highMid: 3, treble: 6 },
  'Hi-Fi Lossless': { bass: 3, lowMid: 1, mid: 0, highMid: 2, treble: 5 },
  'Acoustic': { bass: 2, lowMid: 2, mid: 3, highMid: 1, treble: 2 },
};

const MusicContext = createContext<MusicContextType | null>(null);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tracks, setTracks] = useState<Track[]>(INITIAL_TRACKS);
  const [currentTrack, setCurrentTrack] = useState<Track>(INITIAL_TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [queue, setQueue] = useState<Track[]>(INITIAL_TRACKS);
  const [queueIndex, setQueueIndex] = useState(0);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>('all');
  const [volume, setVolumeState] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [playerTheme, setPlayerTheme] = useState<PlayerTheme>('liquid-glass');
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [playerViewMode, setPlayerViewMode] = useState<PlayerViewMode>('art');
  const [eqPreset, setEqPreset] = useState('Hi-Fi Lossless');
  const [eqBands, setEqBandsState] = useState<EQBands>(EQ_PRESETS['Hi-Fi Lossless']);
  const [playbackSpeed, setPlaybackSpeedState] = useState(1.0);
  const [isLosslessMode, setIsLosslessMode] = useState(true);
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [likedTrackIds, setLikedTrackIds] = useState<Set<string>>(new Set(['track-1', 'track-2', 'track-4']));
  const [playlists] = useState<Playlist[]>(CURATED_PLAYLISTS);
  const [searchQuery, setSearchQuery] = useState('');

  const animFrameRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(performance.now());

  // Master playback timer
  useEffect(() => {
    if (!isPlaying) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    lastTickRef.current = performance.now();

    const loop = (time: number) => {
      const delta = (time - lastTickRef.current) / 1000;
      lastTickRef.current = time;

      setCurrentTime((prev) => {
        const nextTime = prev + delta * playbackSpeed;
        if (nextTime >= currentTrack.duration) {
          handleTrackEnd();
          return 0;
        }
        return nextTime;
      });

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, currentTrack.duration, playbackSpeed]);

  const handleTrackEnd = () => {
    if (repeatMode === 'one') {
      setCurrentTime(0);
      audioEngine.playTrack(currentTrack.dna?.bpm || 118, currentTrack.audioUrl);
      return;
    }
    nextTrack();
  };

  const playTrack = (track: Track, newQueue?: Track[]) => {
    setCurrentTrack(track);
    setCurrentTime(0);
    setIsPlaying(true);

    if (newQueue) {
      setQueue(newQueue);
      const idx = newQueue.findIndex((t) => t.id === track.id);
      setQueueIndex(idx !== -1 ? idx : 0);
    } else {
      const idx = queue.findIndex((t) => t.id === track.id);
      if (idx !== -1) {
        setQueueIndex(idx);
      } else {
        setQueue((prev) => [track, ...prev]);
        setQueueIndex(0);
      }
    }

    audioEngine.playTrack(track.dna?.bpm || 118, track.audioUrl);
  };

  const togglePlay = () => {
    if (isPlaying) {
      audioEngine.pause();
      setIsPlaying(false);
    } else {
      audioEngine.resume();
      setIsPlaying(true);
    }
  };

  const seek = (seconds: number) => {
    const clamped = Math.max(0, Math.min(seconds, currentTrack.duration));
    setCurrentTime(clamped);
  };

  const nextTrack = () => {
    if (queue.length === 0) return;
    let nextIdx = queueIndex + 1;
    if (isShuffle) {
      nextIdx = Math.floor(Math.random() * queue.length);
    } else if (nextIdx >= queue.length) {
      if (repeatMode === 'all') {
        nextIdx = 0;
      } else {
        setIsPlaying(false);
        audioEngine.pause();
        return;
      }
    }
    setQueueIndex(nextIdx);
    const nextT = queue[nextIdx];
    setCurrentTrack(nextT);
    setCurrentTime(0);
    setIsPlaying(true);
    audioEngine.playTrack(nextT.dna?.bpm || 118, nextT.audioUrl);
  };

  const previousTrack = () => {
    if (currentTime > 3) {
      seek(0);
      return;
    }
    if (queue.length === 0) return;
    let prevIdx = queueIndex - 1;
    if (prevIdx < 0) {
      prevIdx = queue.length - 1;
    }
    setQueueIndex(prevIdx);
    const prevT = queue[prevIdx];
    setCurrentTrack(prevT);
    setCurrentTime(0);
    setIsPlaying(true);
    audioEngine.playTrack(prevT.dna?.bpm || 118, prevT.audioUrl);
  };

  const toggleShuffle = () => setIsShuffle((prev) => !prev);

  const toggleRepeat = () => {
    setRepeatMode((prev) => (prev === 'off' ? 'all' : prev === 'all' ? 'one' : 'off'));
  };

  const setVolume = (val: number) => {
    setVolumeState(val);
    setIsMuted(val === 0);
    audioEngine.setVolume(val);
  };

  const toggleLike = (trackId: string) => {
    setLikedTrackIds((prev) => {
      const next = new Set(prev);
      if (next.has(trackId)) {
        next.delete(trackId);
      } else {
        next.add(trackId);
      }
      return next;
    });
  };

  const setEQPreset = (presetName: string) => {
    if (EQ_PRESETS[presetName]) {
      setEqPreset(presetName);
      setEqBandsState(EQ_PRESETS[presetName]);
      audioEngine.setEQ(EQ_PRESETS[presetName]);
    }
  };

  const setEQBands = (bands: EQBands) => {
    setEqBandsState(bands);
    setEqPreset('Custom');
    audioEngine.setEQ(bands);
  };

  const setPlaybackSpeed = (speed: number) => {
    setPlaybackSpeedState(speed);
    audioEngine.setPlaybackRate(speed);
  };

  const toggleLosslessMode = () => {
    setIsLosslessMode((prev) => !prev);
  };

  const addToQueue = (track: Track) => {
    setQueue((prev) => [...prev, track]);
  };

  const removeFromQueue = (index: number) => {
    setQueue((prev) => prev.filter((_, i) => i !== index));
    if (index < queueIndex) {
      setQueueIndex((prev) => prev - 1);
    }
  };

  const clearQueue = () => {
    setQueue([currentTrack]);
    setQueueIndex(0);
  };

  const importUserAudio = (file: File) => {
    const objectUrl = URL.createObjectURL(file);
    const newTrack: Track = {
      id: `imported-${Date.now()}`,
      title: file.name.replace(/\.[^/.]+$/, ''),
      artist: 'Local Import',
      album: 'User Music Library',
      duration: 210,
      coverUrl: INITIAL_TRACKS[0].coverUrl,
      audioUrl: objectUrl,
      dominantColor: '#ED5564',
      secondaryColor: '#BE123C',
      quality: 'Lossless 24-bit/192kHz',
      releaseYear: 2026,
      genre: 'Local Audio',
      dna: {
        story: 'Locally imported audio track decoded in high-resolution directly on device.',
        bpm: 120,
        key: 'C Major',
        producers: 'Self Mastered',
        source: 'Echo Engine',
      },
      lyrics: [
        { time: 0, text: `Now Playing: ${file.name}` },
        { time: 10, text: 'Playing from your local audio device' },
      ],
    };

    setTracks((prev) => [newTrack, ...prev]);
    playTrack(newTrack);
  };

  return (
    <MusicContext.Provider
      value={{
        tracks,
        currentTrack,
        isPlaying,
        currentTime,
        duration: currentTrack.duration,
        queue,
        queueIndex,
        isShuffle,
        repeatMode,
        volume,
        isMuted,
        playerTheme,
        isPlayerOpen,
        playerViewMode,
        eqBands,
        eqPreset,
        playbackSpeed,
        isLosslessMode,
        activeTab,
        likedTrackIds,
        playlists,
        searchQuery,
        setActiveTab,
        playTrack,
        togglePlay,
        seek,
        nextTrack,
        previousTrack,
        toggleShuffle,
        toggleRepeat,
        setVolume,
        toggleLike,
        setPlayerTheme,
        setIsPlayerOpen,
        setPlayerViewMode,
        setEQPreset,
        setEQBands,
        setPlaybackSpeed,
        toggleLosslessMode,
        addToQueue,
        removeFromQueue,
        clearQueue,
        setSearchQuery,
        importUserAudio,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) throw new Error('useMusic must be used within MusicProvider');
  return context;
};
