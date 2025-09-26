import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-cyber focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-hover neon-glow",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:shadow-glow-secondary",
        success: "bg-success text-success-foreground hover:bg-success/90 hover:shadow-glow-success",
        warning: "bg-warning text-warning-foreground hover:bg-warning/90 hover:shadow-lg hover:shadow-warning/25",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "cyber-border bg-surface/50 hover:bg-surface-elevated hover:border-primary/50 text-foreground backdrop-blur-sm",
        ghost: "hover:bg-surface-elevated/50 hover:text-accent-foreground backdrop-blur-sm",
        link: "text-primary underline-offset-4 hover:underline text-glow",
        gradient: "bg-gradient-primary text-primary-foreground neon-glow",
        gradientSuccess: "bg-gradient-success text-success-foreground hover:shadow-glow-success",
        neon: "glass-neon text-primary hover:text-primary-foreground hover:bg-gradient-primary",
        cyber: "cyber-border glass hover:shadow-neon text-foreground hover:text-primary",
        premium: "bg-gradient-hero text-primary-foreground pulse-glow",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 rounded-md px-4",
        lg: "h-14 rounded-xl px-10 text-base",
        xl: "h-16 rounded-xl px-12 text-lg",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };