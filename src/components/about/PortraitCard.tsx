import { useRef } from "react";
import clsx from "clsx";
import { Sparkles } from "lucide-react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsapSetup";
import { useLang } from "@/lib/i18n";

export default function PortraitCard({ className }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const ringRef = useRef<SVGSVGElement>(null);
  const { t } = useLang();

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      // Photo drifts inside its mask as the page scrolls - the card feels
      // like a window onto the image rather than a flat sticker.
      gsap.fromTo(
        imgRef.current,
        { yPercent: -6 },
        {
          yPercent: 6,
          ease: "none",
          scrollTrigger: {
            trigger: wrapRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
      gsap.to(ringRef.current, {
        rotation: 360,
        duration: 26,
        repeat: -1,
        ease: "none",
        transformOrigin: "50% 50%",
      });
    },
    { scope: wrapRef },
  );

  return (
    <div ref={wrapRef} className={clsx("relative", className)}>
      {/* Dot-grid ornament echoing the photo's backdrop */}
      <div
        aria-hidden
        className="absolute -start-7 -top-7 h-24 w-24 opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(rgba(245,137,99,0.45) 1.5px, transparent 1.5px)",
          backgroundSize: "12px 12px",
        }}
      />
      <div
        aria-hidden
        className="absolute -end-2.5 top-12 h-3.5 w-3.5 bg-[var(--color-accent)]"
      />

      <div className="group relative aspect-4/5 overflow-hidden rounded-[2rem] border border-ink/[0.08] bg-[var(--color-card)]">
        <img
          ref={imgRef}
          src="/portrait.jpg"
          alt={t.titles.base}
          loading="lazy"
          className="h-full w-full scale-115 object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.19]"
        />
        {/* Scrim sits on the photo itself, so it stays dark in both themes */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/75 to-transparent"
        />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6">
          <div>
            <div className="font-display text-lg font-semibold text-white">{t.brand}</div>
            <div className="text-xs uppercase tracking-widest text-white/60">
              {t.aboutSection.location}
            </div>
          </div>
        </div>
      </div>

      {/* Rotating circular-text badge overlapping the corner */}
      <div className="absolute -bottom-9 -end-6 flex h-28 w-28 items-center justify-center rounded-full border border-ink/10 bg-bg/95 shadow-2xl sm:-end-9">
        {/* direction:ltr is required: inherited RTL pushes textPath glyphs
            off the path start and the ring text disappears in Arabic */}
        <svg
          ref={ringRef}
          viewBox="0 0 100 100"
          className="h-full w-full"
          style={{ direction: "ltr" }}
          aria-hidden
        >
          <defs>
            <path
              id="portrait-badge-circle"
              d="M 50,50 m -36,0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0"
            />
          </defs>
          <text
            className="fill-ink/65 font-display"
            fontSize="8"
            letterSpacing="1.8"
            style={{ direction: "ltr" }}
          >
            <textPath href="#portrait-badge-circle">{t.portraitBadge}</textPath>
          </text>
        </svg>
        <Sparkles
          size={20}
          className="absolute text-[var(--color-accent)]"
          aria-hidden
        />
      </div>
    </div>
  );
}
