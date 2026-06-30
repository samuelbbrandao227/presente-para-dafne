"use client";

import { useState } from "react";
import { motion, type PanInfo, AnimatePresence } from "framer-motion";
import { useJourney } from "@/hooks/use-journey";
import { VinylDisc } from "@/components/ui/VinylDisc";
import { Button } from "@/components/ui/Button";
import { VINYL_TRACKS } from "@/lib/tracks";

const SWIPE_THRESHOLD = 60;
const VISIBLE_NEIGHBORS = 2;

export function VinylGalleryScene() {
  const { dispatch } = useJourney();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isSelected, setIsSelected] = useState(false);

  const activeTrack = VINYL_TRACKS[activeIndex];

  function goTo(index: number) {
    const clamped = Math.max(0, Math.min(VINYL_TRACKS.length - 1, index));
    if (clamped !== activeIndex) {
      setIsSelected(false);
      setActiveIndex(clamped);
    }
  }

  function handleDiscTap(index: number) {
    if (index === activeIndex) {
      setIsSelected((p) => !p);
    } else {
      goTo(index);
    }
  }

  function handleDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x < -SWIPE_THRESHOLD) goTo(activeIndex + 1);
    else if (info.offset.x > SWIPE_THRESHOLD) goTo(activeIndex - 1);
  }

  function handleConfirmTrack() {
    dispatch({ type: "SET_TRACK", payload: activeTrack.id });
    dispatch({ type: "SET_SCENE", payload: "envelope" });
  }

  return (
    <motion.div
      className="relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden bg-bg px-6 py-16"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Título */}
      <h2 className="font-display mb-10 text-center text-2xl sm:text-3xl">
        Escolha um louvor
      </h2>

      {/* PALCO */}
      <div className="relative flex h-72 w-72 items-center justify-center sm:h-80 sm:w-80">
        {VINYL_TRACKS.map((track, index) => {
          const offset = index - activeIndex;
          const isActive = offset === 0;
          const isVisible = Math.abs(offset) <= VISIBLE_NEIGHBORS;

          if (!isVisible) return null;

          return (
            <motion.button
              key={track.id}
              type="button"
              className="absolute h-56 w-56 rounded-full"
              style={{ zIndex: 50 - Math.abs(offset) }}
              drag={isActive ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.18}
              onDragEnd={isActive ? handleDragEnd : undefined}
              onClick={() => handleDiscTap(index)}
              animate={{
                x: offset * 72,
                y: Math.abs(offset) * 10,
                scale: isActive ? 1 : 0.82 - Math.abs(offset) * 0.05,
                rotate: offset * 14,
                opacity: isActive ? 1 : 0.45,
                filter: isActive ? "blur(0px)" : "blur(1.2px)",
              }}
              transition={{
                type: "spring",
                stiffness: 240,
                damping: 26,
              }}
              whileTap={isActive ? { scale: 0.96 } : undefined}
            >
              {/* sombra separada para profundidade */}
              <div
                className="h-full w-full rounded-full"
                style={{
                  boxShadow: isActive
                    ? "0 30px 70px rgba(0,0,0,0.25)"
                    : "0 12px 30px rgba(0,0,0,0.15)",
                }}
              >
                <VinylDisc track={track} isSpinning={isActive && isSelected} />
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* INFO DO DISCO (AGORA FORA DO VINIL) */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTrack.id}
          initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -10, filter: "blur(8px)" }}
          transition={{ duration: 0.5 }}
          className="mt-10 text-center"
        >
          <h3 className="font-display text-2xl">
            {activeTrack.title}
          </h3>

          <p className="mt-1 text-text-muted">
            {activeTrack.artist}
          </p>

          <p className="mt-3 text-xs text-text-muted">
            {activeIndex + 1} de {VINYL_TRACKS.length}
          </p>
        </motion.div>
      </AnimatePresence>

      <p className="mt-6 text-sm text-text-muted">
        arraste para os lados para ver as outras faixas
      </p>

      {/* botão de seleção */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-6"
          >
            <Button onClick={handleConfirmTrack}>
              Tocar este louvor
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}