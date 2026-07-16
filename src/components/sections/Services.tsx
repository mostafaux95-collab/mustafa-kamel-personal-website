import { Compass, Layers, Sparkles } from "lucide-react";
import * as LucideIcons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Container from "@/components/ui/Container";
import FadeIn from "@/components/ui/FadeIn";
import SplitReveal from "@/components/ui/SplitReveal";
import { useLang } from "@/lib/i18n";
import { fetchPublic } from "@/lib/api";

const ICONS = [Compass, Layers, Sparkles];

interface ServiceItem {
  id: string;
  title: string;
  titleAr: string | null;
  body: string;
  bodyAr: string | null;
  icon: string | null;
}

function resolveIcon(name: string | null, fallback: LucideIcon): LucideIcon {
  if (!name) return fallback;
  const icon = (LucideIcons as unknown as Record<string, LucideIcon>)[name];
  return icon ?? fallback;
}

export default function Services() {
  const { t, lang } = useLang();

  const { data } = useQuery({
    queryKey: ["public", "services"],
    queryFn: () => fetchPublic<{ items: ServiceItem[] }>("/services?pageSize=20"),
  });
  const realServices = data?.items ?? [];
  const hasReal = realServices.length > 0;

  return (
    <section className="relative border-t border-ink/[0.06] py-32 sm:py-40">
      <Container>
        <FadeIn>
          <span className="font-display text-[13px] font-medium uppercase tracking-[0.25em] text-[var(--color-accent)]">
            {t.services.eyebrow}
          </span>
        </FadeIn>
        <SplitReveal
          as="h2"
          type="lines"
          className="mt-6 max-w-xl font-display text-4xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl"
        >
          {t.services.title}
        </SplitReveal>

        <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {hasReal
            ? realServices.map((service, i) => {
                const Icon = resolveIcon(service.icon, ICONS[i % ICONS.length]);
                const title = lang === "ar" && service.titleAr ? service.titleAr : service.title;
                const body = lang === "ar" && service.bodyAr ? service.bodyAr : service.body;
                return (
                  <FadeIn key={service.id} delay={i * 0.08}>
                    <div className="group relative h-full overflow-hidden rounded-3xl border border-ink/[0.08] bg-[var(--color-card)] p-8 transition-all duration-500 hover:-translate-y-1.5 hover:border-[var(--color-accent)]/40">
                      <div
                        aria-hidden
                        className="absolute -end-12 -top-12 h-36 w-36 rounded-full bg-[var(--color-primary-soft)] opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-25"
                      />
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-ink/10 bg-ink/[0.03] transition-colors duration-500 group-hover:border-[var(--color-accent)]/40">
                        <Icon
                          size={22}
                          className="text-[var(--color-accent)] transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      <h3 className="mt-6 font-display text-xl font-semibold text-ink">{title}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink-secondary)]">
                        {body}
                      </p>
                    </div>
                  </FadeIn>
                );
              })
            : t.services.items.map((service, i) => {
                const Icon = ICONS[i % ICONS.length];
                return (
                  <FadeIn key={service.title} delay={i * 0.08}>
                    <div className="group relative h-full overflow-hidden rounded-3xl border border-ink/[0.08] bg-[var(--color-card)] p-8 transition-all duration-500 hover:-translate-y-1.5 hover:border-[var(--color-accent)]/40">
                      <div
                        aria-hidden
                        className="absolute -end-12 -top-12 h-36 w-36 rounded-full bg-[var(--color-primary-soft)] opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-25"
                      />
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-ink/10 bg-ink/[0.03] transition-colors duration-500 group-hover:border-[var(--color-accent)]/40">
                        <Icon
                          size={22}
                          className="text-[var(--color-accent)] transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      <h3 className="mt-6 font-display text-xl font-semibold text-ink">
                        {service.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink-secondary)]">
                        {service.body}
                      </p>
                    </div>
                  </FadeIn>
                );
              })}
        </div>
      </Container>
    </section>
  );
}
