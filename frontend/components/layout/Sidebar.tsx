'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Scale,
  MessageSquare,
  Clock,
  Info,
  AlertTriangle,
  Settings,
  Home,
  Search,
  ChevronLeft,
  ChevronRight,
  Pin,
  Star,
  FolderOpen,
  LogOut,
  User,
  Keyboard,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  } | null;
}

const pinnedChats = [
  { id: '1', title: 'Constitutional Rights Query' },
  { id: '2', title: 'Property Dispute Guidance' },
];

const recentChats = [
  { id: '3', title: 'Employment Contract Review', time: '2h ago' },
  { id: '4', title: 'Tax Filing Assistance', time: '1d ago' },
  { id: '5', title: 'Divorce Proceedings Info', time: '3d ago' },
];

const categories = [
  { id: 'constitutional', name: 'Constitutional', color: 'bg-blue-500' },
  { id: 'criminal', name: 'Criminal', color: 'bg-red-500' },
  { id: 'civil', name: 'Civil', color: 'bg-green-500' },
  { id: 'family', name: 'Family', color: 'bg-purple-500' },
  { id: 'corporate', name: 'Corporate', color: 'bg-indigo-500' },
];

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Chat', href: '/chat', icon: MessageSquare },
  { name: 'History', href: '/history', icon: Clock },
  { name: 'About', href: '/about', icon: Info },
  { name: 'Disclaimer', href: '/disclaimer', icon: AlertTriangle },
];

