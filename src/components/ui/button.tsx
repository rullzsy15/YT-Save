import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium",
    "transition-all duration-[150ms] ease-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--primary))] focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--bg))]",
    "disabled:pointer-events-none disabled:opacity-40",
    "select-none",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: [
          "bg-[hsl(var(--primary))] text-white",
          "hover:bg-[hsl(var(--primary-hover))]",
          "shadow-[0_1px_3px_hsl(var(--primary)/0.3)]",
          "hover:shadow-[0_4px_12px_hsl(var(--primary)/0.3)]",
          "active:scale-[0.98]",
        ].join(" "),
        secondary: [
          "bg-[hsl(var(--surface-2))] text-[hsl(var(--text-primary))]",
          "border border-[hsl(var(--border))]",
          "hover:bg-[hsl(var(--border))] hover:border-[hsl(var(--border-strong))]",
          "active:scale-[0.98]",
        ].join(" "),
        outline: [
          "bg-transparent text-[hsl(var(--text-primary))]",
          "border border-[hsl(var(--border))]",
          "hover:bg-[hsl(var(--surface-2))] hover:border-[hsl(var(--border-strong))]",
          "active:scale-[0.98]",
        ].join(" "),
        ghost: [
          "bg-transparent text-[hsl(var(--text-secondary))]",
          "hover:bg-[hsl(var(--surface-2))] hover:text-[hsl(var(--text-primary))]",
          "active:scale-[0.98]",
        ].join(" "),
        danger: [
          "bg-[hsl(var(--danger))] text-white",
          "hover:bg-[hsl(var(--danger)/0.85)]",
          "shadow-[0_1px_3px_hsl(var(--danger)/0.25)]",
          "hover:shadow-[0_4px_12px_hsl(var(--danger)/0.25)]",
          "active:scale-[0.98]",
        ].join(" "),
        success: [
          "bg-[hsl(var(--success))] text-white",
          "hover:bg-[hsl(var(--success)/0.85)]",
          "shadow-[0_1px_3px_hsl(var(--success)/0.25)]",
          "hover:shadow-[0_4px_12px_hsl(var(--success)/0.25)]",
          "active:scale-[0.98]",
        ].join(" "),
        // Legacy aliases for backward compat
        default: [
          "bg-[hsl(var(--secondary))] text-white",
          "hover:opacity-90",
          "shadow-sm",
          "active:scale-[0.98]",
        ].join(" "),
        destructive: [
          "bg-[hsl(var(--danger))] text-white",
          "hover:bg-[hsl(var(--danger)/0.85)]",
          "shadow-sm",
          "active:scale-[0.98]",
        ].join(" "),
        link: "text-[hsl(var(--primary))] underline-offset-4 hover:underline",
        accent: [
          "bg-[hsl(var(--primary))] text-white",
          "hover:bg-[hsl(var(--primary-hover))]",
          "shadow-[0_1px_3px_hsl(var(--primary)/0.3)]",
          "hover:shadow-[0_4px_12px_hsl(var(--primary)/0.3)]",
          "active:scale-[0.98]",
        ].join(" "),
      },
      size: {
        sm: "h-[36px] px-4 text-sm rounded-md",
        default: "h-[44px] px-5 text-sm rounded-md",
        md: "h-[44px] px-5 text-sm rounded-md",
        lg: "h-[52px] px-8 text-base rounded-md",
        icon: "h-[44px] w-[44px] rounded-md",
        "icon-sm": "h-[36px] w-[36px] rounded-md",
      },
    },
    defaultVariants: {
      variant: "primary",
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
