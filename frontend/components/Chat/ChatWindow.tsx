'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scale, AlertCircle, Sparkles } from 'lucide-react';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import SuggestedQuestions from './SuggestedQuestions';
import type { Message } from '@/types';

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  suggestedQuestions: string[];
  onSuggestionClick: (question: string) => void;
}

function EmptyState({ suggestedQuestions, onSuggestionClick }: {
  suggestedQuestions: string[];
  onSuggestionClick: (question: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      className="h-full flex flex-col items-center justify-center text-center max-w-2xl mx-auto px-4"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 15 }}
        className="relative mb-8"
      >
        <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-xl">
          <Scale className="h-10 w-10 text-black" />
        </div>
        <motion.div
          animate={{ rotate: [0, 15, -15, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-2 -right-2 p-1.5 bg-white rounded-lg shadow-lg"
        >
          <Sparkles className="h-4 w-4 text-black" />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
          Welcome to Legal Advisor AI
        </h2>
        <p className="text-gray-400 mb-10 max-w-md mx-auto leading-relaxed">
          Ask me anything about Indian law. I can help with legal questions,
          explain sections of acts, and provide relevant citations.
        </p>
      </motion.div>

      {suggestedQuestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="w-full"
        >
          <SuggestedQuestions
            questions={suggestedQuestions}
            onQuestionClick={onSuggestionClick}
          />
        </motion.div>
      )}

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-10 text-[11px] text-gray-600 max-w-sm leading-relaxed"
      >
        This AI provides informational guidance only and does not constitute legal advice.
        Always consult a qualified lawyer for specific legal matters.
      </motion.p>
    </motion.div>
  );
}

export default function ChatWindow({
  messages,
  isLoading,
  error,
  suggestedQuestions,
  onSuggestionClick,
}: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 scrollbar-thin"
    >
      {messages.length === 0 && !isLoading ? (
        <EmptyState
          suggestedQuestions={suggestedQuestions}
          onSuggestionClick={onSuggestionClick}
        />
      ) : (
        <div className="max-w-3xl mx-auto">
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
          </AnimatePresence>

          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="flex gap-3 mb-5"
              >
                <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Scale className="h-4 w-4 text-black" />
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm px-4 py-3">
                  <TypingIndicator />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8 }}
                className="flex gap-3 mb-5"
              >
                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="h-4 w-4 text-red-400" />
                </div>
                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[80%]">
                  <p className="text-sm font-medium text-red-300 mb-1">
                    Something went wrong
                  </p>
                  <p className="text-xs text-red-400 leading-relaxed">
                    {error}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
}
