"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import Image from "next/image";
import { useJourney } from "@/hooks/use-journey";
import { useAudio } from "@/hooks/use-audio";
import { Button } from "@/components/ui/Button";
import { Confetti } from "@/components/ui/Confetti";

const PLAYFUL_LINES = [
  "Convocamos um convidado muito especial.",
  "Ele insistiu em cantar pessoalmente.",
];

const LINE_STAGGER = 1.3;
const BUTTON_DELAY = PLAYFUL_LINES.length * LINE_STAGGER + 0.8;

export function CelebrationScene() {
  const { dispatch } = useJourney();
  const { play, hasError } = useAudio({
    src: "/audio/parabens.mp3",
    volume: 0.6,
  });

  useEffect(() => {
    play();
  }, [play]);

  function handleContinue() {
    dispatch({ type: "SET_SCENE", payload: "vinyl-gallery" });
  }

  return (
    <motion.div
      className="relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden bg-[#15131a] px-6 py-16 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.1 }}
    >
      <Confetti count={24} />

      {/* Glow de fundo (mais suave e focado) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute h-[420px] w-[420px] rounded-full opacity-35 blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, var(--color-accent) 0%, transparent 70%)",
        }}
      />

      {/* FOTO DO CONVIDADO */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85, rotate: -2 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        className="relative"
      >
        {/* moldura polaroid */}
        <div className="relative h-36 w-36 sm:h-44 sm:w-44 rounded-2xl bg-white/10 p-2 ring-1 ring-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
          <div className="relative h-full w-full overflow-hidden rounded-xl bg-black/20">
            <Image
              src="/images/cantor.webp"
              alt="Convidado especial"
              fill
              className="object-cover"
              priority
            />

            {/* leve brilho sobre a imagem */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-white/10" />
          </div>
        </div>

        {/* glow atrás da foto */}
        <div className="absolute inset-0 -z-10 mx-auto my-auto h-52 w-52 rounded-full bg-accent/30 blur-[60px]" />
      </motion.div>

      {/* título */}
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.6 }}
        className="font-display mt-8 text-2xl text-white sm:text-3xl"
      >
        Parabéns pra você 🎶
      </motion.h2>

      {/* falas */}
      <div className="mt-6 flex max-w-sm flex-col gap-3" aria-live="polite">
        {PLAYFUL_LINES.map((line, index) => (
          <motion.p
            key={line}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 1 + index * LINE_STAGGER,
            }}
            className="text-base text-white/70"
          >
            {line}
          </motion.p>
        ))}
      </div>

      {/* erro de áudio */}
      {hasError && (
        <p className="mt-4 max-w-xs text-xs text-white/40">
          (Adicione o arquivo em{" "}
          <code>public/audio/parabens.mp3</code> para ativar o áudio)
        </p>
      )}

      {/* botão final */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.7,
          delay: BUTTON_DELAY,
        }}
        className="mt-10"
      >
        <Button onClick={handleContinue}>
          Receber presente
        </Button>
      </motion.div>
    </motion.div>
  );
}