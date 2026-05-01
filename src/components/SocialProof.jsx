import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { testimonials } from "../content.js";
import { fadeUp, stagger } from "../motion.js";
import SectionIntro from "./SectionIntro.jsx";

export default function SocialProof() {
  return (
    <section className="relative bg-[#0f0f0f] px-5 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <SectionIntro
          eyebrow="Lo que pasa después"
          title="La reacción es parte del regalo."
        >
          Regalamusica no termina cuando se entrega el archivo. Termina cuando alguien escucha su propia historia y entiende que fue amado.
        </SectionIntro>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-120px" }}
          className="mt-10 grid gap-4 md:grid-cols-2"
        >
          {testimonials.map((testimonial) => {
            const Icon = testimonial.icon;

            return (
              <motion.article
                variants={fadeUp}
                key={testimonial.quote}
                className="rounded-lg border border-soft/10 bg-night/74 p-4 transition-colors duration-300 hover:border-primary/60"
              >
                <div className="relative aspect-video overflow-hidden rounded-md border border-soft/8 bg-[#171717]">
                  <div className="absolute inset-0 reaction-texture" aria-hidden="true" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                      type="button"
                      className="grid size-14 place-items-center rounded-md bg-soft text-night shadow-glow transition-colors duration-300 hover:bg-accent"
                      aria-label={`Ver testimonio: ${testimonial.quote}`}
                    >
                      <Play className="size-6" fill="currentColor" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="absolute left-4 top-4 grid size-10 place-items-center rounded-md bg-night/65 text-accent backdrop-blur">
                    <Icon className="size-5" aria-hidden="true" />
                  </div>
                </div>
                <blockquote className="px-2 py-6">
                  <p className="text-3xl font-semibold leading-[1.12] text-soft">
                    "{testimonial.quote}"
                  </p>
                  <footer className="mt-4 text-base text-soft/54">{testimonial.person}</footer>
                </blockquote>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
