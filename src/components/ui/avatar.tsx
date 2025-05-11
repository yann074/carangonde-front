import React from "react";
import * as RadixAvatar from '@radix-ui/react-avatar';
import { cn } from "../../lib/utils";

interface AvatarProps extends React.ComponentPropsWithoutRef<typeof RadixAvatar.Root> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  shape?: 'circle' | 'square';
}

const Avatar = React.forwardRef<React.ElementRef<typeof RadixAvatar.Root>, AvatarProps>(
  ({ className, size = 'md', shape = 'circle', ...props }, ref) => (
    <RadixAvatar.Root
      ref={ref}
      className={cn(
        "relative flex shrink-0 overflow-hidden",
        // Size variants
        {
          'h-8 w-8': size === 'sm',
          'h-10 w-10': size === 'md',
          'h-12 w-12': size === 'lg',
          'h-16 w-16': size === 'xl',
        },
        // Shape variants
        {
          'rounded-full': shape === 'circle',
          'rounded-md': shape === 'square',
        },
        className
      )}
      {...props}
    />
  )
);
Avatar.displayName = "Avatar";

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof RadixAvatar.Image>,
  React.ComponentPropsWithoutRef<typeof RadixAvatar.Image>
>(({ className, ...props }, ref) => (
  <RadixAvatar.Image
    ref={ref}
    className={cn(
      "aspect-square h-full w-full object-cover",
      className
    )}
    {...props}
  />
));
AvatarImage.displayName = "AvatarImage";

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof RadixAvatar.Fallback>,
  React.ComponentPropsWithoutRef<typeof RadixAvatar.Fallback>
>(({ className, ...props }, ref) => (
  <RadixAvatar.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center bg-gray-100 text-gray-600",
      className
    )}
    {...props}
  />
));
AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarImage, AvatarFallback };