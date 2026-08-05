'use client';

import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '@/components/Sidebar/Sidebar';
import Navbar from '@/components/Navbar/Navbar';
import ChatWindow from '@/components/Chat/ChatWindow';
import ChatInput from '@/components/Chat/ChatInput';
import { OnboardingModal, shouldShowOnboarding } from '@/components/Onboarding/OnboardingModal';
import { useChat } from '@/hooks/useChat';
import { useAuth } from '@/hooks/useAuth';
import { useShortcuts } from '@/hooks/useKeyboard';

export default function ChatPage() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [showOnboarding, setShowOnboarding] = useState(() =>
    typeof window !== 'undefined' ? shouldShowOnboarding() : false
  );
  const {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat,
    suggestedQuestions,
  } = useChat();

  useShortcuts({
    'ctrl+k': useCallback(() => {
      inputRef.current?.focus();
    }, []),
    'ctrl+n': useCallback(() => {
      clearChat();
      inputRef.current?.focus();
    }, [clearChat]),
    'ctrl+/': useCallback(() => {
      setShowOnboarding(true);
    }, []),
  });

  const handleSendMessage = async (content: string) => {
    await sendMessage(content);
  };

  const handleSuggestionClick = async (question: string) => {
    await sendMessage(question);
  };

  return (
    <div className="flex h-screen bg-black overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onMenuClick={() => setSidebarOpen(true)} user={user} />

        <main className="flex-1 flex flex-col min-h-0">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col"
          >
            <ChatWindow
              messages={messages}
              isLoading={isLoading}
              error={error}
              suggestedQuestions={suggestedQuestions}
              onSuggestionClick={handleSuggestionClick}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <ChatInput
              onSend={handleSendMessage}
              isLoading={isLoading}
              inputRef={inputRef}
            />
          </motion.div>
        </main>
      </div>

      {showOnboarding && (
        <OnboardingModal onClose={() => setShowOnboarding(false)} />
      )}
    </div>
  );
}
