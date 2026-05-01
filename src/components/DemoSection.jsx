import { motion } from "framer-motion";
import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { demos } from "../content.js";
import { fadeUp, stagger } from "../motion.js";
import SectionIntro from "./SectionIntro.jsx";

const formatTime = (seconds) => {
  if (!Number.isFinite(seconds)) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${remainingSeconds}`;
};

export default function DemoSection() {
  const audioRef = useRef(null);
  const [selectedDemo, setSelectedDemo] = useState(0);
  const [playingDemo, setPlayingDemo] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(222.792);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;

    const syncTime = () => setCurrentTime(audio.currentTime);
    const syncDuration = () => {
      if (Number.isFinite(audio.duration)) setAudioDuration(audio.duration);
    };
    const handleEnded = () => setPlayingDemo(null);

    audio.addEventListener("timeupdate", syncTime);
    audio.addEventListener("loadedmetadata", syncDuration);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", syncTime);
      audio.removeEventListener("loadedmetadata", syncDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const handleDemoClick = async (demo, index) => {
    setSelectedDemo(index);

    if (!demo.audioSrc) {
      if (audioRef.current) audioRef.current.pause();
      setPlayingDemo((current) => (current === index ? null : index));
      return;
    }

    const audio = audioRef.current;
    if (!audio) return;

    if (playingDemo === index) {
      audio.pause();
      setPlayingDemo(null);
      return;
    }

    try {
      await audio.play();
      setPlayingDemo(index);
    } catch {
      setPlayingDemo(null);
    }
  };

  return (
    <section className="relative bg-night px-5 py-16 sm:px-8 sm:py-24">
      <audio ref={audioRef} src={demos[0].audioSrc} preload="metadata" />

      <div className="mx-auto max-w-7xl">
        <SectionIntro
          eyebrow="Escucha el tipo de regalo"
          title="Tres canciones. Tres formas distintas de decir te quiero."
        >
          Cada demo es una promesa de tono: íntima, honesta, hecha para que alguien se reconozca en ella.
        </SectionIntro>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-120px" }}
          className="mt-10 grid gap-4 lg:grid-cols-3"
        >
          {demos.map((demo, index) => {
            const isPlaying = playingDemo === index;
            const isSelected = selectedDemo === index;
            const displayTime = demo.audioSrc ? formatTime(currentTime) : isPlaying ? "0:37" : "0:00";
            const displayDuration = demo.audioSrc ? formatTime(audioDuration) : demo.duration;
            const progress = demo.audioSrc
              ? `${Math.min(100, (currentTime / audioDuration) * 100 || 0)}%`
              : isPlaying
                ? "28%"
                : "0%";
            const Icon = isPlaying ? Pause : Play;

            return (
              <motion.article
                key={demo.title}
                variants={fadeUp}
                className={`group rounded-lg border p-5 transition-colors duration-300 hover:border-accent/60 ${
                  isSelected
                    ? "border-primary/50 bg-primary/16"
                    : "border-soft/10 bg-[#101010]"
                }`}
              >
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-semibold text-soft">{demo.title}</h3>
                    <p className="mt-2 text-sm text-primary">{demo.mood}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDemoClick(demo, index)}
                    className="grid size-12 shrink-0 place-items-center rounded-md bg-soft text-night transition-colors duration-300 group-hover:bg-accent"
                    aria-label={`${isPlaying ? "Pausar" : "Reproducir"} ${demo.title}`}
                  >
                    <Icon className="size-5" fill="currentColor" aria-hidden="true" />
                  </button>
                </div>

                <p className="min-h-16 text-lg leading-7 text-soft/72">"{demo.quote}"</p>

                <div className="mt-8 space-y-3">
                  <div className="flex h-20 items-end gap-1 rounded-md bg-night/70 p-3">
                    {Array.from({ length: 28 }).map((_, item) => (
                      <span
                        key={item}
                        className={`w-full rounded-sm ${
                          isPlaying || (demo.audioSrc && isSelected) ? "bg-accent" : "bg-soft/20"
                        }`}
                        style={{
                          height: `${18 + Math.abs(Math.sin(item + index)) * 58}%`,
                        }}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-sm bg-soft/10">
                    <div
                      className="h-full rounded-sm bg-accent transition-[width] duration-300"
                      style={{ width: progress }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm text-soft/45">
                    <span>{displayTime}</span>
                    <span>{displayDuration}</span>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
