'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Paperclip, Loader2, X, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MAX_MESSAGE_LENGTH } from '@/lib/constants';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
  placeholder?: string;
  inputRef?: React.RefObject<HTMLTextAreaElement>;
}

export default function ChatInput({
  onSend,
  isLoading = false,
  disabled = false,
  placeholder = 'Ask a legal question...',
  inputRef,
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const internalRef = useRef<HTMLTextAreaElement>(null);
  const textareaRef = inputRef ?? internalRef;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [message]);

  const handleSubmit = () => {
    if (message.trim() && !isLoading && !disabled) {
      onSend(message.trim());
      setMessage('');
      setAttachedFile(null);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setAttachedFile(file);
  };

  const charCount = message.length;
  const charPercentage = (charCount / MAX_MESSAGE_LENGTH) * 100;
  const isNearLimit = charPercentage > 80;
  const isAtLimit = charPercentage >= 100;

  return (
    <div className="border-t border-white/10 bg-black p-4">
      <div className="max-w-3xl mx-auto">
        <AnimatePresence>
          {attachedFile && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-3"
            >
              <div className="inline-flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg">
                <FileText className="h-4 w-4 text-white" />
                <span className="text-xs text-gray-300 font-medium max-w-[200px] truncate">
                  {attachedFile.name}
                </span>
                <button
                  onClick={() => setAttachedFile(null)}
                  className="p-0.5 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div
          className={cn(
            'relative flex items-end gap-2 rounded-2xl p-2 transition-all duration-300',
            'bg-white/5 border',
            isFocused
              ? 'border-white/20 shadow-lg ring-4 ring-white/5'
              : 'border-white/10 hover:border-white/15'
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleFileSelect}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || isLoading}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors flex-shrink-0 disabled:opacity-40"
            title="Attach file"
          >
            <Paperclip className="h-5 w-5" />
          </button>

          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            disabled={disabled || isLoading}
            rows={1}
            className={cn(
              'flex-1 bg-transparent resize-none px-2 py-2 text-sm text-white placeholder-gray-500 focus:outline-none',
              'min-h-[40px] max-h-[200px] leading-relaxed'
            )}
          />

          <motion.button
            onClick={handleSubmit}
            disabled={!message.trim() || isLoading || disabled || isAtLimit}
            whileHover={{ scale: message.trim() && !isLoading ? 1.05 : 1 }}
            whileTap={{ scale: message.trim() && !isLoading ? 0.92 : 1 }}
            className={cn(
              'p-2.5 rounded-xl transition-all flex-shrink-0',
              message.trim() && !isLoading && !disabled && !isAtLimit
                ? 'bg-white text-black shadow-md hover:shadow-lg'
                : 'bg-white/10 text-gray-500 cursor-not-allowed'
            )}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </motion.button>
        </div>

        <div className="flex items-center justify-between mt-2 px-1">
          <p className="text-[11px] text-gray-600">
            <span className="hidden sm:inline">Press </span>
            <kbd className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] font-mono">
              Enter
            </kbd>
            <span className="hidden sm:inline"> to send, </span>
            <kbd className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] font-mono">
              Shift+Enter
            </kbd>
            <span className="hidden sm:inline"> for new line</span>
          </p>

          <div className="flex items-center gap-2">
            <div
              className={cn(
                'h-1 rounded-full overflow-hidden bg-white/5 w-16',
                isNearLimit && 'animate-pulse'
              )}
            >
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-300',
                  isAtLimit
                    ? 'bg-red-500'
                    : isNearLimit
                    ? 'bg-yellow-500'
                    : 'bg-white/30'
                )}
                style={{ width: `${Math.min(charPercentage, 100)}%` }}
              />
            </div>
            <span
              className={cn(
                'text-[11px] font-mono tabular-nums',
                isAtLimit ? 'text-red-400 font-semibold' : isNearLimit ? 'text-yellow-400' : 'text-gray-600'
              )}
            >
              {charCount}/{MAX_MESSAGE_LENGTH}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
