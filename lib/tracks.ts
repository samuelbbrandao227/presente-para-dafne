import type { VinylTrack } from "@/types/journey";

/**
 * Faixas da galeria de discos (Cena 5).
 *
 * Os "covers" não usam imagens reais de capas de álbuns — isso violaria
 * direitos autorais de obras de terceiros. Em vez disso, cada disco é
 * desenhado proceduralmente em `VinylDisc` usando `accentColor` como
 * base de um gradiente, o que já fica elegante e é 100% livre de
 * direitos. Da mesma forma, `audioSrc` aponta para arquivos que vocês
 * devem adicionar em `public/audio/` com faixas licenciadas (ou
 * composições próprias) — veja `public/audio/README.md`.
 *
 * Para personalizar: troque `title`/`artist`/`accentColor` livremente,
 * e adicione/remova objetos deste array — a galeria se adapta sozinha
 * à quantidade de faixas.
 */
export const VINYL_TRACKS: VinylTrack[] = [
  {
    id: "track-01",
    title: "Buscar-te-ei, Senhor",
    artist: "Quarteto Celebrai",
    audioSrc: "/audio/track-01.mp3",
    accentColor: "#E8B4CB",
  },
  {
    id: "track-02",
    title: "Maranata (Em breve, mui breve)",
    artist: "Quarteto Celebrai",
    audioSrc: "/audio/track-02.mp3",
    accentColor: "#DCCEF9",
  },
  {
    id: "track-03",
    title: "No getsêmani",
    artist: "Igreja Cristã Maranata",
    audioSrc: "/audio/track-03.mp3",
    accentColor: "#F4C9A8",
  },
  {
    id: "track-04",
    title: "Obedecer",
    artist: "Igreja Cristã Maranata",
    audioSrc: "/audio/track-04.mp3",
    accentColor: "#A8D8C9",
  },
];
