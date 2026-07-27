import { lazy, Suspense, useRef } from "react";
import { Download, GraduationCap, Languages } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import Container from "@/components/ui/Container";
import GsapFade from "@/components/ui/GsapFade";
import SplitReveal from "@/components/ui/SplitReveal";
import Magnetic from "@/components/ui/Magnetic";
import CountUp from "@/components/ui/CountUp";
import CtaStrip from "@/components/ui/CtaStrip";
import Marquee from "@/components/ui/Marquee";
import ContactBanner from "@/components/sections/ContactBanner";
import ExperienceTimeline, { type ExperienceRole } from "@/components/experience/ExperienceTimeline";
import CertificatesSlider from "@/components/cv/CertificatesSlider";
import { usePageTitle } from "@/lib/usePageTitle";
import { useLang } from "@/lib/i18n";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsapSetup";
import { useStaggerReveal } from "@/lib/useStaggerReveal";
import { fetchPublic, getAssetUrl } from "@/lib/api";

interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  roleAr: string | null;
  period: string;
  summary: string;
  summaryAr: string | null;
  highlights: string[];
  highlightsAr: string[];
}

interface EducationItem {
  id: string;
  degree: string;
  degreeAr: string | null;
  school: string;
  schoolAr: string | null;
  years: string;
}

interface LanguageItem {
  id: string;
  name: string;
  nameAr: string | null;
  level: string;
  levelAr: string | null;
}

interface CvStat {
  value: string;
  label: string;
  labelAr: string;
}

interface CvSettingsValue {
  profile: string;
  profileAr: string;
  stats: CvStat[];
  skills: string[];
  skillsAr: string[];
  tools: string[];
  toolsAr: string[];
  resumeUrl: string;
}

interface SiteSettingRow {
  key: string;
  value: unknown;
}

const PageShape = lazy(() => import("@/components/three/PageShape"));

const CV_FILE = "/Mustafa-Kamel-CV-2026.pdf";

