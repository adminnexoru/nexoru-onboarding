import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import TrustBar from "@/components/landing/TrustBar";
import ProblemSection from "@/components/landing/ProblemSection";
import HowItWorks from "@/components/landing/HowItWorks";
import SolutionsGrid from "@/components/landing/SolutionsGrid";
import UseCases from "@/components/landing/UseCases";
import PricingTeaser from "@/components/landing/PricingTeaser";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#06070A] text-white">
      <Navbar />
      <Hero />
      <TrustBar />
      <ProblemSection />
      <HowItWorks />
      <SolutionsGrid />
      <UseCases />
      <PricingTeaser />
      <FinalCTA />
      <Footer />
    </main>
  );
}