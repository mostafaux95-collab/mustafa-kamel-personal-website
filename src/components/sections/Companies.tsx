import Container from "@/components/ui/Container";
import FadeIn from "@/components/ui/FadeIn";
import { useLang } from "@/lib/i18n";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsapSetup";
import { useRef } from "react";
import { COMPANY_LOGOS } from "@/data/companyLogos";

export default function Companies() {
  const { t } = useLang();
  const groupRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const items = groupRef.current?.querySelectorAll("[data-company]");
      if (!items?.length) return;

      items.forEach((item, i) => {
        const tile = item.querySelector("[data-tile]");
        const name = item.querySelector("[data-name]");
        const tl = gsap.timeline({
          scrollTrigger: { trigger: groupRef.current, start: "top 85%", once: true },
          delay: i * 0.09,
        });
        tl.from(tile, {
          scale: 0.2,
          rotate: -18,
          autoAlpha: 0,
          duration: 0.7,
          ease: "back.out(2)",
        }).from(
          name,
          {
            x: document.documentElement.dir === "rtl" ? 18 : -18,
            autoAlpha: 0,
            duration: 0.55,
            ease: "power3.out",
          },
          0.2,
        );
        // gentle perpetual float, phase-shifted per tile
        gsap.to(tile, {
          y: -5,
          duration: 2.6 + (i % 3) * 0.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 1 + i * 0.3,
        });
      });
    },
    { scope: groupRef, dependencies: [t], revertOnUpdate: true },
  );

  return (
    <section className="border-t border-ink/[0.06] py-16 sm:py-20">
      <Container>
        <FadeIn>
          <span className="font-display text-[13px] font-medium uppercase tracking-[0.25em] text-[var(--color-ink-muted)]">
            {t.companies.eyebrow}
          </span>
        </FadeIn>
        <div
          ref={groupRef}
          className="mt-9 flex flex-wrap items-center gap-x-12 gap-y-8"
        >
          {t.cv.roles.map((role, i) => {
            const logo = COMPANY_LOGOS[i % COMPANY_LOGOS.length];
            return (
              <div
                key={role.company + role.period}
                data-company
                data-cursor="link"
                className="group flex cursor-default items-center gap-3.5"
              >
                <span
                  data-tile
                  aria-hidden
                  className="flex h-10 w-10 items-center justify-center rounded-xl font-display text-base font-bold shadow-md transition-transform duration-300 group-hover:-translate-y-1 group-hover:rotate-6 sm:h-11 sm:w-11"
                  style={{ backgroundColor: logo.bg, color: logo.fg }}
                >
                  {logo.initial}
                </span>
                <span
                  data-name
                  className="font-display text-2xl font-semibold text-ink/40 transition-colors duration-300 group-hover:text-ink sm:text-3xl"
                >
                  {role.company}
                </span>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
