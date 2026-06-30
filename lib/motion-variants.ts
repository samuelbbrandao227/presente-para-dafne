import type { Variants } from "framer-motion";

/**
 * Variants compartilhadas entre cenas que usam o padrão de entrada
 * "fade + leve zoom + blur diminuindo" (Cena 1, cards das Cenas 2/3, Carta).
 * Centralizar aqui evita duplicar as mesmas curvas de easing em cada cena.
 */
export const fadeBlurIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.94,
    filter: "blur(12px)",
  },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 1.1,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

/**
 * Variants do card de pergunta (Cenas 2 e 3): entra com fade + blur subindo
 * de baixo para cima, e ao ser confirmado, desliza para baixo perdendo
 * opacidade — exatamente como descrito no roteiro ("o card sai deslizando
 * levemente para baixo enquanto perde opacidade").
 */
export const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 28,
    scale: 0.96,
    filter: "blur(8px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    y: 24,
    filter: "blur(6px)",
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};
