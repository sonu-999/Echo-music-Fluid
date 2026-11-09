import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { useMusic } from '../context/MusicContext';
import { fluidSprings } from '../theme/motion';

interface SynchronizedLyricsViewProps {
  className?: string;
  fontSize?: 'normal' | 'large';
}

export const SynchronizedLyricsView: React.FC<SynchronizedLyricsViewProps> = ({
  className = '',
  fontSize = 'normal',
}) => {
  const { currentTrack, currentTime, seek } = useMusic();
  const lyrics = currentTrack.lyrics || [];
  const containerRef = useRef<HTMLDivElement>(null);
  const activeLineRef = useRef<HTMLDivElement>(null);

  // Find the index of the currently playing lyric line
  let activeIndex = -1;
  for (let i = 0; i < lyrics.length; i++) {
    if (currentTime >= lyrics[i].time) {
      activeIndex = i;
    } else {
      break;
    }
  }

  // Smoothly scroll active line to center
  useEffect(() => {
    if (activeLineRef.current && containerRef.current) {
      const container = containerRef.current;
      const element = activeLineRef.current;
      const elementTop = element.offsetTop;
      const elementHeight = element.offsetHeight;
      const containerHeight = container.offsetHeight;

      const targetScroll = elementTop - containerHeight / 2 + elementHeight / 2;

      container.scrollTo({
        top: Math.max(0, targetScroll),
        behavior: 'smooth',
      });
    }
  }, [activeIndex]);

  if (!lyrics || lyrics.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8 text-white/50">
        <p className="text-base font-medium">No synchronized lyrics available for this track.</p>
        <span className="text-xs text-white/30 mt-2">Echo Music fetches lyrics via LRCLIB & Kugou</span>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`h-full overflow-y-auto px-6 py-24 space-y-6 scroll-smooth mask-fade-edges ${className}`}
      style={{
        maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
      }}
    >
      {lyrics.map((line, idx) => {
        const isActive = idx === activeIndex;
        const isPast = idx < activeIndex;

        return (
          <motion.div
            key={`${line.time}-${idx}`}
            ref={isActive ? activeLineRef : null}
            onClick={() => seek(line.time)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={fluidSprings.lyrics}
            className={`cursor-pointer transition-all duration-300 rounded-xl p-2 select-none ${
              isActive
                ? 'opacity-100 font-extrabold text-white scale-[1.03] translate-x-1'
                : isPast
                ? 'opacity-40 text-white/70 font-semibold'
                : 'opacity-25 text-white/50 font-medium'
            } ${
              fontSize === 'large'
                ? 'text-2xl md:text-3xl leading-snug'
                : 'text-xl md:text-2xl leading-normal'
            }`}
            style={{
              textShadow: isActive ? `0 0 24px ${currentTrack.dominantColor}` : 'none',
            }}
          >
            {line.text}
          </motion.div>
        );
      })}
    </div>
  );
};
