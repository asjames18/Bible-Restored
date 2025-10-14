import { useState, useEffect } from 'react';
import { useBibleStore } from '../store/bibleStore';
import { clearCache } from '../lib/data';

interface Settings {
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';
  defaultTranslation: string;
  showHebrewBadges: boolean;
  showTranslitBadges: boolean;
  enableNamePopovers: boolean;
}

export default function Settings() {
  const { translationId, setTranslation } = useBibleStore();
  const [settings, setSettings] = useState<Settings>({
    theme: 'system',
    fontSize: 'medium',
    defaultTranslation: translationId,
    showHebrewBadges: false,
    showTranslitBadges: false,
    enableNamePopovers: true,
  });

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

  const handleFontSizeChange = (fontSize: 'small' | 'medium' | 'large') => {
    saveSettings({ ...settings, fontSize });
  };

  const handleTranslationChange = async (translationId: string) => {
    await setTranslation(translationId);
    saveSettings({ ...settings, defaultTranslation: translationId });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>

        <div className="space-y-6">
          {/* Theme Setting */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Theme</h2>
            <div className="space-y-2">
              {[
                { value: 'light', label: 'Light', description: 'Always use light theme' },
                { value: 'dark', label: 'Dark', description: 'Always use dark theme' },
                { value: 'system', label: 'System', description: 'Follow system preference' },
              ].map((option) => (
                <label key={option.value} className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                  <input
                    type="radio"
                    name="theme"
                    value={option.value}
                    checked={settings.theme === option.value}
                    onChange={() => handleThemeChange(option.value as any)}
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