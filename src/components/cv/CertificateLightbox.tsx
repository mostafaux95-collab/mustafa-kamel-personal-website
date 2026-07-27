import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { getAssetUrl } from "@/lib/api";
import { useLang } from "@/lib/i18n";

interface CertificateItem {
  id: string;
  imageUrl: string;
  title: string | null;
  titleAr: string | null;
}

export default function CertificateLightbox({
  items,
  index,
  onClose,
  onIndexChange,
}: {
  items: CertificateItem[];
  index: number;
  onClose: () => void;
  onIndexChange: (i: number) => void;
}) {
  const { t, lang } = useLang();
  const isRtl = lang === "ar";
  const dragStartX = useRef<number | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const cert = items[index];
  const label = (isRtl && cert.titleAr) || cert.title || "";

  function goPrev() {
    onIndexChange((index - 1 + items.length) % items.length);
  }
  function goNext() {
    onIndexChange((index + 1) % items.length);
  }

  useEffect(() => {
    closeBtnRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") (isRtl ? goNext : goPrev)();
      if (e.key === "ArrowRight") (isRtl ? goPrev : goNext)();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, items.length, isRtl]);

  function onPointerDown(e: React.PointerEvent) {
    dragStartX.current = e.clientX;
  }
  function onPointerUp(e: React.PointerEvent) {
    if (dragStartX.current === null) return;
    const dx = e.clientX - dragStartX.current;
    dragStartX.current = null;
    if (Math.abs(dx) < 40) return;
    const swipedLeft = dx < 0;
    if (swipedLeft) {
      isRtl ? goPrev() : goNext();
    } else {
      isRtl ? goNext() : goPrev();
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={label || t.cv.certificatesTitle}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        ref={closeBtnRef}
        type="button"
        onClick={onClose}
        aria-label={t.cv.certificatesClose}
        className="absolute end-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
      >
        <X size={20} />
      </button>

      {items.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            aria-label={t.cv.certificatesPrev}
            className="absolute start-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:start-6"
          >
            <ChevronLeft size={22} className="rtl:-scale-x-100" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            aria-label={t.cv.certificatesNext}
            className="absolute end-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:end-6"
          >
            <ChevronRight size={22} className="rtl:-scale-x-100" />
          </button>
        </>
      )}

      <div
        onClick={(e) => e.stopPropagation()}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        className="flex max-h-[85vh] max-w-[90vw] touch-pan-y flex-col items-center gap-4"
      >
        <img
          src={getAssetUrl(cert.imageUrl)}
          alt={label}
          className="max-h-[75vh] max-w-full rounded-2xl border border-white/10 object-contain shadow-2xl"
        />
        {label && <p className="text-center text-sm text-white/70">{label}</p>}
      </div>
    </div>
  );
}
