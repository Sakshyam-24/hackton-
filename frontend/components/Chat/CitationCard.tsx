'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ChevronDown, ChevronUp, Copy, Check, ExternalLink } from 'lucide-react';
import type { Citation } from '@/types';
import ConfidenceMeter from './ConfidenceMeter';

interface CitationCardProps {
  citation: Citation;
}

function getDocTypeBadge(act: string): { label: string; color: string } {
  const lower = act.toLowerCase();
  if (lower.includes('ipc') || lower.includes('penal'))
    return { label: 'Criminal', color: 'bg-white/10 text-white border-white/10' };
  if (lower.includes('constitution'))
    return { label: 'Constitutional', color: 'bg-white/10 text-white border-white/10' };
  if (lower.includes('contract') || lower.includes('civil'))
    return { label: 'Civil', color: 'bg-white/10 text-white border-white/10' };
  if (lower.includes('family') || lower.includes('marriage') || lower.includes('divorce'))
    return { label: 'Family', color: 'bg-white/10 text-white border-white/10' };
  if (lower.includes('consumer'))
    return { label: 'Consumer', color: 'bg-white/10 text-white border-white/10' };
  if (lower.includes('it act') || lower.includes('cyber'))
    return { label: 'Cyber', color: 'bg-white/10 text-white border-white/10' };
  return { label: 'Legal', color: 'bg-white/10 text-white border-white/10' };
}

export default function CitationCard({ citation }: CitationCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const badge = getDocTypeBadge(citation.act);

  const handleCopy = async () => {
    const text = `${citation.title} — ${citation.act}, ${citation.section}\n${citation.description}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="group relative rounded-xl border border-white/5 bg-white/[0.02] hover:border-white/15 hover:bg-white/5 transition-all duration-200 overflow-hidden"
    >
      <div className="p-3.5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5 min-w-0 flex-1">
            <div className="mt-0.5 p-1.5 rounded-lg bg-white/5 border border-white/10 flex-shrink-0">
              <BookOpen className="h-3.5 w-3.5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-semibold text-white leading-snug">
                {citation.title}
              </h4>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${badge.color}`}>
                  {badge.label}
                </span>
                <span className="text-xs text-gray-400 font-mono">
                  {citation.act} — {citation.section}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <ConfidenceMeter value={citation.relevance} size={40} strokeWidth={3} />
            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={handleCopy}
                className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-colors"
                title="Copy citation"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-white" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
              {citation.url && (
                <a
                  href={citation.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-colors"
                  title="Open source"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 mt-2.5 text-xs text-gray-500 hover:text-white transition-colors"
        >
          {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          {expanded ? 'Hide details' : 'Show details'}
        </button>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-3.5 pb-3.5 pt-0 border-t border-white/5">
              <p className="text-xs text-gray-400 leading-relaxed mt-3">
                {citation.description}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
