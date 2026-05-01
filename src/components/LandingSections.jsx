import { motion } from "framer-motion";
import { Check, ChevronDown, Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { examples, faqs, occasions, plans, trustBenefits } from "../data/site.js";
import { analyticsEvents, trackEvent } from "../lib/analytics.js";
import { pauseOtherAudioElements } from "../lib/audio.js";
import { fadeUp, stagger } from "../motion.js";
import SectionIntro from "./SectionIntro.jsx";

export function HowItWorksSection() {
  const steps = [
    {
      title: "Cuéntanos la historia",
      text: "Responde algunas preguntas sobre la persona, la ocasión, los recuerdos y el tono que quieres transmitir.",
    },
    {
      title: "Elegimos el camino creativo",
      text: "Transformamos tu historia en una letra y una dirección musical pensada para emocionar.",
    },
    {
      title: "Recibe tu canción",
      text: "Te entregamos una canción personalizada en formato digital, lista para compartir, dedicar o regalar.",
    },
  ];

  return (
    <section id="como-funciona" className="bg-[#0f0f0f] px-5 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <SectionIntro eyebrow="Cómo funciona" title="Un proceso simple para convertir recuerdos en música." />
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mt-10 grid gap-4 md:grid-cols-3">
          {steps.map((step, index) => (
            <motion.article key={step.title} variants={fadeUp} className="rounded-lg border border-soft/10 bg-night/70 p-6">
              <p className="text-sm font-semibold text-accent">0{index + 1}</p>
              <h3 className="mt-4 text-2xl font-semibold text-soft">{step.title}</h3>
              <p className="mt-4 text-base leading-7 text-soft/62">{step.text}</p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export function OccasionsSection() {
  return (
    <section className="bg-night px-5 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <SectionIntro eyebrow="Momentos para regalar" title="Hay historias que merecen escucharse." />
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {occasions.map((occasion) => {
            const Icon = occasion.icon;
            return (
              <motion.article key={occasion.title} variants={fadeUp} className="rounded-lg border border-soft/10 bg-[#101010] p-4 transition-colors duration-300 hover:border-accent/60">
                <Icon className="size-6 text-accent" aria-hidden="true" />
                <h3 className="mt-4 text-lg font-semibold text-soft">{occasion.title}</h3>
                <p className="mt-3 text-sm leading-6 text-soft/58">{occasion.text}</p>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

export function ExamplesSection() {
  const audioRef = useRef(null);
  const [playingIndex, setPlayingIndex] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;

    const syncTime = () => setCurrentTime(audio.currentTime);
    const syncDuration = () => setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
    const stop = () => setPlayingIndex(null);

    audio.addEventListener("timeupdate", syncTime);
    audio.addEventListener("loadedmetadata", syncDuration);
    audio.addEventListener("pause", stop);
    audio.addEventListener("ended", stop);

    return () => {
      audio.removeEventListener("timeupdate", syncTime);
      audio.removeEventListener("loadedmetadata", syncDuration);
      audio.removeEventListener("pause", stop);
      audio.removeEventListener("ended", stop);
    };
  }, []);

  const playExample = async (example, index) => {
    setSelectedIndex(index);
    trackEvent(analyticsEvents.clickListenExamples, { example: example.title });

    if (!example.audioSrc) {
      if (audioRef.current) audioRef.current.pause();
      setPlayingIndex((current) => (current === index ? null : index));
      return;
    }

    const audio = audioRef.current;
    if (!audio) return;

    if (playingIndex === index) {
      audio.pause();
      setPlayingIndex(null);
      return;
    }

    try {
      pauseOtherAudioElements(audio);
      audio.pause();
      audio.src = example.audioSrc;
      audio.load();
      setCurrentTime(0);
      setDuration(0);
      await audio.play();
      setPlayingIndex(index);
    } catch {
      setPlayingIndex(null);
    }
  };

  return (
    <section id="ejemplos" className="bg-[#0f0f0f] px-5 py-16 sm:px-8 sm:py-24">
      <audio ref={audioRef} preload="metadata" />
      <div className="mx-auto max-w-7xl">
        <SectionIntro
          eyebrow="Ejemplos"
          title="Escucha cómo puede sonar una historia convertida en canción"
        />
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mt-10 grid gap-4 lg:grid-cols-3">
          {examples.map((example, index) => {
            const isPlaying = playingIndex === index;
            const isSelected = selectedIndex === index;
            const progress = example.audioSrc && duration
              ? `${Math.min(100, (currentTime / duration) * 100)}%`
              : isPlaying
                ? "36%"
                : "0%";
            const Icon = isPlaying ? Pause : Play;

            return (
            <motion.article key={example.title} variants={fadeUp} className={`rounded-lg border p-5 transition-colors duration-300 ${isSelected ? "border-primary/50 bg-primary/12" : "border-soft/10 bg-night/76"}`}>
              <div className="mb-5 overflow-hidden rounded-lg border border-soft/10 bg-[#101010]">
                <img
                  src={example.coverSrc}
                  alt={`Portada de ${example.title}`}
                  className="aspect-square w-full object-cover transition-transform duration-500 hover:scale-[1.025]"
                />
              </div>
              <p className="text-sm text-primary">{example.style}</p>
              <p className="mt-3 min-h-20 text-base leading-7 text-soft/66">{example.story}</p>
              <div className="mt-5 flex h-16 items-end gap-1 rounded-md bg-[#101010] p-3">
                {Array.from({ length: 24 }).map((_, item) => (
                  <span
                    key={item}
                    className={`w-full rounded-sm ${isPlaying || (example.audioSrc && isSelected) ? "bg-accent" : "bg-accent/50"}`}
                    style={{ height: `${20 + Math.abs(Math.sin(item + index)) * 62}%` }}
                  />
                ))}
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-sm bg-soft/10">
                <div className="h-full rounded-sm bg-accent transition-[width] duration-300" style={{ width: progress }} />
              </div>
              <button
                type="button"
                onClick={() => playExample(example, index)}
                className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-md border border-soft/15 px-4 py-2 text-sm font-semibold text-soft transition-colors duration-300 hover:border-accent hover:text-accent"
              >
                <Icon className="size-4" fill="currentColor" aria-hidden="true" />
                {isPlaying ? "Pausar ejemplo" : "Escuchar ejemplo"}
              </button>
            </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

export function PricingSection() {
  return (
    <section id="planes" className="bg-night px-5 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <SectionIntro eyebrow="Planes" title="Elige el nivel de detalle para tu regalo." />
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {plans.map((plan) => (
            <article key={plan.id} className={`relative rounded-lg border p-6 ${plan.badge ? "border-accent bg-accent/10" : "border-soft/10 bg-[#101010]"}`}>
              {plan.badge ? <p className="mb-4 inline-flex rounded-md bg-accent px-3 py-1 text-xs font-semibold text-night">{plan.badge}</p> : null}
              <h3 className="text-2xl font-semibold text-soft">{plan.name}</h3>
              <p className="mt-2 text-3xl font-semibold text-accent">{plan.price}</p>
              <p className="mt-4 text-base leading-7 text-soft/62">{plan.description}</p>
              <ul className="mt-6 space-y-3">
                {plan.includes.map((item) => (
                  <li key={item} className="flex gap-2 text-sm leading-6 text-soft/72">
                    <Check className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href={`/checkout?plan=${plan.id}`}
                onClick={() => trackEvent(analyticsEvents.selectPlan, { plan: plan.id })}
                className="mt-7 inline-flex min-h-12 w-full items-center justify-center rounded-md bg-accent px-5 py-3 text-base font-semibold text-night transition-colors duration-300 hover:bg-[#ffd46a]"
              >
                {plan.cta}
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TrustSection() {
  return (
    <section className="bg-[#0f0f0f] px-5 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <SectionIntro align="left" eyebrow="Confianza" title="Un regalo personal, no una canción genérica">
          Cada canción se crea a partir de tu historia, tus recuerdos, tus frases y el tono que quieres transmitir. Nuestro proceso está pensado para transformar información personal en una pieza musical lista para regalar.
        </SectionIntro>
        <div className="grid gap-3 sm:grid-cols-3">
          {trustBenefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div key={benefit.title} className="rounded-lg border border-soft/10 bg-night/70 p-5">
                <Icon className="size-6 text-accent" aria-hidden="true" />
                <p className="mt-4 text-base font-semibold leading-6 text-soft">{benefit.title}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function FAQSection() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="bg-night px-5 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-4xl">
        <SectionIntro eyebrow="Preguntas frecuentes" title="Lo que necesitas saber antes de regalar una canción" />
        <div className="mt-10 space-y-3">
          {faqs.map((faq, index) => (
            <div key={faq.question} className="rounded-lg border border-soft/10 bg-[#101010]">
              <button type="button" onClick={() => setOpen(open === index ? -1 : index)} className="flex w-full items-center justify-between gap-4 p-5 text-left">
                <span className="text-lg font-semibold text-soft">{faq.question}</span>
                <ChevronDown className={`size-5 text-accent transition-transform ${open === index ? "rotate-180" : ""}`} />
              </button>
              {open === index ? <p className="px-5 pb-5 text-base leading-7 text-soft/64">{faq.answer}</p> : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-soft/10 bg-[#0f0f0f] px-5 py-10 sm:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <p className="text-xl font-semibold text-soft">Regala Música</p>
          <p className="mt-3 max-w-md text-sm leading-6 text-soft/56">
            Transformamos recuerdos en música: canciones personalizadas listas para dedicar, compartir o guardar.
          </p>
        </div>
        <div className="grid gap-3 text-sm text-soft/62 sm:grid-cols-3">
          {["Cómo funciona", "Ejemplos", "Planes", "Preguntas frecuentes", "Contacto", "Términos y condiciones", "Política de privacidad", "Instagram", "TikTok"].map((link) => (
            <a key={link} href={link === "Ejemplos" ? "#ejemplos" : link === "Planes" ? "#planes" : link === "Preguntas frecuentes" ? "#faq" : "#inicio"} className="hover:text-accent">
              {link}
            </a>
          ))}
        </div>
      </div>
      <p className="mx-auto mt-8 max-w-7xl text-xs text-soft/38">© 2026 Regala Música. Todos los derechos reservados.</p>
    </footer>
  );
}
