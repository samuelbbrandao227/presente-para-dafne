"use client";

import { createContext, useContext, useReducer, type ReactNode } from "react";
import type { JourneyAction, JourneyState } from "@/types/journey";

/**
 * Estado inicial: a jornada sempre começa na cena de boas-vindas,
 * sem nenhum dado da convidada ainda preenchido.
 */
const initialState: JourneyState = {
  currentScene: "welcome",
  guestName: "",
  birthDate: null,
  selectedTrackId: null,
};

function journeyReducer(state: JourneyState, action: JourneyAction): JourneyState {
  switch (action.type) {
    case "SET_SCENE":
      return { ...state, currentScene: action.payload };
    case "SET_NAME":
      return { ...state, guestName: action.payload };
    case "SET_BIRTH_DATE":
      return { ...state, birthDate: action.payload };
    case "SET_TRACK":
      return { ...state, selectedTrackId: action.payload };
    default:
      return state;
  }
}

interface JourneyContextValue {
  state: JourneyState;
  dispatch: React.Dispatch<JourneyAction>;
}

const JourneyContext = createContext<JourneyContextValue | null>(null);

/**
 * Provider único que envolve toda a aplicação, permitindo que qualquer
 * cena leia e atualize o progresso da experiência sem prop drilling.
 */
export function JourneyProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(journeyReducer, initialState);

  return (
    <JourneyContext.Provider value={{ state, dispatch }}>
      {children}
    </JourneyContext.Provider>
  );
}

/**
 * Hook de acesso ao contexto da jornada. Lança erro explícito se usado
 * fora do provider, evitando bugs silenciosos de `undefined`.
 */
export function useJourney() {
  const context = useContext(JourneyContext);
  if (!context) {
    throw new Error("useJourney deve ser usado dentro de <JourneyProvider>");
  }
  return context;
}
