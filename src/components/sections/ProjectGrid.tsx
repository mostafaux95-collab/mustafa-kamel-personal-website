import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ProjectCard from "@/components/sections/ProjectCard";
import { fetchPublic } from "@/lib/api";
import type { ApiProject } from "@/lib/projectsApi";
import { useLang } from "@/lib/i18n";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsapSetup";

type FilterKey = "all" | "saas" | "ecommerce" | "fnb";
const FILTERS: FilterKey[] = ["all", "saas", "ecommerce", "fnb"];

/**
 * Filterable project list shared by the home Featured Work section and
 * the Work page. GSAP handles both the sliding tab indicator and the
 * out-then-in card transition on every filter change.
 */
export default function ProjectGrid() {
  const { t, lang } = useLang();
  const [filter, setFilter] = useState<FilterKey>("all");
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

  const visible = filter === "all" ? projects : projects.filter((p) => p.tags.includes(filter));

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
    { scope: tabsRef, dependencies: [filter, lang] },
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

  function changeFilter(next: FilterKey) {
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
      <div
        ref={tabsRef}
        role="tablist"
        className="relative mb-10 inline-flex flex-wrap items-center gap-1 rounded-full border border-ink/10 bg-ink/[0.02] p-1.5"
      >
        <span
          ref={indicatorRef}
          aria-hidden
          className="absolute top-1.5 bottom-1.5 rounded-full bg-[var(--color-accent)]"
          style={{ left: 6, width: 0 }}
        />
        {FILTERS.map((key) => (
          <button
            key={key}
            data-filter={key}
            role="tab"
            aria-selected={filter === key}
            onClick={() => changeFilter(key)}
            data-cursor="link"
            className={`relative z-10 rounded-full px-5 py-2 font-display text-sm font-semibold transition-colors duration-300 ${
              filter === key ? "text-[#1a0f10]" : "text-ink/60 hover:text-ink"
            }`}
          >
            {t.projectsSection.filters[key]}
          </button>
        ))}
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
