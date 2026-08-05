'use client';

import * as React from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { getInitials } from '@/lib/utils';

const avatarVariants = cva(
  'relative flex shrink-0 overflow-hidden rounded-full',
  {
    variants: {
      size: {
        sm: 'h-8 w-8',
        md: 'h-10 w-10',
        lg: 'h-12 w-12',
        xl: 'h-16 w-16',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

const statusColors = {
  online: 'bg-emerald-500',
  offline: 'bg-muted-foreground/40',
  busy: 'bg-amber-500',
  away: 'bg-muted-foreground/60',
};

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  src?: string | null;
  alt?: string;
  fallback?: string;
  name?: string;
  showStatus?: boolean;
  status?: 'online' | 'offline' | 'busy' | 'away';
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      className,
      size,
      src,
      alt,
      fallback,
      name,
      showStatus = false,
      status = 'online',
      ...props
    },
    ref
  ) => {
    const initials = fallback || (name ? getInitials(name) : '?');

    return (
      <div ref={ref} className={cn('relative inline-flex', className)} {...props}>
        <AvatarPrimitive.Root
          className={cn(
            avatarVariants({ size }),
            'aspect-square bg-muted'
          )}
        >
          <AvatarPrimitive.Image
            className="h-full w-full rounded-[inherit] object-cover"
            src={src || undefined}
            alt={alt || name || 'Avatar'}
          />
          <AvatarPrimitive.Fallback
            className="flex h-full w-full items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground"
            delayMs={src ? 600 : 0}
          >
            {initials}
          </AvatarPrimitive.Fallback>
        </AvatarPrimitive.Root>
        {showStatus && (
          <span
            className={cn(
              'absolute bottom-0 right-0 block rounded-full ring-2 ring-background',
              statusColors[status],
              size === 'sm' && 'h-2 w-2',
              size === 'md' && 'h-2.5 w-2.5',
              size === 'lg' && 'h-3 w-3',
              size === 'xl' && 'h-3.5 w-3.5'
            )}
          />
        )}
      </div>
    );
  }
);
Avatar.displayName = AvatarPrimitive.Root.displayName;

export { Avatar };
