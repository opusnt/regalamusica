import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export default function CTAButton({ children, href = "#crear", onClick }) {
  return (
    <motion.a
      href={href}
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-accent px-6 py-3 text-base font-semibold text-night shadow-amber transition-colors duration-300 hover:bg-[#ffd46a] focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-night"
    >
      <span>{children}</span>
      <ChevronRight
        className="size-5 transition-transform duration-300 group-hover:translate-x-1"
        strokeWidth={2.2}
        aria-hidden="true"
      />
    </motion.a>
  );
}
