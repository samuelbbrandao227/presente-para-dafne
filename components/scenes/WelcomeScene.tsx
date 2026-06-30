"use client";

import { motion, type Variants } from "framer-motion";
import { useEffect } from "react";
import { useJourney } from "@/hooks/use-journey";
import { fadeBlurIn } from "@/lib/motion-variants";

/**
 * Tempo (em ms) que o título permanece totalmente visível antes de começar
 * a desaparecer. Centralizado aqui para fácil ajuste de ritmo.
 */
const HOLD_DURATION = 2600;

/**
 * Estende a variant compartilhada `fadeBlurIn` (entrada) com um `exit`
 * específico desta cena: fade out + leve zoom para cima + blur voltando.
 */
const titleVariants: Variants = {
  ...fadeBlurIn,
  exit: {
    opacity: 0,
    scale: 1.03,
    filter: "blur(10px)",
    transition: {
      duration: 0.9,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

const subtitleVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: [0.22, 1, 0.36, 1] as const, delay: 0.6 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const },
  },
};

/**
 * Cena 1 — Boas-vindas.
 * Tela vazia e elegante com o título central "Olá, seja bem-vinda!".
 * Aparece com fade + zoom + blur diminuindo, permanece alguns segundos,
 * e então avança automaticamente para a Cena 2 (nome).
 */
export function WelcomeScene() {
  const { dispatch } = useJourney();

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch({ type: "SET_SCENE", payload: "name" });
    }, HOLD_DURATION);

    return () => clearTimeout(timer);
  }, [dispatch]);

  return (
    <motion.div
      className="relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden bg-bg px-6"
      initial={{ opacity: 1 }}
      exit={{ opacity: 1 }}
    >
      {/* Glow decorativo discreto ao fundo, sem competir com o texto */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute h-[420px] w-[420px] rounded-full opacity-30 blur-[100px]"
        style={{
          background:
            "radial-gradient(circle, var(--color-accent) 0%, transparent 70%)",
        }}
      />

      <motion.h1
        className="font-display relative text-center text-[2.4rem] font-medium leading-tight text-text sm:text-5xl md:text-6xl"
        variants={titleVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        Olá, seja bem-vinda!
      </motion.h1>

      <motion.p
        className="font-script relative mt-4 text-2xl text-accent-strong sm:text-3xl"
        variants={subtitleVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        aria-hidden="true"
      >
        algo especial está chegando
      </motion.p>
    </motion.div>
  );
}
