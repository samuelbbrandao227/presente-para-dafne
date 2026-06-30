"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { Howl } from "howler";

interface UseAudioOptions {
  src: string;
  loop?: boolean;
  volume?: number;
}

interface UseAudioReturn {
  play: () => void;
  pause: () => void;
  stop: () => void;
  isPlaying: boolean;
  isReady: boolean;
  hasError: boolean;
}

export function useAudio({
  src,
  loop = false,
  volume = 0.7,
}: UseAudioOptions): UseAudioReturn {
  const howlRef = useRef<Howl | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function init() {
      const { Howl } = await import("howler");

      if (!mounted) return;

      const howl = new Howl({
        src: [src],
        html5: true,
        loop,
        volume,

        onload() {
          if (!mounted) return;
          setIsReady(true);
        },

        onplay() {
          if (!mounted) return;
          setIsPlaying(true);
        },

        onpause() {
          if (!mounted) return;
          setIsPlaying(false);
        },

        onstop() {
          if (!mounted) return;
          setIsPlaying(false);
        },

        onend() {
          if (!mounted) return;
          setIsPlaying(false);
        },

        onloaderror(_, err) {
          console.error("Erro carregando áudio:", err);
          if (!mounted) return;

          setHasError(true);
          setIsReady(false);
        },

        onplayerror(_, err) {
          console.error("Erro reproduzindo áudio:", err);

          if (!mounted) return;

          setIsPlaying(false);

          // desbloqueia o áudio após interação do usuário
          howl.once("unlock", () => {
            howl.play();
          });
        },
      });

      howlRef.current = howl;
    }

    init();

    return () => {
      mounted = false;
      howlRef.current?.stop();
      howlRef.current?.unload();
      howlRef.current = null;
    };
  }, [src, loop, volume]);

  const play = useCallback(() => {
    if (!howlRef.current) return;
    if (!isReady) return;
    if (hasError) return;

    howlRef.current.play();
  }, [isReady, hasError]);

  const pause = useCallback(() => {
    howlRef.current?.pause();
  }, []);

  const stop = useCallback(() => {
    howlRef.current?.stop();
  }, []);

  return {
    play,
    pause,
    stop,
    isPlaying,
    isReady,
    hasError,
  };
}