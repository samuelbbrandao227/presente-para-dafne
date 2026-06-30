import type { ButtonHTMLAttributes, ReactNode } from "react";
import { motion } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full font-body font-medium transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-accent text-text shadow-[var(--shadow-soft)] hover:bg-accent-strong",
        secondary:
          "bg-transparent text-text-muted ring-1 ring-[var(--color-border)] hover:bg-card",
      },
      size: {
        md: "px-6 py-3 text-sm sm:text-base",
        sm: "px-4 py-2 text-sm",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

interface ButtonProps
  extends Omit<
      ButtonHTMLAttributes<HTMLButtonElement>,
      "onAnimationStart" | "onAnimationEnd" | "onDrag" | "onDragStart" | "onDragEnd"
    >,
    VariantProps<typeof buttonVariants> {
  children: ReactNode;
}

/**
 * Botão reutilizável com micro-interação de tap (escala levemente ao
 * pressionar) — uma das microinterações pedidas no briefing.
 * `class-variance-authority` mantém as variantes (primary/secondary,
 * md/sm) tipadas e fáceis de estender em cenas futuras.
 */
export function Button({
  children,
  variant,
  size,
  className,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </motion.button>
  );
}
