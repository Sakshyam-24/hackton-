'use client';

import { User, Scale } from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import type { Message } from '@/types';
import CitationCard from '@/components/CitationCard/CitationCard';

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div className={cn('flex gap-3 mb-6 animate-fade-in-up', isUser ? 'flex-row-reverse' : '')}>
      {/* Avatar */}
      <div
        className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
          isUser ? 'bg-primary-100' : 'bg-dark-100'
        )}
      >
        {isUser ? (
          <User className="h-4 w-4 text-primary-600" />
        ) : (
          <Scale className="h-4 w-4 text-dark-600" />
        )}
      </div>

      {/* Content */}
      <div className={cn('max-w-[80%] space-y-2', isUser ? 'items-end' : 'items-start')}>
        <div
          className={cn(
            'rounded-2xl px-4 py-3',
            isUser
              ? 'bg-primary-600 text-white rounded-tr-sm'
              : 'bg-dark-50 text-dark-900 rounded-tl-sm'
          )}
        >
          <div className="whitespace-pre-wrap text-sm leading-relaxed">
            {message.content}
          </div>
        </div>

        {/* Citations */}
        {!isUser && message.citations && message.citations.length > 0 && (
          <div className="space-y-2 mt-3">
            <p className="text-xs font-medium text-dark-500 uppercase tracking-wide">
              Legal Citations
            </p>
            <div className="grid gap-2">
              {message.citations.map((citation) => (
                <CitationCard key={citation.id} citation={citation} />
              ))}
            </div>
          </div>
        )}

        {/* Timestamp */}
        <p className={cn('text-xs text-dark-400', isUser ? 'text-right' : 'text-left')}>
          {formatDate(message.timestamp)}
        </p>
      </div>
    </div>
  );
}
