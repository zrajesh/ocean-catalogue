import { Clients } from "@/features/landing/components/Clients";
import { Collections } from "@/features/landing/components/Collections";
import { Footer } from "@/features/landing/components/Footer";
import { GlassSprite } from "@/features/landing/components/GlassSprite";
import { Header } from "@/features/landing/components/Header";
import { Hero } from "@/features/landing/components/Hero";
import { QuoteSection } from "@/features/landing/components/QuoteSection";
import { WhatsAppFab } from "@/features/landing/components/WhatsAppFab";
import { WhyUs } from "@/features/landing/components/WhyUs";

export default function Home() {
  return (
    <>
      <GlassSprite />
      <Header />
      <main id="top">
        <Hero />
        <Collections />
        <WhyUs />
        <Clients />
        <QuoteSection />
      </main>
      <Footer />
      <WhatsAppFab />
    </>
  );
}
