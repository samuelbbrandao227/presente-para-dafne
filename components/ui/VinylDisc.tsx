import { motion } from "framer-motion";
import type { VinylTrack } from "@/types/journey";

interface VinylDiscProps {
  track: VinylTrack;
  /** Gira lentamente de forma contínua quando o disco está selecionado. */
  isSpinning: boolean;
}

/**
 * Desenha um disco de vinil inteiramente em SVG (sem imagens externas):
 * anel preto com sulcos concêntricos, rótulo central colorido com o
 * `accentColor` da faixa, título e artista. Evita qualquer dependência
 * de capas de álbum reais (direitos autorais) e fica leve/nítido em
 * qualquer resolução de tela.
 */
export function VinylDisc({ track, isSpinning }: VinylDiscProps) {
  return (
    <motion.svg
      viewBox="0 0 240 240"
      className="h-full w-full"
      animate={isSpinning ? { rotate: 360 } : { rotate: 0 }}
      transition={
        isSpinning
          ? { duration: 6, repeat: Infinity, ease: "linear" }
          : { duration: 0.4 }
      }
      role="img"
      aria-label={`Disco: ${track.title}, ${track.artist}`}
    >
      {/* Corpo do disco */}
      <circle cx="120" cy="120" r="118" fill="#1c1a1f" />

      {/* Sulcos concêntricos */}
      {[108, 96, 84, 72, 60].map((r) => (
        <circle
          key={r}
          cx="120"
          cy="120"
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="1"
        />
      ))}

      {/* Brilho sutil, simulando reflexo de luz no vinil */}
      <circle cx="120" cy="120" r="118" fill="url(#vinylSheen)" opacity="0.5" />

      {/* Rótulo central */}
      <circle cx="120" cy="120" r="46" fill={track.accentColor} />
      <circle cx="120" cy="120" r="46" fill="url(#labelShade)" />
      <circle cx="120" cy="120" r="5" fill="#1c1a1f" />

      <text
        x="120"
        y="113"
        textAnchor="middle"
        className="font-display"
        fontSize="11"
        fontWeight="600"
        fill="#1f2937"
      >
        {track.title.length > 16 ? `${track.title.slice(0, 15)}…` : track.title}
      </text>
      <text
        x="120"
        y="128"
        textAnchor="middle"
        className="font-body"
        fontSize="7"
        fill="#1f293799"
      >
        {track.artist}
      </text>

      <defs>
        <radialGradient id="vinylSheen" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.12" />
          <stop offset="40%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="labelShade" cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>
    </motion.svg>
  );
}
