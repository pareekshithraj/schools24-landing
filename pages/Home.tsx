import React from 'react';
import Hero from '../components/Hero';
import DownloadApps from '../components/DownloadApps';
import Partners from '../components/Partners';
import Services from '../components/Services';
import Features from '../components/Features';
import HowWeWork from '../components/HowWeWork';
import ValueStatement from '../components/ValueStatement';
import PortalSpectrum from '../components/PortalSpectrum';

import ScrollVideo from '../components/ScrollVideo';
import KnowUs from '../components/KnowUs';
import Footer from '../components/Footer';

const Home: React.FC = () => {
    return (
        <div className="snap-container relative selection:bg-[#f59e0b] selection:text-white bg-black" style={{ backgroundColor: '#000000' }}>
            <main>
                {/* Phase 1: Brand Reveal */}
                <Hero />

                {/* Phase 1.5: Cross-Platform Access */}
                <DownloadApps />

                {/* Phase 2: Industry Presence */}
                <Partners />

                {/* Phase 3: Product Narrative */}
                <Services />

                {/* Phase 3.5: Portal Spectrum */}
                <PortalSpectrum />

                {/* Phase 4: Capabilities Grid */}
                <Features />

                {/* Phase 5: Process */}
                <HowWeWork />

                {/* Phase 6: Intelligent Discovery */}
                <KnowUs />

                {/* Phase 7: Value Proposition */}
                <ValueStatement />


                {/* Global Impact Section - Video Scroll */}
                <ScrollVideo />
            </main>

            <Footer />
        </div>
    );
};

export default Home;
