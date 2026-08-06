'use client';

import Link from 'next/link';
import { Menu, Bell, User, LogOut, Settings, Languages } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useI18n } from '@/lib/i18n';

interface NavbarProps {
  onMenuClick: () => void;
  user?: {
    name: string;
    email: string;
  } | null;
}

export default function Navbar({ onMenuClick, user }: NavbarProps) {
  const { logout } = useAuth();
  const { language, setLanguage, t } = useI18n();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="h-16 border-b border-white/10 bg-black flex items-center px-4 lg:px-6">
      <button
        onClick={onMenuClick}
        className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="flex-1" />

      <div className="flex items-center gap-4">
        {/* Language toggle */}
        <div className="relative">
          <button
            onClick={() => {
              setShowLangMenu(!showLangMenu);
              setShowDropdown(false);
            }}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg flex items-center gap-1.5"
            title="Language / भाषा"
          >
            <Languages className="h-5 w-5" />
            <span className="text-xs font-semibold uppercase tracking-wide">
              {language === 'en' ? 'EN' : 'ने'}
            </span>
          </button>
          {showLangMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowLangMenu(false)} />
              <div className="absolute right-0 mt-2 w-40 bg-black rounded-xl shadow-xl border border-white/10 py-2 z-50 animate-slide-down">
                <button
                  onClick={() => {
                    setLanguage('en');
                    setShowLangMenu(false);
                  }}
                  className={`flex items-center justify-between w-full px-4 py-2 text-sm hover:bg-white/5 ${
                    language === 'en' ? 'text-white' : 'text-gray-400'
                  }`}
                >
                  <span>English</span>
                  {language === 'en' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                </button>
                <button
                  onClick={() => {
                    setLanguage('ne');
                    setShowLangMenu(false);
                  }}
                  className={`flex items-center justify-between w-full px-4 py-2 text-sm hover:bg-white/5 ${
                    language === 'ne' ? 'text-white' : 'text-gray-400'
                  }`}
                >
                  <span>नेपाली</span>
                  {language === 'ne' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                </button>
              </div>
            </>
          )}
        </div>

        <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full" />
        </button>

        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-white/5 transition-colors"
          >
            <div className="w-8 h-8 bg-white/10 text-white rounded-full flex items-center justify-center font-medium text-sm">
              {user?.name ? getInitials(user.name) : <User className="h-4 w-4" />}
            </div>
            <span className="hidden md:block text-sm font-medium text-gray-300">
              {user?.name || 'User'}
            </span>
          </button>

          {showDropdown && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowDropdown(false)}
              />
              <div className="absolute right-0 mt-2 w-56 bg-black rounded-xl shadow-xl border border-white/10 py-2 z-50 animate-slide-down">
                <div className="px-4 py-3 border-b border-white/10">
                  <p className="text-sm font-medium text-white">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <Link
                  href="/settings"
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-white/5"
                  onClick={() => setShowDropdown(false)}
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setShowDropdown(false);
                  }}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-white/5 w-full text-left"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
