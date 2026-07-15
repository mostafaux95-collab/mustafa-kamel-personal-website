import { Navigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import Container from "@/components/ui/Container";
import FadeIn from "@/components/ui/FadeIn";
import GradientMesh from "@/components/ui/GradientMesh";
import SplitReveal from "@/components/ui/SplitReveal";
import CountUp from "@/components/ui/CountUp";
import CtaStrip from "@/components/ui/CtaStrip";
import Magnetic from "@/components/ui/Magnetic";
import Marquee from "@/components/ui/Marquee";
import { caseStudies } from "@/data/caseStudies";
import { caseStudiesAr } from "@/data/caseStudies.ar";
import { usePageTitle } from "@/lib/usePageTitle";
import { useLang } from "@/lib/i18n";

export default function CaseStudy() {
  const { slug } = useParams();
  const { lang, t } = useLang();
  const data = slug ? (lang === "ar" ? caseStudiesAr : caseStudies)[slug] : undefined;
  usePageTitle(data?.title);

  if (!data) return <Navigate to="/" replace />;

  return (
    <>
      <Nav />
      <main>
        <section
          className="relative flex min-h-[80vh] flex-col justify-end overflow-hidden pb-20 pt-40"
          style={{ background: `linear-gradient(160deg, ${data.coverFrom}, var(--color-bg) 70%)` }}
        >
          <GradientMesh className="opacity-60" />
          <Container className="relative">
            <Magnetic cursor="link">
              <Link
                to="/work"
                className="mb-10 inline-flex items-center gap-2 font-display text-sm font-medium text-ink/70 hover:text-ink"
              >
                <ArrowLeft size={16} className="rtl:-scale-x-100" />
                {t.caseStudy.back}
              </Link>
            </Magnetic>
            <p className="font-display text-[13px] font-medium uppercase tracking-[0.25em] text-[var(--color-accent)]">
              {data.company} · {data.timeline}
            </p>
            <SplitReveal
              as="h1"
              type="chars"
              immediate
              delay={0.2}
              className="mt-6 max-w-3xl font-display text-6xl font-semibold leading-[1.08] tracking-tight text-ink sm:text-7xl"
            >
              {data.title}
            </SplitReveal>
            <p className="mt-8 max-w-xl text-lg text-[var(--color-ink-secondary)]">
              {data.overview}
            </p>
            <div className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
              <div>
                <div className="text-xs uppercase tracking-widest text-[var(--color-ink-muted)]">
                  {t.caseStudy.role}
                </div>
                <div className="mt-1 font-display text-ink">{data.role}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-[var(--color-ink-muted)]">
                  {t.caseStudy.team}
                </div>
                <div className="mt-1 font-display text-ink">{data.team}</div>
              </div>
            </div>
          </Container>
        </section>

        <section className="border-t border-ink/[0.06] py-32 sm:py-40">
          <Container>
            <div className="flex flex-col gap-24 sm:gap-32">
              {data.chapters.map((chapter) => (
                <div key={chapter.id} className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                  <FadeIn className="lg:col-span-3">
                    <span className="font-display text-sm text-[var(--color-ink-muted)]">
                      {chapter.label}
                    </span>
                    <h2 className="mt-2 font-display text-3xl font-semibold text-ink">
                      {chapter.title}
                    </h2>
                  </FadeIn>
                  <FadeIn delay={0.1} className="flex flex-col gap-5 lg:col-span-8 lg:col-start-5">
                    {chapter.body.map((p, i) => (
                      <p
                        key={i}
                        className="max-w-2xl text-lg leading-relaxed text-[var(--color-ink-secondary)]"
                      >
                        {p}
                      </p>
                    ))}
                  </FadeIn>
                </div>
              ))}
            </div>
          </Container>
        </section>

        <section className="border-t border-ink/[0.06] py-32 sm:py-40">
          <Container>
            <FadeIn className="mb-16">
              <span className="font-display text-[13px] font-medium uppercase tracking-[0.25em] text-[var(--color-accent)]">
                {t.caseStudy.gallery}
              </span>
              <h2 className="mt-6 font-display text-4xl font-semibold text-ink">
                {t.caseStudy.finalUi}
              </h2>
            </FadeIn>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {data.gallery.map((g, i) => (
                <FadeIn key={g.title} delay={i * 0.06}>
                  <div
                    className="flex aspect-4/3 items-end rounded-2xl border border-ink/[0.08] p-6"
                    style={{ background: `linear-gradient(135deg, ${g.from}, ${g.to})` }}
                  >
                    <span className="font-display text-sm font-medium text-white/85">
                      {g.title}
                    </span>
                  </div>
                </FadeIn>
              ))}
            </div>
          </Container>
        </section>

        <section className="border-t border-ink/[0.06] py-32 sm:py-40">
          <Container>
            <FadeIn>
              <span className="font-display text-[13px] font-medium uppercase tracking-[0.25em] text-[var(--color-accent)]">
                {t.caseStudy.impact}
              </span>
            </FadeIn>
            <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-3">
              {data.impact.map((m, i) => (
                <FadeIn key={m.label} delay={i * 0.08}>
                  <CountUp
                    value={m.value}
                    className="font-display text-5xl font-semibold text-ink"
                  />
                  <div className="mt-2 text-sm text-[var(--color-ink-muted)]">{m.label}</div>
                </FadeIn>
              ))}
            </div>
            <FadeIn delay={0.2} className="mt-16 max-w-2xl">
              <h3 className="font-display text-2xl font-semibold text-ink">
                {t.caseStudy.reflection}
              </h3>
              <p className="mt-4 text-lg leading-relaxed text-[var(--color-ink-secondary)]">
                {data.reflection}
              </p>
            </FadeIn>
          </Container>
        </section>
        <Marquee reverse items={t.marqueeBottom} />
        <CtaStrip headline={t.cta.caseStudy} />
      </main>
      <Footer />
    </>
  );
}
