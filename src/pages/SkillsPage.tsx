import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import PageHeader from "@/components/ui/PageHeader";
import Skills from "@/components/sections/Skills";
import Industries from "@/components/sections/Industries";
import Learning from "@/components/sections/Learning";
import ContactBanner from "@/components/sections/ContactBanner";
import CtaStrip from "@/components/ui/CtaStrip";
import Marquee from "@/components/ui/Marquee";
import { usePageTitle } from "@/lib/usePageTitle";
import { useLang } from "@/lib/i18n";

export default function SkillsPage() {
  const { t } = useLang();
  usePageTitle(t.titles.skills);

  return (
    <>
      <Nav />
      <main>
        <PageHeader
          eyebrow={t.pages.skills.eyebrow}
          title={t.pages.skills.title}
          sub={t.pages.skills.sub}
          scene="torus"
        />
        <Skills />
        <Industries />
        <Learning />
        <ContactBanner />
        <Marquee items={t.marqueeBottom} />
        <CtaStrip />
      </main>
      <Footer />
    </>
  );
}
