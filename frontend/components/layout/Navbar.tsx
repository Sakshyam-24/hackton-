'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  Bell,
  User,
  LogOut,
  Settings,
  Search,
  ChevronRight,
  Sun,
  Moon,
  Monitor,
  Home,
  MessageSquare,
  History,
  Info,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavbarProps {
  onMenuClick: () => void;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  } | null;
}

const breadcrumbMap: Record<string, string> = {
  '/': 'Home',
  '/chat': 'Chat',
  '/history': 'History',
  '/about': 'About',
  '/disclaimer': 'Disclaimer',
  '/settings': 'Settings',
};

export default function Navbar({ onMenuClick, user }: NavbarProps) {
  const pathname = usePathname();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getBreadcrumbs = () => {
    const segments = pathname.split('/').filter(Boolean);
    const breadcrumbs = [{ label: 'Home', href: '/' }];

    let currentPath = '';
    segments.forEach((segment) => {
      currentPath += `/${segment}`;
      breadcrumbs.push({
        label: breadcrumbMap[currentPath] || segment.charAt(0).toUpperCase() + segment.slice(1),
        href: currentPath,
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  const notifications = [
    { id: '1', title: 'New feature available', message: 'Document analysis is now live', time: '5m ago', read: false },
    { id: '2', title: 'System update', message: 'Scheduled maintenance tonight', time: '1h ago', read: false },
    { id: '3', title: 'Welcome!', message: 'Thanks for joining LegalAdvisor AI', time: '1d ago', read: true },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header
      className={cn(
        'sticky top-0 z-30 h-16 flex items-center justify-between px-4 lg:px-6 transition-all duration-300',
        'glass border-b border-white/10',
        scrolled && 'shadow-glass-sm'
      )}
    >
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onMenuClick}
          className="p-2 text-dark-600 hover:text-dark-900 hover:bg-dark-100/50 rounded-xl lg:hidden transition-colors"
        >
          <Menu className="h-5 w-5" />
        </motion.button>

        {/* Breadcrumbs */}
        <nav className="hidden md:flex items-center gap-1.5 text-sm">
          {breadcrumbs.map((crumb, index) => (
            <div key={crumb.href} className="flex items-center gap-1.5">
              {index > 0 && (
                <ChevronRight className="h-3.5 w-3.5 text-dark-400" />
              )}
              {index === breadcrumbs.length - 1 ? (
                <span className="font-medium text-dark-900">{crumb.label}</span>
              ) : (
                <Link
                  href={crumb.href}
                  className="text-dark-500 hover:text-dark-700 transition-colors"
                >
                  {crumb.label}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Search Trigger */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="hidden md:flex items-center gap-2 px-3 py-2 text-sm text-dark-500 bg-dark-100/50 hover:bg-dark-100 rounded-xl transition-colors"
        >
          <Search className="h-4 w-4" />
          <span>Search...</span>
          <kbd className="text-[10px] font-medium text-dark-400 bg-dark-200/50 px-1.5 py-0.5 rounded ml-2">
            ⌘K
          </kbd>
        </motion.button>

        {/* Theme Switcher */}
        <div className="hidden md:flex items-center bg-dark-100/50 rounded-xl p-1">
          {(['light', 'dark', 'system'] as const).map((t) => (
            <motion.button
              key={t}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setTheme(t)}
              className={cn(
                'p-1.5 rounded-lg transition-all',
                theme === t
                  ? 'bg-white text-dark-900 shadow-sm'
                  : 'text-dark-500 hover:text-dark-700'
              )}
            >
              {t === 'light' && <Sun className="h-4 w-4" />}
              {t === 'dark' && <Moon className="h-4 w-4" />}
              {t === 'system' && <Monitor className="h-4 w-4" />}
            </motion.button>
          ))}
        </div>

        {/* Notifications */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowDropdown(false);
            }}
            className="p-2 text-dark-500 hover:text-dark-700 hover:bg-dark-100/50 rounded-xl relative transition-colors"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center min-w-[18px] h-[18px]"
              >
                {unreadCount}
              </motion.span>
            )}
          </motion.button>

          <AnimatePresence>
            {showNotifications && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-40"
                  onClick={() => setShowNotifications(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-80 glass rounded-2xl shadow-glass-lg border border-white/20 z-50 overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                    <h3 className="font-semibold text-dark-900">Notifications</h3>
                    <span className="text-xs text-primary-600 font-medium cursor-pointer hover:text-primary-700">
                      Mark all read
                    </span>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={cn(
                          'px-4 py-3 border-b border-white/5 hover:bg-dark-50/50 transition-colors cursor-pointer',
                          !notification.read && 'bg-primary-50/30'
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={cn(
                              'w-2 h-2 rounded-full mt-2 flex-shrink-0',
                              !notification.read ? 'bg-primary-500' : 'bg-transparent'
                            )}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-dark-900">
                              {notification.title}
                            </p>
                            <p className="text-xs text-dark-500 mt-0.5">
                              {notification.message}
                            </p>
                            <p className="text-xs text-dark-400 mt-1">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-3 border-t border-white/10">
                    <Link
                      href="/notifications"
                      className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                      onClick={() => setShowNotifications(false)}
                    >
                      View all notifications
                    </Link>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* User Dropdown */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setShowDropdown(!showDropdown);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-dark-100/50 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-sm">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-xs font-bold text-white">
                  {user?.name ? getInitials(user.name) : <User className="h-4 w-4" />}
                </span>
              )}
            </div>
            <span className="hidden md:block text-sm font-medium text-dark-700">
              {user?.name || 'User'}
            </span>
          </motion.button>

          <AnimatePresence>
            {showDropdown && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-40"
                  onClick={() => setShowDropdown(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-64 glass rounded-2xl shadow-glass-lg border border-white/20 py-2 z-50"
                >
                  {user && (
                    <div className="px-4 py-3 border-b border-white/10">
                      <p className="text-sm font-semibold text-dark-900">{user.name}</p>
                      <p className="text-xs text-dark-500">{user.email}</p>
                    </div>
                  )}
                  <div className="py-1">
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-dark-700 hover:bg-dark-50/50 transition-colors"
                      onClick={() => setShowDropdown(false)}
                    >
                      <User className="h-4 w-4 text-dark-400" />
                      Profile
                    </Link>
                    <Link
                      href="/settings"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-dark-700 hover:bg-dark-50/50 transition-colors"
                      onClick={() => setShowDropdown(false)}
                    >
                      <Settings className="h-4 w-4 text-dark-400" />
                      Settings
                    </Link>
                  </div>
                  <div className="border-t border-white/10 pt-1">
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                      }}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50/50 w-full transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
