import HeroSection from '@/components/HeroSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import BenefitsSection from '@/components/BenefitsSection';
import AppScreensSection from '@/components/AppScreensSection';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <main className="overflow-x-hidden">
      <HeroSection />
      <HowItWorksSection />
      <BenefitsSection />
      <AppScreensSection />
      <CTASection />
      <Footer />
    </main>
  );
};

export default Index;
