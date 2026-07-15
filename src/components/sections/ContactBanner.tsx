import { Link } from "react-router-dom";
import { ArrowUpRight, Mail } from "lucide-react";
import Container from "@/components/ui/Container";
import FadeIn from "@/components/ui/FadeIn";
import Magnetic from "@/components/ui/Magnetic";
import { useLang } from "@/lib/i18n";

export default function ContactBanner() {
  const { t } = useLang();

  return (
    <section className="border-t border-ink/[0.06] py-24 sm:py-32">
      <Container>
        <FadeIn>
          <div className="relative overflow-hidden rounded-[2rem] border border-ink/[0.08] bg-[var(--color-card)] p-10 sm:p-14">
            <div
              aria-hidden
              className="pointer-events-none absolute -end-24 -top-24 h-72 w-72 rounded-full opacity-25 blur-[100px]"
              style={{ background: "var(--color-primary-soft)" }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-24 -start-24 h-72 w-72 rounded-full opacity-20 blur-[100px]"
              style={{ background: "var(--color-accent)" }}
            />

            <div className="relative flex flex-col items-start justify-between gap-10 lg:flex-row lg:items-center">
              <div className="flex items-start gap-5 sm:items-center">
                <span className="relative shrink-0">
                  <img
                    src="/portrait.jpg"
                    alt={t.brand}
                    className="h-16 w-16 rounded-full border-2 border-ink/15 object-cover object-top sm:h-20 sm:w-20"
                  />
                  <span className="absolute -bottom-0.5 -end-0.5 h-3.5 w-3.5 rounded-full bg-emerald-400 ring-4 ring-[var(--color-card)]" />
                </span>
                <div>
                  <span className="font-display text-[11px] font-medium uppercase tracking-widest text-emerald-400">
                    {t.banner.available}
                  </span>
                  <h2 className="mt-2 font-display text-2xl font-semibold leading-tight text-ink sm:text-3xl">
                    {t.banner.title}
                  </h2>
                  <p className="mt-2 max-w-md text-sm text-[var(--color-ink-secondary)]">
                    {t.banner.sub}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <Magnetic cursor="link">
                  <a
                    href="mailto:hi@mustafakamel.com"
                    className="flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 font-display text-sm font-semibold text-bg"
                  >
                    <Mail size={15} />
                    hi@mustafakamel.com
                  </a>
                </Magnetic>
                <Magnetic cursor="view">
                  <Link
                    to="/contact"
                    className="btn-shine group flex items-center gap-2 rounded-full bg-[var(--color-accent)] px-6 py-3.5 font-display text-sm font-semibold text-[#1a0f10]"
                  >
                    {t.banner.talk}
                    <ArrowUpRight
                      size={15}
                      className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:-scale-x-100"
                    />
                  </Link>
                </Magnetic>
              </div>
            </div>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
