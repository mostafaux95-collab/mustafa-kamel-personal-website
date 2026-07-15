import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import Container from "@/components/ui/Container";
import FadeIn from "@/components/ui/FadeIn";
import SplitReveal from "@/components/ui/SplitReveal";
import { useLang } from "@/lib/i18n";

const ACCENTS = ["#432666", "#6a3f9c", "#F58963"];

export default function Testimonials() {
  const { t } = useLang();

  return (
    <section className="relative overflow-hidden border-t border-ink/[0.06] py-32 sm:py-40">
      <Container>
        <FadeIn className="mb-16 flex flex-col gap-4 sm:mb-20">
          <span className="font-display text-[13px] font-medium uppercase tracking-[0.25em] text-[var(--color-accent)]">
            {t.testimonials.eyebrow}
          </span>
          <SplitReveal
            as="h2"
            type="lines"
            className="mt-6 max-w-xl font-display text-4xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl"
          >
            {t.testimonials.title}
          </SplitReveal>
        </FadeIn>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {t.testimonials.items.map((item, i) => {
            const accent = ACCENTS[i % ACCENTS.length];
            return (
              <FadeIn key={item.company} delay={i * 0.08}>
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    duration: 7 + i,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.4,
                  }}
                  className="relative flex h-full flex-col gap-6 rounded-3xl border border-ink/[0.08] bg-ink/[0.03] p-8 backdrop-blur-xl"
                >
                  <div
                    className="absolute -end-10 -top-10 h-32 w-32 rounded-full opacity-20 blur-3xl"
                    style={{ background: accent }}
                    aria-hidden
                  />
                  <Quote className="text-ink/20 rtl:-scale-x-100" size={28} />
                  <p className="flex-1 text-[15px] italic leading-relaxed text-[var(--color-ink-secondary)]">
                    {item.quote}
                  </p>
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-dashed border-ink/20 text-xs text-ink/40"
                      style={{ background: `${accent}22` }}
                    >
                      +
                    </div>
                    <div>
                      <div className="text-sm font-medium text-ink/70">
                        {t.testimonials.addRole}
                      </div>
                      <div className="text-xs text-[var(--color-ink-muted)]">{item.company}</div>
                    </div>
                  </div>
                </motion.div>
              </FadeIn>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
