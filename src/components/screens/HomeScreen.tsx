import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Play, Sparkles, Heart, Compass, Disc, Zap, Headphones } from 'lucide-react';
import { useMusic } from '../../context/MusicContext';
import { fluidSprings } from '../../theme/motion';
import { Track } from '../../types/music';

export const HomeScreen: React.FC = () => {
  const {
    tracks,
    currentTrack,
    isPlaying,
    playTrack,
    playlists,
    likedTrackIds,
    toggleLike,
    isLosslessMode,
    setActiveTab,
  } = useMusic();

  const [selectedMood, setSelectedMood] = useState('All');
  const moods = ['All', 'Late Night', 'Chillout', 'Focus', 'Electronic'];

  const filteredTracks = selectedMood === 'All'
    ? tracks
    : tracks.filter((t) =>
        selectedMood === 'Late Night' ? t.genre.includes('Synth') || t.genre.includes('R&B') :
        selectedMood === 'Chillout' ? t.genre.includes('Chill') :
        selectedMood === 'Focus' ? t.genre.includes('Ambient') :
        t.genre.toLowerCase().includes(selectedMood.toLowerCase())
      );

  const heroTrack = tracks[0];

  return (
    <div className="space-y-7 pb-36">
      {/* Top Header Bar Contract */}
      <header className="flex items-center justify-between gap-8 pt-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-[#ED5564] flex items-center justify-center text-white shadow-lg shadow-[#ED5564]/30">
            <Disc className="w-5 h-5 animate-spin" style={{ animationDuration: '8s' }} />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-white">
            Echo Music
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isLosslessMode && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-[11px] font-mono font-bold">
              <Sparkles className="w-3 h-3" />
              <span>FLAC 24-BIT</span>
            </div>
          )}
        </div>
      </header>

      {/* Hero Featured Release Card */}
      <motion.div
        whileHover={fluidSprings.hoverLift}
        className="relative overflow-hidden rounded-3xl liquid-glass border border-white/20 p-6 shadow-2xl"
        style={{
          boxShadow: `0 20px 40px rgba(0,0,0,0.4), 0 0 30px ${heroTrack.dominantColor}30`,
        }}
      >
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full blur-3xl opacity-30 pointer-events-none"
             style={{ backgroundColor: heroTrack.dominantColor }} />

        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
          <div className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-2xl overflow-hidden shrink-0 shadow-xl border border-white/15 bg-neutral-900">
            <img
              src={heroTrack.coverUrl}
              alt={heroTrack.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-bold text-white tracking-wide">
              FEATURED
            </div>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <span className="text-xs font-semibold text-white/50 uppercase tracking-widest block">
              Today's Heavy Rotation
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 leading-tight">
              {heroTrack.title}
            </h2>
            <p className="text-sm font-medium text-white/70 mt-1">
              {heroTrack.artist} · <span className="font-mono text-xs">{heroTrack.album}</span>
            </p>
            <p className="text-xs text-white/50 mt-2 line-clamp-2 max-w-md">
              {heroTrack.dna?.story}
            </p>

            <div className="flex items-center justify-center sm:justify-start gap-3 mt-4">
              <motion.button
                whileTap={{ scale: 0.93 }}
                transition={fluidSprings.snappy}
                onClick={() => playTrack(heroTrack)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black font-extrabold text-xs shadow-lg hover:bg-white/90 transition-all"
              >
                <Play className="w-4 h-4 fill-black" />
                <span>Play Now</span>
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.93 }}
                onClick={() => setActiveTab('flow')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white font-semibold text-xs border border-white/10 transition-colors"
              >
                <Compass className="w-4 h-4 text-emerald-400" />
                <span>Music Flow</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Mood Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {moods.map((mood) => (
          <button
            key={mood}
            onClick={() => setSelectedMood(mood)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedMood === mood
                ? 'bg-white text-black shadow-md'
                : 'bg-white/5 hover:bg-white/10 text-white/70 border border-white/5'
            }`}
          >
            {mood}
          </button>
        ))}
      </div>

      {/* Curated Playlists Carousel */}
      <section className="space-y-3.5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Curated Playlists</h3>
          <span className="text-xs font-medium text-white/40">Studio Selected</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {playlists.map((pl) => (
            <motion.div
              key={pl.id}
              whileHover={fluidSprings.hoverLift}
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                const targetTrack = tracks.find((t) => t.id === pl.trackIds[0]);
                if (targetTrack) playTrack(targetTrack);
              }}
              className="group cursor-pointer rounded-2xl liquid-glass border border-white/10 p-3 flex flex-col justify-between overflow-hidden shadow-lg"
            >
              <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-2.5 bg-neutral-900 border border-white/10">
                <img
                  src={pl.coverUrl}
                  alt={pl.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow-lg">
                    <Play className="w-5 h-5 fill-black ml-0.5" />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-white truncate">{pl.name}</h4>
                <p className="text-[11px] text-white/50 truncate mt-0.5">{pl.curator}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trending & Recommended Songs List */}
      <section className="space-y-3.5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Trending Streams</h3>
          <span className="text-xs font-mono text-white/40 tabular-nums">
            {filteredTracks.length} Tracks
          </span>
        </div>

        <div className="space-y-2">
          {filteredTracks.map((track, idx) => {
            const isCurrent = currentTrack.id === track.id;
            const isLiked = likedTrackIds.has(track.id);

            return (
              <motion.div
                key={track.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                transition={fluidSprings.snappy}
                onClick={() => playTrack(track)}
                className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all border ${
                  isCurrent
                    ? 'bg-white/15 border-white/20 shadow-lg'
                    : 'bg-white/5 hover:bg-white/10 border-white/5'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <span className="text-xs font-mono text-white/40 w-4 text-center shrink-0">
                    {idx + 1}
                  </span>

                  <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-neutral-900 border border-white/10">
                    <img
                      src={track.coverUrl}
                      alt={track.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    {isCurrent && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        {isPlaying ? (
                          <div className="flex items-end gap-0.5 h-3">
                            <span className="w-1 bg-white animate-wave-1 rounded-full" />
                            <span className="w-1 bg-white animate-wave-2 rounded-full" />
                            <span className="w-1 bg-white animate-wave-3 rounded-full" />
                          </div>
                        ) : (
                          <Play className="w-4 h-4 fill-white text-white" />
                        )}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4
                        className={`text-sm truncate font-bold ${
                          isCurrent ? 'text-white' : 'text-white/90'
                        }`}
                      >
                        {track.title}
                      </h4>
                      {track.quality.includes('24-bit') && (
                        <span className="text-[9px] px-1 py-0.5 rounded font-mono font-bold bg-amber-400/20 text-amber-300">
                          Hi-Res
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-white/50 truncate mt-0.5">
                      {track.artist} · <span className="text-white/40">{track.album}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-mono text-white/40 tabular-nums">
                    {Math.floor(track.duration / 60)}:
                    {String(track.duration % 60).padStart(2, '0')}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(track.id);
                    }}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isLiked ? 'fill-[#ED5564] text-[#ED5564]' : 'text-white/30 hover:text-white'
                      }`}
                    />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
