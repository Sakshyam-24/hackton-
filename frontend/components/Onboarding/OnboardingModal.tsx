'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  FileSearch,
  Languages,
  Shield,
  ArrowRight,
  ArrowLeft,
  X,
  Scale,
  Keyboard,
} from 'lucide-react';

const STORAGE_KEY = 'legal-advisor-onboarded';

const STEPS = [
  {
    icon: MessageSquare,
    title: 'Ask Anything Legal',
    description:
      'Type legal questions in plain language. Get clear, structured answers with citations, sources, and a confidence meter on every response.',
  },
  {
    icon: FileSearch,
    title: 'Analyze Documents',
    description:
      'Upload contracts, agreements, or notices for AI-powered analysis, summarization, and extraction of key legal points.',
  },
  {
    icon: Languages,
    title: 'English & Nepali',
    description:
      'Switch between English and Nepali anytime using the language toggle in the top bar. Responses adapt to your language.',
  },
  {
    icon: Keyboard,
    title: 'Keyboard Shortcuts',
    description:
      'Press Ctrl/Cmd + K to focus the chat input, Ctrl/Cmd + N to start a new conversation, and Ctrl/Cmd + / to reopen this guide.',
  },
  {
    icon: Shield,
    title: 'Not Legal Advice',
    description:
      'This platform provides general legal information for educational purposes only. Always consult a qualified attorney for your specific situation.',
  },
];

export function OnboardingModal({ onClose }: { onClose?: () => void }) {
  const [step, setStep] = useState(0);
  const [open, setOpen] = useState(true);

  const close = () => {
    setOpen(false);
    localStorage.setItem(STORAGE_KEY, 'true');
    onClose?.();
  };

  const next = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      close();
    }
  };

  const prev = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={close}
          />
          <motion.div
            initial={{ scale: 0.9, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 30, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg glass-strong rounded-3xl p-8"
          >
            <button
              onClick={close}
              className="absolute top-4 right-4 p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-6">
              <Scale className="w-6 h-6 text-white" />
              <span className="font-bold text-white">Welcome to Legal Advisor AI</span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                  {(() => {
                    const StepIcon = STEPS[step].icon;
                    return <StepIcon className="w-7 h-7 text-white" />;
                  })()}
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">
                  {STEPS[step].title}
                </h2>
                <p className="text-gray-400 leading-relaxed mb-8 min-h-[72px]">
                  {STEPS[step].description}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Progress dots */}
            <div className="flex items-center justify-center gap-2 mb-8">
              {STEPS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setStep(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === step ? 'w-8 bg-white' : 'w-2 bg-white/20 hover:bg-white/40'
                  }`}
                  aria-label={`Step ${i + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={prev}
                disabled={step === 0}
                className="px-5 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <button
                onClick={next}
                className="px-6 py-2.5 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 flex items-center gap-2 transition-colors"
              >
                {step === STEPS.length - 1 ? 'Get Started' : 'Next'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function shouldShowOnboarding(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(STORAGE_KEY) !== 'true';
}
