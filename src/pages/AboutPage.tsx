import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import PageHeader from "@/components/ui/PageHeader";
import About from "@/components/sections/About";
import Principles from "@/components/sections/Principles";
import Process from "@/components/sections/Process";
import Collaboration from "@/components/sections/Collaboration";
import Tools from "@/components/sections/Tools";
import ContactBanner from "@/components/sections/ContactBanner";
import CtaStrip from "@/components/ui/CtaStrip";
import Marquee from "@/components/ui/Marquee";
import { usePageTitle } from "@/lib/usePageTitle";
import { useLang } from "@/lib/i18n";

export default function AboutPage() {
  const { t } = useLang();
  usePageTitle(t.titles.about);

  return (
    <>
      <Nav />
      <main>
        <PageHeader
          eyebrow={t.pages.about.eyebrow}
          title={t.pages.about.title}
          sub={t.pages.about.sub}
          scene="icosa"
        />
        <About />
        <Process />
        <Principles />
        <Collaboration />
        <Tools />
        <ContactBanner />
        <Marquee items={t.marqueeBottom} />
        <CtaStrip />
      </main>
      <Footer />
    </>
  );
}
