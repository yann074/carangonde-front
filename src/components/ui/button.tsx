import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-white shadow hover:bg-primary/90",
        light: "bg-gray-50 text-gray-900 border border-gray-200 hover:bg-gray-100",
        subtle: "bg-gray-100 text-gray-700 hover:bg-gray-200",
        outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
        secondary: "bg-blue-50 text-blue-700 hover:bg-blue-100",
        success: "bg-green-50 text-green-700 hover:bg-green-100",
        warning: "bg-amber-50 text-amber-700 hover:bg-amber-100",
        destructive: "bg-red-50 text-red-700 hover:bg-red-100",
        ghost: "text-gray-700 hover:bg-gray-100",
        link: "text-primary hover:underline underline-offset-4",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-9 px-4 py-2",
        lg: "h-10 px-6 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };