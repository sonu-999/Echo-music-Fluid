import React from 'react';
import { motion } from 'motion/react';
import { Play, Pause, SkipForward, Disc } from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { fluidSprings } from '../theme/motion';

export const FloatingMiniPlayer: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    togglePlay,
    nextTrack,
    setIsPlayerOpen,
    isLosslessMode,
  } = useMusic();

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-20 left-0 right-0 z-30 px-3 md:px-6 pointer-events-none">
      <motion.div
        layoutId="player-container"
        transition={fluidSprings.spatial}
        onClick={() => setIsPlayerOpen(true)}
        className="pointer-events-auto max-w-xl mx-auto relative overflow-hidden rounded-2xl liquid-glass border border-white/15 cursor-pointer shadow-2xl backdrop-blur-2xl group transition-all"
        style={{
          boxShadow: `0 12px 32px rgba(0,0,0,0.5), 0 0 20px ${currentTrack.dominantColor}25`,
        }}
      >
        {/* Hairline Progress Scrubber at Top Edge */}
        <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-white/10">
          <motion.div
            className="h-full"
            style={{
              width: `${progressPercent}%`,
              backgroundColor: currentTrack.dominantColor || '#ED5564',
            }}
            transition={{ ease: 'linear', duration: 0.1 }}
          />
        </div>

        <div className="flex items-center justify-between p-2.5 gap-3">
          {/* Morphing Album Art */}
          <div className="flex items-center gap-3 min-w-0">
            <motion.div
              layoutId={`art_${currentTrack.id}`}
              transition={fluidSprings.spatial}
              className="relative w-11 h-11 rounded-xl overflow-hidden shadow-md shrink-0 bg-neutral-900 border border-white/10"
            >
              <img
                src={currentTrack.coverUrl}
                alt={currentTrack.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              {isPlaying && (
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-white/80 animate-ping" />
                </div>
              )}
            </motion.div>

            {/* Title & Artist */}
            <div className="min-w-0 flex flex-col justify-center">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-white truncate leading-tight">
                  {currentTrack.title}
                </span>
                {isLosslessMode && (
                  <span className="text-[9px] px-1 py-0.5 rounded font-mono font-medium bg-white/15 text-white/90 shrink-0">
                    24-BIT
                  </span>
                )}
              </div>
              <span className="text-xs text-white/60 truncate mt-0.5">
                {currentTrack.artist}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div
            className="flex items-center gap-1.5 shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Play/Pause Button with Tactile Bounce */}
            <motion.button
              whileTap={{ scale: 0.88 }}
              whileHover={{ scale: 1.06 }}
              transition={fluidSprings.snappy}
              onClick={togglePlay}
              className="w-10 h-10 rounded-full flex items-center justify-center text-white bg-white/15 hover:bg-white/25 active:bg-white/30 backdrop-blur-md transition-colors"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-white text-white" />
              ) : (
                <Play className="w-5 h-5 fill-white text-white ml-0.5" />
              )}
            </motion.button>

            {/* Next Track Button */}
            <motion.button
              whileTap={{ scale: 0.88 }}
              whileHover={{ scale: 1.06 }}
              transition={fluidSprings.snappy}
              onClick={nextTrack}
              className="w-9 h-9 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 active:bg-white/20 transition-colors"
              aria-label="Next Track"
            >
              <SkipForward className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
