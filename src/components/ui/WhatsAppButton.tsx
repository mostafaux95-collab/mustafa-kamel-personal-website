import { MessageCircle } from "lucide-react";

const WHATSAPP_URL = "https://wa.me/2001206338893";

// Fixed to the inline-end corner (visually bottom-right in LTR, bottom-left
// in RTL) via logical `end-`/`bottom-` classes, so it flips sides with the
// site's language automatically instead of needing a lang check here.
export default function WhatsAppButton() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noreferrer"
      data-cursor="link"
      aria-label="WhatsApp"
      className="fixed bottom-6 end-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 transition-transform duration-300 hover:scale-110 sm:bottom-8 sm:end-8"
    >
      <MessageCircle size={28} strokeWidth={2} className="text-white" />
    </a>
  );
}
