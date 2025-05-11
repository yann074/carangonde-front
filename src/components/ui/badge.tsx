import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const badgeVariants = cva(
  "inline-flex items-center border font-medium transition-colors focus:outline-none",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground border-transparent",
        secondary: "bg-secondary text-secondary-foreground border-transparent",
        success: "bg-emerald-100 text-emerald-800 border-transparent dark:bg-emerald-900 dark:text-emerald-100",
        warning: "bg-amber-100 text-amber-800 border-transparent dark:bg-amber-900 dark:text-amber-100",
        info: "bg-blue-100 text-blue-800 border-transparent dark:bg-blue-900 dark:text-blue-100",
        destructive: "bg-red-100 text-red-800 border-transparent dark:bg-red-900 dark:text-red-100",
        outline: "bg-transparent text-foreground border-border",
      },
      size: {
        sm: "text-xs px-2 py-0.5 rounded",
        md: "text-sm px-2.5 py-0.5 rounded-md",
        lg: "text-base px-3 py-1 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

interface BadgeProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = ({ className, variant, size, ...props }: BadgeProps) => {
  return (
    <div
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }