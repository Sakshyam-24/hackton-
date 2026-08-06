'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  FileText,
  Scale,
  Loader2,
  Sparkles,
  BookOpen,
  SlidersHorizontal,
  TrendingUp,
} from 'lucide-react';
import { AnimatedLines } from '@/components/AnimatedLines/AnimatedLines';

interface SearchResult {
  content: string;
  document_title: string;
  document_type: string;
  score: number;
  chunk_id: string;
  legal_category: string;
}

const CATEGORIES = [
  'All Categories',
  'Constitutional Law',
  'Criminal Law',
  'Civil Law',
  'Family Law',
  'Property Law',
  'Contract Law',
  'Labour Law',
  'Tax Law',
];

const SUGGESTED = [
  'Fundamental rights under Indian Constitution',
  'Grounds for divorce under Hindu Marriage Act',
  'Employer termination rights',
  'Property inheritance rules',
];

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All Categories');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');

  const runSearch = async (q?: string) => {
    const searchQuery = (q ?? query).trim();
    if (!searchQuery) return;

    setLoading(true);
    setError('');
    setSearched(true);
    try {
      const res = await fetch('http://localhost:8000/api/v1/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: searchQuery,
          top_k: 10,
          legal_category:
            category === 'All Categories' ? undefined : category,
        }),
      });
      if (!res.ok) throw new Error('Search failed');
      const data = await res.json();
      setResults(data.results ?? []);
    } catch {
      setError('Search service unavailable. The vector index may be empty.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = (score: number) => {
    if (score >= 0.7) return 'text-white bg-white/10 border-white/30';
    if (score >= 0.4) return 'text-gray-200 bg-white/5 border-white/15';
    return 'text-gray-400 bg-white/5 border-white/10';
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-20 relative overflow-hidden">
      <AnimatedLines opacity={0.3} density={0.6} className="z-0" />
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 text-white text-sm font-semibold rounded-full border border-white/10 mb-5">
            <Search className="w-4 h-4" />
            Legal Search
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Search the{' '}
            <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Legal Database
            </span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Find statutes, sections, and legal information with natural
            language search across indexed documents.
          </p>
        </motion.div>

        {/* Search Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="glass rounded-2xl p-4 mb-6"
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && runSearch()}
                placeholder="e.g. What are the grounds for divorce?"
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-white/20 focus:border-white/20 outline-none text-white placeholder-gray-500 transition-all"
              />
            </div>
            <button
              onClick={() => runSearch()}
              disabled={loading || !query.trim()}
              className="px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 disabled:bg-white/30 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Sparkles className="w-5 h-5" />
              )}
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-gray-500" />
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 text-sm rounded-full border transition-all ${
                  category === cat
                    ? 'bg-white text-black border-white font-medium'
                    : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/30 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Suggested searches */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-10"
        >
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-400 font-medium">
              Try searching:
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setQuery(s);
                  runSearch(s);
                }}
                className="px-4 py-2 text-sm rounded-full bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white hover:border-white/30 transition-all"
              >
                {s}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Results */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {searched && !loading && !error && (
          <div className="mb-4">
            <p className="text-sm text-gray-400">
              {results.length} result{results.length !== 1 ? 's' : ''} for{' '}
              <span className="text-white font-medium">&quot;{query}&quot;</span>
            </p>
          </div>
        )}

        <div className="space-y-4">
          {results.map((result, index) => (
            <motion.div
              key={result.chunk_id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
              whileHover={{ y: -3 }}
              className="glass rounded-2xl p-6 hover:border-white/20 transition-all"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">
                      {result.document_title || 'Legal Document'}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-gray-500 uppercase tracking-wide">
                        {result.document_type}
                      </span>
                      {result.legal_category && (
                        <span className="inline-flex items-center gap-1 text-xs text-gray-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
                          <Scale className="w-3 h-3" />
                          {result.legal_category}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <span
                  className={`shrink-0 px-2.5 py-1 rounded-full border text-sm font-medium ${scoreColor(
                    result.score
                  )}`}
                >
                  {(result.score * 100).toFixed(0)}%
                </span>
              </div>
              <p className="text-gray-400 leading-relaxed text-sm line-clamp-4">
                {result.content}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Empty state */}
        {searched && !loading && !error && results.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-white/10 mb-4">
              <BookOpen className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No results found
            </h3>
            <p className="text-gray-400">
              Try a different query or add documents to the knowledge base.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
