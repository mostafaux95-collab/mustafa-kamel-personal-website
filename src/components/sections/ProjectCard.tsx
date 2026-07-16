import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { ApiProject } from "@/lib/projectsApi";
import CountUp from "@/components/ui/CountUp";
import { getAssetUrl } from "@/lib/api";
import { useFinePointer, useReducedMotion } from "@/lib/useReducedMotion";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsapSetup";
import { useLang } from "@/lib/i18n";

export default function ProjectCard({ project, index }: { project: ApiProject; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);
  const isFine = useFinePointer();
  const reduced = useReducedMotion();
  const tiltEnabled = isFine && !reduced;
  const { lang } = useLang();
  const isAr = lang === "ar";

  const copy = {
    company: project.company,
    title: isAr && project.titleAr ? project.titleAr : project.title,
    tagline: isAr && project.taglineAr ? project.taglineAr : project.tagline,
    category: project.category,
    year: project.year,
    metrics: project.metrics.map((m) => ({
      value: m.value,
      label: isAr && m.labelAr ? m.labelAr : m.label,
    })),
  };
  const thumbnailSrc = getAssetUrl(project.thumbnailUrl);

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { damping: 20, stiffness: 200 });
  const sry = useSpring(ry, { damping: 20, stiffness: 200 });
  const scale = useSpring(1, { damping: 20, stiffness: 200 });

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        glowRef.current,
        { yPercent: -12 },
        {
          yPercent: 12,
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
      gsap.fromTo(
        numberRef.current,
        { yPercent: 40 },
        {
          yPercent: -40,
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    },
    { scope: ref },
  );

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!tiltEnabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    ry.set(px * 10);
    rx.set(py * -10);
  }

  function onLeave() {
    rx.set(0);
    ry.set(0);
    scale.set(1);
  }

  const body = (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseEnter={() => scale.set(1.015)}
      onMouseLeave={onLeave}
      style={{ rotateX: srx, rotateY: sry, scale, transformPerspective: 1200 }}
      className="group relative overflow-hidden rounded-3xl border border-ink/[0.08] bg-[var(--color-card)]"
    >
      <div
        className="relative h-[46vh] min-h-[320px] w-full overflow-hidden sm:h-[56vh]"
        style={{
          background: `linear-gradient(135deg, ${project.coverGradientFrom}, ${project.coverGradientTo})`,
        }}
      >
        {thumbnailSrc && (
          <img
            src={thumbnailSrc}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div
          ref={glowRef}
          className="absolute -inset-[15%] opacity-40 transition-transform duration-700 ease-out group-hover:scale-105"
          style={{
            backgroundImage:
              "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.25), transparent 45%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.15), transparent 40%)",
          }}
        />
        <div className="absolute inset-0 flex items-end justify-between p-8 sm:p-10">
          <span className="font-display text-[13px] font-medium uppercase tracking-[0.2em] text-white/80">
            {copy.category}
          </span>
          <span
            ref={numberRef}
            className="font-display text-6xl font-semibold text-white/15 sm:text-8xl"
          >
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
        <div className="absolute end-6 top-6 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-md opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 translate-x-2 sm:end-8 sm:top-8">
          <ArrowUpRight size={20} className="text-white rtl:-scale-x-100" />
        </div>
      </div>

      <div className="flex flex-col gap-8 p-8 sm:flex-row sm:items-end sm:justify-between sm:p-10">
        <div>
          <p className="font-display text-sm font-medium uppercase tracking-widest text-[var(--color-accent)]">
            {copy.company} · {copy.year}
          </p>
          <h3 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">
            {copy.title}
          </h3>
          <p className="mt-3 max-w-md text-[var(--color-ink-secondary)]">{copy.tagline}</p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-x-8 gap-y-4 sm:flex-col sm:text-end">
          {copy.metrics.map((m) => (
            <div key={m.label}>
              <CountUp
                value={m.value}
                className="font-display text-2xl font-semibold text-ink"
              />
              <div className="text-xs text-[var(--color-ink-muted)]">{m.label}</div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  if (!project.hasCaseStudy) {
    return <div data-cursor="view">{body}</div>;
  }

  return (
    <Link to={`/work/${project.slug}`} data-cursor="view" className="block">
      {body}
    </Link>
  );
}
