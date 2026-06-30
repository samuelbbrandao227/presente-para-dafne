"use client";

import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useJourney } from "@/hooks/use-journey";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { nameSchema, type NameFormValues } from "@/lib/validations";

/**
 * Cena 2 — "Como você se chama?"
 * Card central com campo de texto e botão de confirmação. Ao submeter,
 * o nome é salvo no estado global da jornada e avançamos para a Cena 3.
 * A saída do card (fade + leve slide para baixo) é tratada pelo próprio
 * `Card`/`AnimatePresence` do orquestrador — aqui só disparamos a troca
 * de cena, sem precisar orquestrar a animação manualmente.
 */
export function NameScene() {
  const { dispatch } = useJourney();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NameFormValues>({
    resolver: zodResolver(nameSchema),
    defaultValues: { name: "" },
  });

  function onSubmit(values: NameFormValues) {
    dispatch({ type: "SET_NAME", payload: values.name.trim() });
    dispatch({ type: "SET_SCENE", payload: "birthday" });
  }

  return (
    <div className="flex min-h-dvh w-full items-center justify-center px-6">
      <Card>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <motion.h2
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="font-display text-center text-2xl text-text sm:text-3xl"
          >
            Como você se chama?
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-7"
          >
            <label htmlFor="name" className="sr-only">
              Seu nome
            </label>
            <input
              id="name"
              type="text"
              autoFocus
              autoComplete="given-name"
              placeholder="Digite seu nome"
              aria-invalid={errors.name ? "true" : "false"}
              aria-describedby={errors.name ? "name-error" : undefined}
              className="w-full rounded-2xl border border-[var(--color-border)] bg-bg px-4 py-3 text-center font-body text-base text-text outline-none transition-shadow duration-200 placeholder:text-text-muted/60 focus:border-accent-strong focus:ring-2 focus:ring-accent/40"
              {...register("name")}
            />
            {errors.name && (
              <p
                id="name-error"
                role="alert"
                className="mt-2 text-center text-sm text-accent-strong"
              >
                {errors.name.message}
              </p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mt-8 flex justify-center"
          >
            <Button type="submit" disabled={isSubmitting}>
              Continuar
            </Button>
          </motion.div>
        </form>
      </Card>
    </div>
  );
}
