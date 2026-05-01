import { motion, useScroll, useTransform } from "framer-motion";
import { Pause, Play, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { storyLines } from "../content.js";

const STORY_AUDIO_SRC = "/Gracias%20por%20tanto%20mama%CC%81.mp3";

const formatTime = (seconds) => {
  if (!Number.isFinite(seconds)) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${remainingSeconds}`;
};

function StoryLine({ line, index, progress }) {
  const start = 0.04 + index * 0.1;
  const opacity = useTransform(progress, [start, start + 0.08], [0.18, 1]);
  const y = useTransform(progress, [start, start + 0.08], [14, 0]);

  return (
    <motion.p style={{ opacity, y }} className="text-pretty text-2xl font-medium leading-[1.18] text-soft sm:text-4xl">
      {line}
    </motion.p>
  );
}

export default function StorySection() {
  const sectionRef = useRef(null);
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(208.56);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 82%", "end 22%"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [-28, 28]);
  const playerProgress = `${Math.min(100, (currentTime / duration) * 100 || 0)}%`;
  const PlayerIcon = isPlaying ? Pause : Play;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;

    const syncTime = () => setCurrentTime(audio.currentTime);
    const syncDuration = () => {
      if (Number.isFinite(audio.duration)) setDuration(audio.duration);
    };
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", syncTime);
    audio.addEventListener("loadedmetadata", syncDuration);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", syncTime);
      audio.removeEventListener("loadedmetadata", syncDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const toggleAudio = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    try {
      await audio.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  };

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-night px-5 py-16 sm:px-8 sm:py-20">
      <audio ref={audioRef} src={STORY_AUDIO_SRC} preload="metadata" />

      <motion.div
        style={{ y: parallaxY }}
        className="story-backdrop pointer-events-none absolute inset-x-0 top-4 bottom-4 mx-auto max-w-7xl opacity-25"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="space-y-5">
          <p className="text-sm font-semibold uppercase text-accent">Una historia real</p>
          <div className="space-y-4">
            {storyLines.map((line, index) => (
              <StoryLine
                key={line}
                line={line}
                index={index}
                progress={scrollYProgress}
              />
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto w-full max-w-md rounded-lg border border-soft/12 bg-[#111111]/82 p-5 shadow-glow backdrop-blur-xl"
        >
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-soft/52">Reproduciendo historia</p>
              <h3 className="mt-1 text-xl font-semibold text-soft">Gracias, mamá</h3>
            </div>
            <button
              type="button"
              onClick={toggleAudio}
              className="grid size-12 place-items-center rounded-md bg-primary text-soft shadow-glow"
              aria-label={`${isPlaying ? "Pausar" : "Reproducir"} Gracias por tanto mamá`}
            >
              <PlayerIcon
                className="size-5"
                fill={isPlaying ? "none" : "currentColor"}
                aria-hidden="true"
              />
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex h-28 items-end gap-1.5 rounded-md border border-soft/8 bg-night/72 p-4">
              {Array.from({ length: 34 }).map((_, index) => (
                <span
                  key={index}
                  className={`w-full rounded-sm ${isPlaying ? "bg-accent" : "bg-accent/55"}`}
                  style={{
                    height: `${18 + Math.abs(Math.sin(index * 0.8)) * 66}%`,
                    opacity: 0.28 + (index % 6) * 0.08,
                  }}
                  aria-hidden="true"
                />
              ))}
            </div>
            <div className="h-1.5 overflow-hidden rounded-sm bg-soft/10">
              <div
                style={{ width: playerProgress }}
                className="h-full rounded-sm bg-accent transition-[width] duration-300"
              />
            </div>
            <div className="flex items-center justify-between text-sm text-soft/48">
              <span>{formatTime(currentTime)}</span>
              <span className="inline-flex items-center gap-1">
                <Volume2 className="size-4" aria-hidden="true" />
                {formatTime(duration)}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
