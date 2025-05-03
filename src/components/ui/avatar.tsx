import * as React from "react"
import * as Avatar from '@radix-ui/react-avatar'

import { cn } from "../../lib/utils" // Certifique-se de que `cn` seja uma função útil para concatenar classes (como o clsx, por exemplo)

const AvatarComponent = React.forwardRef<
  React.ElementRef<typeof Avatar.Root>,
  React.ComponentPropsWithoutRef<typeof Avatar.Root>
>(({ className, ...props }, ref) => (
  <Avatar.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  />
))
AvatarComponent.displayName = Avatar.Root.displayName

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof Avatar.Image>,
  React.ComponentPropsWithoutRef<typeof Avatar.Image>
>(({ className, ...props }, ref) => (
  <Avatar.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
))
AvatarImage.displayName = Avatar.Image.displayName

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof Avatar.Fallback>,
  React.ComponentPropsWithoutRef<typeof Avatar.Fallback>
>(({ className, ...props }, ref) => (
  <Avatar.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    )}
    {...props}
  />
))
AvatarFallback.displayName = Avatar.Fallback.displayName

export { AvatarComponent, AvatarImage, AvatarFallback }
