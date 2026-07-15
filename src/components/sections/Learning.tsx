import { motion } from "framer-motion";
import Container from "@/components/ui/Container";
import FadeIn from "@/components/ui/FadeIn";
import SplitReveal from "@/components/ui/SplitReveal";
import { useLang } from "@/lib/i18n";
import { useStaggerReveal } from "@/lib/useStaggerReveal";

export default function Learning() {
  const { t } = useLang();
  const chipsRef = useStaggerReveal<HTMLDivElement>({
    y: 0,
    scale: 0.5,
    duration: 0.7,
    stagger: 0.07,
    ease: "back.out(2.2)",
  });

  return (
    <section className="relative border-t border-ink/[0.06] py-24 sm:py-32">
      <Container>
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <FadeIn>
              <span className="font-display text-[13px] font-medium uppercase tracking-[0.25em] text-[var(--color-accent)]">
                {t.learning.eyebrow}
              </span>
            </FadeIn>
            <SplitReveal
              as="h2"
              type="lines"
              className="mt-6 font-display text-3xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-4xl"
            >
              {t.learning.title}
            </SplitReveal>
          </div>
          <div ref={chipsRef} className="flex flex-wrap content-start gap-3 lg:col-span-8">
            {t.learning.items.map((item, i) => (
              <span
                key={item}
                data-reveal
                className="inline-flex items-center gap-2.5 rounded-full border border-ink/10 bg-ink/[0.02] px-5 py-2.5 text-sm font-medium text-ink/85"
              >
                  <motion.span
                    animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.35,
                    }}
                    className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]"
                  />
                {item}
              </span>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
