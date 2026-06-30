"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { useJourney } from "@/hooks/use-journey";
import { useAudio } from "@/hooks/use-audio";
import { WelcomeScene } from "@/components/scenes/WelcomeScene";
import { NameScene } from "@/components/scenes/NameScene";
import { BirthdayScene } from "@/components/scenes/BirthdayScene";
import { CelebrationScene } from "@/components/scenes/CelebrationScene";
import { VinylGalleryScene } from "@/components/scenes/VinylGalleryScene";
import { VINYL_TRACKS } from "@/lib/tracks";
import { EnvelopeScene } from "@/components/scenes/EnvelopeScene";
import { LetterScene } from "@/components/scenes/LetterScene";

/**
 * Cenas já implementadas — usadas para decidir quando mostrar o
 * placeholder temporário das cenas futuras.
 */
const IMPLEMENTED_SCENES = [
  "welcome",
  "name",
  "birthday",
  "celebration",
  "vinyl-gallery",
  "envelope",
  "letter",
] as const;

/**
 * Toca a faixa escolhida na Cena 5 e a mantém tocando enquanto a pessoa
 * avança pelas Cenas 6 (envelope) e 7 (carta) — exatamente como pede o
 * roteiro ("essa música passa a tocar" e continua até o fim.
 *
 * Vive aqui no orquestrador (não dentro de `VinylGalleryScene`) de
 * propósito: como cada cena é desmontada pelo `AnimatePresence` ao
 * trocar, um `useAudio` dentro da própria cena pararia a música assim
 * que a galeria saísse de tela. Aqui ele sobrevive a toda a jornada.
 */
function PersistentTrackPlayer({ trackId }: { trackId: string | null }) {
  const track = VINYL_TRACKS.find((t) => t.id === trackId) ?? null;
  const { play } = useAudio({ src: track?.audioSrc ?? "", loop: true, volume: 0.5 });

  useEffect(() => {
    if (track) play();
  }, [track, play]);

  return null;
}

/**
 * Orquestrador central da experiência.
 * Decide qual cena renderizar com base em `currentScene` e garante que
 * toda troca de cena passe por uma transição (AnimatePresence `mode="wait"`
 * espera a cena anterior sair completamente antes de montar a próxima,
 * evitando qualquer corte abrupto de conteúdo).
 *
 * Cenas ainda não implementadas (etapas futuras) mostram um placeholder
 * temporário com o mesmo tratamento visual, para nunca deixar a tela em
 * branco entre uma etapa de desenvolvimento e outra.
 */
export function Journey() {
  const { state } = useJourney();
  const isImplemented = (IMPLEMENTED_SCENES as readonly string[]).includes(
    state.currentScene,
  );

  return (
    <>
      {state.selectedTrackId && (
        <PersistentTrackPlayer
          key={state.selectedTrackId}
          trackId={state.selectedTrackId}
        />
      )}

      <AnimatePresence mode="wait">
        {state.currentScene === "welcome" && <WelcomeScene key="welcome" />}
        {state.currentScene === "name" && <NameScene key="name" />}
        {state.currentScene === "birthday" && <BirthdayScene key="birthday" />}
        {state.currentScene === "celebration" && <CelebrationScene key="celebration" />}
        {state.currentScene === "vinyl-gallery" && (
          <VinylGalleryScene key="vinyl-gallery" />
        )}
        {state.currentScene === "envelope" && <EnvelopeScene key="envelope" />}
        {state.currentScene === "letter" && <LetterScene key="letter" />}

        {!isImplemented && (
          <motion.div
            key={state.currentScene}
            className="flex min-h-dvh w-full items-center justify-center bg-bg px-6"
            initial={{ opacity: 0, filter: "blur(8px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(8px)" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="font-display text-2xl text-text-muted">
              Próxima cena (“{state.currentScene}”) chega na próxima etapa ✨
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
