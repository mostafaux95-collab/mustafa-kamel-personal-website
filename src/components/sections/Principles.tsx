import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import Container from "@/components/ui/Container";
import FadeIn from "@/components/ui/FadeIn";
import SplitReveal from "@/components/ui/SplitReveal";
import { useLang } from "@/lib/i18n";

export default function Principles() {
  const [open, setOpen] = useState<number | null>(0);
  const { t } = useLang();

  return (
    <section className="relative border-t border-ink/[0.06] py-32 sm:py-40">
      <Container>
        <FadeIn>
          <span className="font-display text-[13px] font-medium uppercase tracking-[0.25em] text-[var(--color-accent)]">
            {t.principles.eyebrow}
          </span>
        </FadeIn>
        <SplitReveal
          as="h2"
          type="lines"
          className="mt-6 max-w-xl font-display text-4xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl"
        >
          {t.principles.title}
        </SplitReveal>

        <div className="mt-16 divide-y divide-ink/[0.08] border-t border-ink/[0.08]">
          {t.principles.items.map((p, i) => {
            const isOpen = open === i;
            return (
              <FadeIn key={p.title} delay={i * 0.04}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  data-cursor="link"
                  className="group flex w-full items-center justify-between gap-6 py-8 text-start"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-baseline gap-6">
                    <span className="font-display text-sm text-[var(--color-ink-muted)]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`font-display text-2xl font-medium transition-colors sm:text-3xl ${
                        isOpen ? "text-[var(--color-accent)]" : "text-ink group-hover:text-ink/80"
                      }`}
                    >
                      {p.title}
                    </span>
                  </div>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="shrink-0 text-ink/60"
                  >
                    <Plus size={22} />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-2xl pb-8 ps-0 text-[var(--color-ink-secondary)] sm:ps-14">
                        {p.detail}
                      </p>
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
