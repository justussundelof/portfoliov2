import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import WorkSection from '@/components/WorkSection';
import AboutSection from '@/components/AboutSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

const Index = () => {
    return (
        <div className="min-h-screen bg-background">
            <Navigation />
            <Hero />
            <WorkSection />
            <AboutSection />
            <ContactSection />
            <Footer />
        </div>
    );
};

export default Index;
