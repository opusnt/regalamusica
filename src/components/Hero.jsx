import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { Music2, Pause, Sparkles } from "lucide-react";
import { useRef } from "react";
import CTAButton from "./CTAButton.jsx";
import { fadeScale, fadeUp, stagger } from "../motion.js";

const particleSeeds = Array.from({ length: 42 }, (_, index) => {
  const column = index % 14;
  const row = Math.floor(index / 14);
  const waveX = 46 + column * 21;
  const waveY = 286 + Math.sin(column * 0.85) * 18 + row * 3;

  return {
    id: index,
    fromX: 76 + column * 13 + row * 19,
    fromY: 116 + row * 24 + Math.sin(index) * 4,
    midX: 84 + column * 17,
    midY: 202 + Math.cos(index * 0.7) * 38,
    waveX,
    waveY,
    size: 3 + (index % 4),
    delay: index * 0.035,
  };
});

const waveformBars = Array.from({ length: 30 }, (_, index) => ({
  id: index,
  height: 24 + Math.abs(Math.sin(index * 0.78)) * 58,
  delay: index * 0.035,
}));

const floatingNotes = [
  { note: "♪", className: "left-[8%] top-[18%]", delay: 0 },
  { note: "♬", className: "right-[9%] top-[16%]", delay: 1.2 },
  { note: "♪", className: "right-[16%] bottom-[24%]", delay: 2.2 },
  { note: "♩", className: "left-[15%] bottom-[18%]", delay: 1.7 },
];

function FloatingNotes() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      {floatingNotes.map((item) => (
        <motion.span
          key={`${item.note}-${item.className}`}
          className={`absolute ${item.className} text-2xl text-accent/34 blur-[0.2px]`}
          initial={{ opacity: 0, y: 12, scale: 0.9 }}
          animate={{
            opacity: [0, 0.45, 0.16, 0.38],
            y: [12, -12, 7, -8],
            rotate: [-5, 6, -3, 4],
          }}
          transition={{
            duration: 8,
            delay: item.delay,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
        >
          {item.note}
        </motion.span>
      ))}
    </div>
  );
}

