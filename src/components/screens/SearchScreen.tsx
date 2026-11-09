import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, Mic, Radio, Play, Heart, Disc } from 'lucide-react';
import { useMusic } from '../../context/MusicContext';
import { fluidSprings } from '../../theme/motion';

export const SearchScreen: React.FC = () => {
  const { tracks, playTrack, currentTrack, isPlaying, likedTrackIds, toggleLike } = useMusic();
  const [query, setQuery] = useState('');
  const [isScanningEchoFind, setIsScanningEchoFind] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);

  const filteredTracks = query.trim()
    ? tracks.filter(
        (t) =>
          t.title.toLowerCase().includes(query.toLowerCase()) ||
          t.artist.toLowerCase().includes(query.toLowerCase()) ||
          t.album.toLowerCase().includes(query.toLowerCase()) ||
          t.genre.toLowerCase().includes(query.toLowerCase())
      )
    : tracks;

  const genres = [
    { name: 'Synthwave & Retro', color: 'from-purple-600 to-indigo-900', count: '142 tracks' },
    { name: 'Lo-Fi Night Beats', color: 'from-amber-600 to-yellow-900', count: '98 tracks' },
    { name: 'Deep Ambient & Space', color: 'from-emerald-600 to-teal-900', count: '85 tracks' },
    { name: 'Alternative R&B', color: 'from-rose-600 to-red-950', count: '64 tracks' },
    { name: 'Lossless Masters', color: 'from-cyan-600 to-blue-900', count: '210 tracks' },
    { name: 'Chillout & Instrumental', color: 'from-violet-600 to-fuchsia-900', count: '115 tracks' },
  ];

  const triggerEchoFind = () => {
    setIsScanningEchoFind(true);
    setScanResult(null);

    setTimeout(() => {
      const match = tracks[Math.floor(Math.random() * tracks.length)];
      setIsScanningEchoFind(false);
      setScanResult(`Identified: "${match.title}" by ${match.artist}`);
      playTrack(match);
    }, 2800);
  };

  return (
    <div className="space-y-6 pb-36">
      <header className="pt-2">
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Search & Explore</h1>
        <p className="text-xs text-white/50 mt-0.5">Explore YouTube Music catalog without advertisements</p>
      </header>

      {/* Search Input Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search songs, artists, albums, or lyrics..."
          className="w-full pl-12 pr-12 py-3.5 rounded-2xl liquid-glass border border-white/15 text-sm text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-colors shadow-lg"
        />
        {query ? (
          <button
            onClick={() => setQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/10 text-white/50 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={triggerEchoFind}
            title="Echo Find (Listen & Identify)"
            className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#ED5564] transition-colors"
          >
            <Radio className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Echo Find Sonar Banner */}
      <AnimatePresence>
        {isScanningEchoFind && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="rounded-2xl liquid-glass border border-[#ED5564]/40 p-5 text-center relative overflow-hidden"
          >
            <div className="relative flex items-center justify-center my-3">
              <div className="w-16 h-16 rounded-full bg-[#ED5564]/20 border border-[#ED5564]/50 flex items-center justify-center animate-ping absolute" />
              <div className="w-12 h-12 rounded-full bg-[#ED5564] text-white flex items-center justify-center shadow-lg relative z-10">
                <Mic className="w-6 h-6 animate-pulse" />
              </div>
            </div>
            <h4 className="text-sm font-bold text-white">Echo Find Engine Active</h4>
            <p className="text-xs text-white/60 mt-1">
              Listening to ambient audio to identify matching track...
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {scanResult && !isScanningEchoFind && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-xs text-emerald-200 flex items-center justify-between"
        >
          <span>{scanResult}</span>
          <button
            onClick={() => setScanResult(null)}
            className="p-1 rounded-full hover:bg-white/10 text-emerald-300"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      )}

      {/* Query Results */}
      {query ? (
        <section className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-white/50 uppercase tracking-wider">
            <span>Results ({filteredTracks.length})</span>
          </div>

          {filteredTracks.length === 0 ? (
            <div className="p-8 text-center text-white/40 text-sm">
              No matching tracks found for "{query}". Try another query.
            </div>
          ) : (
            filteredTracks.map((track) => {
              const isCurrent = currentTrack.id === track.id;
              const isLiked = likedTrackIds.has(track.id);

              return (
                <motion.div
                  key={track.id}
                  whileTap={fluidSprings.pressTap}
                  onClick={() => playTrack(track)}
                  className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all border ${
                    isCurrent
                      ? 'bg-white/15 border-white/20 shadow-md'
                      : 'bg-white/5 hover:bg-white/10 border-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-xl overflow-hidden shrink-0 bg-neutral-900 border border-white/10">
                      <img
                        src={track.coverUrl}
                        alt={track.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-white truncate">{track.title}</h4>
                      <p className="text-xs text-white/50 truncate mt-0.5">{track.artist}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLike(track.id);
                      }}
                      className="p-2 text-white/40 hover:text-white"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          isLiked ? 'fill-[#ED5564] text-[#ED5564]' : ''
                        }`}
                      />
                    </button>
                    <button className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20">
                      <Play className="w-3.5 h-3.5 fill-white" />
                    </button>
                  </div>
                </motion.div>
              );
            })
          )}
        </section>
      ) : (
        /* Genre Cards */
        <section className="space-y-3">
          <h3 className="text-base font-bold text-white">Browse Categories</h3>
          <div className="grid grid-cols-2 gap-3">
            {genres.map((g) => (
              <motion.div
                key={g.name}
                whileHover={fluidSprings.hoverLift}
                whileTap={{ scale: 0.96 }}
                onClick={() => setQuery(g.name.split(' ')[0])}
                className={`cursor-pointer rounded-2xl bg-gradient-to-br ${g.color} p-4 text-white shadow-lg border border-white/10 h-28 flex flex-col justify-between`}
              >
                <span className="text-sm font-extrabold leading-snug">{g.name}</span>
                <span className="text-[11px] text-white/60 font-mono">{g.count}</span>
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
