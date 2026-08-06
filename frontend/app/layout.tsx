import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { I18nProvider } from '@/lib/i18n';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: {
    default: 'Legal Advisor AI - AI-Powered Legal Intelligence Platform',
    template: '%s | Legal Advisor AI',
  },
  description:
    'Get AI-powered legal advice with citations from Nepal legal databases. Ask questions about Nepal law and receive instant, accurate responses backed by relevant legal sections and precedents.',
  keywords: [
    'legal advisor',
    'AI',
    'law',
    'Nepal',
    'legal assistance',
    'chatbot',
    'Nepal Penal Code',
    'Constitution',
    'legal rights',
    'legal information',
  ],
  authors: [{ name: 'Legal Advisor AI' }],
  creator: 'Legal Advisor AI',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://legaladvisor.ai',
    siteName: 'Legal Advisor AI',
    title: 'Legal Advisor AI - AI-Powered Legal Intelligence Platform',
    description:
      'Get AI-powered legal advice with citations from Nepal legal databases.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Legal Advisor AI - AI-Powered Legal Intelligence Platform',
    description:
      'Get AI-powered legal advice with citations from Nepal legal databases.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
    { media: '(prefers-color-scheme: light)', color: '#000000' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} min-h-screen bg-black text-white font-sans antialiased`}
      >
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
