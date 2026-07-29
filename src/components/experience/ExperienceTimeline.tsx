import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsapSetup";
import { COMPANY_LOGOS } from "@/data/companyLogos";

export interface ExperienceRole {
  company: string;
  url?: string;
  note?: string;
  title: string;
  period: string;
  points: string[];
  logoUrl?: string;
}

export default function ExperienceTimeline({ roles }: { roles: ExperienceRole[] }) {
  const timelineRef = useRef<HTMLOListElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: timelineRef.current,
            start: "top 75%",
            end: "bottom 60%",
            scrub: true,
          },
        },
      );

      const items = timelineRef.current?.querySelectorAll("[data-role]");
      items?.forEach((item) => {
        gsap.from(item, {
          y: 48,
          autoAlpha: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: item, start: "top 85%", once: true },
        });
        const logo = item.querySelector("[data-logo]");
        if (logo) {
          gsap.from(logo, {
            scale: 0.2,
            rotate: -15,
            duration: 0.7,
            ease: "back.out(2)",
            scrollTrigger: { trigger: item, start: "top 85%", once: true },
          });
        }
        gsap.from(item.querySelectorAll("li"), {
          x: document.documentElement.dir === "rtl" ? 24 : -24,
          autoAlpha: 0,
          duration: 0.6,
          stagger: 0.06,
          ease: "power2.out",
          scrollTrigger: { trigger: item, start: "top 80%", once: true },
        });
      });
    },
    { scope: timelineRef, dependencies: [roles], revertOnUpdate: true },
  );

  return (
    <ol ref={timelineRef} className="relative space-y-16 ps-8 sm:ps-12">
      <span aria-hidden className="absolute start-0 top-0 h-full w-px bg-ink/[0.08]" />
      <span
        ref={lineRef}
        aria-hidden
        className="absolute start-0 top-0 h-full w-px origin-top bg-[var(--color-accent)]"
      />
      {roles.map((role, i) => {
        const fallbackLogo = COMPANY_LOGOS[i % COMPANY_LOGOS.length];
        const nameBlock = (
          <span className="inline-flex items-center gap-3">
            {role.logoUrl ? (
              <img
                src={role.logoUrl}
                alt=""
                data-logo
                className="h-10 w-10 shrink-0 rounded-xl object-cover shadow-md sm:h-11 sm:w-11"
              />
            ) : (
              <span
                data-logo
                aria-hidden
                className="flex h-10 w-10 items-center justify-center rounded-xl font-display text-base font-bold shadow-md sm:h-11 sm:w-11"
                style={{ backgroundColor: fallbackLogo.bg, color: fallbackLogo.fg }}
              >
                {fallbackLogo.initial}
              </span>
            )}
            {role.company}
          </span>
        );
        return (
          <li key={role.company + role.period} data-role className="relative">
            <span className="absolute -start-[calc(2rem+5px)] top-3 h-2.5 w-2.5 rounded-full bg-[var(--color-accent)] ring-4 ring-[var(--color-bg)] sm:-start-[calc(3rem+5px)]" />
            <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1">
              <h3 className="font-display text-2xl font-semibold text-ink">
                {role.url ? (
                  <a
                    href={role.url}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor="link"
                    className="group/link inline-flex items-center gap-2 transition-colors hover:text-[var(--color-accent)]"
                  >
                    {nameBlock}
                    <ArrowUpRight
                      size={18}
                      className="text-ink/30 transition-all group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5 group-hover/link:text-[var(--color-accent)] rtl:-scale-x-100"
                    />
                  </a>
                ) : (
                  nameBlock
                )}
                {role.note && (
                  <span className="ms-3 rounded-full border border-[var(--color-accent)]/40 bg-[var(--color-accent)]/10 px-3 py-0.5 align-middle font-display text-xs font-medium text-[var(--color-accent)]">
                    {role.note}
                  </span>
                )}
              </h3>
              <span className="font-display text-sm text-[var(--color-ink-muted)]">
                {role.period}
              </span>
            </div>
            <p className="mt-2 font-display text-sm font-medium text-[var(--color-ink-secondary)]">
              {role.title}
            </p>
            <ul className="mt-5 space-y-2.5">
              {role.points.map((point) => (
                <li
                  key={point}
                  className="flex gap-3 text-[15px] leading-relaxed text-[var(--color-ink-secondary)]"
                >
                  <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-[var(--color-accent)]/60" />
                  {point}
                </li>
              ))}
            </ul>
          </li>
        );
      })}
    </ol>
  );
}
