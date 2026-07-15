import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import Container from "@/components/ui/Container";
import FadeIn from "@/components/ui/FadeIn";
import Magnetic from "@/components/ui/Magnetic";
import RippleButton from "@/components/playground/RippleButton";
import ElasticSlider from "@/components/playground/ElasticSlider";
import SpringToggle from "@/components/playground/SpringToggle";
import ReorderChips from "@/components/playground/ReorderChips";
import SpotlightReveal from "@/components/playground/SpotlightReveal";

function Demo({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <FadeIn className="rounded-3xl border border-ink/[0.08] bg-[var(--color-card)] p-8">
      <h3 className="font-display text-lg font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-sm text-[var(--color-ink-secondary)]">{description}</p>
      <div className="mt-8 flex min-h-32 items-center justify-center">{children}</div>
    </FadeIn>
  );
}

export default function Playground() {
  return (
    <>
      <Nav />
      <main className="pt-40 pb-32">
        <Container>
          <FadeIn>
            <span className="font-display text-[13px] font-medium uppercase tracking-[0.25em] text-[var(--color-accent)]">
              Playground
            </span>
            <h1 className="mt-6 max-w-2xl font-display text-5xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-6xl">
              Small interactions, taken seriously
            </h1>
            <p className="mt-6 max-w-xl text-lg text-[var(--color-ink-secondary)]">
              A sandbox for the micro-interaction details that don't fit in a case study.
              Everything below is live - drag it, click it, break it.
            </p>
          </FadeIn>

          <div className="mt-20 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Demo title="Magnetic pull, three strengths" description="Hover each button and feel the difference in magnetic strength.">
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Magnetic cursor="link" strength={0.15}>
                  <button className="rounded-full border border-ink/15 px-5 py-2.5 text-sm font-medium text-ink">
                    Subtle
                  </button>
                </Magnetic>
                <Magnetic cursor="link" strength={0.35}>
                  <button className="rounded-full border border-ink/15 px-5 py-2.5 text-sm font-medium text-ink">
                    Default
                  </button>
                </Magnetic>
                <Magnetic cursor="link" strength={0.6}>
                  <button className="rounded-full border border-ink/15 px-5 py-2.5 text-sm font-medium text-ink">
                    Strong
                  </button>
                </Magnetic>
              </div>
            </Demo>

            <Demo title="Ripple on click" description="A tactile click response using an expanding, fading ripple.">
              <RippleButton />
            </Demo>

            <Demo title="Elastic drag slider" description="The thumb stretches under drag velocity, then springs back.">
              <ElasticSlider />
            </Demo>

            <Demo title="Spring toggle" description="A physically-animated switch instead of an instant snap.">
              <SpringToggle />
            </Demo>

            <Demo title="Drag to reorder" description="Reorder a design process using Framer Motion's layout animations.">
              <ReorderChips />
            </Demo>

            <Demo title="Cursor spotlight" description="A hidden message revealed only where the cursor travels.">
              <SpotlightReveal />
            </Demo>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
