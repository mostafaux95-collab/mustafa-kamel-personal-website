import { motion } from "framer-motion";
import Container from "@/components/ui/Container";
import FadeIn from "@/components/ui/FadeIn";
import SplitReveal from "@/components/ui/SplitReveal";
import { useLang } from "@/lib/i18n";

export default function Tools() {
  const { t } = useLang();

  return (
    <section className="relative border-t border-ink/[0.06] py-24 sm:py-32">
      <Container>
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <FadeIn>
              <span className="font-display text-[13px] font-medium uppercase tracking-[0.25em] text-[var(--color-accent)]">
                {t.tools.eyebrow}
              </span>
            </FadeIn>
            <SplitReveal
              as="h2"
              type="lines"
              className="mt-6 font-display text-3xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-4xl"
            >
              {t.tools.title}
            </SplitReveal>
          </div>
          <div className="flex flex-wrap gap-3 lg:col-span-8">
            {t.tools.items.map((tool, i) => (
              <FadeIn key={tool} delay={i * 0.04}>
                <motion.span
                  animate={{ y: [0, -5, 0] }}
                  transition={{
                    duration: 3.5 + (i % 4) * 0.7,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.2,
                  }}
                  whileHover={{ scale: 1.08 }}
                  className="inline-block cursor-default rounded-full border border-ink/10 bg-ink/[0.02] px-5 py-2.5 text-sm font-medium text-ink/85 transition-colors hover:border-[var(--color-accent)]/50 hover:text-ink"
                >
                  {tool}
                </motion.span>
              </FadeIn>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
