import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sliders, Zap, Sparkles } from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { fluidSprings } from '../theme/motion';
import { EQBands } from '../services/audioEngine';

interface EqualizerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_LIST = [
  'Flat',
  'Bass Boost',
  'Vocal Clarity',
  'Electronic',
  'Hi-Fi Lossless',
  'Acoustic',
];

export const EqualizerModal: React.FC<EqualizerModalProps> = ({ isOpen, onClose }) => {
  const {
    eqBands,
    eqPreset,
    setEQPreset,
    setEQBands,
    playbackSpeed,
    setPlaybackSpeed,
    isLosslessMode,
    toggleLosslessMode,
    currentTrack,
  } = useMusic();

  if (!isOpen) return null;

  const handleBandChange = (key: keyof EQBands, val: number) => {
    setEQBands({
      ...eqBands,
      [key]: val,
    });
  };

  const bandsConfig: { key: keyof EQBands; label: string; freq: string }[] = [
    { key: 'bass', label: 'Sub-Bass', freq: '60 Hz' },
    { key: 'lowMid', label: 'Low-Mid', freq: '250 Hz' },
    { key: 'mid', label: 'Midrange', freq: '1 kHz' },
    { key: 'highMid', label: 'Presence', freq: '4 kHz' },
    { key: 'treble', label: 'Brilliance', freq: '12 kHz' },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={fluidSprings.spatial}
          className="w-full max-w-lg rounded-t-3xl sm:rounded-3xl liquid-glass border border-white/20 p-6 text-white shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-white/10 text-white">
                <Sliders className="w-5 h-5 text-[#ED5564]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Audio DSP & Equalizer</h3>
                <p className="text-xs text-white/60">Hardware-accelerated 5-Band parametric filter</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Lossless & Bitrate Engine Switch */}
          <div className="mt-5 p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <div>
                <span className="text-sm font-bold text-white block">Echo Lossless Extension</span>
                <span className="text-xs text-white/50 block">Studio 24-bit/192kHz bit-perfect rendering</span>
              </div>
            </div>
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={toggleLosslessMode}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                isLosslessMode
                  ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/25'
                  : 'bg-white/10 text-white/60 hover:bg-white/15'
              }`}
            >
              {isLosslessMode ? 'ENABLED (24-BIT)' : 'STANDARD (320K)'}
            </motion.button>
          </div>

          {/* Presets Segmented Buttons */}
          <div className="mt-5">
            <label className="text-xs font-semibold text-white/50 uppercase tracking-wider block mb-2.5">
              Tuning Presets
            </label>
            <div className="grid grid-cols-3 gap-2">
              {PRESET_LIST.map((preset) => (
                <button
                  key={preset}
                  onClick={() => setEQPreset(preset)}
                  className={`py-2 px-3 rounded-xl text-xs font-medium transition-all ${
                    eqPreset === preset
                      ? 'bg-white text-black font-bold shadow-md'
                      : 'bg-white/5 hover:bg-white/10 text-white/80'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* 5-Band Slider Sliders */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">
                Frequency Gain Curves
              </label>
              <span className="text-xs font-mono text-white/60">{eqPreset} Mode</span>
            </div>

            <div className="grid grid-cols-5 gap-3 pt-2 pb-4 bg-white/5 rounded-2xl p-4 border border-white/10">
              {bandsConfig.map(({ key, label, freq }) => {
                const val = eqBands[key];
                return (
                  <div key={key} className="flex flex-col items-center gap-2">
                    <span className="text-[11px] font-mono text-white/80 tabular-nums">
                      {val > 0 ? `+${val}` : val}dB
                    </span>
                    <input
                      type="range"
                      min="-12"
                      max="12"
                      step="1"
                      value={val}
                      onChange={(e) => handleBandChange(key, Number(e.target.value))}
                      className="h-32 w-2 appearance-none bg-white/20 rounded-full cursor-pointer accent-[#ED5564] [writing-mode:vertical-lr] [direction:rtl]"
                    />
                    <div className="text-center mt-1">
                      <span className="text-[10px] font-bold text-white block">{label}</span>
                      <span className="text-[9px] font-mono text-white/40 block">{freq}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Varispeed Pitch & Speed */}
          <div className="mt-5 p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Varispeed Pitch & Tempo
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400 tabular-nums">
                {playbackSpeed.toFixed(2)}x
              </span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              {[0.8, 1.0, 1.25, 1.5].map((speed) => (
                <button
                  key={speed}
                  onClick={() => setPlaybackSpeed(speed)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    playbackSpeed === speed
                      ? 'bg-emerald-500 text-black font-bold'
                      : 'bg-white/10 text-white/70 hover:bg-white/15'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-white text-black font-bold text-sm hover:bg-white/90 active:scale-[0.98] transition-all"
            >
              Apply Acoustic Tuning
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
