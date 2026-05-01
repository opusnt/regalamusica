import { motion } from "framer-motion";
import { experiences } from "../content.js";
import { fadeUp, stagger } from "../motion.js";
import SectionIntro from "./SectionIntro.jsx";

export default function ExperienceSelector() {
  return (
    <section className="bg-night px-5 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <SectionIntro
          eyebrow="Elige la emoción"
          title="No todos los regalos buscan lo mismo."
        >
          Empieza por la reacción que quieres provocar. La canción encuentra su forma desde ahí.
        </SectionIntro>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-120px" }}
          className="mt-10 grid gap-4 lg:grid-cols-3"
        >
          {experiences.map((experience) => {
            const Icon = experience.icon;

            return (
              <motion.a
                href="#crear"
                key={experience.title}
                variants={fadeUp}
                whileHover={{ y: -8 }}
                className="group rounded-lg border border-soft/10 bg-[#101010] p-6 transition-colors duration-300 hover:border-accent/70"
              >
                <div className="grid size-14 place-items-center rounded-md bg-primary/16 text-accent transition-colors duration-300 group-hover:bg-accent group-hover:text-night">
                  <Icon className="size-7" aria-hidden="true" />
                </div>
                <h3 className="mt-8 text-3xl font-semibold text-soft">{experience.title}</h3>
                <p className="mt-4 text-base leading-7 text-soft/62">{experience.description}</p>
              </motion.a>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
