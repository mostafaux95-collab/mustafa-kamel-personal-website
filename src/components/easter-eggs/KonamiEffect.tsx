import { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";

const COLORS = ["#F58963", "#432666", "#6a3f9c", "#ffffff", "#c9a5e8"];

export default function KonamiEffect({ active }: { active: boolean }) {
  const particles = useMemo(
    () =>
      Array.from({ length: 60 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.4,
        duration: 2.2 + Math.random() * 1.4,
        size: 6 + Math.random() * 8,
        color: COLORS[i % COLORS.length],
        rotate: Math.random() * 360,
      })),
    [],
  );

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="pointer-events-none fixed inset-0 z-[200] overflow-hidden"
        >
          {particles.map((p) => (
            <motion.span
              key={p.id}
              initial={{ y: -20, x: `${p.x}vw`, opacity: 1, rotate: 0 }}
              animate={{ y: "110vh", rotate: p.rotate }}
              transition={{ duration: p.duration, delay: p.delay, ease: "easeIn" }}
              style={{
                position: "absolute",
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
                borderRadius: p.id % 3 === 0 ? "9999px" : "2px",
              }}
            />
          ))}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="absolute left-1/2 top-10 -translate-x-1/2 rounded-full border border-ink/15 bg-card/90 px-6 py-3 font-display text-sm font-semibold text-ink shadow-2xl backdrop-blur-lg"
          >
            Achievement unlocked: you found the Konami code ✨
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
