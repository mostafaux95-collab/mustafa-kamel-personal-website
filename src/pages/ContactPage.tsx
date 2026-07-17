import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import Contact from "@/components/sections/Contact";
import NextSteps from "@/components/sections/NextSteps";
import Faq from "@/components/sections/Faq";
import Marquee from "@/components/ui/Marquee";
import CtaStrip from "@/components/ui/CtaStrip";
import { usePageTitle } from "@/lib/usePageTitle";
import { useLang } from "@/lib/i18n";

export default function ContactPage() {
  const { t } = useLang();
  usePageTitle(t.titles.contact);

  return (
    <>
      <Nav />
      {/* The Contact section carries its own full-page hero headline,
          so it doubles as the page header here. */}
      <main className="pt-10">
        <Contact />
        <NextSteps />
        <Faq />
        <Marquee items={t.marqueeBottom} />
        <CtaStrip />
      </main>
      <Footer />
    </>
  );
}
