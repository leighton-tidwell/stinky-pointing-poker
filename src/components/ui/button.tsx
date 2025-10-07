import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg border border-transparent text-sm font-semibold uppercase tracking-wide transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary/90 text-primary-foreground shadow-[0_0_25px_rgba(34,197,94,0.35)] hover:bg-primary focus-visible:ring-primary",
        destructive:
          "bg-destructive/90 text-destructive-foreground hover:bg-destructive focus-visible:ring-destructive/80",
        outline:
          "border border-primary/60 bg-transparent text-primary hover:bg-primary/10",
        secondary:
          "bg-secondary/80 text-secondary-foreground hover:bg-secondary",
        ghost:
          "border border-transparent bg-transparent text-muted-foreground hover:border-muted hover:text-foreground",
        link: "text-accent underline-offset-4 hover:text-primary hover:underline",
      },
      size: {
        default: "h-10 px-5",
        sm: "h-9 rounded-md px-3",
        lg: "h-12 rounded-md px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
