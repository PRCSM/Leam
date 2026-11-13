import { Hero } from "@/components/home/Hero";
import { FeatureRow, FeaturedUniverses, Benefits, CreatorGallery, Manifesto, Monetization, Testimonials, FinalCTA } from "@/components/home/Sections";
import { AccessModes, LiveTogether, Discovery, HowItWorks } from "@/components/home/Interactive";

export default function HomePage() {
  return (
    <>
      {/* ---- Faithful reconstruction of the reference screenshot ---- */}
      <Hero />
      <FeatureRow />
      <FeaturedUniverses />
      <Benefits />
      <CreatorGallery />

      {/* ---- Expanded homepage in the same visual language ---- */}
      <Manifesto />
      <AccessModes />
      <LiveTogether />
      <Monetization />
      <Discovery />
      <HowItWorks />
      <Testimonials />
      <FinalCTA />
    </>
  );
}
