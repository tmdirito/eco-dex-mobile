import styles from "../page.module.css";
import HeroSection from "../components/HeroSection";
import StepsSection from "../components/StepsSection";
import FeaturesSection from "../components/FeaturesSection";
import AboutMission from "../components/AboutMission";

export default function AboutPage() {
  return (
    <div style={{ backgroundColor: '#05150b', minHeight: '100vh', paddingBottom: '2rem' }}>
      <main style={{ paddingTop: '80px' }}> {/* Space for the fixed header */}
        <HeroSection />
        <StepsSection />
        <FeaturesSection />
        <AboutMission />
      </main>
    </div>
  );
}