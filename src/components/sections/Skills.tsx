import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Container from "@/components/ui/Container";
import FadeIn from "@/components/ui/FadeIn";
import { categoryColors, type SkillCategory } from "@/data/skills";
import { useLang } from "@/lib/i18n";

const CATEGORIES: SkillCategory[] = [
  "Design",
  "Research",
  "Systems",
  "AI",
  "Frontend",
  "Leadership",
];

export default function Skills() {
  const [active, setActive] = useState<string | null>(null);
  const { t } = useLang();

  return (
    <section
      id="skills"
      className="relative overflow-hidden border-t border-ink/[0.06] py-32 sm:py-40"
    >
      <Container>
        {/* No eyebrow/title here — PageHeader on SkillsPage already
            renders this section's heading (same copy: t.pages.skills),
            so repeating it via t.skillsSection produced a visible
            duplicate. */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((category, ci) => (
            <FadeIn key={category} delay={ci * 0.06}>
              <div className="flex items-center gap-3">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: categoryColors[category] }}
                />
                <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-ink/70">
                  {t.skillsSection.categories[category]}
                </h3>
              </div>

              <div className="relative mt-6 flex flex-wrap gap-3">
                {t.skillsSection.skills
                  .filter((s) => s.category === category)
                  .map((skill, i) => {
                    const isActive = active === skill.name;
                    return (
                      <div key={skill.name} className="relative">
                        <motion.button
                          data-cursor="link"
                          onMouseEnter={() => setActive(skill.name)}
                          onMouseLeave={() => setActive(null)}
                          onFocus={() => setActive(skill.name)}
                          onBlur={() => setActive(null)}
                          animate={{ y: [0, -6, 0] }}
                          transition={{
                            duration: 4 + (i % 3),
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: i * 0.25,
                          }}
                          className="rounded-full border px-4 py-2 text-sm font-medium text-ink/85 transition-colors"
                          style={{
                            borderColor: isActive
                              ? categoryColors[category]
                              : "var(--color-border-strong)",
                            backgroundColor: isActive
                              ? `${categoryColors[category]}1A`
                              : "transparent",
                          }}
                        >
                          {skill.name}
                        </motion.button>

                        <AnimatePresence>
                          {isActive && (
                            <motion.div
                              initial={{ opacity: 0, y: 6, scale: 0.96 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 6, scale: 0.96 }}
                              transition={{ duration: 0.2 }}
                              className="absolute start-0 top-full z-20 mt-2 w-56 rounded-xl border border-ink/10 bg-bg-raised p-3 text-xs leading-relaxed text-[var(--color-ink-secondary)] shadow-2xl"
                            >
                              {skill.detail}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
              </div>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}
