'use client';

import { Lightbulb, ArrowRight } from 'lucide-react';

interface SuggestedQuestionsProps {
  questions: string[];
  onQuestionClick: (question: string) => void;
}

export default function SuggestedQuestions({
  questions,
  onQuestionClick,
}: SuggestedQuestionsProps) {
  if (questions.length === 0) return null;

  return (
    <div className="w-full max-w-2xl">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="h-5 w-5 text-secondary-500" />
        <span className="text-sm font-medium text-dark-600">Suggested Questions</span>
      </div>
      <div className="grid gap-2">
        {questions.map((question, index) => (
          <button
            key={index}
            onClick={() => onQuestionClick(question)}
            className="flex items-center justify-between gap-3 p-4 text-left bg-white border border-dark-200 rounded-xl hover:border-primary-300 hover:bg-primary-50 transition-all group"
          >
            <span className="text-sm text-dark-700 group-hover:text-primary-700">
              {question}
            </span>
            <ArrowRight className="h-4 w-4 text-dark-400 group-hover:text-primary-600 flex-shrink-0 transform group-hover:translate-x-1 transition-transform" />
          </button>
        ))}
      </div>
    </div>
  );
}