function DownloadButton({ label, note, href }: { label: string; note: string; href?: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const iconRef = useRef<HTMLSpanElement>(null);
  const { contextSafe } = useGSAP({ scope: ref });

  const onEnter = contextSafe(() => {
    if (prefersReducedMotion()) return;
    // arrow dips like a file dropping into a tray, then springs back
    gsap
      .timeline()
      .to(iconRef.current, { y: 7, duration: 0.18, ease: "power2.in" })
      .to(iconRef.current, { y: 0, duration: 0.45, ease: "elastic.out(1.4, 0.5)" });
  });

  return (
    <Magnetic cursor="view" strength={0.45}>
      <a
        ref={ref}
        href={href ?? CV_FILE}
        download="Mustafa Kamel CV 2026.pdf"
        onMouseEnter={onEnter}
        className="btn-shine group inline-flex items-center gap-3 rounded-full bg-[var(--color-accent)] px-8 py-4 font-display text-sm font-semibold text-[#1a0f10]"
      >
        <span ref={iconRef} className="inline-flex">
          <Download size={17} />
        </span>
        {label}
        <span className="text-xs font-medium opacity-60">{note}</span>
      </a>
    </Magnetic>
  );
}

export default function Cv() {
  const { t, lang } = useLang();
  const reduced = useReducedMotion();
  usePageTitle(t.nav.cv);

  const { data: experienceData } = useQuery({
    queryKey: ["public", "experience"],
    queryFn: () => fetchPublic<{ items: ExperienceItem[] }>("/experience?pageSize=50"),
  });
  const realExperience = experienceData?.items ?? [];
  const roles: ExperienceRole[] =
    realExperience.length > 0
      ? realExperience.map((item) => ({
          company: item.company,
          title: lang === "ar" && item.roleAr ? item.roleAr : item.role,
          period: item.period,
          points:
            lang === "ar" && item.highlightsAr.length > 0 ? item.highlightsAr : item.highlights,
        }))
      : t.cv.roles;

  const { data: educationData } = useQuery({
    queryKey: ["public", "education"],
    queryFn: () => fetchPublic<{ items: EducationItem[] }>("/education?pageSize=20"),
  });
  const realEducation = educationData?.items ?? [];

  const { data: languageData } = useQuery({
    queryKey: ["public", "languages"],
    queryFn: () => fetchPublic<{ items: LanguageItem[] }>("/languages?pageSize=20"),
  });
  const realLanguages = languageData?.items ?? [];

  const { data: settings } = useQuery({
    queryKey: ["public", "settings"],
    queryFn: () => fetchPublic<SiteSettingRow[]>("/settings"),
  });
  const cvSettings = settings?.find((s) => s.key === "cv")?.value as CvSettingsValue | undefined;

  const profile = cvSettings?.profile
    ? lang === "ar" && cvSettings.profileAr
      ? cvSettings.profileAr
      : cvSettings.profile
    : t.cv.profile;

  const stats =
    cvSettings?.stats && cvSettings.stats.length > 0
      ? cvSettings.stats.map((s) => ({
          value: s.value,
          label: lang === "ar" && s.labelAr ? s.labelAr : s.label,
        }))
      : t.cv.stats;

  const skillChips =
    lang === "ar" && cvSettings?.skillsAr && cvSettings.skillsAr.length > 0
      ? cvSettings.skillsAr
      : cvSettings?.skills && cvSettings.skills.length > 0
        ? cvSettings.skills
        : t.cv.skills;

  const toolChips =
    lang === "ar" && cvSettings?.toolsAr && cvSettings.toolsAr.length > 0
      ? cvSettings.toolsAr
      : cvSettings?.tools && cvSettings.tools.length > 0
        ? cvSettings.tools
        : t.cv.tools;

  const resumeHref = getAssetUrl(cvSettings?.resumeUrl) ?? CV_FILE;

  const headerRef = useRef<HTMLDivElement>(null);
  const statsRef = useStaggerReveal<HTMLDivElement>({ y: 40, stagger: 0.08 });
  const skillsRef = useStaggerReveal<HTMLDivElement>({
    y: 0,
    scale: 0.5,
    duration: 0.6,
    stagger: 0.05,
    ease: "back.out(2)",
  });
  const toolsRef = useStaggerReveal<HTMLDivElement>({
    y: 0,
    scale: 0.5,
    duration: 0.6,
    stagger: 0.05,
    ease: "back.out(2)",
  });
  const factsRef = useStaggerReveal<HTMLDivElement>({ y: 48, stagger: 0.12 });

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      // Header cascade
      if (headerRef.current) {
        gsap.from(headerRef.current.children, {
          y: 28,
          autoAlpha: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          delay: 0.15,
        });
      }
    },
    { dependencies: [t] },
  );

  return (
    <>
      <Nav />
      <main>
        {/* Header */}
        <section className="relative overflow-hidden pt-40 pb-20 sm:pb-24">
          {!reduced && (
            <div
              aria-hidden
              className="pointer-events-none absolute -end-16 top-1/2 hidden h-[460px] w-[460px] -translate-y-1/3 opacity-70 lg:block"
            >
              <Suspense fallback={null}>
                <PageShape variant="knot" />
              </Suspense>
            </div>
          )}
          <Container className="relative">
            <div ref={headerRef}>
              <span className="font-display text-[13px] font-medium uppercase tracking-[0.25em] text-[var(--color-accent)]">
                {t.cv.eyebrow}
              </span>
              <h1 className="mt-6 max-w-3xl font-display text-5xl font-semibold leading-[1.08] tracking-tight text-ink sm:text-6xl lg:text-7xl">
                {t.cv.title}
              </h1>
              <p className="mt-6 max-w-xl text-lg text-[var(--color-ink-secondary)]">{t.cv.sub}</p>
              <div className="mt-10">
                <DownloadButton label={t.cv.download} note={t.cv.downloadNote} href={resumeHref} />
              </div>
            </div>
          </Container>
        </section>

        {/* Profile */}
        <section className="border-t border-ink/[0.06] py-20 sm:py-24">
          <Container>
            <GsapFade>
              <span className="font-display text-[13px] font-medium uppercase tracking-[0.25em] text-[var(--color-accent)]">
                {t.cv.profileTitle}
              </span>
            </GsapFade>
            <SplitReveal
              as="p"
              type="lines"
              className="mt-6 max-w-3xl font-display text-2xl font-medium leading-relaxed text-ink sm:text-3xl"
            >
              {profile}
            </SplitReveal>
          </Container>
        </section>

        {/* Stats */}
        <section className="border-t border-ink/[0.06] py-16 sm:py-20">
          <Container>
            <div ref={statsRef} className="grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} data-reveal>
                  <CountUp
                    value={stat.value}
                    className="font-display text-5xl font-semibold text-ink sm:text-6xl"
                  />
                  <div className="mt-2 max-w-[200px] text-sm text-[var(--color-ink-muted)]">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Experience timeline */}
        <section className="border-t border-ink/[0.06] py-24 sm:py-32">
          <Container>
            <GsapFade>
              <span className="font-display text-[13px] font-medium uppercase tracking-[0.25em] text-[var(--color-accent)]">
                {t.cv.expTitle}
              </span>
            </GsapFade>
            <div className="mt-14">
              <ExperienceTimeline roles={roles} />
            </div>
          </Container>
        </section>

        {/* Education + Languages */}
        <section className="border-t border-ink/[0.06] py-20 sm:py-24">
          <Container>
            <div ref={factsRef} className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div
                data-reveal
                className="rounded-3xl border border-ink/[0.08] bg-[var(--color-card)] p-8"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-ink/10 bg-ink/[0.03]">
                  <GraduationCap size={22} className="text-[var(--color-accent)]" />
                </div>
                <h3 className="mt-6 font-display text-sm font-medium uppercase tracking-widest text-[var(--color-ink-muted)]">
                  {t.cv.eduTitle}
                </h3>
                {realEducation.length > 0 ? (
                  <div className="mt-2 space-y-4">
                    {realEducation.map((edu) => (
                      <div key={edu.id}>
                        <p className="font-display text-xl font-semibold text-ink">
                          {lang === "ar" && edu.degreeAr ? edu.degreeAr : edu.degree}
                        </p>
                        <p className="mt-1 text-sm text-[var(--color-ink-secondary)]">
                          {lang === "ar" && edu.schoolAr ? edu.schoolAr : edu.school} · {edu.years}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    <p className="mt-2 font-display text-xl font-semibold text-ink">{t.cv.eduDegree}</p>
                    <p className="mt-1 text-sm text-[var(--color-ink-secondary)]">
                      {t.cv.eduSchool} · {t.cv.eduYears}
                    </p>
                  </>
                )}
              </div>
              <div
                data-reveal
                className="rounded-3xl border border-ink/[0.08] bg-[var(--color-card)] p-8"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-ink/10 bg-ink/[0.03]">
                  <Languages size={22} className="text-[var(--color-accent)]" />
                </div>
                <h3 className="mt-6 font-display text-sm font-medium uppercase tracking-widest text-[var(--color-ink-muted)]">
                  {t.cv.langTitle}
                </h3>
                <div className="mt-2 space-y-1.5">
                  {(realLanguages.length > 0
                    ? realLanguages.map((l) => ({
                        name: lang === "ar" && l.nameAr ? l.nameAr : l.name,
                        level: lang === "ar" && l.levelAr ? l.levelAr : l.level,
                      }))
                    : t.cv.languages
                  ).map((l) => (
                    <p key={l.name} className="font-display text-lg font-semibold text-ink">
                      {l.name}{" "}
                      <span className="text-sm font-medium text-[var(--color-ink-muted)]">
                        · {l.level}
                      </span>
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Skills */}
        <section className="border-t border-ink/[0.06] py-20 sm:py-24">
          <Container>
            <GsapFade>
              <span className="font-display text-[13px] font-medium uppercase tracking-[0.25em] text-[var(--color-accent)]">
                {t.cv.skillsTitle}
              </span>
            </GsapFade>
            <div ref={skillsRef} className="mt-8 flex flex-wrap gap-3">
              {skillChips.map((skill) => (
                <span
                  key={skill}
                  data-reveal
                  className="rounded-full border border-ink/10 bg-ink/[0.02] px-5 py-2.5 text-sm font-medium text-ink/85 transition-colors hover:border-[var(--color-accent)]/50 hover:text-ink"
                >
                  {skill}
                </span>
              ))}
            </div>
          </Container>
        </section>

        {/* Tools */}
        <section className="border-t border-ink/[0.06] py-20 sm:py-24">
          <Container>
            <GsapFade>
              <span className="font-display text-[13px] font-medium uppercase tracking-[0.25em] text-[var(--color-accent)]">
                {t.cv.toolsTitle}
              </span>
            </GsapFade>
            <div ref={toolsRef} className="mt-8 flex flex-wrap gap-3">
              {toolChips.map((tool) => (
                <span
                  key={tool}
                  data-reveal
                  className="rounded-full border border-ink/10 bg-ink/[0.02] px-5 py-2.5 text-sm font-medium text-ink/85 transition-colors hover:border-[var(--color-accent)]/50 hover:text-ink"
                >
                  {tool}
                </span>
              ))}
            </div>
            <GsapFade delay={0.2}>
              <div className="mt-14">
                <DownloadButton label={t.cv.download} note={t.cv.downloadNote} href={resumeHref} />
              </div>
            </GsapFade>
          </Container>
        </section>

        <CertificatesSlider />

        <ContactBanner />
        <Marquee items={t.marqueeBottom} />
        <CtaStrip />
      </main>
      <Footer />
    </>
  );
}
