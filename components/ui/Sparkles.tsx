"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface SparkleParticle {
  id: number;
  x: number;
  y: number;
  delay: number;
  duration: number;
  size: number;
  kind: "star" | "burst";
  color: string;
}

const PALETTE = ["var(--color-accent)", "var(--color-secondary)", "#F4C9A8"];

function generateParticles(count: number): SparkleParticle[] {
  return Array.from({ length: count }, (_, id) => ({
    id,
    x: 10 + Math.random() * 80,
    y: 10 + Math.random() * 70,
    delay: Math.random() * 2.5,
    duration: 1.6 + Math.random() * 1.4,
    size: 8 + Math.random() * 10,
    kind: id % 3 === 0 ? "burst" : "star",
    color: PALETTE[id % PALETTE.length],
  }));
}

/**
 * Estrela de 4 pontas desenhada via `clip-path`, leve e sem dependência
 * de ícones externos — mantém o padrão "tudo desenhado" do projeto.
 */
function Star({ size, color }: { size: number; color: string }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        background: color,
        clipPath:
          "polygon(50% 0%, 61% 35%, 100% 50%, 61% 65%, 50% 100%, 39% 65%, 0% 50%, 39% 35%)",
      }}
    />
  );
}

/** Pequeno estouro de "fogo" — núcleo + raios curtos saindo do centro. */
function Burst({ size, color }: { size: number; color: string }) {
  const rays = Array.from({ length: 6 });
  return (
    <div className="relative" style={{ width: size * 2.4, height: size * 2.4 }}>
      {rays.map((_, i) => (
        <span
          key={i}
          className="absolute left-1/2 top-1/2 block rounded-full"
          style={{
            width: 2,
            height: size,
            background: color,
            transform: `translate(-50%, -100%) rotate(${i * 60}deg)`,
            transformOrigin: "bottom center",
          }}
        />
      ))}
      <span
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ width: size * 0.5, height: size * 0.5, background: color }}
      />
    </div>
  );
}

interface SparklesProps {
  /** Quantidade de partículas — discreto por padrão, sem poluir a tela. */
  count?: number;
}

/**
 * Efeito final de fechamento (Cena 7): estrelas e pequenos "fogos"
 * surgindo e desaparecendo suavemente em posições aleatórias da tela.
 * Geração client-only via `useEffect` para não quebrar a hidratação SSR
 * (mesmo motivo documentado em `Confetti.tsx`).
 */
export function Sparkles({ count = 14 }: SparklesProps) {
  const [particles, setParticles] = useState<SparkleParticle[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setParticles(generateParticles(count));
  }, [count]);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
          initial={{ opacity: 0, scale: 0.4, rotate: 0 }}
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [0.4, 1, 1, 0.6],
            rotate: p.kind === "star" ? [0, 90] : 0,
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            repeatDelay: 1.4 + Math.random() * 2,
            ease: "easeInOut",
          }}
        >
          {p.kind === "star" ? (
            <Star size={p.size} color={p.color} />
          ) : (
            <Burst size={p.size} color={p.color} />
          )}
        </motion.div>
      ))}
    </div>
  );
}