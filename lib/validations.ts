import { z } from "zod";

/**
 * Schema da Cena 2 — nome da convidada.
 * Mínimo de 2 caracteres evita envios acidentais com uma letra só;
 * máximo de 40 mantém o layout do card e do restante da experiência
 * (ex: "Olá, {nome}") sempre elegante, sem quebrar linha.
 */
export const nameSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Digite ao menos 2 letras")
    .max(40, "Esse nome é grande demais para o cartão 😅"),
});

export type NameFormValues = z.infer<typeof nameSchema>;

/**
 * Schema da Cena 3 — data de nascimento.
 * Usa `z.coerce.date()` para aceitar a string vinda de um
 * `<input type="date">` (formato "YYYY-MM-DD") e já convertê-la em Date.
 * Rejeita datas futuras (ninguém nasceu amanhã) e datas implausivelmente
 * antigas, mantendo a validação simples e gentil.
 */
export const birthdaySchema = z.object({
  birthDate: z.coerce
    .date({ message: "Escolha uma data válida" })
    .max(new Date(), "Essa data ainda não chegou 👀")
    .min(new Date("1900-01-01"), "Data muito antiga 😄"),
});

/** Forma "crua" do formulário, antes da coerção (string vinda do <input>). */
export type BirthdayFormInput = z.input<typeof birthdaySchema>;
/** Forma já validada/coagida (birthDate como Date de verdade). */
export type BirthdayFormValues = z.output<typeof birthdaySchema>;
