import React, { useEffect, useRef, useState } from 'react';
import { audioEngine } from '../services/audioEngine';
import { useMusic } from '../context/MusicContext';

interface VisualizerProps {
  barCount?: number;
  height?: number;
  className?: string;
  glowColor?: string;
}

export const AudioVisualizer: React.FC<VisualizerProps> = ({
  barCount = 36,
  height = 96,
  className = '',
  glowColor,
}) => {
  const { isPlaying, currentTrack } = useMusic();
  const [frequencies, setFrequencies] = useState<number[]>(new Array(barCount).fill(4));
  const rafRef = useRef<number | null>(null);

  const activeColor = glowColor || currentTrack.dominantColor || '#8B5CF6';

  useEffect(() => {
    let phase = 0;

    const update = () => {
      phase += 0.08;
      if (isPlaying) {
        const raw = audioEngine.getFrequencyData();
        const step = Math.max(1, Math.floor(raw.length / barCount));
        const newFreqs: number[] = [];

        for (let i = 0; i < barCount; i++) {
          const rawVal = raw[i * step] || 0;
          // Normalize and add smooth wave motion
          const normalized = Math.max(6, (rawVal / 255) * height);
          newFreqs.push(normalized);
        }
        setFrequencies(newFreqs);
      } else {
        // Idle gentle breathing wave
        const idleFreqs = Array.from({ length: barCount }, (_, i) => {
          return 6 + Math.sin(phase + i * 0.25) * 4;
        });
        setFrequencies(idleFreqs);
      }

      rafRef.current = requestAnimationFrame(update);
    };

    rafRef.current = requestAnimationFrame(update);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isPlaying, barCount, height]);

  return (
    <div
      className={`flex items-end justify-center gap-1 px-4 ${className}`}
      style={{ height: `${height}px` }}
    >
      {frequencies.map((barHeight, idx) => {
        // Create an organic bell-curve weighting
        const centerDistance = Math.abs(idx - barCount / 2) / (barCount / 2);
        const curvedHeight = Math.max(4, barHeight * (1 - centerDistance * 0.3));

        return (
          <div
            key={idx}
            className="flex-1 max-w-[8px] rounded-full transition-all duration-75"
            style={{
              height: `${curvedHeight}px`,
              backgroundColor: activeColor,
              opacity: 0.35 + (curvedHeight / height) * 0.65,
              boxShadow: isPlaying && curvedHeight > 25 ? `0 0 12px ${activeColor}` : 'none',
            }}
          />
        );
      })}
    </div>
  );
};
