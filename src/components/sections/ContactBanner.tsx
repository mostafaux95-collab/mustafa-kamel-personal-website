import { Link } from "react-router-dom";
import { ArrowUpRight, Mail } from "lucide-react";
import Container from "@/components/ui/Container";
import FadeIn from "@/components/ui/FadeIn";
import Magnetic from "@/components/ui/Magnetic";
import { useLang } from "@/lib/i18n";

export default function ContactBanner() {
  const { t } = useLang();

  return (
    <section className="border-t border-ink/[0.06] py-16 sm:py-24 lg:py-32">
      <Container>
        <FadeIn>
          <div className="relative overflow-hidden rounded-3xl border border-ink/[0.08] bg-[var(--color-card)] p-6 sm:rounded-[2rem] sm:p-10 lg:p-14">
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

            <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center lg:gap-10">
              <div className="flex items-start gap-4 sm:items-center sm:gap-5">
                <span className="relative shrink-0">
                  <img
                    src="/portrait.jpg"
                    alt={t.brand}
                    className="h-14 w-14 rounded-full border-2 border-ink/15 object-cover object-top sm:h-16 sm:w-16 lg:h-20 lg:w-20"
                  />
                  <span className="absolute -bottom-0.5 -end-0.5 h-3.5 w-3.5 rounded-full bg-emerald-400 ring-4 ring-[var(--color-card)]" />
                </span>
                <div>
                  <span className="font-display text-[10px] font-medium uppercase tracking-widest text-emerald-400 sm:text-[11px]">
                    {t.banner.available}
                  </span>
                  <h2 className="mt-2 font-display text-xl font-semibold leading-tight text-ink sm:text-2xl lg:text-3xl">
                    {t.banner.title}
                  </h2>
                  <p className="mt-2 max-w-md text-sm text-[var(--color-ink-secondary)]">
                    {t.banner.sub}
                  </p>
                </div>
              </div>

              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
                <Magnetic cursor="link" className="w-full sm:w-auto">
                  <a
                    href="mailto:hi@mustafakamel.com"
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-[#331C48] px-6 py-3.5 font-display text-sm font-semibold text-white sm:w-auto sm:justify-start"
                  >
                    <Mail size={15} />
                    hi@mustafakamel.com
                  </a>
                </Magnetic>
                <Magnetic cursor="view" className="w-full sm:w-auto">
                  <Link
                    to="/contact"
                    className="btn-shine group flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-accent)] px-6 py-3.5 font-display text-sm font-semibold text-[#1a0f10] sm:w-auto sm:justify-start"
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
