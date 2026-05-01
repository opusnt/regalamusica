import { motion } from "framer-motion";
import CTAButton from "./CTAButton.jsx";
import { fadeUp, stagger } from "../motion.js";

export default function FinalCTA() {
  return (
    <section id="final" className="relative isolate overflow-hidden bg-night px-5 py-20 sm:px-8 sm:py-28">
      <div className="final-visual absolute inset-0 -z-10" aria-hidden="true" />
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-120px" }}
        className="mx-auto flex max-w-5xl flex-col items-center text-center"
      >
        <motion.p variants={fadeUp} className="text-sm font-semibold uppercase text-accent">
          Cuando se escuche, va a entender
        </motion.p>
        <motion.h2
          variants={fadeUp}
          className="mt-5 text-balance font-display text-5xl font-semibold leading-[1.02] text-soft sm:text-7xl"
        >
          Esto no es una canción
          <span className="mt-3 block text-soft/72">Es un recuerdo para siempre</span>
        </motion.h2>
        <motion.p variants={fadeUp} className="mt-7 max-w-2xl text-lg leading-8 text-soft/66">
          Hay palabras que cambian cuando se cantan. Regalas música, pero lo que queda es la escena: la mirada, el silencio, el abrazo.
        </motion.p>
        <motion.div variants={fadeUp} className="mt-10">
          <CTAButton href="#crear">Crear mi canción ahora</CTAButton>
        </motion.div>
      </motion.div>
    </section>
  );
}
