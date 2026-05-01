import { motion } from "framer-motion";
import { steps } from "../content.js";
import { fadeUp, stagger } from "../motion.js";
import SectionIntro from "./SectionIntro.jsx";

export default function HowItWorks() {
  return (
    <section className="relative bg-[#0f0f0f] px-5 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <SectionIntro
          eyebrow="Cómo nace"
          title="Solo necesitas recordar. Nosotros nos encargamos de convertirlo en música."
        >
          No partimos de un catálogo. Partimos de una persona, una historia y una emoción que merece quedarse.
        </SectionIntro>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-120px" }}
          className="mt-10 grid gap-4 md:grid-cols-3"
        >
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.article
                variants={fadeUp}
                key={step.title}
                className="rounded-lg border border-soft/10 bg-night/70 p-6 text-center transition-colors duration-300 hover:border-primary/60"
              >
                <div className="mx-auto grid size-14 place-items-center rounded-md bg-primary/18 text-accent">
                  <Icon className="size-7" aria-hidden="true" />
                </div>
                <p className="mt-6 text-sm font-semibold text-accent">0{index + 1}</p>
                <h3 className="mt-2 text-2xl font-semibold text-soft">{step.title}</h3>
                <p className="mt-4 text-base leading-7 text-soft/62">{step.text}</p>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
