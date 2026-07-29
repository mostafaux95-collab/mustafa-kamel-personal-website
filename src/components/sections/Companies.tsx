import Container from "@/components/ui/Container";
import FadeIn from "@/components/ui/FadeIn";
import { useLang } from "@/lib/i18n";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsapSetup";
import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPublic, getAssetUrl } from "@/lib/api";

interface ClientItem {
  id: string;
  name: string;
  nameAr: string | null;
  logoInitial: string | null;
  logoBg: string | null;
  logoFg: string | null;
  logoUrl: string | null;
}

export default function Companies() {
  const { t, lang } = useLang();
  const groupRef = useRef<HTMLDivElement>(null);

  const { data } = useQuery({
    queryKey: ["public", "clients"],
    queryFn: () => fetchPublic<{ items: ClientItem[] }>("/clients?pageSize=50"),
  });
  const clients = data?.items ?? [];

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
          // "back.out" easing intentionally overshoots past the target
          // scale before settling — combined with the per-tile stagger
          // delay below, that meant whichever tile started animating
          // first (delay: i * 0.09, so always the first one) finished its
          // overshoot-and-settle while later tiles were still small and
          // mid-animation, making it look permanently larger in any
          // screenshot taken during that ~1s window. power3.out never
          // exceeds the final scale, so no tile can ever appear bigger
          // than its settled size, even mid-animation.
          scale: 0.2,
          rotate: -18,
          autoAlpha: 0,
          duration: 0.6,
          ease: "power3.out",
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
    { scope: groupRef, dependencies: [t, clients.length], revertOnUpdate: true },
  );

  if (clients.length === 0) return null;

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
          {clients.map((client) => {
            const name = lang === "ar" && client.nameAr ? client.nameAr : client.name;
            const logoSrc = getAssetUrl(client.logoUrl);
            return (
              <div
                key={client.id}
                data-company
                data-cursor="link"
                className="group flex cursor-default items-center gap-3.5"
              >
                {logoSrc ? (
                  <img
                    data-tile
                    src={logoSrc}
                    alt=""
                    aria-hidden
                    className="h-[50px] w-[50px] shrink-0 rounded-xl object-cover shadow-md transition-transform duration-300 group-hover:-translate-y-1 group-hover:rotate-6"
                  />
                ) : (
                  <span
                    data-tile
                    aria-hidden
                    className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-xl font-display text-xl font-bold shadow-md transition-transform duration-300 group-hover:-translate-y-1 group-hover:rotate-6"
                    style={{ backgroundColor: client.logoBg ?? "#432666", color: client.logoFg ?? "#ffffff" }}
                  >
                    {client.logoInitial ?? name.slice(0, 1)}
                  </span>
                )}
                <span
                  data-name
                  className="font-display text-2xl font-semibold text-ink/40 transition-colors duration-300 group-hover:text-ink sm:text-3xl"
                >
                  {name}
                </span>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
