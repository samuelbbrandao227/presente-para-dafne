import { JourneyProvider } from "@/hooks/use-journey";
import { Journey } from "@/components/Journey";

/**
 * Página única da experiência. Toda a navegação acontece via troca de
 * `currentScene` dentro do JourneyProvider — não há rotas adicionais,
 * o que mantém as transições fluidas e sob controle total do Framer Motion.
 */
export default function Home() {
  return (
    <JourneyProvider>
      <main className="relative min-h-dvh w-full overflow-hidden bg-bg">
        <Journey />
      </main>
    </JourneyProvider>
  );
}
