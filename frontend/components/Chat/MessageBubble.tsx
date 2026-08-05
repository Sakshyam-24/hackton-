'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Scale, Copy, Check, ThumbsUp, ThumbsDown } from 'lucide-react';
import { cn, formatDate, getInitials } from '@/lib/utils';
import type { Message } from '@/types';
import CitationCard from './CitationCard';
import MarkdownRenderer from './MarkdownRenderer';

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);
  const [reaction, setReaction] = useState<'up' | 'down' | null>(null);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
      className={cn('flex gap-3 mb-5', isUser ? 'flex-row-reverse' : '')}
    >
      {/* Avatar */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 400, damping: 20 }}
        className={cn(
          'w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm',
          isUser
            ? 'bg-white'
            : 'bg-white/10 border border-white/10'
        )}
      >
        {isUser ? (
          <span className="text-xs font-bold text-black">
            {getInitials('You')}
          </span>
        ) : (
          <Scale className="h-4 w-4 text-white" />
        )}
      </motion.div>

      {/* Content */}
      <div className={cn('max-w-[80%] min-w-0 space-y-1.5', isUser ? 'items-end' : 'items-start')}>
        <div className={cn('flex items-center gap-2', isUser ? 'justify-end' : '')}>
          <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">
            {isUser ? 'You' : 'Legal AI'}
          </span>
        </div>

        <div
          className={cn(
            'rounded-2xl px-4 py-3 shadow-sm',
            isUser
              ? 'bg-white text-black rounded-tr-sm'
              : 'bg-white/5 border border-white/10 text-white rounded-tl-sm'
          )}
        >
          {isUser ? (
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {message.content}
            </div>
          ) : (
            <MarkdownRenderer content={message.content} />
          )}
        </div>

        {!isUser && message.citations && message.citations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-2 mt-3"
          >
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">
              Legal Citations
            </p>
            <div className="grid gap-2">
              {message.citations.map((citation) => (
                <CitationCard key={citation.id} citation={citation} />
              ))}
            </div>
          </motion.div>
        )}

        <div className={cn('flex items-center gap-2', isUser ? 'justify-end' : '')}>
          <span className="text-[11px] text-gray-500">
            {formatDate(message.timestamp)}
          </span>

          {!isUser && !message.isStreaming && (
            <div className="flex items-center gap-0.5">
              <button
                onClick={handleCopy}
                className="p-1 rounded-md text-gray-500 hover:text-white hover:bg-white/5 transition-colors"
                title="Copy message"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-white" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
              <button
                onClick={() => setReaction(reaction === 'up' ? null : 'up')}
                className={cn(
                  'p-1 rounded-md transition-colors',
                  reaction === 'up'
                    ? 'text-white bg-white/10'
                    : 'text-gray-500 hover:text-white hover:bg-white/5'
                )}
                title="Helpful"
              >
                <ThumbsUp className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setReaction(reaction === 'down' ? null : 'down')}
                className={cn(
                  'p-1 rounded-md transition-colors',
                  reaction === 'down'
                    ? 'text-red-400 bg-red-500/10'
                    : 'text-gray-500 hover:text-red-400 hover:bg-red-500/10'
                )}
                title="Not helpful"
              >
                <ThumbsDown className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
