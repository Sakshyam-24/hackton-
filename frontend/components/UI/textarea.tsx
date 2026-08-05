'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  showCharCount?: boolean;
  maxChars?: number;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      showCharCount = false,
      maxLength,
      maxChars,
      id,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');
    const [charCount, setCharCount] = React.useState(
      typeof value === 'string' ? value.length : 0
    );
    const limit = maxChars || maxLength;

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length);
      onChange?.(e);
    };

    return (
      <div className="w-full space-y-2">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
          </label>
        )}
        <textarea
          className={cn(
            'flex min-h-[80px] w-full rounded-lg border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200',
            error
              ? 'border-destructive focus-visible:ring-destructive'
              : 'border-input',
            className
          )}
          ref={ref}
          id={textareaId}
          value={value}
          onChange={handleChange}
          maxLength={maxLength}
          {...props}
        />
        <div className="flex items-center justify-between">
          {(error || helperText) && (
            <p
              className={cn(
                'text-sm',
                error ? 'text-destructive' : 'text-muted-foreground'
              )}
            >
              {error || helperText}
            </p>
          )}
          {showCharCount && limit && (
            <p
              className={cn(
                'text-sm ml-auto',
                charCount >= limit ? 'text-destructive' : 'text-muted-foreground'
              )}
            >
              {charCount}/{limit}
            </p>
          )}
        </div>
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };
