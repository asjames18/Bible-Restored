import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useBibleStore } from '../store/bibleStore';
import { clearCache } from '../lib/data';
import { Palette, Sun, Moon, Scroll, Star, Download, Upload, Info, Mail } from 'lucide-react';
import { 
  downloadExportedData, 
  importUserData, 
  parseImportFile, 
  getExportSummary, 
  getExportSize 
} from '../lib/export';

interface Settings {
  theme: 'light' | 'dark' | 'system';
  themePreset: 'classic' | 'midnight' | 'scroll';
  fontSize: 'small' | 'medium' | 'large';
  defaultTranslation: string;
  showHebrewBadges: boolean;
  showTranslitBadges: boolean;
  enableNamePopovers: boolean;
  showTranslatorNotes: boolean;
  dyslexiaMode: boolean;
  focusMode: boolean;
  nightLightMode: boolean;
}

export default function Settings() {
  const { translationId, setTranslation, getBibleStats, bible } = useBibleStore();
  const [isReloading, setIsReloading] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [settings, setSettings] = useState<Settings>({
    theme: 'system',
    themePreset: 'classic',
    fontSize: 'medium',
    defaultTranslation: translationId,
    showHebrewBadges: false,
    showTranslitBadges: false,
    enableNamePopovers: true,
    showTranslatorNotes: true,
    dyslexiaMode: false,
    focusMode: false,
    nightLightMode: false,
  });
  
  const stats = getBibleStats();
  const exportSummary = getExportSummary();

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

    // Apply accessibility modes
    if (newSettings.dyslexiaMode) {
      document.body.classList.add('dyslexia-mode');
    } else {
      document.body.classList.remove('dyslexia-mode');
    }

    if (newSettings.focusMode) {
      document.body.classList.add('focus-mode-active');
    } else {
      document.body.classList.remove('focus-mode-active');
    }

    if (newSettings.nightLightMode) {
      document.body.classList.add('night-light-mode');
    } else {
      document.body.classList.remove('night-light-mode');
    }
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

  const handleEmailSupport = () => {
    const subject = encodeURIComponent('Bible App Support');
    const body = encodeURIComponent(
      `Hello James,\n\nI need help with the Bible app.\n\n---\nURL: ${window.location.href}\nUser-Agent: ${navigator.userAgent}`
    );
    window.location.href = `mailto:asjames18@proton.me?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen bg-theme-bg text-theme-text page-content-mobile">
      <div className="max-w-2xl mx-auto container-mobile py-4 md:py-8">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-mobile-title md:text-3xl font-bold mb-6 md:mb-8 text-theme-text"
        >
          Settings
        </motion.h1>

        <div className="space-y-5 md:space-y-6">
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
            <h2 className="text-base md:text-lg font-semibold mb-3 flex items-center">
              <Star className="w-5 h-5 mr-2 text-theme-accent" />
              Theme Preset
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
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

          {/* Translator Notes */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Translator Notes</h2>
            <div className="space-y-3">
              <label className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                <input
                  type="checkbox"
                  checked={settings.showTranslatorNotes}
                  onChange={(e) => saveSettings({ ...settings, showTranslatorNotes: e.target.checked })}
                  className="mr-3"
                />
                <div>
                  <div className="font-medium">Show translator notes</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Display KJV translator notes in curly braces {'{...}'} with helpful icons and tooltips
                  </div>
                </div>
              </label>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-xs text-blue-800 dark:text-blue-200 leading-relaxed">
                  <strong>What are translator notes?</strong> These are KJV marginal notes showing:
                  <br/>• Words added for English clarity (e.g., "{'{it was}'}")
                  <br/>• Literal Hebrew translations
                  <br/>• Alternative renderings
                  <br/>Hover over the ℹ️ icon to see explanations.
                </p>
              </div>
            </div>
          </div>

          {/* Accessibility Settings */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Accessibility</h2>
            <div className="space-y-3">
              <label className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                <input
                  type="checkbox"
                  checked={settings.dyslexiaMode}
                  onChange={(e) => saveSettings({ ...settings, dyslexiaMode: e.target.checked })}
                  className="mr-3"
                />
                <div>
                  <div className="font-medium">Dyslexia-Friendly Mode</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Enhanced readability with increased spacing, larger text, and clearer fonts
                  </div>
                </div>
              </label>

              <label className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                <input
                  type="checkbox"
                  checked={settings.focusMode}
                  onChange={(e) => saveSettings({ ...settings, focusMode: e.target.checked })}
                  className="mr-3"
                />
                <div>
                  <div className="font-medium">Enhanced Focus Mode</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Dim surrounding content to highlight the reading area
                  </div>
                </div>
              </label>

              <label className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                <input
                  type="checkbox"
                  checked={settings.nightLightMode}
                  onChange={(e) => saveSettings({ ...settings, nightLightMode: e.target.checked })}
                  className="mr-3"
                />
                <div>
                  <div className="font-medium">Night Light Mode</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Warm color temperature for comfortable bedtime reading
                  </div>
                </div>
              </label>

              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-xs text-blue-800 dark:text-blue-200 leading-relaxed">
                  <strong>Accessibility Features:</strong>
                  <br/>• Dyslexia mode improves readability with optimized spacing
                  <br/>• Focus mode helps concentrate on current reading
                  <br/>• Night light reduces eye strain in low-light conditions
                </p>
              </div>
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
                        <div className="font-semibold">{stats.books}</div>
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

          {/* Data Export/Import */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Backup & Restore</h2>
            <div className="space-y-3">
              {/* Export Section */}
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Info className="w-5 h-5 text-blue-500 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-medium">Export Your Data</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Save bookmarks, notes, highlights, reading plans, prayers, and memory verses
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {exportSummary.bookmarks} bookmarks • {exportSummary.notes} notes • {exportSummary.highlights} highlights • {exportSummary.plans} plans • {exportSummary.prayers} prayers • {exportSummary.memoryVerses} memory verses (~{getExportSize()})
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      downloadExportedData();
                      alert('Data exported successfully!');
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Export Data
                  </button>
                </div>
              </div>

              {/* Import Section */}
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Info className="w-5 h-5 text-green-500 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-medium">Import Your Data</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Restore from a previously exported backup file
                      </div>
                    </div>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      setIsImporting(true);
                      try {
                        const data = await parseImportFile(file);
                        const result = importUserData(data);
                        
                        if (result.success) {
                          const counts = result.imported.reduce((acc, item) => {
                            acc[item] = (acc[item] || 0) + 1;
                            return acc;
                          }, {} as Record<string, number>);
                          
                          const summary = Object.entries(counts)
                            .map(([key, value]) => `${value} ${key}${value > 1 ? 's' : ''}`)
                            .join(', ');
                          
                          alert(`Successfully imported: ${summary}`);
                        } else {
                          alert(`Import completed with errors:\n${result.errors.join('\n')}`);
                        }
                      } catch (error) {
                        alert(`Failed to import: ${error}`);
                      } finally {
                        setIsImporting(false);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = '';
                        }
                      }
                    }}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isImporting}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    {isImporting ? 'Importing...' : 'Import Data'}
                  </button>
                </div>
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

          {/* Support */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Support</h2>
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <button
                onClick={handleEmailSupport}
                className="w-full bg-theme-accent hover:bg-theme-accent-dark text-white px-4 py-2 rounded font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" />
                Email Support
              </button>
              <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                Opens your email client with helpful context like your current page and device info.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}