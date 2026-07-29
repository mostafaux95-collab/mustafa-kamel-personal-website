import { useQuery } from "@tanstack/react-query";
import FadeIn from "@/components/ui/FadeIn";
import Container from "@/components/ui/Container";
import SplitReveal from "@/components/ui/SplitReveal";
import PortraitCard from "@/components/about/PortraitCard";
import ExperienceTimeline, { type ExperienceRole } from "@/components/experience/ExperienceTimeline";
import { useLang } from "@/lib/i18n";
import { fetchPublic, getAssetUrl } from "@/lib/api";

interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  roleAr: string | null;
  period: string;
  highlights: string[];
  highlightsAr: string[];
  logoUrl: string | null;
}

export default function About() {
  const { t, lang } = useLang();

  // Same backend-first-with-locale-fallback pattern as Cv.tsx's experience
  // timeline — this section renders the identical timeline on a different
  // page, so it needs the same real data rather than the hardcoded roles.
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
          logoUrl: getAssetUrl(item.logoUrl),
        }))
      : t.cv.roles;

  return (
    <section id="about" className="relative border-t border-ink/[0.06] py-32 sm:py-40">
      <Container>
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <FadeIn>
                <span className="font-display text-[13px] font-medium uppercase tracking-[0.25em] text-[var(--color-accent)]">
                  {t.aboutSection.eyebrow}
                </span>
              </FadeIn>
              <SplitReveal
                as="h2"
                type="lines"
                className="mt-6 font-display text-4xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl"
              >
                {t.aboutSection.title}
              </SplitReveal>
              <FadeIn delay={0.15}>
                <p className="mt-8 max-w-md text-[var(--color-ink-secondary)]">
                  {t.aboutSection.p1}
                </p>
                <p className="mt-4 max-w-md text-[var(--color-ink-secondary)]">
                  {t.aboutSection.p2}
                </p>
              </FadeIn>
              <FadeIn delay={0.25}>
                <PortraitCard className="mt-14 max-w-sm" />
              </FadeIn>
            </div>
          </div>

          <div className="lg:col-span-7">
            <ExperienceTimeline roles={roles} />
          </div>
        </div>
      </Container>
    </section>
  );
}
