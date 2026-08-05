'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

export type Language = 'en' | 'ne';

interface I18nContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const STORAGE_KEY = 'legal-advisor-language';

export const translations: Record<string, { en: string; ne: string }> = {
  'nav.chat': { en: 'Chat', ne: 'कुराकानी' },
  'nav.history': { en: 'History', ne: 'इतिहास' },
  'nav.documents': { en: 'Documents', ne: 'कागजातहरू' },
  'nav.search': { en: 'Search', ne: 'खोजी' },
  'nav.roadmap': { en: 'Legal Roadmap', ne: 'कानुनी रोडम्याप' },
  'nav.knowYourRights': { en: 'Know Your Rights', ne: 'आफ्ना अधिकार जान्नुहोस्' },
  'nav.glossary': { en: 'Glossary', ne: 'शब्दावली' },
  'nav.about': { en: 'About', ne: 'हाम्रो बारेमा' },
  'nav.disclaimer': { en: 'Disclaimer', ne: 'अस्वीकरण' },
  'nav.admin': { en: 'Admin', ne: 'प्रशासक' },
  'nav.analytics': { en: 'Analytics', ne: 'विश्लेषण' },
  'chat.title': { en: 'Legal Advisor AI', ne: 'कानुनी सल्लाहकार एआई' },
  'chat.placeholder': {
    en: 'Ask a legal question...',
    ne: 'कानुनी प्रश्न सोध्नुहोस्...',
  },
  'chat.send': { en: 'Send', ne: 'पठाउनुहोस्' },
  'search.placeholder': {
    en: 'Search the legal database...',
    ne: 'कानुनी डाटाबेस खोज्नुहोस्...',
  },
  'search.button': { en: 'Search', ne: 'खोज्नुहोस्' },
  'common.getStarted': { en: 'Get Started', ne: 'सुरु गर्नुहोस्' },
  'common.signIn': { en: 'Sign In', ne: 'साइन इन' },
  'common.signOut': { en: 'Sign out', ne: 'साइन आउट' },
  'common.settings': { en: 'Settings', ne: 'सेटिङ्स' },
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Language | null;
    if (stored === 'en' || stored === 'ne') {
      setLanguageState(stored);
    }
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.setAttribute('lang', lang);
  }, []);

  const t = useCallback(
    (key: string) => {
      const entry = translations[key];
      if (!entry) return key;
      return entry[language];
    },
    [language]
  );

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
