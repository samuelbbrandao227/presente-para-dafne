import { type ClassValue, clsx } from "clsx";

/**
 * Combina classes condicionalmente.
 * Usado em toda a aplicação para compor classes Tailwind de forma segura.
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Pequeno utilitário de espera assíncrona, usado em sequências
 * de animação orquestradas (ex: loading "Consultando calendário...").
 */
export function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Verifica se a data informada corresponde ao dia de hoje
 * (ignorando o ano), usada na Cena 3 para identificar o aniversário.
 */
export function isBirthdayToday(birthDate: Date): boolean {
  const today = new Date();
  return (
    birthDate.getDate() === today.getDate() &&
    birthDate.getMonth() === today.getMonth()
  );
}
