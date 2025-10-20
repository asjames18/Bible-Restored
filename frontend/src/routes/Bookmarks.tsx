import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bookmark, Trash2, FolderPlus, Folder, ArrowLeft, Search } from 'lucide-react';
import { useStudyStore } from '../store/studyStore';
import TopBar from '../components/TopBar';

export default function Bookmarks() {
  const navigate = useNavigate();
  const { bookmarks, removeBookmark } = useStudyStore();
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Get unique folders
  const folders = useMemo(() => {
    const folderSet = new Set<string>();
    bookmarks.forEach(b => {
      if (b.folder) folderSet.add(b.folder);
    });
    return Array.from(folderSet).sort();
  }, [bookmarks]);

  // Filter bookmarks
  const filteredBookmarks = useMemo(() => {
    let filtered = bookmarks;

    // Filter by folder
    if (selectedFolder !== null) {
      filtered = filtered.filter(b => b.folder === selectedFolder);
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(b =>
        b.verseRef.toLowerCase().includes(query) ||
        b.verseText?.toLowerCase().includes(query)
      );
    }

    return filtered.sort((a, b) => b.createdAt - a.createdAt);
  }, [bookmarks, selectedFolder, searchQuery]);

  const handleVerseClick = (verseRef: string) => {
    // Parse verse reference like "Genesis 1:1"
    const parts = verseRef.match(/^(.+?)\s+(\d+):(\d+)$/);
    if (parts) {
      const [, book, chapter] = parts;
      navigate(`/restored_kjv/${book}/${chapter}`);
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-theme-bg pb-20">
      <TopBar />

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="text-theme-text/60 hover:text-theme-text transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-theme-text">Bookmarked Verses</h1>
            <p className="text-theme-text/60 text-sm">{bookmarks.length} saved verses</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-theme-text/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search bookmarks..."
            className="w-full pl-12 pr-4 py-3 bg-theme-surface border border-theme-border rounded-xl text-theme-text placeholder:text-theme-text/40 focus:outline-none focus:ring-2 focus:ring-theme-accent"
          />
        </div>

        {/* Folder Filter */}
        {folders.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <motion.button
              onClick={() => setSelectedFolder(null)}
              className={`px-4 py-2 rounded-full whitespace-nowrap flex items-center gap-2 ${
                selectedFolder === null
                  ? 'bg-theme-accent text-white'
                  : 'bg-theme-surface text-theme-text border border-theme-border'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              <Folder className="w-4 h-4" />
              All
            </motion.button>
            {folders.map((folder) => (
              <motion.button
                key={folder}
                onClick={() => setSelectedFolder(folder)}
                className={`px-4 py-2 rounded-full whitespace-nowrap flex items-center gap-2 ${
                  selectedFolder === folder
                    ? 'bg-theme-accent text-white'
                    : 'bg-theme-surface text-theme-text border border-theme-border'
                }`}
                whileTap={{ scale: 0.95 }}
              >
                <Folder className="w-4 h-4" />
                {folder}
              </motion.button>
            ))}
          </div>
        )}

        {/* Bookmarks List */}
        {filteredBookmarks.length === 0 ? (
          <div className="text-center py-16">
            <Bookmark className="w-16 h-16 mx-auto text-theme-text/20 mb-4" />
            <p className="text-theme-text/60">
              {searchQuery || selectedFolder !== null
                ? 'No bookmarks found'
                : 'No bookmarks yet. Start bookmarking verses while reading!'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredBookmarks.map((bookmark) => (
              <motion.div
                key={bookmark.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-theme-surface border border-theme-border rounded-xl p-4 hover:border-theme-accent transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div 
                    className="flex-1 cursor-pointer"
                    onClick={() => handleVerseClick(bookmark.verseRef)}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Bookmark className="w-4 h-4 text-theme-accent fill-theme-accent" />
                      <h3 className="font-semibold text-theme-accent">
                        {bookmark.verseRef}
                      </h3>
                      {bookmark.folder && (
                        <span className="text-xs px-2 py-1 bg-theme-accent/10 text-theme-accent rounded-full">
                          {bookmark.folder}
                        </span>
                      )}
                    </div>
                    {bookmark.verseText && (
                      <p className="text-theme-text/80 text-sm leading-relaxed line-clamp-2">
                        {bookmark.verseText}
                      </p>
                    )}
                    <p className="text-theme-text/40 text-xs mt-2">
                      {formatDate(bookmark.createdAt)}
                    </p>
                  </div>
                  <motion.button
                    onClick={() => removeBookmark(bookmark.id)}
                    className="text-theme-text/40 hover:text-red-500 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="Remove bookmark"
                  >
                    <Trash2 className="w-5 h-5" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