export default function Sidebar({
  isOpen,
  onClose,
  isCollapsed,
  onToggleCollapse,
  user,
}: SidebarProps) {
  const pathname = usePathname();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const getInitials = useCallback((name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }, []);

  const sidebarVariants = {
    expanded: { width: 280 },
    collapsed: { width: 72 },
  };

  const mobileOverlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const mobileSidebarVariants = {
    hidden: { x: -300, opacity: 0 },
    visible: { x: 0, opacity: 1 },
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={isCollapsed ? 'collapsed' : 'expanded'}
        variants={sidebarVariants}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className={cn(
          'hidden lg:flex flex-col fixed inset-y-0 left-0 z-40',
          'glass border-r border-white/20',
          'shadow-glass'
        )}
      >
        {/* Logo & Toggle */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
          <Link href="/" className="flex items-center gap-3 overflow-hidden">
            <motion.div
              whileHover={{ rotate: 10 }}
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center flex-shrink-0 shadow-lg"
            >
              <Scale className="h-5 w-5 text-white" />
            </motion.div>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="text-lg font-bold text-dark-900 whitespace-nowrap"
                >
                  LegalAdvisor
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg hover:bg-dark-100 text-dark-400 hover:text-dark-600 transition-colors hidden lg:flex"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </motion.button>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="px-3 py-3 border-b border-white/10"
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dark-400" />
                <input
                  type="text"
                  placeholder="Search chats..."
                  className="w-full pl-9 pr-4 py-2 text-sm bg-dark-50/50 border border-dark-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-transparent placeholder-dark-400 transition-all"
                />
                <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-medium text-dark-400 bg-dark-100 px-1.5 py-0.5 rounded">
                  ⌘K
                </kbd>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onMouseEnter={() => setHoveredItem(item.name)}
                onMouseLeave={() => setHoveredItem(null)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-gradient-to-r from-primary-500/10 to-primary-500/5 text-primary-700 shadow-sm'
                    : 'text-dark-600 hover:bg-dark-100/50 hover:text-dark-900'
                )}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className={cn(
                    'flex-shrink-0',
                    isActive ? 'text-primary-600' : 'text-dark-400'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                </motion.div>
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="whitespace-nowrap"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
                {isCollapsed && hoveredItem === item.name && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="absolute left-full ml-2 px-3 py-1.5 bg-dark-900 text-white text-xs font-medium rounded-lg shadow-lg z-50 whitespace-nowrap"
                  >
                    {item.name}
                  </motion.div>
                )}
              </Link>
            );
          })}

          {/* Pinned Chats Section */}
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="pt-4"
              >
                <div className="flex items-center gap-2 px-3 mb-2">
                  <Pin className="h-3.5 w-3.5 text-dark-400" />
                  <span className="text-xs font-semibold text-dark-400 uppercase tracking-wider">
                    Pinned
                  </span>
                </div>
                {pinnedChats.map((chat) => (
                  <Link
                    key={chat.id}
                    href={`/chat?id=${chat.id}`}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-dark-600 hover:bg-dark-100/50 hover:text-dark-900 transition-all"
                  >
                    <Star className="h-4 w-4 text-amber-400 flex-shrink-0" />
                    <span className="truncate">{chat.title}</span>
                  </Link>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Recent Chats Section */}
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="pt-4"
              >
                <div className="flex items-center gap-2 px-3 mb-2">
                  <Clock className="h-3.5 w-3.5 text-dark-400" />
                  <span className="text-xs font-semibold text-dark-400 uppercase tracking-wider">
                    Recent
                  </span>
                </div>
                {recentChats.map((chat) => (
                  <Link
                    key={chat.id}
                    href={`/chat?id=${chat.id}`}
                    className="flex items-center justify-between px-3 py-2 rounded-xl text-sm text-dark-600 hover:bg-dark-100/50 hover:text-dark-900 transition-all group"
                  >
                    <span className="truncate group-hover:text-dark-900">
                      {chat.title}
                    </span>
                    <span className="text-xs text-dark-400 flex-shrink-0 ml-2">
                      {chat.time}
                    </span>
                  </Link>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Categories Section */}
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="pt-4"
              >
                <div className="flex items-center gap-2 px-3 mb-2">
                  <FolderOpen className="h-3.5 w-3.5 text-dark-400" />
                  <span className="text-xs font-semibold text-dark-400 uppercase tracking-wider">
                    Categories
                  </span>
                </div>
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/chat?category=${cat.id}`}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-dark-600 hover:bg-dark-100/50 hover:text-dark-900 transition-all"
                  >
                    <div className={cn('w-2.5 h-2.5 rounded-full flex-shrink-0', cat.color)} />
                    <span>{cat.name}</span>
                  </Link>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        {/* Keyboard Shortcut Hint */}
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="px-3 py-2 border-t border-white/10"
            >
              <div className="flex items-center gap-2 px-3 py-2 text-xs text-dark-400">
                <Keyboard className="h-3.5 w-3.5" />
                <span>Press <kbd className="font-medium">⌘K</kbd> for command palette</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Settings & User Profile */}
        <div className="p-3 border-t border-white/10 space-y-1">
          <Link
            href="/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-dark-600 hover:bg-dark-100/50 hover:text-dark-900 transition-all"
          >
            <Settings className="h-5 w-5 text-dark-400 flex-shrink-0" />
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="whitespace-nowrap"
                >
                  Settings
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          {/* User Profile */}
          <AnimatePresence>
            {!isCollapsed && user && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-dark-50/50"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center flex-shrink-0">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-xs font-bold text-white">
                      {getInitials(user.name)}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-dark-900 truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-dark-400 truncate">{user.email}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              variants={mobileOverlayVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={onClose}
            />
            <motion.aside
              variants={mobileSidebarVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="fixed inset-y-0 left-0 z-50 w-72 glass shadow-glass-lg lg:hidden flex flex-col"
            >
              {/* Mobile Logo */}
              <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
                <Link href="/" className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg">
                    <Scale className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-lg font-bold text-dark-900">
                    LegalAdvisor
                  </span>
                </Link>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-dark-100 text-dark-400 hover:text-dark-600"
                >
                  <ChevronLeft className="h-5 w-5" />
                </motion.button>
              </div>

              {/* Mobile Search */}
              <div className="px-3 py-3 border-b border-white/10">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dark-400" />
                  <input
                    type="text"
                    placeholder="Search chats..."
                    className="w-full pl-9 pr-4 py-2 text-sm bg-dark-50/50 border border-dark-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-transparent placeholder-dark-400"
                  />
                </div>
              </div>

              {/* Mobile Navigation */}
              <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                        isActive
                          ? 'bg-gradient-to-r from-primary-500/10 to-primary-500/5 text-primary-700'
                          : 'text-dark-600 hover:bg-dark-100/50 hover:text-dark-900'
                      )}
                    >
                      <item.icon
                        className={cn(
                          'h-5 w-5',
                          isActive ? 'text-primary-600' : 'text-dark-400'
                        )}
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>

              {/* Mobile User Profile */}
              {user && (
                <div className="p-3 border-t border-white/10">
                  <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-dark-50/50">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                      <span className="text-xs font-bold text-white">
                        {getInitials(user.name)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-dark-900 truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-dark-400 truncate">{user.email}</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
