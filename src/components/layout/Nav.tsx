import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import clsx from "clsx";
import Container from "@/components/ui/Container";
import Magnetic from "@/components/ui/Magnetic";
import { useTheme } from "@/lib/theme";
import { useLang } from "@/lib/i18n";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsapSetup";

/**
 * "Let's Talk" - GSAP interactive button:
 * label rolls upward while an accent disc floods the pill from the exact
 * pointer entry point; reverses out toward the exit point. Magnetic pull
 * comes from the shared cursor system.
 */
function TalkButton({ label }: { label: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const rollRef = useRef<HTMLSpanElement>(null);
  const navigate = useNavigate();
  const { contextSafe } = useGSAP({ scope: ref });

  const place = (e: React.MouseEvent) => {
    const r = ref.current!.getBoundingClientRect();
    const d = Math.hypot(r.width, r.height) * 2.2;
    gsap.set(fillRef.current, {
      width: d,
      height: d,
      left: e.clientX - r.left,
      top: e.clientY - r.top,
      xPercent: -50,
      yPercent: -50,
    });
  };

  const onEnter = contextSafe((e: React.MouseEvent) => {
    if (prefersReducedMotion()) return;
    place(e);
    gsap.to(fillRef.current, { scale: 1, duration: 0.55, ease: "power2.out" });
    gsap.to(rollRef.current, { yPercent: -50, duration: 0.45, ease: "power3.out" });
    gsap.to(ref.current, { color: "#1a0f10", duration: 0.25 });
  });

  const onLeave = contextSafe((e: React.MouseEvent) => {
    if (prefersReducedMotion()) return;
    place(e);
    gsap.to(fillRef.current, { scale: 0, duration: 0.45, ease: "power2.in" });
    gsap.to(rollRef.current, { yPercent: 0, duration: 0.45, ease: "power3.out" });
    gsap.to(ref.current, { color: "", clearProps: "color", duration: 0.25, delay: 0.1 });
  });

  const onClick = contextSafe((e: React.MouseEvent) => {
    e.preventDefault();
    if (prefersReducedMotion()) {
      navigate("/contact");
      return;
    }
    // squash-and-go
    gsap
      .timeline({ onComplete: () => navigate("/contact") })
      .to(ref.current, { scale: 0.92, duration: 0.1, ease: "power2.in" })
      .to(ref.current, { scale: 1, duration: 0.18, ease: "back.out(3)" });
  });

  return (
    <Magnetic cursor="link" strength={0.5}>
      <a
        ref={ref}
        href="/contact"
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        onClick={onClick}
        className="relative inline-block overflow-hidden rounded-full border border-ink/15 px-5 py-2 font-display text-[13px] font-medium text-ink"
      >
        <span
          ref={fillRef}
          aria-hidden
          className="absolute rounded-full bg-[var(--color-accent)]"
          style={{ scale: 0 }}
        />
        <span className="relative block h-[1.25rem] overflow-hidden leading-[1.25rem]">
          <span ref={rollRef} className="block">
            <span className="block">{label}</span>
            <span className="block" aria-hidden>
              {label}
            </span>
          </span>
        </span>
      </a>
    </Magnetic>
  );
}

export default function Nav() {
  const { scrollY } = useScroll();
  const { pathname } = useLocation();
  const { theme, toggle: toggleTheme } = useTheme();
  const { t, toggle: toggleLang } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const links = [
    { label: t.nav.home, to: "/" },
    { label: t.nav.work, to: "/work" },
    { label: t.nav.about, to: "/about" },
    { label: t.nav.skills, to: "/skills" },
    { label: t.nav.cv, to: "/cv" },
  ];

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 24);
  });

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function isActive(to: string) {
    return to === "/" ? pathname === "/" : pathname.startsWith(to);
  }

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={clsx(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
        scrolled
          ? "border-b border-ink/[0.06] bg-bg/80 backdrop-blur-lg"
          : "bg-transparent",
      )}
    >
      <Container className="flex h-16 items-center justify-between sm:h-20">
        <Link
          to="/"
          data-cursor="link"
          data-cursor-magnetic
          className="font-display text-sm font-semibold tracking-tight text-ink"
        >
          {t.brand}
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              data-cursor="link"
              aria-current={isActive(link.to) ? "page" : undefined}
              className={clsx(
                "relative font-display text-[13px] font-medium uppercase tracking-widest transition-colors",
                isActive(link.to) ? "text-ink" : "text-ink/60 hover:text-ink",
              )}
            >
              {link.label}
              {isActive(link.to) && (
                <span className="absolute -bottom-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[var(--color-accent)]" />
              )}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <button
            onClick={toggleLang}
            data-cursor="link"
            className="rounded-full border border-ink/10 px-3 py-1.5 font-display text-[12px] font-semibold text-ink/70 transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
          >
            {t.nav.langLabel}
          </button>
          <button
            onClick={toggleTheme}
            data-cursor="link"
            aria-label={t.nav.themeToggle}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-ink/10 text-ink/70 transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
          >
            {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
          </button>
          <TalkButton label={t.nav.letsTalk} />
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <button
            onClick={toggleLang}
            className="rounded-full border border-ink/10 px-2.5 py-1 font-display text-[11px] font-semibold text-ink/70"
          >
            {t.nav.langLabel}
          </button>
          <button
            onClick={toggleTheme}
            aria-label={t.nav.themeToggle}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-ink/10 text-ink/70"
          >
            {theme === "dark" ? <Sun size={13} /> : <Moon size={13} />}
          </button>
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5"
            aria-label={t.nav.toggleMenu}
            aria-expanded={open}
          >
            <motion.span
              animate={{ rotate: open ? 45 : 0, y: open ? 6 : 0 }}
              className="h-px w-6 bg-ink"
            />
            <motion.span animate={{ opacity: open ? 0 : 1 }} className="h-px w-6 bg-ink" />
            <motion.span
              animate={{ rotate: open ? -45 : 0, y: open ? -6 : 0 }}
              className="h-px w-6 bg-ink"
            />
          </button>
        </div>
      </Container>

      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="border-t border-ink/[0.06] bg-bg md:hidden"
        >
          <Container className="flex flex-col gap-6 py-8">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                aria-current={isActive(link.to) ? "page" : undefined}
                className={clsx(
                  "font-display text-2xl font-medium",
                  isActive(link.to) ? "text-[var(--color-accent)]" : "text-ink",
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="font-display text-2xl font-medium text-[var(--color-accent)]"
            >
              {t.nav.letsTalk}
            </Link>
          </Container>
        </motion.div>
      )}
    </motion.header>
  );
}
