import { useRef } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";

export default function SpotlightReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(-200);
  const my = useMotionValue(-200);
  const mask = useMotionTemplate`radial-gradient(120px circle at ${mx}px ${my}px, black, transparent)`;

  return (
    <div
      ref={ref}
      onPointerMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mx.set(e.clientX - rect.left);
        my.set(e.clientY - rect.top);
      }}
      onPointerLeave={() => {
        mx.set(-200);
        my.set(-200);
      }}
      className="relative flex h-40 w-full items-center justify-center overflow-hidden rounded-2xl bg-[var(--color-card)]"
    >
      <span className="pointer-events-none px-6 text-center font-display text-lg text-ink/15">
        Move your cursor to find the message
      </span>
      <motion.div
        className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[var(--color-accent)] px-6 text-center"
        style={{ WebkitMaskImage: mask, maskImage: mask }}
      >
        <span className="font-display text-lg font-semibold text-[#1a0f10]">
          Every pixel has a purpose.
        </span>
      </motion.div>
    </div>
  );
}
