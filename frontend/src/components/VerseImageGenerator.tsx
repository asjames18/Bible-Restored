import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Share2, Copy, Check, Palette } from 'lucide-react';
import {
  generateVerseCard,
  downloadImage,
  shareImage,
  copyImageToClipboard,
  themes,
  type VerseCardTheme,
} from '../lib/imageGenerator';

interface VerseImageGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  verseText: string;
  verseRef: string;
}

export default function VerseImageGenerator({
  isOpen,
  onClose,
  verseText,
  verseRef,
}: VerseImageGeneratorProps) {
  const [selectedTheme, setSelectedTheme] = useState<VerseCardTheme>(themes[0]);
  const [generatedImage, setGeneratedImage] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  // Generate image when theme changes
  useEffect(() => {
    if (isOpen) {
      handleGenerate();
    }
  }, [selectedTheme, isOpen]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const dataUrl = await generateVerseCard({
        verseText,
        verseRef,
        theme: selectedTheme,
        width: 1200,
        height: 630,
        includeAppName: true,
      });
      setGeneratedImage(dataUrl);
    } catch (error) {
      console.error('Failed to generate image:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      const filename = `${verseRef.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.png`;
      downloadImage(generatedImage, filename);
    }
  };

  const handleShare = async () => {
    if (generatedImage) {
      const success = await shareImage(generatedImage, verseRef, verseText);
      if (success) {
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      }
    }
  };

  const handleCopy = async () => {
    if (generatedImage) {
      const success = await copyImageToClipboard(generatedImage);
      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 25 }}
          className="bg-theme-surface rounded-2xl w-full max-w-4xl shadow-2xl my-8"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 md:p-6 border-b border-theme-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-theme-accent/10 rounded-lg flex items-center justify-center">
                <Palette className="w-5 h-5 text-theme-accent" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-theme-text">Create Verse Card</h3>
                <p className="text-sm text-theme-text/60">Customize and share your verse</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-theme-text/60 hover:text-theme-text transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="p-4 md:p-6 space-y-6">
            {/* Preview */}
            <div className="relative">
              {isGenerating ? (
                <div className="aspect-[1200/630] bg-theme-bg rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-theme-accent border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                    <p className="text-theme-text/60">Generating...</p>
                  </div>
                </div>
              ) : generatedImage ? (
                <motion.img
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  src={generatedImage}
                  alt="Generated verse card"
                  className="w-full rounded-xl shadow-lg"
                />
              ) : (
                <div className="aspect-[1200/630] bg-theme-bg rounded-xl flex items-center justify-center">
                  <p className="text-theme-text/60">Select a theme to generate</p>
                </div>
              )}
            </div>

            {/* Theme Selector */}
            <div>
              <h4 className="text-sm font-semibold text-theme-text mb-3">Choose Theme</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {themes.map((theme) => (
                  <motion.button
                    key={theme.id}
                    onClick={() => setSelectedTheme(theme)}
                    className={`relative p-4 rounded-xl border-2 transition-all ${
                      selectedTheme.id === theme.id
                        ? 'border-theme-accent bg-theme-accent/5'
                        : 'border-theme-border hover:border-theme-accent/50'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Theme Preview */}
                    <div
                      className="w-full h-16 rounded-lg mb-2"
                      style={{
                        background: typeof theme.background === 'string' 
                          ? theme.background.includes('gradient') 
                            ? theme.background.replace('linear-gradient', 'linear-gradient')
                            : theme.background
                          : theme.background,
                      }}
                    />
                    <p className="text-sm font-medium text-theme-text">{theme.name}</p>
                    {selectedTheme.id === theme.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-2 right-2 w-6 h-6 bg-theme-accent rounded-full flex items-center justify-center"
                      >
                        <Check size={14} className="text-white" />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <motion.button
                onClick={handleDownload}
                disabled={!generatedImage}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-theme-accent hover:bg-theme-accent/90 disabled:bg-theme-accent/50 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors"
                whileHover={{ scale: generatedImage ? 1.02 : 1 }}
                whileTap={{ scale: generatedImage ? 0.98 : 1 }}
              >
                <Download size={20} />
                Download
              </motion.button>

              {navigator.share && (
                <motion.button
                  onClick={handleShare}
                  disabled={!generatedImage}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors"
                  whileHover={{ scale: generatedImage ? 1.02 : 1 }}
                  whileTap={{ scale: generatedImage ? 0.98 : 1 }}
                >
                  {shared ? <Check size={20} /> : <Share2 size={20} />}
                  {shared ? 'Shared!' : 'Share'}
                </motion.button>
              )}

              <motion.button
                onClick={handleCopy}
                disabled={!generatedImage}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 disabled:bg-green-500/50 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors"
                whileHover={{ scale: generatedImage ? 1.02 : 1 }}
                whileTap={{ scale: generatedImage ? 0.98 : 1 }}
              >
                {copied ? <Check size={20} /> : <Copy size={20} />}
                {copied ? 'Copied!' : 'Copy'}
              </motion.button>
            </div>

            {/* Info */}
            <div className="text-xs text-theme-text/60 text-center p-3 bg-theme-bg rounded-lg">
              💡 Your verse card is ready to share on social media! Image size: 1200x630px
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

