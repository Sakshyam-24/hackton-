'use client';

import { BookOpen, ExternalLink } from 'lucide-react';
import type { Citation } from '@/types';

interface CitationCardProps {
  citation: Citation;
}

export default function CitationCard({ citation }: CitationCardProps) {
  const getRelevanceColor = (relevance: number) => {
    if (relevance >= 80) return 'bg-green-100 text-green-700';
    if (relevance >= 60) return 'bg-yellow-100 text-yellow-700';
    return 'bg-orange-100 text-orange-700';
  };

  return (
    <div className="bg-white border border-dark-200 rounded-lg p-3 hover:border-primary-300 transition-colors group">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2 min-w-0">
          <BookOpen className="h-4 w-4 text-primary-600 mt-0.5 flex-shrink-0" />
          <div className="min-w-0">
            <h4 className="text-sm font-medium text-dark-900 truncate">
              {citation.title}
            </h4>
            <p className="text-xs text-dark-500 mt-0.5">
              {citation.act} - {citation.section}
            </p>
            <p className="text-xs text-dark-600 mt-1 line-clamp-2">
              {citation.description}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`text-xs px-2 py-0.5 rounded-full ${getRelevanceColor(citation.relevance)}`}>
            {citation.relevance}% match
          </span>
          <button className="p-1 text-dark-400 hover:text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity">
            <ExternalLink className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
