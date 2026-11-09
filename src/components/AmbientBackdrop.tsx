import React from 'react';
import { motion } from 'motion/react';
import { useMusic } from '../context/MusicContext';
import { fluidSprings } from '../theme/motion';

export const AmbientBackdrop: React.FC = () => {
  const { currentTrack, playerTheme } = useMusic();

  const primary = currentTrack?.dominantColor || '#8B5CF6';
  const secondary = currentTrack?.secondaryColor || '#EC4899';

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-[#0B0B0F] dark:bg-[#070709] transition-colors duration-700">
      {/* Dynamic ambient orb 1 */}
      <motion.div
        animate={{
          backgroundColor: primary,
          scale: [1, 1.08, 0.98, 1],
          x: ['-10%', '5%', '-5%', '-10%'],
          y: ['-10%', '0%', '-5%', '-10%'],
        }}
        transition={{
          backgroundColor: { duration: 1.2, ease: 'easeInOut' },
          scale: { duration: 18, repeat: Infinity, ease: 'easeInOut' },
          x: { duration: 22, repeat: Infinity, ease: 'easeInOut' },
          y: { duration: 20, repeat: Infinity, ease: 'easeInOut' },
        }}
        className="absolute -top-32 -left-32 w-[650px] h-[650px] rounded-full opacity-40 blur-[120px]"
      />

      {/* Dynamic ambient orb 2 */}
      <motion.div
        animate={{
          backgroundColor: secondary,
          scale: [1, 0.94, 1.06, 1],
          x: ['5%', '-10%', '0%', '5%'],
          y: ['10%', '-5%', '8%', '10%'],
        }}
        transition={{
          backgroundColor: { duration: 1.2, ease: 'easeInOut' },
          scale: { duration: 20, repeat: Infinity, ease: 'easeInOut' },
          x: { duration: 24, repeat: Infinity, ease: 'easeInOut' },
          y: { duration: 22, repeat: Infinity, ease: 'easeInOut' },
        }}
        className="absolute top-1/3 -right-32 w-[580px] h-[580px] rounded-full opacity-30 blur-[130px]"
      />

      {/* Theme specific overlays */}
      {playerTheme === 'apple-style' && (
        <div className="absolute inset-0 bg-black/35 backdrop-blur-[40px]" />
      )}

      {playerTheme === 'material-expressive' && (
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, ${primary} 0%, transparent 60%)`,
          }}
        />
      )}

      {/* Subtle vinyl micro-noise overlay for high-end acoustic texture */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_transparent_0%,_rgba(0,0,0,0.6)_100%)]" />
    </div>
  );
};
