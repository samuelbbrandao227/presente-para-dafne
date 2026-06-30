import { motion } from "framer-motion";

interface LoadingDotsProps {
  label: string;
}

/**
 * Indicador de "carregando" com três pontinhos pulsando em sequência.
 * Usado na Cena 3 ("Consultando calendário...") e reutilizável em
 * qualquer outro momento futuro que precise do mesmo efeito de suspense.
 * `label` é anunciado a leitores de tela via `aria-live`, já que o
 * conteúdo visual (pontinhos) não carrega informação por si só.
 */
export function LoadingDots({ label }: LoadingDotsProps) {
  return (
    <div role="status" aria-live="polite" className="flex flex-col items-center gap-3">
      <span className="font-body text-sm text-text-muted">{label}</span>
      <div className="flex items-center gap-1.5" aria-hidden="true">
        {[0, 1, 2].map((index) => (
          <motion.span
            key={index}
            className="h-2 w-2 rounded-full bg-accent-strong"
            animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
            transition={{
              duration: 0.9,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.15,
            }}
          />
        ))}
      </div>
    </div>
  );
}
