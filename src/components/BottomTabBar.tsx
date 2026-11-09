import React from 'react';
import { motion } from 'motion/react';
import { Home, Search, Compass, Library, Settings } from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { NavTab } from '../types/music';
import { fluidSprings } from '../theme/motion';

export const BottomTabBar: React.FC = () => {
  const { activeTab, setActiveTab } = useMusic();

  const tabs: { id: NavTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'flow', label: 'Music Flow', icon: Compass },
    { id: 'library', label: 'Library', icon: Library },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 px-3 pb-2 pt-1 pointer-events-auto select-none">
      <div className="max-w-md mx-auto rounded-3xl liquid-glass border border-white/15 px-3 py-1 shadow-2xl backdrop-blur-2xl">
        <div className="flex items-center justify-around h-14">
          {tabs.map(({ id, label, icon: Icon }) => {
            const isActive = activeTab === id;

            return (
              <motion.button
                key={id}
                whileTap={fluidSprings.pressTap}
                onClick={() => setActiveTab(id)}
                className={`relative flex flex-col items-center justify-center flex-1 h-full min-w-[48px] py-1 rounded-2xl transition-colors ${
                  isActive ? 'text-white' : 'text-white/50 hover:text-white/80'
                }`}
                aria-label={label}
              >
                {/* Active Indicator Background Pill */}
                {isActive && (
                  <motion.div
                    layoutId="activeTabPill"
                    transition={fluidSprings.snappy}
                    className="absolute inset-0 bg-white/15 rounded-2xl -z-10"
                  />
                )}

                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                <span className="text-[10px] font-semibold tracking-tight mt-0.5 whitespace-nowrap">
                  {label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
