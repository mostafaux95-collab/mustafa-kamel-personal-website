import { useEffect, useState } from "react";
import { Whatsapp } from "iconsax-react";

const WHATSAPP_URL = "https://wa.me/2001206338893";

// Fixed to the inline-end corner (visually bottom-right in LTR, bottom-left
// in RTL) via logical `end-`/`bottom-` classes, so it flips sides with the
// site's language automatically instead of needing a lang check here.
export default function WhatsAppButton() {
  // A fixed button unavoidably sits on top of whatever content happens to
  // scroll behind it — usually a harmless, transient overlap. But every
  // page's Footer (and several pages' final CTA row) lands right in that
  // bottom corner too, where the overlap becomes a durable, un-scroll-away
  // obstruction over real links. Hiding the button once the footer is in
  // view sidesteps that: by then the visitor has reached the page's
  // natural end anyway.
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;
    const observer = new IntersectionObserver(([entry]) => setHidden(entry.isIntersecting), {
      rootMargin: "0px 0px -10% 0px",
    });
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noreferrer"
      data-cursor="link"
      aria-label="WhatsApp"
      aria-hidden={hidden}
      tabIndex={hidden ? -1 : undefined}
      className={`fixed bottom-6 end-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 transition-all duration-300 hover:scale-110 sm:bottom-8 sm:end-8 ${
        hidden ? "pointer-events-none translate-y-4 opacity-0" : "opacity-100"
      }`}
    >
      <Whatsapp size={28} variant="Bold" color="currentColor" className="text-white" />
    </a>
  );
}
