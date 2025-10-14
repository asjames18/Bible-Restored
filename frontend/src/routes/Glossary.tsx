import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBibleStore } from '../store/bibleStore';
import { loadHebrewLexicon, getHighlightedNames, type HebrewName } from '../lib/nameHighlighter';

export default function Glossary() {
  const navigate = useNavigate();
  const { bible, translationId } = useBibleStore();
  const [names, setNames] = useState<HebrewName[]>([]);
  const [occurrenceCounts, setOccurrenceCounts] = useState<Record<string, number>>({});
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'count' | 'category'>('name');

  useEffect(() => {
    loadHebrewLexicon().then((loadedNames) => {
      setNames(loadedNames);
    });
  }, []);

  useEffect(() => {
    if (bible && names.length > 0) {
      const counts: Record<string, number> = {};
      
      // Count occurrences of each name in the current translation
      Object.values(bible).forEach(chapters => {
        Object.values(chapters).forEach(verses => {
          Object.values(verses).forEach(text => {
            const foundNames = getHighlightedNames(text);
            foundNames.forEach(name => {
              counts[name.id] = (counts[name.id] || 0) + 1;
            });
          });
        });
      });
      
      setOccurrenceCounts(counts);
    }
  }, [bible, names]);

  const filteredAndSortedNames = names
    .filter(name => 
      name.label.toLowerCase().includes(filter.toLowerCase()) ||
      name.hebrew.includes(filter) ||
      name.meaning.toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'count':
          return (occurrenceCounts[b.id] || 0) - (occurrenceCounts[a.id] || 0);
        case 'category':
          return a.category.localeCompare(b.category);
        case 'name':
        default:
          return a.label.localeCompare(b.label);
      }
    });

  const handleViewOccurrences = (nameLabel: string) => {
    navigate('/search', { 
      state: { 
        searchQuery: nameLabel,
        hebrewOnly: true 
      } 
    });
  };

  const categories = [...new Set(names.map(n => n.category))];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Hebrew Names Glossary</h1>
        
        {/* Filters and Controls */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Search names, Hebrew text, or meanings..."
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="name">Sort by Name</option>
                <option value="count">Sort by Occurrences</option>
                <option value="category">Sort by Category</option>
              </select>
            </div>
          </div>
          
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {filteredAndSortedNames.length} of {names.length} names
            {translationId === 'restored_kjv' && ' (Restored Names translation)'}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('')}
              className={`px-3 py-1 rounded-full text-sm ${
                filter === '' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              All
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-3 py-1 rounded-full text-sm capitalize ${
                  filter === category 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Names Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAndSortedNames.map((name) => (
            <div
              key={name.id}
              className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                    {name.label}
                  </h3>
                  <div className="text-2xl text-blue-600 dark:text-blue-400 mt-1">
                    {name.hebrew}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {occurrenceCounts[name.id] || 0} occurrences
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 capitalize">
                    {name.category}
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Transliteration:</span>
                  <span className="ml-2 text-gray-900 dark:text-gray-100">{name.transliteration}</span>
                </div>
                
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Meaning:</span>
                  <span className="ml-2 text-gray-900 dark:text-gray-100">{name.meaning}</span>
                </div>
              </div>

              <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                {name.context}
              </div>

              {name.references.length > 0 && (
                <div className="mt-3 text-sm">
                  <div className="font-medium text-gray-700 dark:text-gray-300 mb-1">References:</div>
                  <div className="text-gray-900 dark:text-gray-100">
                    {name.references.slice(0, 2).join(', ')}
                    {name.references.length > 2 && ` +${name.references.length - 2} more`}
                  </div>
                </div>
              )}

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleViewOccurrences(name.label)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm transition-colors"
                >
                  View Occurrences
                </button>
                <button
                  onClick={() => navigator.clipboard.writeText(name.label)}
                  className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 px-3 py-2 rounded text-sm transition-colors"
                  title="Copy name"
                >
                  📋
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredAndSortedNames.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">
              No names found matching "{filter}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}