import { useRef } from "react";
import clsx from "clsx";
import { gsap, useGSAP, SplitText, prefersReducedMotion } from "@/lib/gsapSetup";
import { useLang } from "@/lib/i18n";

type RevealTag = "h1" | "h2" | "h3" | "p" | "span" | "div";

export default function SplitReveal({
  children,
  as: Tag = "div",
  className,
  type = "words",
  immediate = false,
  delay = 0,
}: {
  children: string;
  as?: RevealTag;
  className?: string;
  type?: "chars" | "words" | "lines";
  immediate?: boolean;
  delay?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const { lang } = useLang();
  // Char-splitting breaks the connected Arabic script, so fall back to words
  const effType = lang === "ar" && type === "chars" ? "words" : type;

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;

      const split = SplitText.create(el, {
        type: effType === "chars" ? "chars,words" : effType,
        mask: effType === "chars" ? "words" : effType,
      });
      const targets =
        effType === "chars" ? split.chars : effType === "words" ? split.words : split.lines;

      gsap.from(targets, {
        yPercent: 120,
        rotate: effType === "chars" ? 4 : 0,
        opacity: effType === "chars" ? 1 : 0,
        duration: 1.1,
        ease: "power4.out",
        stagger: effType === "chars" ? 0.02 : 0.09,
        delay,
        ...(immediate
          ? {}
          : { scrollTrigger: { trigger: el, start: "top 85%", once: true } }),
      });

      return () => split.revert();
    },
    { scope: ref, dependencies: [children, effType], revertOnUpdate: true },
  );

  return (
    // Keyed by the rendered text itself: GSAP's SplitText.revert() restores
    // the *original* HTML it captured at split time, not whatever React
    // wrote to the DOM afterward. On a language switch, React updates the
    // text first, then this effect's cleanup fires (dependencies changed)
    // and reverts straight back to the pre-switch text before re-splitting
    // it — so the heading gets stuck showing the old language until a full
    // page reload remounts it fresh. Keying on `children` forces React to
    // unmount/remount the node instead, sidestepping the revert race
    // entirely.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag key={`${effType}:${children}`} ref={ref as any} className={clsx(className)}>
      {children}
    </Tag>
  );
}
