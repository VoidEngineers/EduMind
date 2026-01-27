import { CTASection } from '@/components/landing/CTASection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { Footer } from '@/components/landing/Footer';
import { HeroSection } from '@/components/landing/HeroSection';
import { Navbar } from '@/components/landing/Navbar';
import { StatsSection } from '@/components/landing/StatsSection';

export default function Landing() {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <HeroSection />
            <StatsSection />
            <FeaturesSection />
            <CTASection />
            <Footer />
        </div>
    );
}
