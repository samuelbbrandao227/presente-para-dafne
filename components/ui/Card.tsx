import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { cardVariants } from "@/lib/motion-variants";

interface CardProps {
  children: ReactNode;
  className?: string;
}

/**
 * Card elegante reutilizável — base visual das Cenas 2 e 3 (perguntas)
 * e potencialmente de outras telas com conteúdo flutuante.
 * Sombra suave, borda quase invisível, cantos arredondados generosos:
 * a estética "produto premium" pedida no briefing.
 */
export function Card({ children, className }: CardProps) {
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={cn(
        "w-full max-w-sm rounded-3xl bg-card px-7 py-9 sm:max-w-md sm:px-9 sm:py-10",
        "shadow-[var(--shadow-card)] ring-1 ring-[var(--color-border)]",
        className,
      )}
    >
      {children}
    </motion.div>
  );
}
