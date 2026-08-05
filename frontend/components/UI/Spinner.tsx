import { cn } from '@/lib/utils';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function Spinner({ size = 'md', className }: SpinnerProps) {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-2 border-dark-200 border-t-primary-600',
          sizes[size]
        )}
      />
    </div>
  );
}

export function TypingIndicator({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="w-2 h-2 bg-dark-400 rounded-full typing-dot" />
      <div className="w-2 h-2 bg-dark-400 rounded-full typing-dot" />
      <div className="w-2 h-2 bg-dark-400 rounded-full typing-dot" />
    </div>
  );
}