function MessageToMusicCard({ rotateX, rotateY, visualY }) {
  return (
    <motion.div
      style={{ rotateX, rotateY, y: visualY }}
      animate={{ translateY: [0, -14, 0] }}
      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      className="hero-card-3d relative mx-auto aspect-[0.92] w-full max-w-[520px]"
    >
      <div className="absolute -inset-12 rounded-full bg-primary/18 blur-3xl" aria-hidden="true" />
      <div className="absolute -bottom-8 left-1/2 h-24 w-3/4 -translate-x-1/2 rounded-full bg-accent/12 blur-3xl" aria-hidden="true" />

      <div className="relative h-full overflow-hidden rounded-lg border border-soft/14 bg-primary/10 p-5 shadow-[0_34px_110px_rgba(63,105,175,0.22)] backdrop-blur-2xl sm:p-7">
        <div className="absolute inset-0 hero-card-sheen" aria-hidden="true" />
        <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-soft/8" aria-hidden="true" />

        <div className="relative z-10 flex h-full flex-col">
          <div className="mb-7 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-accent">Historia original</p>
              <p className="mt-1 text-sm text-soft/48">Mensaje privado</p>
            </div>
            <motion.div
              className="grid size-11 place-items-center rounded-md border border-soft/10 bg-soft/8 text-accent"
              animate={{ boxShadow: ["0 0 0 rgba(245,188,54,0)", "0 0 26px rgba(245,188,54,0.32)", "0 0 0 rgba(245,188,54,0)"] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles className="size-5" aria-hidden="true" />
            </motion.div>
          </div>

          <div className="relative min-h-40 rounded-lg border border-soft/10 bg-night/42 p-5">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 1, 1, 0, 0],
                filter: ["blur(8px)", "blur(0px)", "blur(0px)", "blur(9px)", "blur(9px)"],
                scale: [0.98, 1, 1, 1.02, 1.02],
              }}
              transition={{
                duration: 9.5,
                times: [0, 0.16, 0.36, 0.5, 1],
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="text-2xl font-semibold leading-tight text-soft sm:text-3xl"
            >
              <motion.span
                className="block"
                animate={{ y: [12, 0, 0, -8], opacity: [0, 1, 1, 0] }}
                transition={{ duration: 9.5, times: [0.02, 0.14, 0.38, 0.5], repeat: Infinity, ease: "easeInOut" }}
              >
                Gracias por todo
              </motion.span>
              <motion.span
                className="mt-2 block text-soft/82"
                animate={{ y: [12, 0, 0, -8], opacity: [0, 1, 1, 0] }}
                transition={{ duration: 9.5, times: [0.09, 0.21, 0.39, 0.5], repeat: Infinity, ease: "easeInOut" }}
              >
                mamá…
              </motion.span>
            </motion.div>
          </div>

          <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
            {particleSeeds.map((particle) => (
              <motion.span
                key={particle.id}
                className="absolute rounded-full bg-accent/90 shadow-[0_0_18px_rgba(245,188,54,0.45)]"
                style={{
                  width: particle.size,
                  height: particle.size,
                  filter: particle.id % 3 === 0 ? "blur(1.2px)" : "blur(0px)",
                }}
                initial={{ x: particle.fromX, y: particle.fromY, opacity: 0, scale: 0.4 }}
                animate={{
                  x: [particle.fromX, particle.fromX, particle.midX, particle.waveX, particle.waveX],
                  y: [particle.fromY, particle.fromY, particle.midY, particle.waveY, particle.waveY],
                  opacity: [0, 0, 0.86, 0.68, 0],
                  scale: [0.4, 0.4, 1, 0.7, 0.35],
                }}
                transition={{
                  duration: 9.5,
                  times: [0, 0.38, 0.56, 0.72, 1],
                  delay: particle.delay,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          <div className="relative mt-8 flex-1 rounded-lg border border-primary/18 bg-[#07111c]/70 p-5">
            <div className="absolute inset-x-5 top-6 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" aria-hidden="true" />
            <motion.div
              className="flex h-28 items-center gap-1.5"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: [0, 0, 1, 1, 0.28], y: [18, 18, 0, 0, -4] }}
              transition={{ duration: 9.5, times: [0, 0.52, 0.66, 0.88, 1], repeat: Infinity, ease: "easeInOut" }}
            >
              {waveformBars.map((bar) => (
                <motion.span
                  key={bar.id}
                  className="w-full rounded-sm bg-gradient-to-t from-primary via-accent to-soft"
                  initial={{ height: 12, opacity: 0.3 }}
                  animate={{ height: [bar.height * 0.45, bar.height, bar.height * 0.62, bar.height * 0.92], opacity: [0.48, 1, 0.62, 0.9] }}
                  transition={{ duration: 1.65, delay: bar.delay, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
                />
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: [0, 0, 1, 1], y: [16, 16, 0, 0] }}
              transition={{ duration: 9.5, times: [0, 0.64, 0.76, 1], repeat: Infinity, ease: "easeInOut" }}
              className="mt-4 rounded-lg border border-soft/10 bg-night/72 p-4"
            >
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="grid size-11 place-items-center rounded-md bg-accent text-night shadow-amber"
                  aria-label="Pausar muestra"
                >
                  <Pause className="size-5" aria-hidden="true" />
                </button>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-soft">Gracias por todo mamá</p>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-sm bg-soft/10">
                    <motion.div
                      className="h-full rounded-sm bg-accent"
                      animate={{ width: ["18%", "72%", "94%"] }}
                      transition={{ duration: 5.4, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </div>
                </div>
                <p className="text-xs text-soft/42">2:58</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Hero() {
  const sectionRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 90, damping: 24, mass: 0.35 });
  const smoothY = useSpring(mouseY, { stiffness: 90, damping: 24, mass: 0.35 });
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-7, 7]);
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [6, -6]);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const visualY = useTransform(scrollYProgress, [0, 1], [0, 80]);

  const handlePointerMove = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    mouseX.set((event.clientX - bounds.left) / bounds.width - 0.5);
    mouseY.set((event.clientY - bounds.top) / bounds.height - 0.5);
  };

  return (
    <section
      ref={sectionRef}
      onPointerMove={handlePointerMove}
      className="relative isolate min-h-[760px] overflow-hidden bg-night lg:min-h-[820px]"
    >
      <div className="absolute inset-0 -z-10">
        <div className="hero-mesh absolute inset-0" aria-hidden="true" />
        <div className="hero-noise absolute inset-0" aria-hidden="true" />
        <div className="hero-vignette absolute inset-0" aria-hidden="true" />
      </div>

      <header className="absolute left-0 right-0 top-0 z-20">
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

      <div id="top" className="mx-auto grid min-h-[760px] max-w-7xl items-center gap-10 px-5 pb-12 pt-24 sm:px-8 lg:min-h-[820px] lg:grid-cols-[0.82fr_1.18fr] lg:gap-12 lg:pb-12 lg:pt-20">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="relative z-10 max-w-2xl"
        >
          <motion.div
            variants={fadeScale}
            className="mb-6 inline-flex items-center gap-2 rounded-md border border-soft/12 bg-night/45 px-3 py-2 text-sm text-soft/76 backdrop-blur-md"
          >
            <span className="size-2 rounded-sm bg-accent shadow-amber" aria-hidden="true" />
            De mensaje privado a canción inolvidable
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-balance font-display text-4xl font-semibold leading-[1.02] text-soft sm:text-6xl lg:text-6xl xl:text-7xl"
          >
            Hay cosas que nunca dijiste…
            <span className="mt-3 block text-soft/82">
              Nosotros las convertimos en una canción
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-xl text-pretty text-lg leading-8 text-soft/72 sm:text-xl"
          >
            Regala algo que no se olvida nunca
          </motion.p>

          <motion.div variants={fadeUp} className="mt-8">
            <CTAButton>Crear mi canción</CTAButton>
          </motion.div>
        </motion.div>

        <motion.div
          variants={fadeScale}
          initial="hidden"
          animate="visible"
          className="relative z-10 min-h-[520px] lg:min-h-[660px]"
        >
          <FloatingNotes />
          <MessageToMusicCard rotateX={rotateX} rotateY={rotateY} visualY={visualY} />
        </motion.div>
      </div>
    </section>
  );
}
