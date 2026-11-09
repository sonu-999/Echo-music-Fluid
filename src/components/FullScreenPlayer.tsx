import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronDown,
  Heart,
  Shuffle,
  SkipBack,
  Play,
  Pause,
  SkipForward,
  Repeat,
  Repeat1,
  Sliders,
  ListMusic,
  Mic2,
  Disc3,
  Activity,
  Volume2,
  VolumeX,
  Info,
  Sparkles,
  Palette,
} from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { fluidSprings } from '../theme/motion';
import { SynchronizedLyricsView } from './SynchronizedLyricsView';
import { AudioVisualizer } from './AudioVisualizer';
import { EqualizerModal } from './EqualizerModal';
import { QueueModal } from './QueueModal';
import { PlayerTheme, PlayerViewMode } from '../types/music';

export const FullScreenPlayer: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    togglePlay,
    seek,
    nextTrack,
    previousTrack,
    isShuffle,
    toggleShuffle,
    repeatMode,
    toggleRepeat,
    volume,
    setVolume,
    isMuted,
    isPlayerOpen,
    setIsPlayerOpen,
    playerViewMode,
    setPlayerViewMode,
    playerTheme,
    setPlayerTheme,
    likedTrackIds,
    toggleLike,
    isLosslessMode,
  } = useMusic();

  const [isEQOpen, setIsEQOpen] = useState(false);
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [showDNA, setShowDNA] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);

  if (!isPlayerOpen) return null;

  const isLiked = likedTrackIds.has(currentTrack.id);
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = Math.floor(secs % 60);
    return `${mins}:${String(remaining).padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <AnimatePresence>
      <motion.div
        layoutId="player-container"
        initial={{ opacity: 0, y: '100%' }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: '100%' }}
        transition={fluidSprings.spatial}
        className={`fixed inset-0 z-50 flex flex-col text-white overflow-hidden select-none ${
          playerTheme === 'liquid-glass'
            ? 'liquid-glass backdrop-blur-3xl bg-black/75'
            : playerTheme === 'apple-style'
            ? 'bg-black/65 backdrop-blur-[60px]'
            : 'bg-[#121214] border-t border-white/10'
        }`}
      >
        {/* Dynamic Glow Orb inside Player */}
        <motion.div
          animate={{
            scale: isPlaying ? [1, 1.15, 1] : 1,
            opacity: isPlaying ? [0.35, 0.55, 0.35] : 0.25,
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none"
          style={{ backgroundColor: currentTrack.dominantColor || '#8B5CF6' }}
        />

        {/* Top App Bar Contract: Minimize chevron, Center Album Context, Right Controls */}
        <header className="relative z-10 flex items-center justify-between px-6 pt-5 pb-3 shrink-0">
          <motion.button
            whileTap={fluidSprings.pressTap}
            onClick={() => setIsPlayerOpen(false)}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
            aria-label="Collapse Player"
          >
            <ChevronDown className="w-6 h-6" />
          </motion.button>

          {/* Center Context */}
          <div className="flex flex-col items-center max-w-[200px] text-center">
            <span className="text-[11px] font-semibold text-white/50 uppercase tracking-widest truncate">
              {currentTrack.album}
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-xs font-bold text-white/90">
                {isLosslessMode ? 'Lossless Master' : '320 kbps Stream'}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </div>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2">
            <motion.button
              whileTap={fluidSprings.pressTap}
              onClick={() => setShowThemePicker((p) => !p)}
              title="Change Player Theme"
              className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
            >
              <Palette className="w-4 h-4" />
            </motion.button>
          </div>
        </header>

        {/* Theme Picker Dropdown Popover */}
        {showThemePicker && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-16 right-6 z-40 p-3 rounded-2xl liquid-glass border border-white/20 shadow-2xl space-y-1.5 w-52"
          >
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider block px-2 pb-1">
              Player Style
            </span>
            {[
              { id: 'liquid-glass', name: 'Echo Liquid Glass' },
              { id: 'apple-style', name: 'Apple Music Glow' },
              { id: 'material-expressive', name: 'Material 3 Expressive' },
            ].map((th) => (
              <button
                key={th.id}
                onClick={() => {
                  setPlayerTheme(th.id as PlayerTheme);
                  setShowThemePicker(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                  playerTheme === th.id
                    ? 'bg-white text-black font-bold'
                    : 'text-white/80 hover:bg-white/10'
                }`}
              >
                {th.name}
              </button>
            ))}
          </motion.div>
        )}

        {/* View Mode Tabs (Artwork | Lyrics | Visualizer) */}
        <div className="relative z-10 flex justify-center py-2 shrink-0">
          <div className="flex items-center gap-1 p-1 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
            <button
              onClick={() => setPlayerViewMode('art')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                playerViewMode === 'art'
                  ? 'bg-white text-black shadow-md'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <Disc3 className="w-3.5 h-3.5" />
              <span>Artwork</span>
            </button>
            <button
              onClick={() => setPlayerViewMode('lyrics')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                playerViewMode === 'lyrics'
                  ? 'bg-white text-black shadow-md'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <Mic2 className="w-3.5 h-3.5" />
              <span>Lyrics</span>
            </button>
            <button
              onClick={() => setPlayerViewMode('visualizer')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                playerViewMode === 'visualizer'
                  ? 'bg-white text-black shadow-md'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Visualizer</span>
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="relative z-10 flex-1 flex flex-col justify-center px-6 max-w-md mx-auto w-full overflow-hidden">
          {/* View Mode 1: Artwork */}
          {playerViewMode === 'art' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={fluidSprings.spatial}
              className="flex flex-col items-center w-full my-auto"
            >
              {/* Album Art with Ambient Shadow and Spring Bounce */}
              <motion.div
                layoutId={`art_${currentTrack.id}`}
                transition={fluidSprings.spatial}
                whileHover={{ scale: 1.02 }}
                className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-3xl overflow-hidden shadow-2xl border border-white/15 bg-neutral-900"
                style={{
                  boxShadow: `0 20px 50px rgba(0,0,0,0.6), 0 0 40px ${currentTrack.dominantColor}40`,
                }}
              >
                <img
                  src={currentTrack.coverUrl}
                  alt={currentTrack.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover select-none"
                />

                {/* Spinning Vinyl Pulse Ring when playing */}
                {isPlaying && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 pointer-events-none rounded-3xl border border-white/20"
                  />
                )}
              </motion.div>

              {/* Title & Artist & Like Button Row */}
              <div className="w-full mt-7 flex items-center justify-between">
                <div className="min-w-0 pr-3">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-white truncate tracking-tight">
                    {currentTrack.title}
                  </h1>
                  <p className="text-sm font-medium text-white/60 truncate mt-0.5">
                    {currentTrack.artist}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <motion.button
                    whileTap={{ scale: 0.8 }}
                    onClick={() => setShowDNA((p) => !p)}
                    title="Music DNA & Story"
                    className={`p-2.5 rounded-full transition-colors ${
                      showDNA ? 'bg-white text-black' : 'bg-white/10 text-white/70 hover:text-white'
                    }`}
                  >
                    <Info className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.75 }}
                    transition={fluidSprings.snappy}
                    onClick={() => toggleLike(currentTrack.id)}
                    className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                  >
                    <Heart
                      className={`w-5 h-5 transition-colors ${
                        isLiked ? 'fill-[#ED5564] text-[#ED5564]' : 'text-white/80'
                      }`}
                    />
                  </motion.button>
                </div>
              </div>

              {/* Music DNA & Track Story Drawer */}
              {showDNA && currentTrack.dna && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="w-full mt-3 p-3.5 rounded-2xl bg-white/10 border border-white/15 text-xs text-white/80"
                >
                  <div className="flex items-center justify-between mb-1.5 text-white/50 font-bold uppercase tracking-wider text-[10px]">
                    <span>Music DNA & Trivia</span>
                    <span>{currentTrack.dna.source}</span>
                  </div>
                  <p className="line-clamp-3 leading-relaxed">{currentTrack.dna.story}</p>
                  <div className="flex items-center gap-3 mt-2 text-[11px] font-mono text-white/60">
                    <span>BPM: {currentTrack.dna.bpm}</span>
                    <span>·</span>
                    <span>Key: {currentTrack.dna.key}</span>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* View Mode 2: Synchronized Lyrics */}
          {playerViewMode === 'lyrics' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={fluidSprings.spatial}
              className="h-[360px] w-full"
            >
              <SynchronizedLyricsView />
            </motion.div>
          )}

          {/* View Mode 3: Real-Time Audio Visualizer */}
          {playerViewMode === 'visualizer' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={fluidSprings.spatial}
              className="h-[340px] w-full flex flex-col items-center justify-center p-4 bg-white/5 rounded-3xl border border-white/10"
            >
              <div className="text-center mb-6">
                <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-widest block">
                  Live Spectrum FFT Analyser
                </span>
                <span className="text-sm font-semibold text-white/80 mt-1 block">
                  {currentTrack.title} — {currentTrack.artist}
                </span>
              </div>
              <AudioVisualizer barCount={32} height={130} className="w-full max-w-sm" />
            </motion.div>
          )}

          {/* Scrubbing Bar & Time */}
          <div className="w-full mt-6">
            <div className="relative group">
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={(e) => seek(Number(e.target.value))}
                className="w-full h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer accent-white group-hover:h-2 transition-all"
                style={{
                  background: `linear-gradient(to right, ${currentTrack.dominantColor || '#fff'} ${progressPercent}%, rgba(255,255,255,0.2) ${progressPercent}%)`,
                }}
              />
            </div>
            <div className="flex justify-between items-center text-xs font-mono font-medium text-white/50 mt-2 tabular-nums">
              <span>{formatTime(currentTime)}</span>
              <span>-{formatTime(Math.max(0, duration - currentTime))}</span>
            </div>
          </div>

          {/* Transport Controls with Spring Physics */}
          <div className="flex items-center justify-between mt-4">
            <motion.button
              whileTap={fluidSprings.pressTap}
              onClick={toggleShuffle}
              className={`p-3 rounded-full transition-colors ${
                isShuffle ? 'text-white bg-white/20' : 'text-white/50 hover:text-white'
              }`}
              aria-label="Toggle Shuffle"
            >
              <Shuffle className="w-5 h-5" />
            </motion.button>

            <motion.button
              whileTap={fluidSprings.pressTap}
              onClick={previousTrack}
              className="p-3 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Previous Track"
            >
              <SkipBack className="w-7 h-7 fill-current" />
            </motion.button>

            {/* Giant Play/Pause Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              transition={fluidSprings.snappy}
              onClick={togglePlay}
              className="w-18 h-18 rounded-full flex items-center justify-center bg-white text-black shadow-2xl active:bg-white/90 transition-all"
              style={{
                boxShadow: `0 8px 32px ${currentTrack.dominantColor}50, 0 4px 16px rgba(255,255,255,0.4)`,
              }}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-8 h-8 fill-black text-black" />
              ) : (
                <Play className="w-8 h-8 fill-black text-black ml-1" />
              )}
            </motion.button>

            <motion.button
              whileTap={fluidSprings.pressTap}
              onClick={nextTrack}
              className="p-3 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Next Track"
            >
              <SkipForward className="w-7 h-7 fill-current" />
            </motion.button>

            <motion.button
              whileTap={fluidSprings.pressTap}
              onClick={toggleRepeat}
              className={`p-3 rounded-full transition-colors ${
                repeatMode !== 'off' ? 'text-white bg-white/20' : 'text-white/50 hover:text-white'
              }`}
              aria-label="Toggle Repeat"
            >
              {repeatMode === 'one' ? (
                <Repeat1 className="w-5 h-5 text-amber-400" />
              ) : (
                <Repeat className="w-5 h-5" />
              )}
            </motion.button>
          </div>

          {/* Volume Scrubber Row */}
          <div className="flex items-center gap-3 mt-5 px-2">
            <button
              onClick={() => setVolume(isMuted ? 0.8 : 0)}
              className="text-white/50 hover:text-white transition-colors"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-rose-400" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer accent-white"
            />
          </div>
        </div>

        {/* Bottom Utility Bar: DSP Equalizer & Queue */}
        <footer className="relative z-10 flex items-center justify-around px-8 py-4 border-t border-white/10 shrink-0 bg-black/20 backdrop-blur-xl">
          <motion.button
            whileTap={fluidSprings.pressTap}
            onClick={() => setIsEQOpen(true)}
            className="flex items-center gap-2 py-2 px-3.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-semibold text-white/90 transition-colors"
          >
            <Sliders className="w-4 h-4 text-[#ED5564]" />
            <span>EQ & Hi-Fi</span>
          </motion.button>

          <motion.button
            whileTap={fluidSprings.pressTap}
            onClick={() => setIsQueueOpen(true)}
            className="flex items-center gap-2 py-2 px-3.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-semibold text-white/90 transition-colors"
          >
            <ListMusic className="w-4 h-4" />
            <span>Up Next</span>
          </motion.button>
        </footer>

        {/* Modal Portals */}
        <EqualizerModal isOpen={isEQOpen} onClose={() => setIsEQOpen(false)} />
        <QueueModal isOpen={isQueueOpen} onClose={() => setIsQueueOpen(false)} />
      </motion.div>
    </AnimatePresence>
  );
};
