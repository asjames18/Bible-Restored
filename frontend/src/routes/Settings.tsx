import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useBibleStore } from '../store/bibleStore';
import { clearCache } from '../lib/data';
import { Palette, Sun, Moon, Scroll, Star } from 'lucide-react';

interface Settings {
  theme: 'light' | 'dark' | 'system';
  themePreset: 'classic' | 'midnight' | 'scroll';
  fontSize: 'small' | 'medium' | 'large';
  defaultTranslation: string;
  showHebrewBadges: boolean;
  showTranslitBadges: boolean;
  enableNamePopovers: boolean;
}

export default function Settings() {
  const { translationId, setTranslation, getBibleStats, bible } = useBibleStore();
  const [isReloading, setIsReloading] = useState(false);
  const [settings, setSettings] = useState<Settings>({
    theme: 'system',
    themePreset: 'classic',
    fontSize: 'medium',
    defaultTranslation: translationId,
    showHebrewBadges: false,
    showTranslitBadges: false,
    enableNamePopovers: true,
  });
  
  const stats = getBibleStats();

  // Load settings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('bible-settings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  // Save settings to localStorage
  const saveSettings = (newSettings: Settings) => {
    setSettings(newSettings);
    localStorage.setItem('bible-settings', JSON.stringify(newSettings));
    
    // Apply theme preset
    document.documentElement.setAttribute('data-theme', newSettings.themePreset);
    
    // Apply theme
    if (newSettings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (newSettings.theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      // System theme
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }

    // Apply font size
    document.documentElement.style.fontSize = 
      newSettings.fontSize === 'small' ? '14px' :
      newSettings.fontSize === 'large' ? '18px' : '16px';
  };

  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    saveSettings({ ...settings, theme });
  };

  const handleThemePresetChange = (themePreset: 'classic' | 'midnight' | 'scroll') => {
    saveSettings({ ...settings, themePreset });
  };

  const handleFontSizeChange = (fontSize: 'small' | 'medium' | 'large') => {
    saveSettings({ ...settings, fontSize });
  };

  const handleTranslationChange = async (translationId: string) => {
    await setTranslation(translationId);
    saveSettings({ ...settings, defaultTranslation: translationId });
  };

  return (
    <div className="min-h-screen bg-theme-bg text-theme-text">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold mb-8 text-theme-text"
        >
          Settings
        </motion.h1>

        <div className="space-y-6">
          {/* Theme Setting */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-lg font-semibold mb-3 flex items-center">
              <Palette className="w-5 h-5 mr-2 text-theme-accent" />
              Theme
            </h2>
            <div className="space-y-2">
              {[
                { value: 'light', label: 'Light', description: 'Always use light theme', icon: Sun },
                { value: 'dark', label: 'Dark', description: 'Always use dark theme', icon: Moon },
                { value: 'system', label: 'System', description: 'Follow system preference', icon: Star },
              ].map((option) => (
                <motion.label 
                  key={option.value} 
                  className="flex items-center p-4 bg-theme-surface hover:bg-theme-surface-hover rounded-xl cursor-pointer transition-all duration-200 border border-theme-border"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <input
                    type="radio"
                    name="theme"
                    value={option.value}
                    checked={settings.theme === option.value}
                    onChange={() => handleThemeChange(option.value as any)}
                    className="mr-4 w-4 h-4 text-theme-accent"
                  />
                  <option.icon className="w-5 h-5 mr-3 text-theme-accent" />
                  <div>
                    <div className="font-medium text-theme-text">{option.label}</div>
                    <div className="text-sm text-theme-text/60">{option.description}</div>
                  </div>
                </motion.label>
              ))}
            </div>
          </motion.div>

          {/* Theme Preset */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-lg font-semibold mb-3 flex items-center">
              <Star className="w-5 h-5 mr-2 text-theme-accent" />
              Theme Preset
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { 
                  value: 'classic', 
                  label: 'Classic', 
                  description: 'White & Gold', 
                  icon: Sun,
                  colors: 'bg-gradient-to-br from-white to-yellow-50 border-yellow-200'
                },
                { 
                  value: 'midnight', 
                  label: 'Midnight', 
                  description: 'Dark & Teal', 
                  icon: Moon,
                  colors: 'bg-gradient-to-br from-gray-900 to-teal-900 border-teal-500'
                },
                { 
                  value: 'scroll', 
                  label: 'Scroll', 
                  description: 'Parchment', 
                  icon: Scroll,
                  colors: 'bg-gradient-to-br from-amber-50 to-orange-100 border-amber-300'
                },
              ].map((option) => (
                <motion.label 
                  key={option.value} 
                  className={`relative p-4 rounded-xl cursor-pointer transition-all duration-200 border-2 ${
                    settings.themePreset === option.value 
                      ? 'border-theme-accent shadow-lg' 
                      : 'border-theme-border hover:border-theme-accent/50'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <input
                    type="radio"
                    name="themePreset"
                    value={option.value}
                    checked={settings.themePreset === option.value}
                    onChange={() => handleThemePresetChange(option.value as any)}
                    className="sr-only"
                  />
                  <div className={`absolute inset-0 rounded-xl ${option.colors} opacity-20`}></div>
                  <div className="relative z-10 text-center">
                    <option.icon className="w-6 h-6 mx-auto mb-2 text-theme-accent" />
                    <div className="font-medium text-theme-text">{option.label}</div>
                    <div className="text-sm text-theme-text/60">{option.description}</div>
                  </div>
                </motion.label>
              ))}
            </div>
          </motion.div>

          {/* Font Size Setting */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Font Size</h2>
            <div className="space-y-2">
              {[
                { value: 'small', label: 'Small', description: '14px' },
                { value: 'medium', label: 'Medium', description: '16px (default)' },
                { value: 'large', label: 'Large', description: '18px' },
              ].map((option) => (
                <label key={option.value} className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                  <input
                    type="radio"
                    name="fontSize"
                    value={option.value}
                    checked={settings.fontSize === option.value}
                    onChange={() => handleFontSizeChange(option.value as any)}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-medium">{option.label}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{option.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Default Translation */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Default Translation</h2>
            <div className="space-y-2">
              {[
                { id: 'restored_kjv', label: 'KJV (Restored Names)', description: 'With restored Hebrew names' },
                { id: 'kjv', label: 'KJV', description: 'Original King James Version' },
              ].map((translation) => (
                <label key={translation.id} className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                  <input
                    type="radio"
                    name="translation"
                    value={translation.id}
                    checked={settings.defaultTranslation === translation.id}
                    onChange={() => handleTranslationChange(translation.id)}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-medium">{translation.label}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{translation.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Hebrew Names Display */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Hebrew Names Display</h2>
            <div className="space-y-3">
              <label className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                <input
                  type="checkbox"
                  checked={settings.showHebrewBadges}
                  onChange={(e) => saveSettings({ ...settings, showHebrewBadges: e.target.checked })}
                  className="mr-3"
                />
                <div>
                  <div className="font-medium">Show Hebrew badges</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Display Hebrew text next to restored names</div>
                </div>
              </label>
              
              <label className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                <input
                  type="checkbox"
                  checked={settings.showTranslitBadges}
                  onChange={(e) => saveSettings({ ...settings, showTranslitBadges: e.target.checked })}
                  className="mr-3"
                />
                <div>
                  <div className="font-medium">Show transliteration badges</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Display transliterated Hebrew next to restored names</div>
                </div>
              </label>
              
              <label className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                <input
                  type="checkbox"
                  checked={settings.enableNamePopovers}
                  onChange={(e) => saveSettings({ ...settings, enableNamePopovers: e.target.checked })}
                  className="mr-3"
                />
                <div>
                  <div className="font-medium">Enable name popovers</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Click restored names to see Hebrew details</div>
                </div>
              </label>
            </div>
          </div>

          {/* Bible Data Status */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Bible Data Status</h2>
            <div className="space-y-3">
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div>
                    <div className="text-gray-600 dark:text-gray-400">Translation</div>
                    <div className="font-semibold">
                      {translationId === 'restored_kjv' ? 'KJV (Restored Names)' : 'KJV'}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600 dark:text-gray-400">Status</div>
                    <div className="font-semibold">
                      {bible ? (
                        <span className="text-green-600 dark:text-green-400">✓ Loaded</span>
                      ) : (
                        <span className="text-yellow-600 dark:text-yellow-400">⚠ Not Loaded</span>
                      )}
                    </div>
                  </div>
                  {stats && (
                    <>
                      <div>
                        <div className="text-gray-600 dark:text-gray-400">Books</div>
                        <div className="font-semibold">{stats.books} / 66</div>
                      </div>
                      <div>
                        <div className="text-gray-600 dark:text-gray-400">Verses</div>
                        <div className="font-semibold">{stats.verses.toLocaleString()}</div>
                      </div>
                    </>
                  )}
                </div>
                <button
                  onClick={async () => {
                    setIsReloading(true);
                    try {
                      await setTranslation(translationId);
                      alert('Bible data reloaded successfully!');
                    } catch (error) {
                      alert('Failed to reload Bible data: ' + (error as Error).message);
                    } finally {
                      setIsReloading(false);
                    }
                  }}
                  disabled={isReloading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded font-medium transition-colors"
                >
                  {isReloading ? 'Reloading...' : 'Reload Bible Data'}
                </button>
              </div>
            </div>
          </div>

          {/* Cache Management */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Cache Management</h2>
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">Clear Offline Cache</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Remove cached Bible translations to free up space
                    </div>
                  </div>
                  <button
                    onClick={async () => {
                      if (confirm('Clear all cached Bible data? This will require re-downloading translations.')) {
                        await clearCache();
                        alert('Cache cleared successfully');
                      }
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors"
                  >
                    Clear Cache
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Keyboard Shortcuts */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Keyboard Shortcuts</h2>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span>Previous chapter</span>
                  <kbd className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">[</kbd>
                </div>
                <div className="flex justify-between">
                  <span>Next chapter</span>
                  <kbd className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">]</kbd>
                </div>
                <div className="flex justify-between">
                  <span>Search</span>
                  <kbd className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">/</kbd>
                </div>
                <div className="flex justify-between">
                  <span>Translation</span>
                  <kbd className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">t</kbd>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}