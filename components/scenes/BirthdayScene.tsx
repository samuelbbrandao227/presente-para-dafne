"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useJourney } from "@/hooks/use-journey";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { LoadingDots } from "@/components/ui/LoadingDots";
import { birthdaySchema, type BirthdayFormInput, type BirthdayFormValues } from "@/lib/validations";
import { wait } from "@/lib/utils";

/**
 * Quanto tempo o "Consultando calendário..." fica visível antes de
 * revelar a pergunta de confirmação — tempo suficiente para parecer
 * uma checagem real, sem cansar quem está esperando.
 */
const LOOKUP_DURATION = 1800;

/**
 * As três sub-fases internas desta cena. Diferente da Cena 2 (um único
 * passo), a Cena 3 tem uma micro-jornada própria antes de avançar para
 * a cena global seguinte — por isso o estado de fase vive localmente
 * aqui, e não no `JourneyState` global (que só guarda dados que outras
 * cenas precisam ler).
 */
type Phase = "asking" | "loading" | "reveal";

const phaseVariants = {
  hidden: { opacity: 0, y: 10, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
  exit: {
    opacity: 0,
    y: -6,
    filter: "blur(4px)",
    transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] as const },
  },
};

/**
 * Cena 3 — "Quando você nasceu?"
 * Card com campo de data. Ao confirmar, simula uma checagem ("Consultando
 * calendário...") e revela a confirmação lúdica de aniversário, com
 * dois botões que avançam para a Cena 4 (celebração).
 */
export function BirthdayScene() {
  const { dispatch } = useJourney();
  const [phase, setPhase] = useState<Phase>("asking");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BirthdayFormInput, unknown, BirthdayFormValues>({
    resolver: zodResolver(birthdaySchema),
  });

  async function onSubmit(values: BirthdayFormValues) {
    dispatch({ type: "SET_BIRTH_DATE", payload: values.birthDate });
    setPhase("loading");
    await wait(LOOKUP_DURATION);
    setPhase("reveal");
  }

  function handleConfirm() {
    dispatch({ type: "SET_SCENE", payload: "celebration" });
  }

  return (
    <div className="flex min-h-dvh w-full items-center justify-center px-6">
      <Card className="overflow-hidden">
        <AnimatePresence mode="wait">
          {phase === "asking" && (
            <motion.form
              key="asking"
              variants={phaseVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >
              <h2 className="font-display text-center text-2xl text-text sm:text-3xl">
                Quando você nasceu?
              </h2>

              <div className="mt-7">
                <label htmlFor="birthDate" className="sr-only">
                  Sua data de nascimento
                </label>
                <input
                  id="birthDate"
                  type="date"
                  autoFocus
                  max={new Date().toISOString().split("T")[0]}
                  aria-invalid={errors.birthDate ? "true" : "false"}
                  aria-describedby={errors.birthDate ? "birthDate-error" : undefined}
                  className="w-full rounded-2xl border border-[var(--color-border)] bg-bg px-4 py-3 text-center font-body text-base text-text outline-none transition-shadow duration-200 focus:border-accent-strong focus:ring-2 focus:ring-accent/40"
                  {...register("birthDate")}
                />
                {errors.birthDate && (
                  <p
                    id="birthDate-error"
                    role="alert"
                    className="mt-2 text-center text-sm text-accent-strong"
                  >
                    {errors.birthDate.message}
                  </p>
                )}
              </div>

              <div className="mt-8 flex justify-center">
                <Button type="submit" disabled={isSubmitting}>
                  Continuar
                </Button>
              </div>
            </motion.form>
          )}

          {phase === "loading" && (
            <motion.div
              key="loading"
              variants={phaseVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex min-h-[180px] items-center justify-center"
            >
              <LoadingDots label="Consultando calendário..." />
            </motion.div>
          )}

          {phase === "reveal" && (
            <motion.div
              key="reveal"
              variants={phaseVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex flex-col items-center text-center"
            >
              <motion.p
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="font-script text-3xl text-accent-strong"
              >
                Opa...
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="font-display mt-2 text-2xl text-text sm:text-3xl"
              >
                Hoje é seu aniversário?
              </motion.h2>

              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-8 flex flex-wrap justify-center gap-3"
              >
                <Button variant="secondary" onClick={handleConfirm}>
                  Sim
                </Button>
                <Button onClick={handleConfirm}>Claro 😄</Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
}
