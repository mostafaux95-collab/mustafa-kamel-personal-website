import { Navigate, useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
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
import { fetchPublic, getAssetUrl } from "@/lib/api";
import type { ApiProject } from "@/lib/projectsApi";
import { usePageTitle } from "@/lib/usePageTitle";
import { useLang } from "@/lib/i18n";

export default function CaseStudy() {
  const { slug } = useParams();
  const { lang, t } = useLang();
  const isAr = lang === "ar";

  const { data: project, isLoading, isError } = useQuery({
    queryKey: ["public", "project", slug],
    queryFn: () => fetchPublic<ApiProject>(`/projects/${slug}`),
    enabled: Boolean(slug),
    retry: false,
  });

  usePageTitle(project ? (isAr && project.titleAr ? project.titleAr : project.title) : undefined);

  if (!slug) return <Navigate to="/work" replace />;
  if (isError) return <Navigate to="/work" replace />;
  if (isLoading || !project) return null;

  const title = isAr && project.titleAr ? project.titleAr : project.title;
  const tagline = isAr && project.taglineAr ? project.taglineAr : project.tagline;
  const role = isAr && project.roleAr ? project.roleAr : project.role;
  const challenge = isAr && project.challengeAr ? project.challengeAr : project.challenge;
  const solution = isAr && project.solutionAr ? project.solutionAr : project.solution;
  const coverSrc = getAssetUrl(project.coverImageUrl);

  return (
    <>
      <Nav />
      <main>
        <section
          className="relative flex min-h-[80vh] flex-col justify-end overflow-hidden pb-20 pt-40"
          style={
            coverSrc
              ? { backgroundImage: `url(${coverSrc})`, backgroundSize: "cover", backgroundPosition: "center" }
              : { background: `linear-gradient(160deg, ${project.coverGradientFrom}, var(--color-bg) 70%)` }
          }
        >
          {coverSrc && <div className="absolute inset-0 bg-[var(--color-bg)]/70" aria-hidden />}
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
              {project.company} · {project.year}
            </p>
            <SplitReveal
              as="h1"
              type="chars"
              immediate
              delay={0.2}
              className="mt-6 max-w-3xl font-display text-6xl font-semibold leading-[1.08] tracking-tight text-ink sm:text-7xl"
            >
              {title}
            </SplitReveal>
            <p className="mt-8 max-w-xl text-lg text-[var(--color-ink-secondary)]">{tagline}</p>
            <div className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
              <div>
                <div className="text-xs uppercase tracking-widest text-[var(--color-ink-muted)]">
                  {t.caseStudy.role}
                </div>
                <div className="mt-1 font-display text-ink">{role}</div>
              </div>
            </div>
          </Container>
        </section>

        <section className="border-t border-ink/[0.06] py-32 sm:py-40">
          <Container>
            <div className="flex flex-col gap-24 sm:gap-32">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                <FadeIn className="lg:col-span-3">
                  <h2 className="font-display text-3xl font-semibold text-ink">
                    {t.caseStudy.challenge}
                  </h2>
                </FadeIn>
                <FadeIn delay={0.1} className="flex flex-col gap-5 lg:col-span-8 lg:col-start-5">
                  <p className="max-w-2xl text-lg leading-relaxed text-[var(--color-ink-secondary)]">
                    {challenge}
                  </p>
                </FadeIn>
              </div>

              <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                <FadeIn className="lg:col-span-3">
                  <h2 className="font-display text-3xl font-semibold text-ink">
                    {t.caseStudy.solution}
                  </h2>
                </FadeIn>
                <FadeIn delay={0.1} className="flex flex-col gap-5 lg:col-span-8 lg:col-start-5">
                  <p className="max-w-2xl text-lg leading-relaxed text-[var(--color-ink-secondary)]">
                    {solution}
                  </p>
                </FadeIn>
              </div>
            </div>
          </Container>
        </section>

        {project.galleryUrls.length > 0 && (
          <section className="border-t border-ink/[0.06] py-32 sm:py-40">
            <Container>
              <FadeIn className="mb-16">
                <span className="font-display text-[13px] font-medium uppercase tracking-[0.25em] text-[var(--color-accent)]">
                  {t.caseStudy.gallery}
                </span>
              </FadeIn>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {project.galleryUrls.map((url, i) => (
                  <FadeIn key={url} delay={i * 0.06}>
                    <img
                      src={getAssetUrl(url)}
                      alt=""
                      className="aspect-4/3 w-full rounded-2xl border border-ink/[0.08] object-cover"
                    />
                  </FadeIn>
                ))}
              </div>
            </Container>
          </section>
        )}

        {project.metrics.length > 0 && (
          <section className="border-t border-ink/[0.06] py-32 sm:py-40">
            <Container>
              <FadeIn>
                <span className="font-display text-[13px] font-medium uppercase tracking-[0.25em] text-[var(--color-accent)]">
                  {t.caseStudy.impact}
                </span>
              </FadeIn>
              <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-3">
                {project.metrics.map((m, i) => (
                  <FadeIn key={`${m.label}-${i}`} delay={i * 0.08}>
                    <CountUp value={m.value} className="font-display text-5xl font-semibold text-ink" />
                    <div className="mt-2 text-sm text-[var(--color-ink-muted)]">
                      {isAr && m.labelAr ? m.labelAr : m.label}
                    </div>
                  </FadeIn>
                ))}
              </div>
            </Container>
          </section>
        )}

        {project.techStack.length > 0 && (
          <section className="border-t border-ink/[0.06] py-32 sm:py-40">
            <Container>
              <FadeIn>
                <span className="font-display text-[13px] font-medium uppercase tracking-[0.25em] text-[var(--color-accent)]">
                  {t.caseStudy.techStack}
                </span>
              </FadeIn>
              <div className="mt-8 flex flex-wrap gap-3">
                {project.techStack.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-ink/[0.1] bg-ink/[0.03] px-4 py-2 text-sm text-ink/70"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </Container>
          </section>
        )}

        <Marquee items={t.marqueeBottom} />
        <CtaStrip headline={t.cta.caseStudy} />
      </main>
      <Footer />
    </>
  );
}
