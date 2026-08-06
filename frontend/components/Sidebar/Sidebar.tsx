'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Scale,
  MessageSquare,
  Clock,
  Info,
  AlertTriangle,
  X,
  Home,
  Settings,
  Search,
  FileText,
  Shield,
  Map,
  BookOpen,
  FolderTree,
  BarChart3,
  LayoutDashboard,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const mainNavigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Chat', href: '/chat', icon: MessageSquare },
  { name: 'Search', href: '/search', icon: Search },
  { name: 'Documents', href: '/documents', icon: FileText },
  { name: 'Know Your Rights', href: '/know-your-rights', icon: Shield },
  { name: 'Legal Roadmap', href: '/roadmap', icon: Map },
  { name: 'Categories', href: '/categories', icon: FolderTree },
  { name: 'Glossary', href: '/glossary', icon: BookOpen },
  { name: 'History', href: '/history', icon: Clock },
];

const managementNavigation = [
  { name: 'Admin', href: '/admin', icon: LayoutDashboard },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

const infoNavigation = [
  { name: 'About', href: '/about', icon: Info },
  { name: 'Disclaimer', href: '/disclaimer', icon: AlertTriangle },
];

function SidebarLink({
  item,
  isActive,
  onClose,
}: {
  item: { name: string; href: string; icon: React.ElementType };
  isActive: boolean;
  onClose: () => void;
}) {
  return (
    <Link
      href={item.href}
      onClick={onClose}
      className={cn(
        'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
        isActive
          ? 'bg-white/10 text-white'
          : 'text-gray-400 hover:bg-white/5 hover:text-white'
      )}
    >
      <item.icon
        className={cn('h-5 w-5', isActive ? 'text-white' : 'text-gray-500')}
      />
      {item.name}
    </Link>
  );
}

function SidebarSection({
  label,
  items,
  pathname,
  onClose,
}: {
  label?: string;
  items: { name: string; href: string; icon: React.ElementType }[];
  pathname: string;
  onClose: () => void;
}) {
  return (
    <div>
      {label && (
        <p className="px-3 pt-4 pb-1 text-[11px] font-semibold uppercase tracking-wider text-gray-600">
          {label}
        </p>
      )}
      <div className="space-y-1">
        {items.map((item) => (
          <SidebarLink
            key={item.name}
            item={item}
            isActive={pathname === item.href}
            onClose={onClose}
          />
        ))}
      </div>
    </div>
  );
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-50 w-64 bg-black border-r border-white/10 flex flex-col transform transition-transform duration-300 lg:transform-none overflow-y-auto',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/10 shrink-0">
          <Link href="/" className="flex items-center gap-2">
            <Scale className="h-7 w-7 text-white" />
            <span className="text-lg font-bold text-white">Legal Advisor</span>
          </Link>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          <SidebarSection items={mainNavigation} pathname={pathname} onClose={onClose} />
          <SidebarSection label="Management" items={managementNavigation} pathname={pathname} onClose={onClose} />
          <SidebarSection label="Resources" items={infoNavigation} pathname={pathname} onClose={onClose} />
        </nav>

        {/* Bottom section */}
        <div className="p-4 border-t border-white/10 shrink-0">
          <div className="rounded-xl bg-white/[0.03] border border-white/5 p-3">
            <p className="text-[11px] text-gray-500 leading-relaxed">
              AI-generated legal information for educational purposes only. Not legal advice.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
