import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import Container from "@/components/ui/Container";
import GradientMesh from "@/components/ui/GradientMesh";
import MouseLight from "@/components/ui/MouseLight";
import Magnetic from "@/components/ui/Magnetic";
import HeroScene from "@/components/three/HeroScene";
import { gsap, useGSAP, SplitText, prefersReducedMotion } from "@/lib/gsapSetup";
import { useLang } from "@/lib/i18n";
import { knotSpin } from "@/lib/heroInteraction";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const headlineWrapRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLHeadingElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLParagraphElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const accentRef = useRef<HTMLSpanElement>(null);
  const paraRef = useRef<HTMLParagraphElement>(null);
  const ctasRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);
  const { lang, t } = useLang();

  function onKnotPointerDown(e: React.PointerEvent) {
    if (prefersReducedMotion()) return;
    e.preventDefault();
    knotSpin.dragging = true;
    let px = e.clientX;
    let py = e.clientY;
    const move = (ev: PointerEvent) => {
      knotSpin.vy += (ev.clientX - px) * 0.0035;
      knotSpin.vx += (ev.clientY - py) * 0.0035;
      px = ev.clientX;
      py = ev.clientY;
    };
    const up = () => {
      knotSpin.dragging = false;
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerup", up);
  }

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      // GSAP SplitText has no RTL/bidi awareness: it reconstructs each
      // word's text by measuring character bounding boxes in left-to-right
      // screen order, which for Arabic glyphs reverses every word's
      // character order once re-inserted into the DOM (e.g. "أصمّم" comes
      // out as "ممّصأ"). There's no split config that avoids this for
      // Arabic, so Arabic skips SplitText entirely and animates each line
      // as a single whole block instead - the browser then renders the
      // untouched, correctly-shaped Arabic text natively.
      const isAr = lang === "ar";

      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.from(
        avatarRef.current,
        { scale: 0.5, autoAlpha: 0, duration: 0.9, ease: "back.out(1.6)" },
        0,
      ).from(badgeRef.current, { y: 14, autoAlpha: 0, duration: 0.7 }, 0.1);

      let split1: SplitText | undefined;
      let split2: SplitText | undefined;
      let split3: SplitText | undefined;

      if (isAr) {
        tl.from(line1Ref.current, { y: 34, autoAlpha: 0, duration: 0.9 }, 0.2)
          .from(line2Ref.current, { y: 34, autoAlpha: 0, duration: 0.9 }, 0.4)
          .from(accentRef.current, { y: 34, autoAlpha: 0, duration: 0.9, ease: "back.out(1.4)" }, 0.55);
      } else {
        split1 = SplitText.create(line1Ref.current, { type: "chars,words", mask: "words" });
        split2 = SplitText.create(line2Ref.current, { type: "chars,words", mask: "words" });
        split3 = SplitText.create(accentRef.current, { type: "chars,words", mask: "words" });

        tl.from(split1.chars, { yPercent: 120, rotate: 5, duration: 1.1, stagger: 0.022 }, 0.2)
          .from(split2.chars, { yPercent: 120, rotate: 5, duration: 1.1, stagger: 0.022 }, 0.45)
          .from(
            split3.chars,
            { yPercent: 130, rotate: -6, duration: 1.2, stagger: 0.033, ease: "back.out(1.4)" },
            0.65,
          );
      }

      tl.from(paraRef.current, { y: 24, autoAlpha: 0, duration: 0.9 }, 1.0)
        .from(ctasRef.current, { y: 24, autoAlpha: 0, duration: 0.9 }, 1.15)
        .from(hintRef.current, { autoAlpha: 0, duration: 0.8 }, 1.5)
        .to(overlayRef.current, { autoAlpha: 1, duration: 1 }, 1.6);

      // Scroll indicator bob
      gsap.to(arrowRef.current, {
        y: 8,
        duration: 0.9,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // Parallax exit - content drifts down and fades as the hero scrolls away
      gsap.to(contentRef.current, {
        y: 130,
        autoAlpha: 0,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "85% top",
          scrub: true,
        },
      });

      // Cursor spotlight on the headline + gentle depth parallax on content
      let removePointer = () => {};
      if (window.matchMedia("(pointer: fine)").matches) {
        const wrap = headlineWrapRef.current!;
        const xTo = gsap.quickTo(parallaxRef.current, "x", { duration: 0.7, ease: "power3.out" });
        const yTo = gsap.quickTo(parallaxRef.current, "y", { duration: 0.7, ease: "power3.out" });
        const onPointerMove = (e: PointerEvent) => {
          const r = wrap.getBoundingClientRect();
          wrap.style.setProperty("--spot-x", `${e.clientX - r.left}px`);
          wrap.style.setProperty("--spot-y", `${e.clientY - r.top}px`);
          xTo((e.clientX / window.innerWidth - 0.5) * -14);
          yTo((e.clientY / window.innerHeight - 0.5) * -10);
        };
        window.addEventListener("pointermove", onPointerMove, { passive: true });
        removePointer = () => window.removeEventListener("pointermove", onPointerMove);
      }

      return () => {
        removePointer();
        split1?.revert();
        split2?.revert();
        split3?.revert();
      };
    },
    { scope: sectionRef, dependencies: [lang], revertOnUpdate: true },
  );

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-[var(--color-bg)]"
    >
      <GradientMesh />
      <MouseLight containerRef={sectionRef} />
      <HeroScene />

      {/* Invisible hotspot over the knot - drag to spin it */}
      <div
        onPointerDown={onKnotPointerDown}
        data-cursor="drag"
        aria-hidden
        className="absolute end-[136px] top-1/2 z-0 hidden h-72 w-72 -translate-y-1/2 cursor-grab touch-none rounded-full active:cursor-grabbing lg:block"
      />

      <div ref={contentRef} className="relative z-10">
        <div ref={parallaxRef}>
          <Container className="pt-24">
          <div ref={avatarRef} className="mb-7 inline-block">
            <div className="relative">
              <img
                src="/portrait.jpg"
                alt={t.brand}
                className="h-20 w-20 rounded-full border-2 border-ink/15 object-cover object-top shadow-[0_0_50px_rgba(106,63,156,0.55)] sm:h-24 sm:w-24"
              />
              <span
                aria-hidden
                className="absolute -bottom-0.5 end-1 h-3.5 w-3.5 rounded-full bg-emerald-400 ring-4 ring-bg"
              />
            </div>
          </div>
          <p
            ref={badgeRef}
            className="mb-6 font-display text-[13px] font-medium uppercase tracking-[0.25em] text-[var(--color-accent)]"
          >
            {t.hero.badge}
          </p>

          {/* Keyed by lang: SplitText.revert() (cleanup below) restores the
              *original* HTML captured at split time, not whatever React
              wrote afterward, so on a language switch the headline gets
              stuck on the pre-switch text until a full reload. Keying this
              subtree forces React to unmount/remount it instead, so the
              GSAP effect always splits fresh, already-correct text. */}
          <div key={lang} ref={headlineWrapRef} className="relative max-w-5xl">
            <h1 className="font-display text-[13vw] leading-[1.08] font-semibold tracking-tight text-ink sm:text-[9vw] lg:text-[6.4vw]">
              <span ref={line1Ref} className="block">
                {t.hero.line1}
              </span>
              <span className="block">
                <span ref={line2Ref} className="inline-block">
                  {t.hero.line2}
                </span>{" "}
                <span
                  ref={accentRef}
                  className={`inline-block text-[var(--color-accent)] ${lang === "ar" ? "" : "italic"}`}
                >
                  {t.hero.accent}
                </span>
              </span>
            </h1>
            {/* Ghost copy revealed inside the cursor spotlight */}
            <h1
              ref={overlayRef}
              aria-hidden
              className="spotlight-layer pointer-events-none absolute inset-0 font-display text-[13vw] leading-[1.08] font-semibold tracking-tight opacity-0 sm:text-[9vw] lg:text-[6.4vw]"
            >
              <span className="block">{t.hero.line1}</span>
              <span className="block">
                <span className="inline-block">{t.hero.line2}</span>{" "}
                <span className={`inline-block ${lang === "ar" ? "" : "italic"}`}>
                  {t.hero.accent}
                </span>
              </span>
            </h1>
          </div>

          <p
            ref={paraRef}
            className="mt-8 max-w-xl text-balance font-body text-lg text-[var(--color-ink-secondary)] sm:text-xl"
          >
            {t.hero.para}
          </p>

          <div ref={ctasRef} className="mt-12 flex flex-wrap items-center gap-5">
            <Magnetic cursor="view">
              <Link
                to="/work"
                className="btn-shine group flex items-center gap-2 rounded-full bg-ink px-7 py-4 font-display text-sm font-semibold text-bg transition-colors"
              >
                {t.hero.viewProjects}
                <ArrowUpRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:-scale-x-100"
                />
              </Link>
            </Magnetic>
            <Magnetic cursor="link">
              <Link
                to="/contact"
                className="rounded-full border border-ink/15 px-7 py-4 font-display text-sm font-semibold text-ink transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
              >
                {t.hero.build}
              </Link>
            </Magnetic>
          </div>
          </Container>
        </div>
      </div>

      <div
        ref={hintRef}
        className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-ink/40"
      >
        <span className="font-display text-[10px] uppercase tracking-[0.3em]">
          {t.hero.scroll}
        </span>
        <div ref={arrowRef}>
          <ArrowDown size={16} />
        </div>
      </div>
    </section>
  );
}
