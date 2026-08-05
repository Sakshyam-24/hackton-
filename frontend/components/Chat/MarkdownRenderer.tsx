'use client';

import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { Copy, Check } from 'lucide-react';
import { useState, type ReactNode } from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

function CodeBlock({ children, className }: { children?: ReactNode; className?: string }) {
  const [copied, setCopied] = useState(false);
  const code = String(children ?? '').replace(/\n$/, '');
  const language = className?.replace('language-', '') || '';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (className) {
    return (
      <div className="relative group my-3 rounded-xl overflow-hidden border border-white/10 bg-white/5">
        <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
          <span className="text-xs font-mono text-gray-400">{language}</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
        <pre className="p-4 overflow-x-auto text-sm leading-relaxed">
          <code className="font-mono text-gray-200">{code}</code>
        </pre>
      </div>
    );
  }

  return (
    <code className="px-1.5 py-0.5 rounded-md bg-white/10 text-white font-mono text-[0.85em] border border-white/10">
      {children}
    </code>
  );
}

const components: Components = {
  h1: ({ children }) => (
    <h1 className="text-xl font-bold text-white mt-6 mb-3 pb-2 border-b border-white/10">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-lg font-bold text-white mt-5 mb-2 pb-1.5 border-b border-white/5">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-base font-semibold text-white mt-4 mb-2">
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="text-sm font-semibold text-gray-200 mt-3 mb-1.5">
      {children}
    </h4>
  ),
  p: ({ children }) => (
    <p className="text-sm leading-relaxed text-gray-300 mb-3 last:mb-0">
      {children}
    </p>
  ),
  ul: ({ children }) => (
    <ul className="list-disc list-outside ml-5 mb-3 space-y-1 text-sm text-gray-300 marker:text-gray-500">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-outside ml-5 mb-3 space-y-1 text-sm text-gray-300 marker:text-gray-500 marker:font-medium">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="pl-1 leading-relaxed">{children}</li>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-3 pl-4 border-l-4 border-white/20 bg-white/5 rounded-r-lg py-2 pr-3 text-sm text-gray-400 italic">
      {children}
    </blockquote>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-white hover:text-gray-300 underline underline-offset-2 decoration-white/30 hover:decoration-white/60 transition-colors"
    >
      {children}
    </a>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-white">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="italic text-gray-400">{children}</em>
  ),
  table: ({ children }) => (
    <div className="my-3 overflow-x-auto rounded-lg border border-white/10">
      <table className="min-w-full text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-white/5 border-b border-white/10">{children}</thead>
  ),
  tbody: ({ children }) => (
    <tbody className="divide-y divide-white/5">{children}</tbody>
  ),
  tr: ({ children }) => (
    <tr className="hover:bg-white/5 transition-colors">{children}</tr>
  ),
  th: ({ children }) => (
    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-3 py-2 text-gray-300">{children}</td>
  ),
  hr: () => <hr className="my-4 border-white/10" />,
  code: CodeBlock,
  pre: ({ children }) => <>{children}</>,
};

export default function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <div className={`prose prose-sm prose-invert max-w-none ${className ?? ''}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
