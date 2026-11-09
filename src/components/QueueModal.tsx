import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ListMusic, Trash2, Play, Volume2 } from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { fluidSprings } from '../theme/motion';

interface QueueModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QueueModal: React.FC<QueueModalProps> = ({ isOpen, onClose }) => {
  const { queue, queueIndex, currentTrack, playTrack, removeFromQueue, clearQueue, isPlaying } = useMusic();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={fluidSprings.spatial}
          className="w-full max-w-lg rounded-t-3xl sm:rounded-3xl liquid-glass border border-white/20 p-6 text-white shadow-2xl max-h-[85vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-white/10 text-white">
                <ListMusic className="w-5 h-5 text-[#ED5564]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Playback Queue</h3>
                <p className="text-xs text-white/60">{queue.length} tracks queued up</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={clearQueue}
                title="Clear Queue"
                className="p-2 rounded-full hover:bg-white/10 text-white/50 hover:text-rose-400 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Track List */}
          <div className="mt-4 overflow-y-auto space-y-2 flex-1 pr-1">
            {queue.map((track, idx) => {
              const isCurrent = idx === queueIndex;

              return (
                <motion.div
                  key={`${track.id}-${idx}`}
                  layout
                  transition={fluidSprings.snappy}
                  onClick={() => playTrack(track)}
                  className={`flex items-center justify-between p-2.5 rounded-2xl cursor-pointer transition-all ${
                    isCurrent
                      ? 'bg-white/20 border border-white/20 shadow-md'
                      : 'hover:bg-white/10 bg-white/5 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-10 h-10 rounded-xl overflow-hidden shrink-0 bg-neutral-900 border border-white/10">
                      <img
                        src={track.coverUrl}
                        alt={track.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      {isCurrent && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          {isPlaying ? (
                            <Volume2 className="w-4 h-4 text-white animate-pulse" />
                          ) : (
                            <Play className="w-4 h-4 text-white fill-white" />
                          )}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <span
                        className={`text-sm block truncate font-medium ${
                          isCurrent ? 'text-white font-bold' : 'text-white/80'
                        }`}
                      >
                        {track.title}
                      </span>
                      <span className="text-xs text-white/50 block truncate">
                        {track.artist}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-mono text-white/40 tabular-nums">
                      {Math.floor(track.duration / 60)}:
                      {String(track.duration % 60).padStart(2, '0')}
                    </span>
                    {queue.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromQueue(idx);
                        }}
                        className="p-1.5 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/10 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
