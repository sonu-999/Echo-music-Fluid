import React from 'react';
import { MusicProvider, useMusic } from './context/MusicContext';
import { AmbientBackdrop } from './components/AmbientBackdrop';
import { FloatingMiniPlayer } from './components/FloatingMiniPlayer';
import { FullScreenPlayer } from './components/FullScreenPlayer';
import { BottomTabBar } from './components/BottomTabBar';
import { HomeScreen } from './components/screens/HomeScreen';
import { SearchScreen } from './components/screens/SearchScreen';
import { MusicFlowScreen } from './components/screens/MusicFlowScreen';
import { LibraryScreen } from './components/screens/LibraryScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';

const MainContent: React.FC = () => {
  const { activeTab } = useMusic();

  return (
    <div className="relative min-h-screen text-slate-100 flex flex-col justify-between">
      <AmbientBackdrop />

      {/* Main Viewport Container */}
      <main className="relative z-10 w-full max-w-xl mx-auto px-4 pt-4 flex-1">
        {activeTab === 'home' && <HomeScreen />}
        {activeTab === 'search' && <SearchScreen />}
        {activeTab === 'flow' && <MusicFlowScreen />}
        {activeTab === 'library' && <LibraryScreen />}
        {activeTab === 'settings' && <SettingsScreen />}
      </main>

      {/* Floating Mini-Player */}
      <FloatingMiniPlayer />

      {/* Full-Screen Morphing Player */}
      <FullScreenPlayer />

      {/* Fixed Bottom Tab Navigation */}
      <BottomTabBar />
    </div>
  );
};

export default function App() {
  return (
    <MusicProvider>
      <MainContent />
    </MusicProvider>
  );
}
