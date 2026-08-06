'use client';

import { motion } from 'framer-motion';
import {
  Lightbulb,
  ArrowRight,
  Landmark,
  Shield,
  Scale,
  Users,
  Briefcase,
  FileText,
  HelpCircle,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface SuggestedQuestionsProps {
  questions: string[];
  onQuestionClick: (question: string) => void;
}

const categoryIcons: LucideIcon[] = [
  Landmark,
  Shield,
  Scale,
  Users,
  Briefcase,
  FileText,
  HelpCircle,
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1 },
};

export default function SuggestedQuestions({
  questions,
  onQuestionClick,
}: SuggestedQuestionsProps) {
  if (questions.length === 0) return null;

  return (
    <div className="w-full max-w-2xl">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="p-1.5 rounded-lg bg-white/5 border border-white/10">
          <Lightbulb className="h-4 w-4 text-white" />
        </div>
        <span className="text-sm font-semibold text-gray-300">Suggested Questions</span>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 gap-2.5"
      >
        {questions.map((question, index) => {
          const Icon = categoryIcons[index % categoryIcons.length];
          return (
            <motion.button
              key={index}
              variants={item}
              whileHover={{ scale: 1.015, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onQuestionClick(question)}
              className="group flex items-start gap-3 p-4 text-left bg-white/[0.02] border border-white/5 rounded-xl hover:border-white/15 hover:bg-white/5 transition-all duration-200"
            >
              <div className="p-2 rounded-lg bg-white/5 border border-white/10 flex-shrink-0 group-hover:bg-white/10 transition-colors">
                <Icon className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-sm text-gray-300 group-hover:text-white leading-relaxed line-clamp-2 transition-colors">
                  {question}
                </span>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-600 group-hover:text-white flex-shrink-0 mt-0.5 transform group-hover:translate-x-1 transition-all" />
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}
