import { motion } from "framer-motion";
import { Music2 } from "lucide-react";
import CTAButton from "./CTAButton.jsx";
import { fadeScale, fadeUp, stagger } from "../motion.js";

export default function Hero() {
  return (
    <section className="relative isolate min-h-[700px] overflow-hidden bg-night sm:min-h-[760px] lg:min-h-[820px]">
      <div className="absolute inset-0 -z-10">
        <motion.img
          src="/cinematic-poster.png"
          alt=""
          className="h-full w-full scale-105 object-cover opacity-80"
          initial={{ scale: 1.08 }}
          animate={{ scale: 1.02 }}
          transition={{ duration: 10, ease: "easeOut" }}
        />
        <div className="hero-film absolute inset-0" aria-hidden="true" />
        <div className="hero-vignette absolute inset-0" aria-hidden="true" />
      </div>

      <header className="absolute left-0 right-0 top-0 z-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <a href="#top" className="inline-flex items-center gap-2 text-sm font-semibold text-soft">
            <span className="grid size-9 place-items-center rounded-md border border-soft/15 bg-soft/5">
              <Music2 className="size-5 text-accent" aria-hidden="true" />
            </span>
            Regalamusica
          </a>
          <a
            href="#crear"
            className="hidden rounded-md border border-soft/15 px-4 py-2 text-sm font-semibold text-soft/88 transition-colors duration-300 hover:border-accent/70 hover:text-accent sm:inline-flex"
          >
            Crear ahora
          </a>
        </div>
      </header>

      <div id="top" className="mx-auto flex min-h-[700px] max-w-7xl items-center px-5 pb-10 pt-24 sm:min-h-[760px] sm:px-8 lg:min-h-[820px]">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="max-w-5xl"
        >
          <motion.div
            variants={fadeScale}
            className="mb-6 inline-flex items-center gap-2 rounded-md border border-soft/12 bg-night/45 px-3 py-2 text-sm text-soft/76 backdrop-blur-md"
          >
            <span className="size-2 rounded-sm bg-accent shadow-amber" aria-hidden="true" />
            Canciones personalizadas que se sienten como una vida entera
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-balance font-display text-5xl font-semibold leading-[0.98] text-soft sm:text-7xl lg:text-8xl"
          >
            Hay cosas que nunca dijiste…
            <span className="mt-3 block text-soft/82">
              Nosotros las convertimos en una canción
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-7 max-w-2xl text-pretty text-lg leading-8 text-soft/72 sm:text-2xl"
          >
            Regala algo que no se olvida nunca
          </motion.p>

          <motion.div variants={fadeUp} className="mt-9">
            <CTAButton>Crear mi canción</CTAButton>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
