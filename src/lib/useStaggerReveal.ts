import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsapSetup";

/**
 * Scroll-triggered GSAP stagger for a group of children.
 * Targets `[data-reveal]` descendants of the returned ref's element.
 */
export function useStaggerReveal<T extends HTMLElement>(vars?: gsap.TweenVars) {
  const ref = useRef<T>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const items = ref.current?.querySelectorAll("[data-reveal]");
      if (!items?.length) return;
      gsap.from(items, {
        y: 44,
        autoAlpha: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: ref.current, start: "top 82%", once: true },
        ...vars,
      });
    },
    { scope: ref },
  );

  return ref;
}
