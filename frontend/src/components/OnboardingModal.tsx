import { useEffect, useState } from 'react';
import { X, Star, Search, Bookmark, Settings as SettingsIcon } from 'lucide-react';

const STORAGE_KEY = 'bible-onboarding-dismissed';

export default function OnboardingModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY) === 'true';
    if (!dismissed) {
      // Slight delay to avoid competing with initial loading animations
      const t = setTimeout(() => setOpen(true), 600);
      return () => clearTimeout(t);
    }
  }, []);

  if (!open) return null;

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg bg-theme-surface text-theme-text rounded-2xl shadow-2xl border border-theme-border">
        <div className="flex items-center justify-between p-4">
          <h3 className="text-lg font-semibold">Welcome to the Bible App</h3>
          <button onClick={dismiss} className="p-2 hover:text-theme-accent">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-4 pb-4 space-y-3">
          <p className="text-sm text-theme-text/70">Quick tips to get started:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Tip icon={<Search className="w-5 h-5" />} title="Search Scripture" desc="Press / to search verses and names. Use filters for OT/NT." />
            <Tip icon={<Bookmark className="w-5 h-5" />} title="Bookmarks & Notes" desc="Tap a verse to bookmark, highlight, or add a note." />
            <Tip icon={<Star className="w-5 h-5" />} title="Focus Mode" desc="Press F to enter distraction-free reading." />
            <Tip icon={<SettingsIcon className="w-5 h-5" />} title="Settings" desc="Customize theme, font size, and manage backups." />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setOpen(false)} className="px-4 py-2 rounded-lg bg-theme-surface hover:bg-theme-surface-hover border border-theme-border">Remind me later</button>
            <button onClick={dismiss} className="px-4 py-2 rounded-lg bg-theme-accent text-white">Got it</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Tip({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="p-3 rounded-xl border border-theme-border bg-theme-bg">
      <div className="flex items-center gap-2 font-medium mb-1">
        <span className="text-theme-accent">{icon}</span>
        <span>{title}</span>
      </div>
      <div className="text-xs text-theme-text/70">{desc}</div>
    </div>
  );
}


