/**
 * Identificadores de cada cena da jornada, na ordem em que aparecem.
 * Centralizar isso em um tipo evita strings soltas espalhadas pelo app
 * e facilita adicionar/reordenar cenas no futuro.
 */
export type SceneId =
  | "welcome" // Cena 1 — "Olá, seja bem-vinda!"
  | "name" // Cena 2 — Como você se chama?
  | "birthday" // Cena 3 — Quando você nasceu? + checagem
  | "celebration" // Cena 4 — Parabéns + convidado especial
  | "vinyl-gallery" // Cena 5 — Galeria de discos
  | "envelope" // Cena 6 — Envelope físico
  | "letter"; // Cena 7 — Carta final

/**
 * Estado global da jornada, compartilhado entre cenas via contexto.
 */
export interface JourneyState {
  currentScene: SceneId;
  guestName: string;
  birthDate: Date | null;
  selectedTrackId: string | null;
}

/**
 * Representa um disco de vinil na galeria da Cena 5.
 * A capa NÃO é uma imagem (evita usar artes protegidas por direitos
 * autorais sem licença); ela é desenhada proceduralmente a partir de
 * `accentColor`, mantendo a estética consistente com o resto do app.
 */
export interface VinylTrack {
  id: string;
  title: string;
  artist: string;
  audioSrc: string;
  accentColor: string;
}

/**
 * Ações disponíveis para atualizar o estado da jornada.
 */
export type JourneyAction =
  | { type: "SET_SCENE"; payload: SceneId }
  | { type: "SET_NAME"; payload: string }
  | { type: "SET_BIRTH_DATE"; payload: Date }
  | { type: "SET_TRACK"; payload: string };
