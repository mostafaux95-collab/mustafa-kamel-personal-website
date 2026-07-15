import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import Container from "@/components/ui/Container";
import FadeIn from "@/components/ui/FadeIn";
import SplitReveal from "@/components/ui/SplitReveal";
import { useLang } from "@/lib/i18n";

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const { t } = useLang();

  return (
    <section className="relative border-t border-ink/[0.06] py-24 sm:py-32">
      <Container>
        <FadeIn>
          <span className="font-display text-[13px] font-medium uppercase tracking-[0.25em] text-[var(--color-accent)]">
            {t.faq.eyebrow}
          </span>
        </FadeIn>
        <SplitReveal
          as="h2"
          type="lines"
          className="mt-6 max-w-xl font-display text-3xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-4xl"
        >
          {t.faq.title}
        </SplitReveal>

        <div className="mt-16 divide-y divide-ink/[0.08] border-t border-ink/[0.08]">
          {t.faq.items.map((faq, i) => {
            const isOpen = open === i;
            return (
              <FadeIn key={faq.q}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  data-cursor="link"
                  className="flex w-full items-center justify-between gap-6 py-6 text-start"
                  aria-expanded={isOpen}
                >
                  <span
                    className={`font-display text-lg font-medium transition-colors sm:text-xl ${
                      isOpen ? "text-[var(--color-accent)]" : "text-ink"
                    }`}
                  >
                    {faq.q}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="shrink-0 text-ink/60"
                  >
                    <Plus size={20} />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-2xl pb-6 text-[var(--color-ink-secondary)]">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </FadeIn>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
