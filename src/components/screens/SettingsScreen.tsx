import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Palette,
  Sparkles,
  Sliders,
  ShieldCheck,
  Disc,
  ExternalLink,
  Volume2,
  Check,
  Zap,
} from 'lucide-react';
import { useMusic } from '../../context/MusicContext';
import { fluidSprings } from '../../theme/motion';
import { PlayerTheme } from '../../types/music';
import { EqualizerModal } from '../EqualizerModal';

export const SettingsScreen: React.FC = () => {
  const {
    playerTheme,
    setPlayerTheme,
    isLosslessMode,
    toggleLosslessMode,
    playbackSpeed,
    setPlaybackSpeed,
  } = useMusic();

  const [isEQOpen, setIsEQOpen] = useState(false);
  const [cacheCleared, setCacheCleared] = useState(false);

  const themeOptions: { id: PlayerTheme; title: string; desc: string }[] = [
    {
      id: 'liquid-glass',
      title: 'Echo Liquid Glass',
      desc: 'Translucent frosted glass with refractive edge specular highlights and dynamic glow.',
    },
    {
      id: 'apple-style',
      title: 'Apple Music Glow',
      desc: 'Deep multi-layer Gaussian dispersion backdrop with animated mesh movement.',
    },
    {
      id: 'material-expressive',
      title: 'Material 3 Expressive',
      desc: 'Dynamic color palette extraction with soft tonal containers and rounded shapes.',
    },
  ];

  const handleClearCache = () => {
    setCacheCleared(true);
    setTimeout(() => setCacheCleared(false), 2000);
  };

  return (
    <div className="space-y-6 pb-36 text-white">
      <header className="pt-2">
        <h1 className="text-2xl font-extrabold tracking-tight">App Settings & Audio</h1>
        <p className="text-xs text-white/50 mt-0.5">Customize fluid visual motion and DSP pipeline</p>
      </header>

      {/* Visual Fluid Theme Engine */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-[#ED5564]" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-white/70">
            Player Visual Engine
          </h3>
        </div>

        <div className="space-y-2.5">
          {themeOptions.map((opt) => (
            <motion.div
              key={opt.id}
              whileTap={fluidSprings.pressTap}
              onClick={() => setPlayerTheme(opt.id)}
              className={`cursor-pointer p-4 rounded-2xl border transition-all ${
                playerTheme === opt.id
                  ? 'bg-white/15 border-white/30 shadow-lg'
                  : 'bg-white/5 hover:bg-white/10 border-white/5'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    {opt.title}
                    {playerTheme === opt.id && (
                      <span className="w-2 h-2 rounded-full bg-[#ED5564]" />
                    )}
                  </h4>
                  <p className="text-xs text-white/60 mt-1">{opt.desc}</p>
                </div>
                {playerTheme === opt.id && (
                  <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Audio Extensions & Quality */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-white/70">
            Audio Quality & DSP
          </h3>
        </div>

        <div className="rounded-2xl liquid-glass border border-white/10 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-white">Lossless Audio Extension</h4>
              <p className="text-xs text-white/50 mt-0.5">
                Stream in studio-grade 24-bit/192kHz FLAC format without compression
              </p>
            </div>
            <button
              onClick={toggleLosslessMode}
              className={`w-12 h-7 rounded-full p-1 transition-colors ${
                isLosslessMode ? 'bg-[#ED5564]' : 'bg-white/20'
              }`}
            >
              <motion.div
                layout
                transition={fluidSprings.snappy}
                className={`w-5 h-5 rounded-full bg-white shadow-md ${
                  isLosslessMode ? 'ml-auto' : 'mr-auto'
                }`}
              />
            </button>
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-white">Equalizer & Audio Effects</h4>
              <p className="text-xs text-white/50 mt-0.5">5-Band parametric filters and presets</p>
            </div>
            <button
              onClick={() => setIsEQOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
            >
              Open EQ
            </button>
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-white">Varispeed Tape Pitch</h4>
              <p className="text-xs text-white/50 mt-0.5">Current rate: {playbackSpeed.toFixed(2)}x</p>
            </div>
            <div className="flex items-center gap-1">
              {[0.8, 1.0, 1.25].map((s) => (
                <button
                  key={s}
                  onClick={() => setPlaybackSpeed(s)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold ${
                    playbackSpeed === s
                      ? 'bg-emerald-500 text-black'
                      : 'bg-white/10 text-white/60 hover:text-white'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Storage & Privacy */}
      <section className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-white/70">
          Cache & Performance
        </h3>
        <div className="rounded-2xl liquid-glass border border-white/10 p-4 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-white">Audio Cache</h4>
            <p className="text-xs text-white/50 mt-0.5">Estimated storage: 42.8 MB</p>
          </div>
          <button
            onClick={handleClearCache}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              cacheCleared
                ? 'bg-emerald-500 text-black font-bold'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            {cacheCleared ? 'Cleared!' : 'Clear Cache'}
          </button>
        </div>
      </section>

      {/* About Echo Music */}
      <section className="rounded-2xl liquid-glass border border-white/10 p-5 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#ED5564] flex items-center justify-center text-white shadow-lg shadow-[#ED5564]/30">
            <Disc className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Echo Music</h4>
            <p className="text-xs text-white/50">Version 4.2.0 (Fluid Fluid Motion Edition)</p>
          </div>
        </div>
        <p className="text-xs text-white/70 leading-relaxed">
          An open-source music experience engineered with spring-based motion physics,
          translucent liquid glass, synchronized lyrics, and lossless studio playback.
        </p>

        <div className="pt-2 flex items-center gap-4 text-xs font-semibold text-white/60">
          <a
            href="https://github.com/EchoMusicApp/Echo-Music"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <span>GitHub Repository</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <span>·</span>
          <span className="text-white/40">GPL-3.0 Licensed</span>
        </div>
      </section>

      <EqualizerModal isOpen={isEQOpen} onClose={() => setIsEQOpen(false)} />
    </div>
  );
};
