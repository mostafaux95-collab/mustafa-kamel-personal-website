import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Projects from "@/components/sections/Projects";
import Services from "@/components/sections/Services";
import StatsBar from "@/components/sections/StatsBar";
import Companies from "@/components/sections/Companies";
import AboutTeaser from "@/components/sections/AboutTeaser";
import Testimonials from "@/components/sections/Testimonials";
import CtaStrip from "@/components/ui/CtaStrip";
import Marquee from "@/components/ui/Marquee";
import { usePageTitle } from "@/lib/usePageTitle";
import { useLang } from "@/lib/i18n";

export default function Home() {
  const { t } = useLang();
  usePageTitle();

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Companies />
        <Marquee items={t.marqueeTop} />
        <Projects />
        <StatsBar />
        <Services />
        <AboutTeaser />
        <Testimonials />
        <Marquee items={t.marqueeBottom} />
        <CtaStrip headline={t.cta.home} />
      </main>
      <Footer />
    </>
  );
}
