import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, BookOpen, Search, Settings, Bookmark } from 'lucide-react';
import { useBibleStore } from '../store/bibleStore';

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { translationId, book, chapter } = useBibleStore();

  const tabs = [
    { id: 'home', label: 'Home', icon: Home, path: '/' },
    { 
      id: 'reader', 
      label: 'Read', 
      icon: BookOpen, 
      path: `/${translationId}/${book}/${chapter}` 
    },
    { id: 'study', label: 'Study', icon: Bookmark, path: '/bookmarks' },
    { id: 'search', label: 'Search', icon: Search, path: '/search' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
  ];

  const isActive = (path: string) => {
    // Special handling for study tab (bookmarks/notes)
    if (path === '/bookmarks') {
      return location.pathname === '/bookmarks' || location.pathname === '/notes';
    }
    return location.pathname === path;
  };

  return (
    <nav className="bottom-nav fixed bottom-0 left-0 right-0 bg-theme-surface border-t border-theme-border md:hidden z-40 pb-safe overflow-hidden">
      <div className="relative flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(tab.path);
          
          return (
            <motion.button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center justify-center flex-1 h-full relative transition-colors border-b-2 ${
                active 
                  ? 'text-theme-accent border-theme-accent' 
                  : 'text-theme-text/60 border-transparent'
              }`}
            >
              {/* Content wrapper to handle tap animation without affecting underline */}
              <motion.div whileTap={{ scale: 0.95 }} className="flex flex-col items-center justify-center">
                <Icon 
                  className={`w-6 h-6 mb-1 transition-all ${
                    active ? 'scale-110' : 'scale-100'
                  }`} 
                />
                <span className={`text-xs font-medium ${
                  active ? 'font-semibold' : 'font-normal'
                }`}>
                  {tab.label}
                </span>
              </motion.div>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
