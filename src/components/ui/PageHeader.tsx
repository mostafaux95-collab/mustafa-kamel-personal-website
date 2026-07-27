import { lazy, Suspense } from "react";
import Container from "@/components/ui/Container";
import FadeIn from "@/components/ui/FadeIn";
import SplitReveal from "@/components/ui/SplitReveal";
import { useReducedMotion } from "@/lib/useReducedMotion";
import type { ShapeVariant } from "@/components/three/PageShape";

const PageShape = lazy(() => import("@/components/three/PageShape"));

export default function PageHeader({
  eyebrow,
  title,
  sub,
  scene,
}: {
  eyebrow: string;
  title: string;
  sub?: string;
  scene?: ShapeVariant;
}) {
  const reduced = useReducedMotion();

  return (
    <section className="relative overflow-hidden pt-40 pb-20 sm:pb-24">
      {scene && !reduced && (
        <div
          aria-hidden
          // Positioned flush at the edge and true-centered, matching the
          // home hero's HeroScene treatment — previously this sat at
          // -end-16 (pushed 64px past the edge) with an off-center
          // -translate-y-1/3, cramping it and cutting more of it off
          // than the home page's version.
          className="pointer-events-none absolute end-0 top-1/2 hidden h-[460px] w-[460px] -translate-y-1/2 opacity-70 lg:block"
        >
          <Suspense fallback={null}>
            <PageShape variant={scene} />
          </Suspense>
        </div>
      )}
      <Container className="relative">
        <FadeIn>
          <span className="font-display text-[13px] font-medium uppercase tracking-[0.25em] text-[var(--color-accent)]">
            {eyebrow}
          </span>
        </FadeIn>
        <SplitReveal
          as="h1"
          type="lines"
          immediate
          delay={0.15}
          className="mt-6 max-w-3xl font-display text-5xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-6xl lg:text-7xl"
        >
          {title}
        </SplitReveal>
        {sub && (
          <FadeIn delay={0.3}>
            <p className="mt-6 max-w-xl text-lg text-[var(--color-ink-secondary)]">{sub}</p>
          </FadeIn>
        )}
      </Container>
    </section>
  );
}
