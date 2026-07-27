import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Container from "@/components/ui/Container";
import GsapFade from "@/components/ui/GsapFade";
import { useLang } from "@/lib/i18n";
import { fetchPublic, getAssetUrl } from "@/lib/api";
import { prefersReducedMotion } from "@/lib/gsapSetup";
import CertificateLightbox from "./CertificateLightbox";

interface CertificateItem {
  id: string;
  imageUrl: string;
  title: string | null;
  titleAr: string | null;
}

// Pixels of continuous drift per animation frame at ~60fps.
const AUTOPLAY_SPEED = 0.6;
// How long after a drag/touch interaction ends before autoplay resumes.
const RESUME_DELAY_MS = 1600;
// Worst-case card width + gap (desktop breakpoint), used to size the
// repeated block wide enough that it never runs out of room — see the
// REPEAT comment below.
const CARD_STEP_PX = 276;
// Each of the 3 repeated blocks must be at least this wide. The browser
// clamps scrollLeft to [0, scrollWidth - clientWidth]; if a block were
// narrower than the viewport, that native clamp would kick in before our
// own wrap threshold ever did, freezing the strip at the clamped edge
// instead of looping. Comfortably covers ultra-wide monitors too.
const MIN_BLOCK_WIDTH_PX = 3600;

export default function CertificatesSlider() {
  const { t, lang } = useLang();
  const isRtl = lang === "ar";

  const { data } = useQuery({
    queryKey: ["public", "certificates"],
    queryFn: () => fetchPublic<{ items: CertificateItem[] }>("/certificates?pageSize=100"),
  });
  const items = data?.items ?? [];

  const trackRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const pausedRef = useRef(false);
  const draggingRef = useRef(false);
  const draggedRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartScrollRef = useRef(0);
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Direction matches the site's other marquees (Marquee.tsx): the whole
  // strip visually drifts left-to-right in English and right-to-left in
  // Arabic. Increasing scrollLeft pans the *viewport* rightward across
  // the content, which makes the content itself appear to drift left —
  // so English (content should move right) needs a *decreasing*
  // scrollLeft, the opposite sign of what reading direction alone would
  // suggest.
  const dir = isRtl ? 1 : -1;

  useEffect(() => {
    const el = trackRef.current;
    if (!el || items.length === 0 || prefersReducedMotion()) return;

    // Center the strip on its middle copy so autoplay can drift either
    // direction and still have room before wrapping.
    el.scrollLeft = el.scrollWidth / 3;

    function tick() {
      if (el && !pausedRef.current && !draggingRef.current) {
        el.scrollLeft += AUTOPLAY_SPEED * dir;
        const third = el.scrollWidth / 3;
        if (el.scrollLeft >= third * 2) el.scrollLeft -= third;
        else if (el.scrollLeft <= 0) el.scrollLeft += third;
      }
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [items.length, dir]);

  function scheduleResume() {
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      pausedRef.current = false;
    }, RESUME_DELAY_MS);
  }

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    const el = trackRef.current;
    if (!el) return;
    draggingRef.current = true;
    draggedRef.current = false;
    pausedRef.current = true;
    dragStartXRef.current = e.clientX;
    dragStartScrollRef.current = el.scrollLeft;
    el.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!draggingRef.current) return;
    const el = trackRef.current;
    if (!el) return;
    const dx = e.clientX - dragStartXRef.current;
    if (Math.abs(dx) > 4) draggedRef.current = true;
    el.scrollLeft = dragStartScrollRef.current - dx;
  }

  function endDrag() {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    scheduleResume();
  }

  if (items.length === 0) return null;

  // Repeat the item set enough times that a single block comfortably
  // exceeds MIN_BLOCK_WIDTH_PX regardless of how few certificates exist
  // (see the constant's comment for why this matters), then lay out 3
  // such blocks back to back so the strip can be re-centered on the
  // middle one after wrapping in either direction without ever showing
  // an edge — required for autoplay to drift both ways (RTL vs LTR) and
  // for manual drag to overshoot past a wrap point safely.
  const repeat = Math.max(1, Math.ceil(MIN_BLOCK_WIDTH_PX / (items.length * CARD_STEP_PX)));
  const block = Array.from({ length: repeat }, () => items).flat();
  const tripled = [...block, ...block, ...block];

  return (
    <section className="border-t border-ink/[0.06] py-20 sm:py-24">
      <Container>
        <GsapFade>
          <span className="font-display text-[13px] font-medium uppercase tracking-[0.25em] text-[var(--color-accent)]">
            {t.cv.certificatesTitle}
          </span>
        </GsapFade>
      </Container>

      <div
        ref={trackRef}
        dir="ltr"
        className="mt-8 flex touch-pan-y select-none gap-5 overflow-x-hidden px-6 cursor-grab active:cursor-grabbing sm:px-10"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={endDrag}
        onMouseEnter={() => {
          pausedRef.current = true;
        }}
        onMouseLeave={() => {
          if (!draggingRef.current) pausedRef.current = false;
        }}
        onDragStart={(e) => e.preventDefault()}
      >
        {tripled.map((cert, i) => {
          const label = (isRtl && cert.titleAr) || cert.title || "";
          return (
            <button
              key={`${cert.id}-${i}`}
              type="button"
              onClick={() => {
                if (draggedRef.current) return;
                setLightboxIndex(i % items.length);
              }}
              className="group relative h-40 w-56 shrink-0 overflow-hidden rounded-2xl border border-ink/[0.08] bg-[var(--color-card)] shadow-md transition-shadow duration-300 hover:shadow-xl sm:h-48 sm:w-64"
            >
              <img
                src={getAssetUrl(cert.imageUrl)}
                alt={label}
                loading="lazy"
                decoding="async"
                draggable={false}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </button>
          );
        })}
      </div>

      {lightboxIndex !== null && (
        <CertificateLightbox
          items={items}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onIndexChange={setLightboxIndex}
        />
      )}
    </section>
  );
}
