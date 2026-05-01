import { motion } from "framer-motion";
import { fadeUp, stagger } from "../motion.js";

export default function SectionIntro({ eyebrow, title, children, align = "center" }) {
  const alignClass = align === "left" ? "items-start text-left" : "items-center text-center";

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-120px" }}
      className={`mx-auto flex max-w-3xl flex-col ${alignClass}`}
    >
      {eyebrow ? (
        <motion.p
          variants={fadeUp}
          className="mb-4 text-sm font-semibold uppercase text-accent"
        >
          {eyebrow}
        </motion.p>
      ) : null}
      <motion.h2
        variants={fadeUp}
        className="text-balance font-display text-3xl font-semibold leading-[1.08] text-soft sm:text-5xl"
      >
        {title}
      </motion.h2>
      {children ? (
        <motion.p
          variants={fadeUp}
          className="mt-5 max-w-2xl text-pretty text-base leading-7 text-soft/68 sm:text-lg"
        >
          {children}
        </motion.p>
      ) : null}
    </motion.div>
  );
}
