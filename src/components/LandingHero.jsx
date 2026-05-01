import { motion } from "framer-motion";
import { Gift, Music2, Pause, Play, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import CTAButton from "./CTAButton.jsx";
import { analyticsEvents, trackEvent } from "../lib/analytics.js";
import { pauseOtherAudioElements } from "../lib/audio.js";
import { fadeScale, fadeUp, stagger } from "../motion.js";

const heroAudioSrc = "/gracias-por-tanto-mama.mp3";

export default function LandingHero() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;

    const syncTime = () => setCurrentTime(audio.currentTime);
    const syncDuration = () => setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
    const stop = () => setIsPlaying(false);

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

  const toggleHeroAudio = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    try {
      pauseOtherAudioElements(audio);
      await audio.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  };

  const progress = duration ? `${Math.min(100, (currentTime / duration) * 100)}%` : "0%";
  const PlayerIcon = isPlaying ? Pause : Play;

  return (
    <section id="inicio" className="relative isolate overflow-hidden bg-night px-5 pb-16 pt-28 sm:px-8 lg:pt-24">
      <audio ref={audioRef} src={heroAudioSrc} preload="metadata" />
      <div className="absolute inset-0 -z-10">
        <div className="hero-mesh absolute inset-0" aria-hidden="true" />
        <div className="hero-noise absolute inset-0" aria-hidden="true" />
        <div className="hero-vignette absolute inset-0" aria-hidden="true" />
      </div>

      <header className="absolute left-0 right-0 top-0 z-20">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <a href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-soft">
            <span className="grid size-9 place-items-center rounded-md border border-soft/15 bg-soft/5">
              <Music2 className="size-5 text-accent" aria-hidden="true" />
            </span>
            Regala Música
          </a>
          <nav className="hidden items-center gap-5 text-sm text-soft/70 lg:flex">
            <a href="#como-funciona" className="hover:text-accent">Cómo funciona</a>
            <a href="#ejemplos" className="hover:text-accent">Ejemplos</a>
            <a href="#planes" className="hover:text-accent">Planes</a>
            <a href="#faq" className="hover:text-accent">FAQ</a>
          </nav>
          <a
            href="/checkout"
            onClick={() => trackEvent(analyticsEvents.clickCreateSong, { location: "nav" })}
            className="hidden rounded-md border border-soft/15 px-4 py-2 text-sm font-semibold text-soft/88 transition-colors duration-300 hover:border-accent/70 hover:text-accent sm:inline-flex"
          >
            Crear ahora
          </a>
        </div>
      </header>

      <div className="mx-auto grid min-h-[720px] max-w-7xl items-center gap-10 lg:grid-cols-[0.92fr_1.08fr]">
        <motion.div variants={stagger} initial="hidden" animate="visible" className="max-w-3xl">
          <motion.p
            variants={fadeScale}
            className="mb-6 inline-flex items-center gap-2 rounded-md border border-soft/12 bg-night/45 px-3 py-2 text-sm text-soft/76 backdrop-blur-md"
          >
            <span className="size-2 rounded-sm bg-accent shadow-amber" aria-hidden="true" />
            Canciones personalizadas para regalar en momentos únicos
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="text-balance font-display text-4xl font-semibold leading-[1.02] text-soft sm:text-6xl xl:text-7xl"
          >
            Convierte una historia real en una canción inolvidable
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-soft/72 sm:text-xl"
          >
            Creamos canciones personalizadas para regalar en cumpleaños, aniversarios, matrimonios y momentos importantes. Tú nos cuentas la historia, eliges el estilo y nosotros la transformamos en una canción lista para emocionar.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <CTAButton href="/checkout" onClick={() => trackEvent(analyticsEvents.clickCreateSong, { location: "hero" })}>
              Crear mi canción
            </CTAButton>
            <motion.a
              href="#ejemplos"
              onClick={() => trackEvent(analyticsEvents.clickListenExamples)}
              whileHover={{ y: -2 }}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-soft/15 px-6 py-3 text-base font-semibold text-soft transition-colors duration-300 hover:border-primary hover:text-accent"
            >
              <Play className="size-5" fill="currentColor" aria-hidden="true" />
              Escuchar ejemplos
            </motion.a>
          </motion.div>
        </motion.div>

        <motion.div variants={fadeScale} initial="hidden" animate="visible" className="relative">
          <div className="absolute inset-8 rounded-full bg-primary/20 blur-3xl" aria-hidden="true" />
          <div className="relative mx-auto max-w-[520px] rounded-lg border border-soft/14 bg-primary/10 p-5 shadow-[0_34px_110px_rgba(63,105,175,0.24)] backdrop-blur-2xl sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase text-accent">Regalo musical</p>
                <h2 className="mt-1 text-2xl font-semibold text-soft">Canción para mamá</h2>
              </div>
              <div className="grid size-12 place-items-center rounded-md bg-accent text-night shadow-amber">
                <Gift className="size-6" aria-hidden="true" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-lg border border-soft/12 bg-gradient-to-br from-primary/80 via-[#1b2430] to-night p-5">
                <div className="flex items-start justify-between gap-4">
                  <Sparkles className="size-7 text-accent" aria-hidden="true" />
                  <p className="rounded-md bg-night/42 px-3 py-1 text-xs font-semibold uppercase text-soft/60">
                    Historia original
                  </p>
                </div>
                <p className="mt-16 max-w-sm text-2xl font-semibold leading-tight text-soft">
                  Gracias por todo lo que nunca supe decir.
                </p>
              </div>

              <div className="rounded-lg border border-soft/10 bg-night/62 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-soft/52">De historia a canción</p>
                    <p className="mt-1 text-lg font-semibold text-soft">Gracias por tanto mamá</p>
                  </div>
                  <span className="rounded-md bg-primary/20 px-3 py-1 text-xs font-semibold text-accent">
                    Balada cálida
                  </span>
                </div>
                <div className="mt-5 flex h-24 items-end gap-1.5">
                  {Array.from({ length: 26 }).map((_, index) => (
                    <motion.span
                      key={index}
                      className={`w-full rounded-sm bg-gradient-to-t ${isPlaying ? "from-primary to-accent" : "from-primary/60 to-accent/70"}`}
                      animate={{ height: [`${24 + (index % 5) * 8}%`, `${42 + Math.abs(Math.sin(index)) * 48}%`, `${28 + (index % 7) * 6}%`] }}
                      transition={{ duration: 1.8, delay: index * 0.03, repeat: Infinity, repeatType: "mirror" }}
                    />
                  ))}
                </div>
                <div className="mt-5 rounded-md border border-soft/10 bg-soft/5 p-3">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={toggleHeroAudio}
                      className="grid size-10 shrink-0 place-items-center rounded-md bg-accent text-night"
                      type="button"
                      aria-label={`${isPlaying ? "Pausar" : "Reproducir"} Gracias por tanto mamá`}
                    >
                      <PlayerIcon className="size-5" fill={isPlaying ? "none" : "currentColor"} aria-hidden="true" />
                    </button>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-soft">Una canción creada desde tu historia</p>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-sm bg-soft/10">
                        <div className="h-full rounded-sm bg-accent transition-[width] duration-300" style={{ width: progress }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
