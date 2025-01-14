import { HeroSection } from "./_components/HeroSection";
import { AboutSection } from "./_components/AboutSection";
import ReviewSection from "./_components/ReviewSection";
import WeddingWisdomSection from "./_components/WeddingWisdomSection";
import { Navbar } from "./_components/Navbar";
import Footer from "./_components/Footer";

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <ReviewSection />
      <WeddingWisdomSection />
      <Footer />
    </div>
  );
}
