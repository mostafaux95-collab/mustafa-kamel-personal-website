import { useEffect, type RefObject } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { useFinePointer, useReducedMotion } from "@/lib/useReducedMotion";

export default function MouseLight({
  containerRef,
}: {
  containerRef: RefObject<HTMLElement | null>;
}) {
  const isFine = useFinePointer();
  const reduced = useReducedMotion();
  const mx = useMotionValue(50);
  const my = useMotionValue(35);
  const sx = useSpring(mx, { damping: 30, stiffness: 60 });
  const sy = useSpring(my, { damping: 30, stiffness: 60 });
  const background = useMotionTemplate`radial-gradient(600px circle at ${sx}% ${sy}%, rgba(245,137,99,0.10), transparent 60%)`;

  useEffect(() => {
    if (!isFine || reduced) return;
    function onMove(e: PointerEvent) {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      mx.set(((e.clientX - rect.left) / rect.width) * 100);
      my.set(((e.clientY - rect.top) / rect.height) * 100);
    }
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [containerRef, isFine, mx, my, reduced]);

  if (!isFine || reduced) return null;

  return (
    <motion.div aria-hidden className="pointer-events-none absolute inset-0" style={{ background }} />
  );
}
