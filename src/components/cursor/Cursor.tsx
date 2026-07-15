import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useFinePointer, useReducedMotion } from "@/lib/useReducedMotion";
import { useLang } from "@/lib/i18n";

type CursorVariant = "default" | "link" | "view" | "drag";

export default function Cursor() {
  const isFine = useFinePointer();
  const reduced = useReducedMotion();
  const enabled = isFine && !reduced;
  const { t } = useLang();

  const variantLabel: Record<CursorVariant, string> = {
    default: "",
    link: "",
    view: t.cursor.view,
    drag: t.cursor.drag,
  };

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { damping: 28, stiffness: 300, mass: 0.5 });
  const ringY = useSpring(y, { damping: 28, stiffness: 300, mass: 0.5 });

  const [variant, setVariant] = useState<CursorVariant>("default");
  const [visible, setVisible] = useState(false);
  const magnetTarget = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("has-custom-cursor");

    function onMove(e: MouseEvent) {
      let targetX = e.clientX;
      let targetY = e.clientY;

      const magnetic = (e.target as HTMLElement)?.closest<HTMLElement>(
        "[data-cursor-magnetic]",
      );
      if (magnetic) {
        const rect = magnetic.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const pull = magnetic.dataset.magneticStrength
          ? Number(magnetic.dataset.magneticStrength)
          : 0.35;
        targetX = cx + (e.clientX - cx) * (1 - pull);
        targetY = cy + (e.clientY - cy) * (1 - pull);
        magnetic.style.transform = `translate(${(e.clientX - cx) * pull * 0.6}px, ${(e.clientY - cy) * pull * 0.6}px)`;
        magnetTarget.current = magnetic;
      } else if (magnetTarget.current) {
        magnetTarget.current.style.transform = "";
        magnetTarget.current = null;
      }

      x.set(targetX);
      y.set(targetY);
      if (!visible) setVisible(true);

      const cursorEl = (e.target as HTMLElement)?.closest<HTMLElement>(
        "[data-cursor]",
      );
      setVariant((cursorEl?.dataset.cursor as CursorVariant) || "default");
    }

    function onLeave() {
      setVisible(false);
    }

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, [enabled, visible, x, y]);

  if (!enabled) return null;

  const isBig = variant === "view" || variant === "drag";

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100] rounded-full bg-[var(--color-accent)]"
        style={{ x, y, width: 6, height: 6 }}
        animate={{
          opacity: visible ? 1 : 0,
          x: -3,
          y: -3,
        }}
        transition={{ duration: 0.15 }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100] flex items-center justify-center rounded-full border border-ink/25 backdrop-blur-[1px]"
        style={{ x: ringX, y: ringY }}
        animate={{
          width: isBig ? 88 : variant === "link" ? 56 : 32,
          height: isBig ? 88 : variant === "link" ? 56 : 32,
          x: isBig ? -44 : variant === "link" ? -28 : -16,
          y: isBig ? -44 : variant === "link" ? -28 : -16,
          opacity: visible ? 1 : 0,
          backgroundColor:
            variant === "view"
              ? "rgba(245,137,99,0.12)"
              : variant === "link"
                ? "rgba(130,130,145,0.10)"
                : "rgba(130,130,145,0.04)",
          borderColor:
            variant === "view" ? "rgba(245,137,99,0.5)" : "rgba(130,130,145,0.45)",
        }}
        transition={{ type: "spring", damping: 24, stiffness: 260, mass: 0.6 }}
      >
        {variantLabel[variant] && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-display text-[11px] font-medium uppercase tracking-wider text-ink"
          >
            {variantLabel[variant]}
          </motion.span>
        )}
      </motion.div>
    </>
  );
}
