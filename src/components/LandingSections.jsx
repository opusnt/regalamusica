import { motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  Check,
  ChevronDown,
  MessageCircle,
  Pause,
  Play,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { b2bCases, examples, faqs, occasions, plans, trustBenefits } from "../data/site.js";
import { analyticsEvents, trackEvent } from "../lib/analytics.js";
import { pauseOtherAudioElements } from "../lib/audio.js";
import { fadeUp, stagger } from "../motion.js";
import SectionIntro from "./SectionIntro.jsx";

const createHref = (params = {}) => {
  const search = new URLSearchParams(params);
  return `/crear${search.toString() ? `?${search.toString()}` : ""}`;
};

export function HowItWorksSection() {
  const steps = [
    {
      title: "Cuéntanos la historia",
      text: "Responde preguntas simples sobre la persona, la ocasión, los recuerdos y el tono que quieres transmitir.",
    },
    {
      title: "Creamos la canción",
      text: "Convertimos tu historia en una letra y una dirección musical pensada para emocionar.",
    },
    {
      title: "Recibe y regala",
      text: "Te entregamos una canción digital lista para compartir, dedicar o guardar como recuerdo.",
    },
  ];

  return (
    <section id="como-funciona" className="bg-[#0b0f18] px-5 py-14 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-7xl">
        <SectionIntro eyebrow="Cómo funciona" title="Así transformamos tu historia en canción" />
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} className="mt-10 grid gap-4 md:grid-cols-3">
          {steps.map((step, index) => (
            <motion.article key={step.title} variants={fadeUp} className="rounded-lg border border-soft/10 bg-[#080a0f]/80 p-6 shadow-glow/20">
              <div className="grid size-11 place-items-center rounded-md border border-accent/40 bg-accent/10 text-sm font-semibold text-accent">
                0{index + 1}
              </div>
              <h3 className="mt-5 text-2xl font-semibold text-soft">{step.title}</h3>
              <p className="mt-4 text-base leading-7 text-soft/64">{step.text}</p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export function OccasionsSection() {
  return (
    <section className="bg-night px-5 py-14 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-7xl">
        <SectionIntro eyebrow="Momentos para regalar" title="Una canción para cada momento importante" />
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {occasions.map((occasion) => {
            const Icon = occasion.icon;
            return (
              <motion.a
                key={occasion.title}
                variants={fadeUp}
                href={createHref({ occasion: occasion.title })}
                onClick={() => trackEvent(analyticsEvents.clickCreateSong, { location: "occasion", occasion: occasion.title })}
                className="group rounded-lg border border-soft/10 bg-[#10141e] p-4 transition-colors duration-300 hover:border-accent/70 hover:bg-[#13213a]"
              >
                <Icon className="size-6 text-accent" aria-hidden="true" />
                <h3 className="mt-4 text-lg font-semibold text-soft">{occasion.title}</h3>
                <p className="mt-3 text-sm leading-6 text-soft/62">{occasion.text}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-accent opacity-0 transition-opacity group-hover:opacity-100">
                  Crear canción <ArrowRight className="size-3" aria-hidden="true" />
                </span>
              </motion.a>
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
      setPlayingIndex(null);
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
    <section id="ejemplos" className="bg-[#0b0f18] px-5 py-14 sm:px-8 sm:py-20">
      <audio ref={audioRef} preload="metadata" />
      <div className="mx-auto max-w-7xl">
        <SectionIntro eyebrow="Ejemplos" title="Escucha cómo puede sonar una historia convertida en canción">
          Cada ejemplo parte de una historia, un tono y un estilo musical distinto.
        </SectionIntro>
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} className="mt-10 grid gap-4 lg:grid-cols-3">
          {examples.map((example, index) => {
            const isPlaying = playingIndex === index;
            const isSelected = selectedIndex === index;
            const progress = example.audioSrc && isSelected && duration ? `${Math.min(100, (currentTime / duration) * 100)}%` : "0%";
            const Icon = isPlaying ? Pause : Play;

            return (
              <motion.article
                key={example.title}
                variants={fadeUp}
                className={`rounded-lg border p-5 transition-colors duration-300 ${isSelected ? "border-primary/60 bg-primary/15" : "border-soft/10 bg-night/80"}`}
              >
                <div className="overflow-hidden rounded-lg border border-soft/10 bg-[#101010]">
                  <img
                    src={example.coverSrc}
                    alt={`Portada de ${example.title}`}
                    loading="lazy"
                    className="aspect-square w-full object-cover transition-transform duration-500 hover:scale-[1.025]"
                  />
                </div>
                <div className="mt-5 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase text-accent">Ejemplo demostrativo</p>
                    <h3 className="mt-2 text-2xl font-semibold text-soft">{example.title}</h3>
                  </div>
                  <span className="rounded-md border border-soft/10 px-2 py-1 text-xs text-soft/60">{example.occasion}</span>
                </div>
                <p className="mt-3 text-sm font-semibold text-primary">{example.style}</p>
                <p className="mt-3 min-h-20 text-base leading-7 text-soft/66">{example.story}</p>
                <div className="mt-5 flex h-16 items-end gap-1 rounded-md bg-[#080a0f] p-3">
                  {Array.from({ length: 24 }).map((_, item) => (
                    <span
                      key={item}
                      className={`w-full rounded-sm ${isPlaying || (example.audioSrc && isSelected) ? "bg-accent" : "bg-accent/45"}`}
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
                  disabled={!example.audioSrc}
                  className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-md border border-soft/15 px-4 py-2 text-sm font-semibold text-soft transition-colors duration-300 hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Icon className="size-4" fill={example.audioSrc && !isPlaying ? "currentColor" : "none"} aria-hidden="true" />
                  {!example.audioSrc ? "Próximamente" : isPlaying ? "Pausar ejemplo" : "Escuchar ejemplo"}
                </button>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

export function BeforeAfterSection() {
  return (
    <section className="relative overflow-hidden bg-night px-5 py-14 sm:px-8 sm:py-20">
      <div className="absolute right-0 top-1/3 h-72 w-72 rounded-full bg-accent/10 blur-3xl" aria-hidden="true" />
      <div className="mx-auto max-w-7xl">
        <SectionIntro eyebrow="Antes y después" title="De una historia personal a una canción lista para regalar" />
        <div className="mt-10 grid items-stretch gap-4 lg:grid-cols-[1fr_auto_1fr]">
          <article className="rounded-lg border border-soft/10 bg-[#10141e] p-6">
            <p className="text-sm font-semibold uppercase text-primary">Lo que nos cuentas</p>
            <p className="mt-5 text-2xl font-semibold leading-tight text-soft">
              “Mi mamá siempre cantaba mientras cocinaba, nos sacó adelante sola y tiene una frase que repite desde chicos: ‘todo pasa con un té’.”
            </p>
          </article>
          <div className="hidden items-center justify-center lg:flex">
            <div className="grid size-14 place-items-center rounded-full border border-accent/40 bg-accent/10 text-accent">
              <ArrowRight className="size-6" aria-hidden="true" />
            </div>
          </div>
          <article className="relative overflow-hidden rounded-lg border border-accent/35 bg-primary/20 p-6 shadow-amber">
            <div className="absolute -right-14 -top-14 h-44 w-44 rounded-full bg-accent/20 blur-3xl" aria-hidden="true" />
            <p className="text-sm font-semibold uppercase text-accent">Lo que creamos</p>
            <p className="mt-5 text-2xl font-semibold leading-tight text-soft">
              Una balada cálida sobre gratitud, hogar, esfuerzo y pequeños rituales familiares, escrita para emocionar desde el primer coro.
            </p>
            <div className="mt-8 flex h-16 items-end gap-1.5">
              {Array.from({ length: 26 }).map((_, index) => (
                <span key={index} className="w-full rounded-sm bg-gradient-to-t from-primary to-accent" style={{ height: `${24 + Math.abs(Math.sin(index)) * 62}%` }} />
              ))}
            </div>
          </article>
        </div>
        <div className="mt-8 text-center">
          <a href="/crear" className="inline-flex min-h-12 items-center justify-center rounded-md bg-accent px-6 py-3 font-semibold text-night hover:bg-[#ffd46a]">
            Crear una canción con mi historia
          </a>
        </div>
      </div>
    </section>
  );
}

export function PricingSection() {
  return (
    <section id="planes" className="bg-[#0b0f18] px-5 py-14 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-7xl">
        <SectionIntro eyebrow="Planes" title="Elige cómo quieres regalar tu canción">
          Todos los planes parten desde tu historia. La diferencia está en el nivel de producción, revisión y formato de entrega.
        </SectionIntro>
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.id}
              className={`relative rounded-lg border p-6 ${plan.badge ? "border-accent bg-accent/10 shadow-amber" : "border-soft/10 bg-[#080a0f]"}`}
            >
              {plan.badge ? <p className="mb-4 inline-flex rounded-md bg-accent px-3 py-1 text-xs font-semibold text-night">{plan.badge}</p> : null}
              <h3 className="text-2xl font-semibold text-soft">{plan.name}</h3>
              <p className="mt-2 text-3xl font-semibold text-accent">{plan.price}</p>
              <p className="mt-4 text-base leading-7 text-soft/64">{plan.description}</p>
              <ul className="mt-6 space-y-3">
                {plan.includes.map((item) => (
                  <li key={item} className="flex gap-2 text-sm leading-6 text-soft/74">
                    <Check className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href={createHref({ plan: plan.id })}
                onClick={() => trackEvent(analyticsEvents.selectPlan, { plan: plan.id })}
                className="mt-7 inline-flex min-h-12 w-full items-center justify-center rounded-md bg-accent px-5 py-3 text-base font-semibold text-night transition-colors duration-300 hover:bg-[#ffd46a]"
              >
                {plan.cta}
              </a>
            </article>
          ))}
        </div>
        <div className="mt-8 rounded-lg border border-soft/10 bg-night/70 p-5 text-center">
          <p className="text-base text-soft/72">¿Tienes una historia especial y no sabes qué plan elegir?</p>
          <a
            href="https://wa.me/"
            onClick={() => trackEvent(analyticsEvents.clickWhatsapp, { location: "pricing" })}
            className="mt-3 inline-flex items-center gap-2 rounded-md border border-accent/60 px-4 py-2 font-semibold text-accent hover:bg-accent hover:text-night"
          >
            <MessageCircle className="size-4" aria-hidden="true" />
            Escríbenos
          </a>
        </div>
      </div>
    </section>
  );
}

export function TrustSection() {
  return (
    <section className="bg-night px-5 py-14 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-7xl">
        <SectionIntro eyebrow="Confianza" title="Un regalo personal, no una canción genérica">
          Cada canción se crea a partir de tu historia, tus recuerdos, tus frases y el tono que quieres transmitir. Nuestro proceso está pensado para transformar información personal en una pieza musical lista para regalar.
        </SectionIntro>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {trustBenefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <article key={benefit.title} className="rounded-lg border border-soft/10 bg-[#10141e] p-5">
                <Icon className="size-6 text-accent" aria-hidden="true" />
                <h3 className="mt-4 text-lg font-semibold leading-6 text-soft">{benefit.title}</h3>
                <p className="mt-3 text-sm leading-6 text-soft/62">{benefit.text}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function GuaranteeSection() {
  return (
    <section className="bg-[#0b0f18] px-5 py-12 sm:px-8">
      <div className="mx-auto max-w-5xl rounded-lg border border-accent/25 bg-accent/10 p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <ShieldCheck className="size-8 shrink-0 text-accent" aria-hidden="true" />
          <div>
            <h2 className="text-2xl font-semibold text-soft">Queremos que la canción represente tu historia</h2>
            <p className="mt-3 text-base leading-7 text-soft/72">
              Si algo importante de tu historia no quedó bien representado, los planes Premium y Experiencia incluyen ajustes para acercar la canción al tono que imaginaste.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function B2BSection() {
  return (
    <section className="bg-night px-5 py-14 sm:px-8 sm:py-20">
      <div className="mx-auto grid max-w-7xl gap-8 rounded-lg border border-soft/10 bg-[#10141e] p-6 sm:p-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase text-accent">Empresas y eventos</p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight text-soft">También creamos canciones para empresas, equipos y eventos</h2>
          <p className="mt-4 text-base leading-7 text-soft/66">
            Regalos musicales personalizados para colaboradores, clientes, campañas, colegios, matrimonios y momentos de marca.
          </p>
          <a
            href="mailto:contacto@regalamusica.cl?subject=Consulta%20packs%20Regala%20Música"
            onClick={() => trackEvent(analyticsEvents.clickB2bContact)}
            className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-md border border-accent/60 px-4 py-2 font-semibold text-accent hover:bg-accent hover:text-night"
          >
            <Building2 className="size-4" aria-hidden="true" />
            Consultar por packs
          </a>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {b2bCases.map((item) => (
            <div key={item} className="rounded-md border border-soft/10 bg-night/60 p-4 text-sm font-semibold text-soft/76">
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FAQSection() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="bg-[#0b0f18] px-5 py-14 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-4xl">
        <SectionIntro eyebrow="Preguntas frecuentes" title="Lo que necesitas saber antes de regalar una canción" />
        <div className="mt-10 space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = open === index;
            return (
              <div key={faq.question} className="rounded-lg border border-soft/10 bg-[#080a0f]">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : index)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left focus:outline-none focus:ring-2 focus:ring-accent/70"
                >
                  <span className="text-lg font-semibold text-soft">{faq.question}</span>
                  <ChevronDown className={`size-5 text-accent transition-transform ${isOpen ? "rotate-180" : ""}`} aria-hidden="true" />
                </button>
                {isOpen ? <p className="px-5 pb-5 text-base leading-7 text-soft/64">{faq.answer}</p> : null}
              </div>
            );
          })}
        </div>
        <div className="mt-8 text-center">
          <a
            href="https://wa.me/"
            onClick={() => trackEvent(analyticsEvents.clickWhatsapp, { location: "faq" })}
            className="inline-flex min-h-11 items-center gap-2 rounded-md border border-accent/60 px-4 py-2 font-semibold text-accent hover:bg-accent hover:text-night"
          >
            <MessageCircle className="size-4" aria-hidden="true" />
            Escríbenos
          </a>
        </div>
      </div>
    </section>
  );
}

export function SiteFooter() {
  const links = [
    ["Cómo funciona", "#como-funciona"],
    ["Ejemplos", "#ejemplos"],
    ["Planes", "#planes"],
    ["Crear mi canción", "/crear"],
    ["Preguntas frecuentes", "#faq"],
    ["Contacto", "mailto:contacto@regalamusica.cl"],
    ["Términos y condiciones", "#"],
    ["Política de privacidad", "#"],
  ];

  return (
    <footer className="border-t border-soft/10 bg-[#080a0f] px-5 py-10 sm:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <p className="text-xl font-semibold text-soft">Regala Música</p>
          <p className="mt-3 max-w-md text-sm leading-6 text-soft/56">
            Canciones personalizadas para regalar en momentos importantes.
          </p>
        </div>
        <div className="grid gap-3 text-sm text-soft/62 sm:grid-cols-3">
          {links.map(([label, href]) => (
            <a key={label} href={href} className="hover:text-accent">
              {label}
            </a>
          ))}
        </div>
      </div>
      <p className="mx-auto mt-8 max-w-7xl text-xs text-soft/38">© 2026 Regala Música. Todos los derechos reservados.</p>
    </footer>
  );
}
