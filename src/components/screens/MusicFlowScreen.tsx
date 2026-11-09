import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  Pause,
  Heart,
  Share2,
  ListPlus,
  ArrowDown,
  ArrowUp,
  Disc3,
  Sparkles,
} from 'lucide-react';
import { useMusic } from '../../context/MusicContext';
import { fluidSprings } from '../../theme/motion';

export const MusicFlowScreen: React.FC = () => {
  const {
    tracks,
    currentTrack,
    isPlaying,
    togglePlay,
    currentTime,
    playTrack,
    likedTrackIds,
    toggleLike,
    isLosslessMode,
  } = useMusic();

  const [flyingHearts, setFlyingHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const isLiked = likedTrackIds.has(currentTrack.id);

  // Synchronized lyric line for Music Flow
  const lyrics = currentTrack.lyrics || [];
  let currentLyricIndex = -1;
  for (let i = 0; i < lyrics.length; i++) {
    if (currentTime >= lyrics[i].time) {
      currentLyricIndex = i;
    } else {
      break;
    }
  }

  const currentLyric = lyrics[currentLyricIndex]?.text || '♪ Instrumental Audio Stream ♪';
  const nextLyric = lyrics[currentLyricIndex + 1]?.text || '...';

  // Navigate next / previous song in reel
  const currentIndex = tracks.findIndex((t) => t.id === currentTrack.id);

  const goNext = () => {
    const nextIdx = (currentIndex + 1) % tracks.length;
    playTrack(tracks[nextIdx]);
  };

  const goPrev = () => {
    const prevIdx = (currentIndex - 1 + tracks.length) % tracks.length;
    playTrack(tracks[prevIdx]);
  };

  const handleDoubleTap = (e: React.MouseEvent) => {
    toggleLike(currentTrack.id);
    const rect = e.currentTarget.getBoundingClientRect();
    const newHeart = {
      id: Date.now(),
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    setFlyingHearts((prev) => [...prev, newHeart]);
    setTimeout(() => {
      setFlyingHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
    }, 1000);
  };

  return (
    <div className="relative h-[calc(100vh-140px)] w-full rounded-3xl overflow-hidden liquid-glass border border-white/15 select-none shadow-2xl flex flex-col justify-between p-6">
      {/* Blurred Tinted Full-Bleed Backdrop */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <img
          src={currentTrack.coverUrl}
          alt=""
          className="w-full h-full object-cover blur-3xl scale-125 opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/85" />
      </div>

      {/* Top Bar Chrome */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-white/10 text-white/90 border border-white/15">
            Music Flow · For You
          </span>
          {isLosslessMode && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30">
              Lossless
            </span>
          )}
        </div>

        {/* Up/Down Reel Navigation Affordance */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={goPrev}
            title="Previous in Flow"
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
          <button
            onClick={goNext}
            title="Next in Flow"
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <ArrowDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Center Reel Content: Synchronized Lyrics First + Centered Artwork */}
      <div className="relative z-10 my-auto flex flex-col items-center text-center">
        {/* Prominent Live Synced Lyrics (As specified in DESIGN.md) */}
        <div className="w-full max-w-sm mb-6 min-h-[72px] flex flex-col justify-center">
          <motion.div
            key={currentLyric}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={fluidSprings.lyrics}
            className="text-lg sm:text-xl font-extrabold text-white leading-snug drop-shadow-md"
            style={{ textShadow: `0 0 16px ${currentTrack.dominantColor}` }}
          >
            {currentLyric}
          </motion.div>
          <span className="text-xs font-semibold text-white/40 mt-1.5 block truncate">
            {nextLyric}
          </span>
        </div>

        {/* Centered Artwork with Vinyl / Tap Action */}
        <div
          onDoubleClick={handleDoubleTap}
          onClick={togglePlay}
          className="relative group cursor-pointer"
        >
          <motion.div
            whileTap={{ scale: 0.95 }}
            transition={fluidSprings.snappy}
            className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-3xl overflow-hidden shadow-2xl border border-white/20 bg-neutral-900"
            style={{
              boxShadow: `0 20px 50px rgba(0,0,0,0.6), 0 0 35px ${currentTrack.dominantColor}45`,
            }}
          >
            <img
              src={currentTrack.coverUrl}
              alt={currentTrack.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />

            {/* Play glyph centered only when paused */}
            {!isPlaying && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white">
                  <Play className="w-8 h-8 fill-white ml-1" />
                </div>
              </div>
            )}
          </motion.div>

          {/* Flying Heart Particles on Double Tap */}
          {flyingHearts.map((h) => (
            <motion.div
              key={h.id}
              initial={{ opacity: 1, scale: 0.5, y: 0 }}
              animate={{ opacity: 0, scale: 1.8, y: -80 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="absolute pointer-events-none text-rose-500 z-30"
              style={{ left: h.x, top: h.y }}
            >
              <Heart className="w-8 h-8 fill-rose-500 text-rose-500" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom Metadata & Action Row */}
      <div className="relative z-10 flex items-end justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl font-extrabold text-white truncate">
            {currentTrack.title}
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm font-semibold text-white/70 truncate">
              {currentTrack.artist}
            </span>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full border border-white/30 text-white/80 whitespace-nowrap">
              {currentTrack.genre}
            </span>
          </div>
        </div>

        {/* Action Row */}
        <div className="flex items-center gap-2 shrink-0">
          <motion.button
            whileTap={fluidSprings.pressTap}
            onClick={() => toggleLike(currentTrack.id)}
            className={`p-3 rounded-full backdrop-blur-md transition-colors ${
              isLiked ? 'bg-[#ED5564] text-white shadow-lg' : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-white' : ''}`} />
          </motion.button>

          <motion.button
            whileTap={fluidSprings.pressTap}
            onClick={goNext}
            className="p-3 rounded-full bg-white text-black hover:bg-white/90 shadow-lg font-bold"
            title="Next Track"
          >
            <ArrowDown className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};
