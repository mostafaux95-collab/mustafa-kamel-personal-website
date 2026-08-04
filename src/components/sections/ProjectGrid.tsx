import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ProjectCard from "@/components/sections/ProjectCard";
import { fetchPublic } from "@/lib/api";
import type { ApiProject } from "@/lib/projectsApi";
import { useLang } from "@/lib/i18n";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsapSetup";

/**
 * Filterable project list shared by the home Featured Work section and
 * the Work page. GSAP handles both the sliding tab indicator and the
 * out-then-in card transition on every filter change.
 *
 * Filter tabs are derived from whatever tag values actually exist across
 * the loaded projects, rather than a fixed list — adding a brand-new tag
 * to a project in the admin (e.g. "Fintech") makes its own tab appear
 * here automatically, no code change required. Tags are plain display
 * strings (not per-language keys), so they render as typed regardless
 * of site language — the same tradeoff free-text tags make anywhere.
 *
 * There's no "All" tab — one specific category is always active, defaulting
 * to the first tag once projects load.
 */
export default function ProjectGrid({ limit }: { limit?: number } = {}) {
  const { t, lang } = useLang();
  const [filter, setFilter] = useState<string>("");
  const [animating, setAnimating] = useState(false);
  const tabsRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const firstRun = useRef(true);

  const { data, isLoading } = useQuery({
    queryKey: ["public", "projects"],
    queryFn: () => fetchPublic<{ items: ApiProject[] }>("/projects?pageSize=100"),
  });
  const projects = data?.items ?? [];

  const filters = Array.from(new Set(projects.flatMap((p) => p.tags))).sort((a, b) =>
    a.localeCompare(b),
  );

  useEffect(() => {
    if (filters.length && !filters.includes(filter)) {
      setFilter(filters[0]);
    }
  }, [filters.join(), filter]);

  const filtered = filter ? projects.filter((p) => p.tags.includes(filter)) : [];
  const visible = limit ? filtered.slice(0, limit) : filtered;

  // Slide the pill indicator under the active tab
  useGSAP(
    () => {
      const active = tabsRef.current?.querySelector<HTMLButtonElement>(
        `[data-filter="${filter}"]`,
      );
      if (!active || !indicatorRef.current) return;
      gsap.to(indicatorRef.current, {
        left: active.offsetLeft,
        width: active.offsetWidth,
        duration: prefersReducedMotion() ? 0 : 0.45,
        ease: "power3.out",
      });
    },
    { scope: tabsRef, dependencies: [filter, lang, filters.join()] },
  );

  // Cards animate in whenever the filtered set changes
  useGSAP(
    () => {
      if (prefersReducedMotion() || !listRef.current) return;
      const items = listRef.current.children;
      if (!items.length) return;
      if (firstRun.current) {
        firstRun.current = false;
        gsap.from(items, {
          y: 48,
          autoAlpha: 0,
          duration: 0.9,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: listRef.current, start: "top 85%", once: true },
        });
      } else {
        gsap.fromTo(
          items,
          { y: 36, autoAlpha: 0, scale: 0.98 },
          { y: 0, autoAlpha: 1, scale: 1, duration: 0.7, stagger: 0.09, ease: "power3.out" },
        );
      }
    },
    { scope: listRef, dependencies: [filter] },
  );

  function changeFilter(next: string) {
    if (next === filter || animating) return;
    if (prefersReducedMotion() || !listRef.current?.children.length) {
      setFilter(next);
      return;
    }
    setAnimating(true);
    let applied = false;
    const apply = () => {
      if (applied) return;
      applied = true;
      setFilter(next);
      setAnimating(false);
    };
    gsap.to(listRef.current.children, {
      y: -24,
      autoAlpha: 0,
      scale: 0.985,
      duration: 0.32,
      stagger: 0.05,
      ease: "power2.in",
      onComplete: apply,
    });
    // rAF is frozen in hidden tabs, so GSAP's onComplete may never fire;
    // this guarantees the filter still applies.
    window.setTimeout(apply, 900);
  }

  return (
    <div>
      {/* A wrapping pill row breaks down on narrow screens — the sliding
          accent indicator is absolutely positioned assuming a single line,
          so a wrapped second/third row made it stretch across multiple
          rows of tabs instead of highlighting just the active one.
          Horizontal scroll (mobile's standard tab-list pattern) keeps it
          to one line at every width; desktop has room to wrap instead. */}
      <div className="relative mb-10 -mx-6 overflow-x-auto no-scrollbar sm:mx-0 sm:overflow-visible">
        <div
          ref={tabsRef}
          role="tablist"
          className="relative inline-flex flex-nowrap items-center gap-1 rounded-full border border-ink/10 bg-ink/[0.02] p-1.5 mx-6 sm:mx-0 sm:flex-wrap"
        >
          <span
            ref={indicatorRef}
            aria-hidden
            className="absolute top-1.5 bottom-1.5 rounded-full bg-[var(--color-accent)]"
            style={{ left: 6, width: 0 }}
          />
          {filters.map((key) => (
            <button
              key={key}
              data-filter={key}
              role="tab"
              aria-selected={filter === key}
              onClick={() => changeFilter(key)}
              data-cursor="link"
              className={`relative z-10 shrink-0 rounded-full px-5 py-2 font-display text-sm font-semibold transition-colors duration-300 ${
                filter === key ? "text-[#1a0f10]" : "text-ink/60 hover:text-ink"
              }`}
            >
              {key}
            </button>
          ))}
        </div>
      </div>

      {isLoading && (
        <p className="py-16 text-center text-sm text-[var(--color-ink-muted)]">
          {t.projectsSection.loading}
        </p>
      )}

      <div ref={listRef} className="flex flex-col gap-8 sm:gap-10">
        {visible.map((project, i) => (
          <div key={project.id}>
            <ProjectCard project={project} index={i} />
          </div>
        ))}
      </div>
    </div>
  );
}
