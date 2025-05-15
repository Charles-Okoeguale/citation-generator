import Image from "next/image";
import { HeroSection } from "./components/landing/HeroSection";
import { FeaturesSection } from "./components/landing/FeaturesSection";
import { HowItWorksSection } from "./components/landing/HowItWorksSection";
import { StylesShowcase } from "./components/landing/StylesShowcase";
import { BenefitsSection } from "./components/landing/BenefitsSection";
import { CTASection } from "./components/landing/CTASection";
import { Footer } from "./components/landing/Footer";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <StylesShowcase />
      <BenefitsSection />
      <CTASection />
      <Footer />
    </main>
  );
}
