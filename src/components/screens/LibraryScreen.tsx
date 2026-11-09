import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { Heart, Upload, FolderHeart, Music, DownloadCloud, Play, Sparkles, Plus } from 'lucide-react';
import { useMusic } from '../../context/MusicContext';
import { fluidSprings } from '../../theme/motion';

export const LibraryScreen: React.FC = () => {
  const {
    tracks,
    likedTrackIds,
    playTrack,
    playlists,
    importUserAudio,
    currentTrack,
    isPlaying,
  } = useMusic();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const likedTracks = tracks.filter((t) => likedTrackIds.has(t.id));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      importUserAudio(files[0]);
    }
  };

  return (
    <div className="space-y-6 pb-36">
      <header className="pt-2 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Your Music Library</h1>
          <p className="text-xs text-white/50 mt-0.5">Saved tracks, custom playlists & local imports</p>
        </div>

        {/* Hidden file input for importing local songs */}
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <motion.button
          whileTap={fluidSprings.pressTap}
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/15 transition-colors"
        >
          <Upload className="w-4 h-4 text-[#ED5564]" />
          <span>Import Local Audio</span>
        </motion.button>
      </header>

      {/* Liked Songs Special Card */}
      <motion.div
        whileHover={fluidSprings.hoverLift}
        whileTap={{ scale: 0.98 }}
        onClick={() => {
          if (likedTracks.length > 0) {
            playTrack(likedTracks[0], likedTracks);
          }
        }}
        className="cursor-pointer relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-600 via-rose-700 to-red-950 p-6 text-white shadow-2xl border border-white/20"
      >
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg">
              <Heart className="w-8 h-8 fill-white text-white" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold">Liked Songs</h2>
              <p className="text-xs text-white/80 font-mono mt-0.5">
                {likedTracks.length} tracks saved
              </p>
            </div>
          </div>

          <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-xl">
            <Play className="w-5 h-5 fill-black ml-0.5" />
          </div>
        </div>
      </motion.div>

      {/* Library Sections: Playlists */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white">Your Playlists</h3>
          <span className="text-xs text-white/40">{playlists.length} Playlists</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {playlists.map((pl) => (
            <motion.div
              key={pl.id}
              whileTap={fluidSprings.pressTap}
              onClick={() => {
                const targetTrack = tracks.find((t) => t.id === pl.trackIds[0]);
                if (targetTrack) playTrack(targetTrack);
              }}
              className="cursor-pointer flex items-center gap-3.5 p-3 rounded-2xl liquid-glass border border-white/10 hover:bg-white/10 transition-all shadow-md"
            >
              <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-neutral-900 border border-white/10">
                <img
                  src={pl.coverUrl}
                  alt={pl.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-white truncate">{pl.name}</h4>
                <p className="text-xs text-white/50 truncate mt-0.5">{pl.description}</p>
                <span className="text-[10px] font-mono text-white/40 block mt-1">
                  {pl.trackIds.length} tracks · {pl.curator}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Liked Tracks Listing */}
      <section className="space-y-3">
        <h3 className="text-base font-bold text-white">Favorite Tracks</h3>

        {likedTracks.length === 0 ? (
          <div className="p-8 text-center text-white/40 rounded-2xl border border-white/5 bg-white/5">
            <p className="text-sm">You haven’t liked any songs yet.</p>
            <span className="text-xs text-white/30 mt-1 block">Tap the heart icon on any song to save it here.</span>
          </div>
        ) : (
          <div className="space-y-2">
            {likedTracks.map((track) => {
              const isCurrent = currentTrack.id === track.id;

              return (
                <motion.div
                  key={track.id}
                  whileTap={fluidSprings.pressTap}
                  onClick={() => playTrack(track, likedTracks)}
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

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-mono text-white/40 tabular-nums">
                      {Math.floor(track.duration / 60)}:
                      {String(track.duration % 60).padStart(2, '0')}
                    </span>
                    <button className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20">
                      <Play className="w-3.5 h-3.5 fill-white" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
