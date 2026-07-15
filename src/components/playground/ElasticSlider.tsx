import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export default function ElasticSlider() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState(60);
  const stretch = useMotionValue(1);
  const springStretch = useSpring(stretch, { stiffness: 300, damping: 15 });
  const scaleY = useTransform(springStretch, [1, 1.6], [1, 1.6]);

  function updateFromClientX(clientX: number) {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const pct = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    setValue(Math.round(pct * 100));
  }

  return (
    <div className="w-full max-w-xs">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs uppercase tracking-widest text-[var(--color-ink-muted)]">
          Drag me
        </span>
        <span className="font-display text-lg font-semibold text-ink">{value}</span>
      </div>
      <div
        ref={trackRef}
        data-cursor="drag"
        className="relative flex h-10 items-center"
        onPointerDown={(e) => {
          (e.target as HTMLElement).setPointerCapture(e.pointerId);
          stretch.set(1.6);
          updateFromClientX(e.clientX);
        }}
        onPointerMove={(e) => {
          if (e.buttons === 1) updateFromClientX(e.clientX);
        }}
        onPointerUp={() => stretch.set(1)}
      >
        <div className="h-1.5 w-full rounded-full bg-ink/10">
          <div
            className="h-full rounded-full bg-[var(--color-accent)]"
            style={{ width: `${value}%` }}
          />
        </div>
        <motion.div
          style={{ left: `${value}%`, scaleY }}
          className="absolute top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink shadow-lg"
        />
      </div>
    </div>
  );
}
