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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} className={clsx(className)}>
      {children}
    </Tag>
  );
}
