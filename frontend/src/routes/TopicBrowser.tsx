import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Search } from 'lucide-react';
import TopBar from '../components/TopBar';
import { useBibleStore } from '../store/bibleStore';
import topicData from '../data/topicTags.json';

interface Topic {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  verses: Array<{ ref: string; text: string }>;
}

export default function TopicBrowser() {
  const navigate = useNavigate();
  const { translationId, setRef } = useBibleStore();
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const topics = topicData.topics as Topic[];

  const filteredTopics = searchTerm
    ? topics.filter((topic) =>
        topic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        topic.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : topics;

  const handleNavigateToVerse = (ref: string) => {
    const match = ref.match(/^(.+?)\s+(\d+):(\d+)$/);
    if (match) {
      const [, book, chapter, verse] = match;
      setRef(book, chapter, verse);
      navigate(`/${translationId}/${book}/${chapter}/${verse}`);
    }
  };

  const colorClasses: Record<string, string> = {
    red: 'from-red-500 to-pink-500',
    blue: 'from-blue-500 to-cyan-500',
    yellow: 'from-yellow-500 to-orange-500',
    green: 'from-green-500 to-emerald-500',
    orange: 'from-orange-500 to-red-500',
    purple: 'from-purple-500 to-pink-500',
    teal: 'from-teal-500 to-cyan-500',
    pink: 'from-pink-500 to-rose-500',
    indigo: 'from-indigo-500 to-purple-500',
    gold: 'from-yellow-600 to-amber-500',
    cyan: 'from-cyan-500 to-blue-500',
    emerald: 'from-emerald-500 to-teal-500',
  };

  return (
    <div className="min-h-screen bg-theme-bg pb-20">
      <TopBar />

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              if (selectedTopic) {
                setSelectedTopic(null);
              } else {
                navigate(-1);
              }
            }}
            className="text-theme-text/60 hover:text-theme-text transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-theme-text">
              {selectedTopic ? selectedTopic.name : 'Browse by Topic'}
            </h1>
            <p className="text-theme-text/60 text-sm">
              {selectedTopic ? selectedTopic.description : 'Explore verses organized by themes'}
            </p>
          </div>
        </div>

        {!selectedTopic ? (
          <>
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-text/60" size={20} />
              <input
                type="text"
                placeholder="Search topics..."
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-theme-surface border border-theme-border text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-accent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Topics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTopics.map((topic, index) => (
                <motion.button
                  key={topic.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedTopic(topic)}
                  className="text-left bg-theme-surface rounded-xl p-6 border-2 border-theme-border hover:border-theme-accent transition-all group"
                >
                  {/* Icon with Gradient Background */}
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${colorClasses[topic.color] || 'from-gray-500 to-gray-600'} flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform`}>
                    {topic.icon}
                  </div>

                  {/* Topic Info */}
                  <h3 className="text-lg font-semibold text-theme-text mb-2 group-hover:text-theme-accent transition-colors">
                    {topic.name}
                  </h3>
                  <p className="text-sm text-theme-text/70 mb-3">
                    {topic.description}
                  </p>

                  {/* Verse Count */}
                  <div className="flex items-center gap-2 text-xs text-theme-text/60">
                    <BookOpen size={14} />
                    <span>{topic.verses.length} verses</span>
                  </div>
                </motion.button>
              ))}
            </div>

            {filteredTopics.length === 0 && (
              <div className="text-center py-16">
                <Search className="w-16 h-16 text-theme-text/20 mx-auto mb-4" />
                <p className="text-theme-text/60">No topics found matching "{searchTerm}"</p>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Topic Header */}
            <div className="bg-theme-surface rounded-xl p-6 border border-theme-border">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${colorClasses[selectedTopic.color]} flex items-center justify-center text-3xl`}>
                  {selectedTopic.icon}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-theme-text mb-1">
                    {selectedTopic.name}
                  </h2>
                  <p className="text-theme-text/70">{selectedTopic.description}</p>
                </div>
              </div>
            </div>

            {/* Verses List */}
            <div className="space-y-3">
              {selectedTopic.verses.map((verse, index) => (
                <motion.div
                  key={`${verse.ref}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-theme-surface rounded-lg p-4 border border-theme-border hover:border-theme-accent/50 transition-all cursor-pointer group"
                  onClick={() => handleNavigateToVerse(verse.ref)}
                >
                  <div className="flex items-start gap-3">
                    <BookOpen size={18} className="text-theme-accent flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-theme-accent mb-2 group-hover:underline">
                        {verse.ref}
                      </h4>
                      <p className="text-sm text-theme-text/80 italic leading-relaxed">
                        "{verse.text}..."
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

