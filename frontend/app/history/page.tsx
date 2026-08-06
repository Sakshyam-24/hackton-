'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, MessageSquare, Trash2, Search, Plus } from 'lucide-react';
import Sidebar from '@/components/Sidebar/Sidebar';
import Navbar from '@/components/Navbar/Navbar';
import { useAuth } from '@/hooks/useAuth';

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  messageCount: number;
  createdAt: string;
  updatedAt: string;
}

export default function HistoryPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Simulate loading conversations
    const mockConversations: Conversation[] = [
      {
        id: '1',
        title: 'Property Rights in India',
        lastMessage: 'Under the Transfer of Property Act, 1882...',
        messageCount: 12,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: '2',
        title: 'Criminal Law - IPC Section 302',
        lastMessage: 'Section 302 of the Nepal Labour Code deals with punishment for murder...',
        messageCount: 8,
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: '3',
        title: 'Consumer Protection Rights',
        lastMessage: 'The Consumer Protection Act, 2019 provides...',
        messageCount: 15,
        createdAt: new Date(Date.now() - 259200000).toISOString(),
        updatedAt: new Date(Date.now() - 172800000).toISOString(),
      },
    ];

    setConversations(mockConversations);
    setIsLoading(false);
  }, [isAuthenticated, router]);

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'long' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  const handleDelete = (id: string) => {
    setConversations(conversations.filter((conv) => conv.id !== id));
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen bg-white">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onMenuClick={() => setSidebarOpen(true)} user={user} />

        <main className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-3xl font-bold text-dark-900 mb-2">Chat History</h1>
              <p className="text-dark-600">View and manage your previous conversations</p>
            </motion.div>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="relative mb-6"
            >
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-dark-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-10"
                placeholder="Search conversations..."
              />
            </motion.div>

            {/* Conversations List */}
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="card animate-pulse"
                  >
                    <div className="h-4 bg-dark-200 rounded w-1/3 mb-2"></div>
                    <div className="h-3 bg-dark-100 rounded w-2/3 mb-4"></div>
                    <div className="flex justify-between">
                      <div className="h-3 bg-dark-100 rounded w-1/4"></div>
                      <div className="h-3 bg-dark-100 rounded w-1/6"></div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : filteredConversations.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <MessageSquare className="h-12 w-12 text-dark-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-dark-900 mb-2">No conversations found</h3>
                <p className="text-dark-600 mb-6">
                  {searchQuery ? 'Try a different search term' : 'Start a new conversation to get legal advice'}
                </p>
                <Link
                  href="/chat"
                  className="inline-flex items-center gap-2 btn-primary"
                >
                  <Plus className="h-5 w-5" />
                  Start New Chat
                </Link>
              </motion.div>
            ) : (
              <AnimatePresence>
                <div className="space-y-4">
                  {filteredConversations.map((conversation, index) => (
                    <motion.div
                      key={conversation.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ y: -2 }}
                      className="card-hover group cursor-pointer"
                      onClick={() => router.push(`/chat?conversation=${conversation.id}`)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-dark-900 mb-1 truncate">
                            {conversation.title}
                          </h3>
                          <p className="text-dark-600 text-sm mb-3 line-clamp-2">
                            {conversation.lastMessage}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-dark-500">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatDate(conversation.updatedAt)}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageSquare className="h-3 w-3" />
                              {conversation.messageCount} messages
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(conversation.id);
                          }}
                          className="p-2 text-dark-400 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
