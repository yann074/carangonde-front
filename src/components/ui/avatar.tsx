// Importação do Radix Avatar
import React from "react";

import * as RadixAvatar from '@radix-ui/react-avatar'
import { cn } from "../../lib/utils" // Certifique-se de que `cn` seja uma função útil para concatenar classes (como o clsx, por exemplo)

// Componente AvatarRoot
const AvatarComponent = React.forwardRef<React.ElementRef<typeof RadixAvatar.Root>, React.ComponentPropsWithoutRef<typeof RadixAvatar.Root>>(
  ({ className, ...props }, ref) => (
    <RadixAvatar.Root
      ref={ref}
      className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)}
      {...props}
    />
  )
)
AvatarComponent.displayName = RadixAvatar.Root.displayName

// Componente AvatarImage
const AvatarImage = React.forwardRef<React.ElementRef<typeof RadixAvatar.Image>, React.ComponentPropsWithoutRef<typeof RadixAvatar.Image>>(
  ({ className, ...props }, ref) => (
    <RadixAvatar.Image
      ref={ref}
      className={cn("aspect-square h-full w-full", className)}
      {...props}
    />
  )
)
AvatarImage.displayName = RadixAvatar.Image.displayName

// Componente AvatarFallback
const AvatarFallback = React.forwardRef<React.ElementRef<typeof RadixAvatar.Fallback>, React.ComponentPropsWithoutRef<typeof RadixAvatar.Fallback>>(
  ({ className, ...props }, ref) => (
    <RadixAvatar.Fallback
      ref={ref}
      className={cn("flex h-full w-full items-center justify-center rounded-full bg-muted", className)}
      {...props}
    />
  )
)
AvatarFallback.displayName = RadixAvatar.Fallback.displayName

export { AvatarComponent as Avatar, AvatarImage, AvatarFallback };
