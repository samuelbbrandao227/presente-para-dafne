"use client";

import { useEffect, useRef, useState, type UIEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useJourney } from "@/hooks/use-journey";
import { Sparkles } from "@/components/ui/Sparkles";
import { fadeBlurIn } from "@/lib/motion-variants";

type Phase = "reading" | "finale";

const SCROLL_END_THRESHOLD = 0.92;

function buildLetterParagraphs(guestName: string): string[] {
  const name = guestName.trim() || "você";

  return [
    `${name},`,
    "Decidi tirar um tempo para produzir algo especial para alguém especial.",
    "Quero que, neste dia, você possa sentir o amor de Deus pela sua vida e de todos ao seu redor.",
    "Que você possa relembrar os melhores momentos da sua vida e todas as bênçãos que o Senhor já lhe concedeu.",
    "Que você possa glorificar ao Senhor por completar mais um ano de vida em Sua presença e pela certeza das grandes bênçãos que Ele ainda irá operar na sua vida.",
    "Saiba que, para todos que estão ao seu redor, você é como está escrito em Provérbios 31:10: “Mulher virtuosa, quem a achará? O seu valor muito excede o de rubis.”",
    "Você é especial, para Deus e para todos nós.",
    "Com carinho, Samuel.",
  ];
}

export function LetterScene() {
  const { state } = useJourney();
  const [phase, setPhase] = useState<Phase>("reading");
  const [reachedEnd, setReachedEnd] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const paragraphs = buildLetterParagraphs(state.guestName);

  useEffect(() => {
    function checkOverflow() {
      const el = scrollRef.current;
      if (!el) return;
      const scrollable = el.scrollHeight - el.clientHeight;
      if (scrollable <= 4) setReachedEnd(true);
    }

    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, []);

  function handleScroll(event: UIEvent<HTMLDivElement>) {
    const el = event.currentTarget;
    const scrollable = el.scrollHeight - el.clientHeight;
    if (scrollable <= 4) {
      setReachedEnd(true);
      return;
    }
    const progress = el.scrollTop / scrollable;
    if (progress >= SCROLL_END_THRESHOLD) setReachedEnd(true);
  }

  function handleFinish() {
    setPhase("finale");
  }

  return (
    <motion.div
      className="relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden bg-bg px-6 py-16"
      initial={{ opacity: 0, filter: "blur(10px)", scale: 0.97 }}
      animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute h-[380px] w-[380px] rounded-full opacity-30 blur-[110px]"
        style={{
          background: "radial-gradient(circle, var(--color-accent) 0%, transparent 70%)",
        }}
      />

      <AnimatePresence mode="wait">
        {phase === "reading" && (
          <motion.div
            key="reading"
            variants={fadeBlurIn}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, filter: "blur(10px)", scale: 1.02, transition: { duration: 0.7 } }}
            className="relative flex w-full max-w-md flex-col items-center"
          >
            <div
              className="w-full rounded-3xl bg-card px-7 py-9 shadow-[var(--shadow-card)] ring-1 ring-[var(--color-border)] sm:px-9 sm:py-10"
              style={{
                background:
                  "linear-gradient(180deg, var(--color-card) 0%, #fffdfa 100%)",
              }}
            >
              <div
                ref={scrollRef}
                onScroll={handleScroll}
                tabIndex={0}
                role="region"
                aria-label="Carta de aniversário, role para ler"
                className="max-h-[50vh] overflow-y-auto pr-2 text-left"
              >
                {paragraphs.map((paragraph, index) => (
                  <p
                    key={index}
                    className={
                      index === 0
                        ? "font-script mb-5 text-3xl text-accent-strong"
                        : "font-body mb-4 text-base leading-relaxed text-text last:mb-0"
                    }
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              {reachedEnd ? (
                <motion.button
                  key="finish"
                  type="button"
                  onClick={handleFinish}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="mt-7 flex flex-col items-center gap-1.5 transition-opacity hover:opacity-70"
                >
                  <span className="font-script text-2xl text-accent-strong">
                    Feliz aniversário ❤️
                  </span>
                  <span className="text-xs text-text-muted">toque para continuar</span>
                </motion.button>
              ) : (
                <motion.p
                  key="hint"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-7 text-sm text-text-muted"
                  aria-hidden="true"
                >
                  role para continuar lendo
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {phase === "finale" && (
          <motion.div
            key="finale"
            initial={{ opacity: 0, scale: 0.9, filter: "blur(8px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex flex-col items-center text-center"
          >
            <Sparkles count={16} />
            <h2 className="font-display relative text-3xl text-text sm:text-4xl">
              Feliz aniversário ❤️
            </h2>
            <p className="font-script relative mt-4 text-xl text-accent-strong">
              com todo o meu carinho
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}