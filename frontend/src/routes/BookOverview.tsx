import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Calendar, User, Target, BookText, Tag } from 'lucide-react';
import TopBar from '../components/TopBar';
import bookSummariesData from '../data/bookSummaries.json';
import { useBibleStore } from '../store/bibleStore';

interface BookSummary {
  author: string;
  date: string;
  purpose: string;
  overview: string;
  keyThemes: string[];
  chapters: number;
  testament: string;
}

export default function BookOverview() {
  const { book } = useParams<{ book: string }>();
  const navigate = useNavigate();
  const { translationId } = useBibleStore();
  
  const summaries = bookSummariesData as Record<string, BookSummary>;
  const bookData = book ? summaries[book] : null;

  if (!bookData || !book) {
    return (
      <div className="min-h-screen bg-theme-bg pb-20">
        <TopBar />
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 mx-auto text-theme-text/20 mb-4" />
            <p className="text-theme-text/60">Book not found</p>
          </div>
        </div>
      </div>
    );
  }

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
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs px-2 py-1 bg-theme-accent/10 text-theme-accent rounded-full font-medium">
                {bookData.testament} Testament
              </span>
              <span className="text-xs text-theme-text/60">{bookData.chapters} chapters</span>
            </div>
            <h1 className="text-3xl font-bold text-theme-text">{book}</h1>
          </div>
        </div>

        {/* Main Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-theme-surface rounded-2xl border border-theme-border overflow-hidden"
        >
          {/* Overview Section */}
          <div className="p-6 space-y-6">
            {/* Author */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-theme-accent/10 flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-theme-accent" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-theme-text/70 mb-1">Author</h3>
                <p className="text-theme-text">{bookData.author}</p>
              </div>
            </div>

            {/* Date Written */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-blue-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-theme-text/70 mb-1">Date Written</h3>
                <p className="text-theme-text">{bookData.date}</p>
              </div>
            </div>

            {/* Purpose */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                <Target className="w-5 h-5 text-green-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-theme-text/70 mb-1">Purpose</h3>
                <p className="text-theme-text leading-relaxed">{bookData.purpose}</p>
              </div>
            </div>

            {/* Overview */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                <BookText className="w-5 h-5 text-purple-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-theme-text/70 mb-1">Overview</h3>
                <p className="text-theme-text leading-relaxed">{bookData.overview}</p>
              </div>
            </div>

            {/* Key Themes */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                <Tag className="w-5 h-5 text-orange-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-theme-text/70 mb-2">Key Themes</h3>
                <div className="flex flex-wrap gap-2">
                  {bookData.keyThemes.map((theme) => (
                    <span
                      key={theme}
                      className="px-3 py-1 bg-theme-accent/10 text-theme-accent rounded-full text-sm font-medium"
                    >
                      {theme}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Start Reading Button */}
          <div className="p-6 bg-theme-bg/50 border-t border-theme-border">
            <motion.button
              onClick={() => navigate(`/${translationId}/${book}/1`)}
              className="w-full py-4 px-6 bg-theme-accent hover:bg-theme-accent/90 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <BookOpen className="w-5 h-5" />
              Start Reading {book}
            </motion.button>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-theme-surface rounded-xl p-4 border border-theme-border text-center">
            <p className="text-3xl font-bold text-theme-accent">{bookData.chapters}</p>
            <p className="text-sm text-theme-text/60 mt-1">Chapters</p>
          </div>
          <div className="bg-theme-surface rounded-xl p-4 border border-theme-border text-center">
            <p className="text-3xl font-bold text-theme-accent">{bookData.keyThemes.length}</p>
            <p className="text-sm text-theme-text/60 mt-1">Key Themes</p>
          </div>
        </div>
      </div>
    </div>
  );
}

