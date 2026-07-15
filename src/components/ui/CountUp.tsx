import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsapSetup";

// Animates the leading integer of a metric string ("80+", "12 workflows")
// counting up when scrolled into view. Values without a leading number
// ("Platform-wide", "12 → 5") render as-is.
export default function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const match = /^(\d+)([^0-9→]*)$/.exec(value);

  useGSAP(
    () => {
      if (!match || prefersReducedMotion() || !numRef.current) return;
      const target = Number(match[1]);
      const counter = { n: 0 };
      gsap.to(counter, {
        n: target,
        duration: 1.6,
        ease: "power2.out",
        scrollTrigger: { trigger: ref.current, start: "top 90%", once: true },
        onUpdate() {
          if (numRef.current) numRef.current.textContent = String(Math.round(counter.n));
        },
      });
    },
    { scope: ref },
  );

  if (!match) return <span className={className}>{value}</span>;

  return (
    <span ref={ref} className={className}>
      <span ref={numRef}>{match[1]}</span>
      {match[2]}
    </span>
  );
}
