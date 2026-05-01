import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, Send } from "lucide-react";
import { useMemo, useState } from "react";
import { formSteps } from "../content.js";
import SectionIntro from "./SectionIntro.jsx";

export default function ChatForm() {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [draft, setDraft] = useState("");
  const [customOptionDraft, setCustomOptionDraft] = useState("");
  const [showCustomOption, setShowCustomOption] = useState(false);
  const activeStep = formSteps[stepIndex];
  const completed = stepIndex >= formSteps.length;

  const conversation = useMemo(
    () =>
      formSteps
        .slice(0, Math.min(stepIndex, formSteps.length))
        .flatMap((step) => [
          { role: "guide", text: step.question },
          { role: "user", text: answers[step.id] },
        ])
        .filter((message) => message.text),
    [answers, stepIndex],
  );

  const saveAnswer = (value) => {
    if (!activeStep) return;
    const cleanValue = value.trim();
    if (!cleanValue) return;
    setAnswers((current) => ({ ...current, [activeStep.id]: cleanValue }));
    setDraft("");
    setCustomOptionDraft("");
    setShowCustomOption(false);
    setStepIndex((current) => current + 1);
  };

  const handleOptionClick = (option) => {
    if (activeStep?.allowCustom && option === "Otro") {
      setShowCustomOption(true);
      setCustomOptionDraft("");
      return;
    }

    saveAnswer(option);
  };

  return (
    <section id="crear" className="relative bg-[#0f0f0f] px-5 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto grid max-w-7xl gap-9 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
        <SectionIntro
          align="left"
          eyebrow="Comienza aqui"
          title="Dinos a quién amas. Nosotros encontramos la canción."
        >
          Un comienzo simple, como una conversación. No necesitas escribir perfecto. Solo recordar con honestidad.
        </SectionIntro>

        <motion.div
          initial={{ opacity: 0, y: 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-lg border border-soft/10 bg-night p-4 shadow-glow sm:p-6"
        >
          <div className="mb-6 flex items-center gap-3 border-b border-soft/10 pb-5">
            <div className="grid size-11 place-items-center rounded-md bg-primary/18 text-accent">
              <MessageCircle className="size-6" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm text-soft/46">Regalamusica</p>
              <h3 className="text-xl font-semibold text-soft">Tu historia empieza ahora</h3>
            </div>
          </div>

          <div className="min-h-[410px] space-y-4">
            <AnimatePresence initial={false}>
              {conversation.map((message, index) => (
                <motion.div
                  key={`${message.role}-${index}-${message.text}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[82%] rounded-lg px-4 py-3 text-base leading-7 ${
                      message.role === "user"
                        ? "bg-primary text-soft"
                        : "bg-soft/8 text-soft/80"
                    }`}
                  >
                    {message.text}
                  </div>
                </motion.div>
              ))}

              {!completed ? (
                <motion.div
                  key={activeStep.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35 }}
                  className="space-y-4"
                >
                  <div className="flex justify-start">
                    <div className="max-w-[88%] rounded-lg bg-soft/8 px-4 py-3 text-lg font-medium text-soft">
                      {activeStep.question}
                    </div>
                  </div>

                  {activeStep.type === "options" ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {activeStep.options.map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => handleOptionClick(option)}
                            className={`min-h-12 rounded-md border px-3 py-3 text-sm font-semibold transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-night ${
                              showCustomOption && option === "Otro"
                                ? "border-accent bg-accent/10 text-accent"
                                : "border-soft/12 bg-[#151515] text-soft hover:border-accent hover:text-accent"
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>

                      {showCustomOption ? (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="grid gap-2 sm:grid-cols-[1fr_auto]"
                        >
                          <input
                            value={customOptionDraft}
                            onChange={(event) => setCustomOptionDraft(event.target.value)}
                            placeholder={activeStep.customPlaceholder}
                            className="min-h-12 rounded-md border border-soft/12 bg-[#151515] px-4 py-3 text-base text-soft outline-none transition-colors duration-300 placeholder:text-soft/34 focus:border-accent"
                          />
                          <button
                            type="button"
                            onClick={() => saveAnswer(customOptionDraft)}
                            disabled={!customOptionDraft.trim()}
                            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-accent px-5 py-3 text-base font-semibold text-night transition-colors duration-300 hover:bg-[#ffd46a] disabled:cursor-not-allowed disabled:opacity-45"
                          >
                            Continuar
                            <Send className="size-4" aria-hidden="true" />
                          </button>
                        </motion.div>
                      ) : null}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <textarea
                        value={draft}
                        onChange={(event) => setDraft(event.target.value)}
                        placeholder={activeStep.placeholder}
                        rows={5}
                        className="min-h-32 w-full resize-none rounded-md border border-soft/12 bg-[#151515] px-4 py-4 text-base leading-7 text-soft outline-none transition-colors duration-300 placeholder:text-soft/34 focus:border-accent"
                      />
                      <button
                        type="button"
                        onClick={() => saveAnswer(draft)}
                        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-accent px-5 py-3 text-base font-semibold text-night transition-colors duration-300 hover:bg-[#ffd46a] disabled:cursor-not-allowed disabled:opacity-45"
                        disabled={!draft.trim()}
                      >
                        Continuar
                        <Send className="size-4" aria-hidden="true" />
                      </button>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="complete"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.45 }}
                  className="rounded-lg border border-accent/40 bg-accent/10 p-5"
                >
                  <p className="text-2xl font-semibold text-soft">Ya tenemos el comienzo.</p>
                  <p className="mt-3 text-base leading-7 text-soft/68">
                    La canción empieza con una historia real. Lo siguiente es convertirla en una entrega que se sienta imposible de olvidar.
                  </p>
                  <a
                    href="#checkout"
                    className="mt-5 inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-accent px-5 py-3 text-base font-semibold text-night transition-colors duration-300 hover:bg-[#ffd46a]"
                  >
                    Ir a pago
                    <Send className="size-4" aria-hidden="true" />
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
