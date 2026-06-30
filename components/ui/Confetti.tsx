"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface ConfettiPiece {
  id: number;
  x: number;
  delay: number;
  duration: number;
  rotation: number;
  color: string;
  size: number;
}

const PALETTE = ["var(--color-accent)", "var(--color-secondary)", "var(--color-accent-strong)"];

function generatePieces(count: number): ConfettiPiece[] {
  return Array.from({ length: count }, (_, id) => ({
    id,
    x: Math.random() * 100,
    delay: Math.random() * 1.2,
    duration: 2.8 + Math.random() * 1.6,
    rotation: Math.random() * 360,
    color: PALETTE[id % PALETTE.length],
    size: 6 + Math.random() * 5,
  }));
}

interface ConfettiProps {
  /** Quantidade de partículas — mantenha baixo para um efeito discreto. */
  count?: number;
}

/**
 * Confete discreto, gerado proceduralmente (sem imagens, sem libs extras).
 * As posições/tempos aleatórios só são gerados **depois de montar no
 * cliente** (via `useEffect`), nunca durante a renderização: gerar
 * valores aleatórios no corpo do componente quebraria a hidratação SSR
 * do Next.js (servidor e cliente produziriam números diferentes) e viola
 * a regra de pureza de render do React.
 * `aria-hidden`: é puramente decorativo, não deve ser anunciado.
 */
export function Confetti({ count = 18 }: ConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    // Geração única, client-only, de partículas aleatórias. Não há loop de
    // re-render: este efeito roda apenas quando `count` muda (raro/nunca
    // em uso real), então o re-render extra é intencional e inofensivo —
    // é o jeito correto de evitar Math.random() durante o render em si.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPieces(generatePieces(count));
  }, [count]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {pieces.map((piece) => (
        <motion.span
          key={piece.id}
          className="absolute top-0 block rounded-sm"
          style={{
            left: `${piece.x}%`,
            width: piece.size,
            height: piece.size * 1.6,
            backgroundColor: piece.color,
          }}
          initial={{ y: -20, opacity: 0, rotate: 0 }}
          animate={{
            y: "110vh",
            opacity: [0, 1, 1, 0],
            rotate: piece.rotation,
            x: [0, 12, -12, 0],
          }}
          transition={{
            duration: piece.duration,
            delay: piece.delay,
            ease: "easeIn",
          }}
        />
      ))}
    </div>
  );
}
