import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Share2,
  Copy,
  Download,
  Image as ImageIcon,
  Twitter,
  Facebook,
  Mail,
  MessageCircle,
  Link as LinkIcon,
  CheckCircle,
} from 'lucide-react';
import { toPlainText } from '../lib/text';

interface ShareMenuProps {
  isOpen: boolean;
  onClose: () => void;
  verseText: string;
  verseRef: string;
  onGenerateImage?: () => void;
}

export default function ShareMenu({
  isOpen,
  onClose,
  verseText,
  verseRef,
  onGenerateImage,
}: ShareMenuProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = `${verseRef} - The Restored Word`;
  const shareText = `"${toPlainText(verseText)}" - ${verseRef}`;

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        onClose();
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  const handleTwitterShare = () => {
    const tweetText = encodeURIComponent(`${shareText}\n${shareUrl}`);
    window.open(
      `https://twitter.com/intent/tweet?text=${tweetText}`,
      '_blank',
      'width=550,height=420'
    );
  };

  const handleFacebookShare = () => {
    const fbUrl = encodeURIComponent(shareUrl);
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${fbUrl}`,
      '_blank',
      'width=550,height=420'
    );
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(shareTitle);
    const body = encodeURIComponent(`${shareText}\n\n${shareUrl}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handleSMSShare = () => {
    const smsText = encodeURIComponent(`${shareText}\n${shareUrl}`);
    // iOS uses '&' separator, Android uses '?'
    const separator = /iPhone|iPad|iPod/.test(navigator.userAgent) ? '&' : '?';
    window.location.href = `sms:${separator}body=${smsText}`;
  };

  const shareOptions = [
    {
      id: 'native',
      label: 'Share',
      icon: Share2,
      action: handleNativeShare,
      show: typeof navigator !== 'undefined' && !!navigator.share,
      color: 'bg-theme-accent',
    },
    {
      id: 'image',
      label: 'Create Image',
      icon: ImageIcon,
      action: () => {
        onGenerateImage?.();
        onClose();
      },
      show: !!onGenerateImage,
      color: 'bg-purple-500',
    },
    {
      id: 'copy',
      label: copied ? 'Copied!' : 'Copy Text',
      icon: copied ? CheckCircle : Copy,
      action: handleCopyText,
      show: true,
      color: copied ? 'bg-green-500' : 'bg-blue-500',
    },
    {
      id: 'link',
      label: 'Copy Link',
      icon: LinkIcon,
      action: handleCopyLink,
      show: true,
      color: 'bg-gray-500',
    },
    {
      id: 'twitter',
      label: 'Twitter',
      icon: Twitter,
      action: handleTwitterShare,
      show: true,
      color: 'bg-[#1DA1F2]',
    },
    {
      id: 'facebook',
      label: 'Facebook',
      icon: Facebook,
      action: handleFacebookShare,
      show: true,
      color: 'bg-[#4267B2]',
    },
    {
      id: 'email',
      label: 'Email',
      icon: Mail,
      action: handleEmailShare,
      show: true,
      color: 'bg-orange-500',
    },
    {
      id: 'sms',
      label: 'Message',
      icon: MessageCircle,
      action: handleSMSShare,
      show: true,
      color: 'bg-green-600',
    },
  ];

  const visibleOptions = shareOptions.filter((option) => option.show);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-end md:items-center justify-center z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25 }}
          className="bg-theme-surface rounded-t-2xl md:rounded-2xl w-full md:max-w-md max-h-[80vh] overflow-y-auto shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-theme-surface border-b border-theme-border p-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-theme-text">Share Verse</h3>
            <button
              onClick={onClose}
              className="text-theme-text/60 hover:text-theme-text transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Verse Preview */}
          <div className="p-4 bg-theme-bg/50 border-b border-theme-border">
            <p className="text-sm text-theme-text/80 italic mb-2">
              "{verseText.length > 150 ? `${verseText.slice(0, 150)}...` : verseText}"
            </p>
            <p className="text-sm font-semibold text-theme-accent">{verseRef}</p>
          </div>

          {/* Share Options Grid */}
          <div className="p-4">
            <div className="grid grid-cols-4 gap-3 mb-4">
              {visibleOptions.map((option, index) => (
                <motion.button
                  key={option.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={option.action}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-theme-bg transition-colors"
                >
                  <div
                    className={`w-12 h-12 ${option.color} rounded-full flex items-center justify-center text-white`}
                  >
                    <option.icon size={20} />
                  </div>
                  <span className="text-xs text-theme-text text-center leading-tight">
                    {option.label}
                  </span>
                </motion.button>
              ))}
            </div>

            {/* Tip */}
            <div className="text-xs text-theme-text/60 text-center mt-4 p-3 bg-theme-bg rounded-lg">
              💡 Tip: Use "Create Image" to generate a beautiful shareable card!
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

