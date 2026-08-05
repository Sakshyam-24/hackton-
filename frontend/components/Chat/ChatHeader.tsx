'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Share2,
  Download,
  MoreVertical,
  Trash2,
  FileText,
  FileDown,
  Check,
  Scale,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatHeaderProps {
  title?: string;
  messageCount?: number;
  onClear?: () => void;
  onExportMarkdown?: () => void;
  onExportPDF?: () => void;
}

export default function ChatHeader({
  title = 'New Conversation',
  messageCount = 0,
  onClear,
  onExportMarkdown,
  onExportPDF,
}: ChatHeaderProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative flex items-center justify-between px-4 sm:px-6 py-3 border-b border-gray-200/80 bg-white/80 backdrop-blur-xl">
      {/* Left: Title */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="p-2 rounded-xl bg-gradient-to-br from-legal-500 to-legal-600 shadow-md shadow-legal-200/50 flex-shrink-0">
          <Scale className="h-4 w-4 text-white" />
        </div>
        <div className="min-w-0">
          <h1 className="text-sm font-semibold text-gray-900 truncate">
            {title}
          </h1>
          {messageCount > 0 && (
            <p className="text-[11px] text-gray-400">
              {messageCount} message{messageCount !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1">
        {/* Share button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleShare}
          className="p-2 rounded-xl text-gray-400 hover:text-legal-600 hover:bg-legal-50 transition-colors"
          title="Share conversation"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Share2 className="h-4 w-4" />
          )}
        </motion.button>

        {/* Export dropdown */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowDropdown(!showDropdown)}
            className="p-2 rounded-xl text-gray-400 hover:text-legal-600 hover:bg-legal-50 transition-colors"
            title="Export"
          >
            <Download className="h-4 w-4" />
          </motion.button>

          <AnimatePresence>
            {showDropdown && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowDropdown(false)}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-xl shadow-xl shadow-gray-200/50 z-50 overflow-hidden"
                >
                  <button
                    onClick={() => {
                      onExportMarkdown?.();
                      setShowDropdown(false);
                    }}
                    className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <FileText className="h-4 w-4 text-gray-400" />
                    Export as Markdown
                  </button>
                  <button
                    onClick={() => {
                      onExportPDF?.();
                      setShowDropdown(false);
                    }}
                    className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <FileDown className="h-4 w-4 text-gray-400" />
                    Export as PDF
                  </button>
                  <div className="border-t border-gray-100" />
                  <button
                    onClick={() => {
                      onClear?.();
                      setShowDropdown(false);
                    }}
                    className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                    Clear conversation
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
