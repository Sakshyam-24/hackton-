import {
  Scale,
  Shield,
  Briefcase,
  Home,
  Heart,
  Gavel,
  FileText,
  Users,
  Building,
  Landmark,
  type LucideIcon,
} from 'lucide-react';

export const APP_NAME = 'LegalAdvisor AI';
export const APP_DESCRIPTION = 'Your AI-powered legal advisor for Nepal law';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface LegalCategory {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

export const LEGAL_CATEGORIES: LegalCategory[] = [
  {
    id: 'constitutional',
    name: 'Constitutional Law',
    description: 'Fundamental rights, duties, and constitutional provisions',
    icon: Landmark,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    id: 'criminal',
    name: 'Criminal Law',
    description: 'IPC, CrPC, and criminal procedures',
    icon: Shield,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
  },
  {
    id: 'civil',
    name: 'Civil Law',
    description: 'Civil disputes, contracts, and property matters',
    icon: Scale,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    id: 'family',
    name: 'Family Law',
    description: 'Marriage, divorce, custody, and inheritance',
    icon: Users,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  {
    id: 'corporate',
    name: 'Corporate Law',
    description: 'Business regulations, compliance, and governance',
    icon: Briefcase,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
  },
  {
    id: 'property',
    name: 'Property Law',
    description: 'Real estate, land acquisition, and tenancy',
    icon: Home,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
  },
  {
    id: 'labor',
    name: 'Labor Law',
    description: 'Employment rights, wages, and workplace safety',
    icon: FileText,
    color: 'text-teal-600',
    bgColor: 'bg-teal-50',
  },
  {
    id: 'consumer',
    name: 'Consumer Protection',
    description: 'Consumer rights and grievance redressal',
    icon: Heart,
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
  },
  {
    id: 'cyber',
    name: 'Cyber Law',
    description: 'IT Act, data protection, and cyber crimes',
    icon: Building,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
  },
  {
    id: 'environmental',
    name: 'Environmental Law',
    description: 'Environmental regulations and compliance',
    icon: Gavel,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
  },
];

export interface NavItem {
  label: string;
  href: string;
  icon?: LucideIcon;
  requiresAuth?: boolean;
}

export const NAVIGATION_ITEMS: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Chat', href: '/chat', requiresAuth: true },
  { label: 'History', href: '/history', requiresAuth: true },
  { label: 'About', href: '/about' },
  { label: 'Disclaimer', href: '/disclaimer' },
];

export const SUGGESTED_QUESTIONS: Record<string, string[]> = {
  constitutional: [
    'What are my fundamental rights under the Nepal Constitution?',
    'Can the government take away my fundamental rights?',
    'What is Article 21 and how does it protect my life and liberty?',
    'How can I file a PIL (Public Interest Litigation)?',
  ],
  criminal: [
    'What should I do if I am falsely accused of a crime?',
    'What are my rights if the police arrest me?',
    'What is the difference between bail and anticipatory bail?',
    'How long can the police keep me in custody?',
  ],
  civil: [
    'How do I file a civil suit in India?',
    'What is the limitation period for filing a civil case?',
    'How can I recover a debt from someone?',
    'What are my rights as a tenant?',
  ],
  family: [
    'What are the grounds for divorce in India?',
    'How is child custody decided?',
    'What are my rights if I am a victim of domestic violence?',
    'How does inheritance work in India?',
  ],
  corporate: [
    'How do I register a company in India?',
    'What are the compliance requirements for a startup?',
    'What is the procedure for intellectual property registration?',
    'What are the tax implications for a private limited company?',
  ],
  general: [
    'What are the steps to file a police complaint?',
    'How can I check the status of my court case?',
    'What documents do I need for a court case?',
    'How do I find a good lawyer in my area?',
    'What is the difference between a civil and criminal case?',
    'How long does a typical court case take in India?',
  ],
};

export interface FooterLinkGroup {
  title: string;
  links: { label: string; href: string }[];
}

export const FOOTER_LINKS: FooterLinkGroup[] = [
  {
    title: 'Legal Areas',
    links: [
      { label: 'Constitutional Law', href: '/chat?category=constitutional' },
      { label: 'Criminal Law', href: '/chat?category=criminal' },
      { label: 'Civil Law', href: '/chat?category=civil' },
      { label: 'Family Law', href: '/chat?category=family' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help Center', href: '/help' },
      { label: 'Disclaimer', href: '/disclaimer' },
      { label: 'FAQs', href: '/faqs' },
      { label: 'Feedback', href: '/feedback' },
    ],
  },
];

export interface SocialLink {
  name: string;
  href: string;
  icon: string;
}

export const SOCIAL_LINKS: SocialLink[] = [
  { name: 'Twitter', href: 'https://twitter.com/legaladvisorai', icon: 'twitter' },
  { name: 'LinkedIn', href: 'https://linkedin.com/company/legaladvisorai', icon: 'linkedin' },
  { name: 'GitHub', href: 'https://github.com/legaladvisorai', icon: 'github' },
];

export const LEGAL_DISCLAIMERS = {
  main: `This AI-powered legal advisor is for informational purposes only and does not constitute legal advice. The information provided should not be relied upon as a substitute for professional legal counsel. Always consult with a qualified lawyer for specific legal matters.`,
  accuracy: `While we strive to provide accurate and up-to-date information, we make no representations or warranties of any kind about the completeness, accuracy, reliability, or availability of the information provided through this service.`,
  noLawyer: `Using this AI assistant does not create an attorney-client relationship. The responses generated are based on general legal principles and may not apply to your specific situation.`,
  jurisdiction: `The legal information provided is primarily based on Nepal law. Laws may vary by jurisdiction and are subject to change. Always verify the current applicable laws in your jurisdiction.`,
  emergency: `In case of a legal emergency, please contact local law enforcement or a qualified legal professional immediately. Do not rely solely on AI-generated responses for urgent legal matters.`,
};

export const MAX_MESSAGE_LENGTH = 5000;
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
];

export const TOAST_DURATION = 5000;
export const DEBOUNCE_DELAY = 300;
export const TYPING_INDICATOR_DELAY = 1000;

export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
  CONVERSATIONS: 'conversations',
} as const;
