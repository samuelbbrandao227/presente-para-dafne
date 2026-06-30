"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useJourney } from "@/hooks/use-journey";

/**
 * Cena 6 — Envelope.
 * Surge um envelope com aparência física (sombra, profundidade, aba
 * dobrável). Ao tocar, a aba abre e a carta desliza para cima por
 * dentro — convidando a pessoa a avançar para a Cena 7 (a carta em si).
 *
 * Fases:
 * - "closed": envelope fechado, aguardando toque.
 * - "opening": aba já abriu, papel subiu, botão de avançar aparece.
 */
type Phase = "closed" | "opening";

const ENVELOPE_WIDTH = 280;
const ENVELOPE_HEIGHT = 188;

export function EnvelopeScene() {
  const { dispatch } = useJourney();
  const [phase, setPhase] = useState<Phase>("closed");

  function handleOpen() {
    if (phase === "closed") setPhase("opening");
  }

  function handleContinue() {
    dispatch({ type: "SET_SCENE", payload: "letter" });
  }

  return (
    <motion.div
      className="relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden bg-bg px-6"
      initial={{ opacity: 0, filter: "blur(10px)", scale: 0.97 }}
      animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
      exit={{ opacity: 0, filter: "blur(10px)", scale: 1.02 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Glow discreto atrás do envelope, mesma assinatura visual das outras cenas */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute h-[360px] w-[360px] rounded-full opacity-30 blur-[110px]"
        style={{
          background: "radial-gradient(circle, var(--color-secondary) 0%, transparent 70%)",
        }}
      />

      <motion.h2
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="font-display relative mb-10 text-center text-2xl text-text sm:text-3xl"
      >
        {phase === "closed" ? "Tem algo aqui pra você" : "Quase lá..."}
      </motion.h2>

      <motion.button
        type="button"
        onClick={handleOpen}
        disabled={phase === "opening"}
        aria-label={
          phase === "closed"
            ? "Abrir envelope"
            : "Envelope aberto, a carta está pronta"
        }
        className="relative cursor-pointer disabled:cursor-default"
        style={{
          width: ENVELOPE_WIDTH,
          height: ENVELOPE_HEIGHT,
          perspective: 800,
        }}
        whileHover={phase === "closed" ? { y: -4 } : undefined}
        whileTap={phase === "closed" ? { scale: 0.98 } : undefined}
        animate={
          phase === "closed"
            ? { rotate: [0, -1.2, 1.2, 0] }
            : { rotate: 0 }
        }
        transition={
          phase === "closed"
            ? { duration: 4, repeat: Infinity, ease: "easeInOut" }
            : { duration: 0.4 }
        }
      >
        {/* Corpo do envelope */}
        <div
          className="absolute inset-0 rounded-md"
          style={{
            background: "linear-gradient(180deg, #fffdfb 0%, #f7f2ec 100%)",
            boxShadow:
              "0 24px 48px rgba(31,41,55,0.16), 0 4px 12px rgba(31,41,55,0.08)",
          }}
        />

        {/* Carta — fica por trás da aba, sobe quando o envelope abre */}
        <motion.div
          className="absolute left-1/2 top-3 -translate-x-1/2 rounded-sm bg-card"
          style={{
            width: ENVELOPE_WIDTH * 0.74,
            height: ENVELOPE_HEIGHT * 0.86,
            boxShadow: "0 8px 20px rgba(31,41,55,0.12)",
            zIndex: 5,
          }}
          animate={
            phase === "opening"
              ? { y: -ENVELOPE_HEIGHT * 0.46, opacity: 1 }
              : { y: 0, opacity: 0 }
          }
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: phase === "opening" ? 0.5 : 0 }}
        >
          <div className="flex h-full w-full items-center justify-center px-3">
            <span className="font-script text-center text-lg text-accent-strong">
              para você
            </span>
          </div>
        </motion.div>

        {/* Costura/textura sutil das bordas internas (V invertido), simulando o corte do papel.
            Fica na frente da carta (opaca) para parecer que ela sai por trás do bolso inferior do envelope. */}
        <div
          className="absolute inset-0 rounded-md"
          style={{
            clipPath: `polygon(0 0, 50% 56%, 100% 0, 100% 100%, 0 100%)`,
            background: "linear-gradient(160deg, #efe7dd 0%, #e3d8ca 100%)",
            zIndex: 6,
          }}
          aria-hidden="true"
        />

        {/* Aba do envelope (triângulo) — dobra para cima ao abrir.
            zIndex cai quando aberta para que a carta passe a ficar na frente dela. */}
        <motion.div
          className="absolute inset-x-0 top-0 origin-top rounded-t-md"
          style={{
            height: "60%",
            clipPath: "polygon(0 0, 100% 0, 50% 100%)",
            background: "linear-gradient(150deg, #fdf9f5 0%, #f0e6da 100%)",
            boxShadow: "0 2px 6px rgba(31,41,55,0.08)",
            transformStyle: "preserve-3d",
            zIndex: phase === "opening" ? 1 : 10,
          }}
          animate={{ rotateX: phase === "opening" ? 180 : 0 }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
        />

        {/* Selo decorativo no centro da aba */}
        {phase === "closed" && (
          <motion.div
            className="absolute left-1/2 top-[26%] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              width: 34,
              height: 34,
              background: "var(--color-accent)",
              boxShadow: "0 2px 6px rgba(31,41,55,0.15)",
              zIndex: 11,
            }}
            aria-hidden="true"
          >
            <span className="flex h-full w-full items-center justify-center font-script text-sm text-white">
              ♡
            </span>
          </motion.div>
        )}
      </motion.button>

      <p className="relative mt-8 text-sm text-text-muted" aria-hidden="true">
        {phase === "closed" ? "toque no envelope para abrir" : ""}
      </p>

      <AnimatePresence mode="wait">
        {phase === "opening" && (
          <motion.div
            key="continue"
            initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 8, filter: "blur(6px)" }}
            transition={{ duration: 0.5, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative mt-10"
          >
            <button
              type="button"
              onClick={handleContinue}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 font-body text-sm font-medium text-text shadow-[var(--shadow-soft)] transition-colors duration-200 hover:bg-accent-strong sm:text-base"
            >
              Ler a carta
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}