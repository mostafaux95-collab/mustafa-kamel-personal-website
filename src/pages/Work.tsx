import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import PageHeader from "@/components/ui/PageHeader";
import Container from "@/components/ui/Container";
import ProjectGrid from "@/components/sections/ProjectGrid";
import StatsBar from "@/components/sections/StatsBar";
import EngagementModels from "@/components/sections/EngagementModels";
import ContactBanner from "@/components/sections/ContactBanner";
import CtaStrip from "@/components/ui/CtaStrip";
import Marquee from "@/components/ui/Marquee";
import { usePageTitle } from "@/lib/usePageTitle";
import { useLang } from "@/lib/i18n";

export default function Work() {
  const { t } = useLang();
  usePageTitle(t.titles.work);

  return (
    <>
      <Nav />
      <main>
        <PageHeader
          eyebrow={t.pages.work.eyebrow}
          title={t.pages.work.title}
          sub={t.pages.work.sub}
          scene="octa"
        />
        <section className="pb-16">
          <Container>
            <ProjectGrid />
          </Container>
        </section>
        <EngagementModels />
        <StatsBar />
        <ContactBanner />
        <Marquee reverse items={t.marqueeBottom} />
        <CtaStrip />
      </main>
      <Footer />
    </>
  );
}
