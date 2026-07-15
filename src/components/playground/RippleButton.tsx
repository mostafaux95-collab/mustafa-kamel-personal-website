import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Ripple {
  id: number;
  x: number;
  y: number;
}

export default function RippleButton() {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const id = Date.now();
    setRipples((r) => [...r, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
    setTimeout(() => setRipples((r) => r.filter((ripple) => ripple.id !== id)), 700);
  }

  return (
    <button
      onClick={handleClick}
      data-cursor="view"
      className="relative overflow-hidden rounded-full bg-[var(--color-accent)] px-8 py-4 font-display text-sm font-semibold text-[#1a0f10]"
    >
      Click anywhere
      <AnimatePresence>
        {ripples.map((r) => (
          <motion.span
            key={r.id}
            initial={{ width: 0, height: 0, opacity: 0.5 }}
            animate={{ width: 240, height: 240, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="pointer-events-none absolute rounded-full bg-ink/50"
            style={{ left: r.x, top: r.y, translateX: "-50%", translateY: "-50%" }}
          />
        ))}
      </AnimatePresence>
    </button>
  );
}
