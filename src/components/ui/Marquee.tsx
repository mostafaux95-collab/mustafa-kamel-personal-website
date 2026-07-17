import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger, prefersReducedMotion } from "@/lib/gsapSetup";
import { useLang } from "@/lib/i18n";

export default function Marquee({ items }: { items: string[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const { lang } = useLang();
  const isRtl = lang === "ar";

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const strip = stripRef.current!;

      // The strip holds two identical halves. Keeping the translation
      // inside the 0 to -50% window means the viewport is always covered,
      // so the loop wraps with zero visible gap in either direction.
      // A long linear duration keeps the drift calm and continuous.
      //
      // Direction follows reading direction: English drifts forward
      // (left to right), Arabic drifts backward (right to left) — chosen
      // by picking which fromTo to build, NOT by flipping timeScale
      // negative on an already-running repeat:-1 tween — GSAP can't play
      // an infinitely-repeating tween backward past its start (totalTime
      // hits 0 and the tween just stops there), which is why the strip
      // used to freeze on an RTL language switch.
      const DURATION = 110;
      const goForward = !isRtl;
      const tween = goForward
        ? gsap.fromTo(
            strip,
            { xPercent: -50 },
            { xPercent: 0, duration: DURATION, ease: "none", repeat: -1 },
          )
        : gsap.fromTo(
            strip,
            { xPercent: 0 },
            { xPercent: -50, duration: DURATION, ease: "none", repeat: -1 },
          );

      // Scroll velocity gives a gentle lean and a slight push, then settles.
      const st = ScrollTrigger.create({
        onUpdate(self) {
          const v = self.getVelocity();
          gsap.to(strip, {
            skewX: gsap.utils.clamp(-5, 5, v / -350),
            duration: 0.6,
            ease: "power2.out",
            overwrite: "auto",
          });
          tween.timeScale(gsap.utils.clamp(1, 1.8, 1 + Math.abs(v) / 3500));
        },
      });

      return () => {
        st.kill();
        tween.kill();
      };
    },
    { scope: wrapRef, dependencies: [items.join(), isRtl], revertOnUpdate: true },
  );

  // Each half repeats the items enough times to always exceed the viewport
  // width, so the seam between halves is never on screen alone.
  const REPEAT = 3;
  const half = (keyPrefix: string) =>
    Array.from({ length: REPEAT }).flatMap((_, r) =>
      items.map((item, i) => (
        <span
          key={`${keyPrefix}-${r}-${i}`}
          className="flex shrink-0 items-center gap-8 pe-8"
        >
          <span
            className={
              (r * items.length + i) % 2 === 0
                ? "font-display text-5xl font-semibold text-ink/90 sm:text-7xl"
                : "text-stroke font-display text-5xl font-semibold sm:text-7xl"
            }
          >
            {item}
          </span>
          <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
        </span>
      )),
    );

  return (
    <div
      ref={wrapRef}
      aria-hidden
      // Physical LTR layout regardless of page direction: the translation
      // math stays identical in Arabic and English, and the strip always
      // anchors to the viewport's left edge. Direction is handled purely
      // by which fromTo variant is built above.
      dir="ltr"
      className="pointer-events-none overflow-hidden border-y border-ink/[0.06] py-8 sm:py-10"
    >
      <div ref={stripRef} className="flex w-max will-change-transform">
        {half("a")}
        {half("b")}
      </div>
    </div>
  );
}
