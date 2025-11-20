import React from 'react';
import Navbar from './components/Navbar'; 
import BannerInicio from './components/BannerInicio';
import BannerFeature from './components/BannerFeature';
import BenefitsSection from './components/BenefitsSection';
import BannerVariedad from './components/BannerVariedad';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <BannerInicio />
      <BannerFeature />
      <BenefitsSection />
      <BannerVariedad />
      <Testimonials />
      <Footer />
    </div>
  );
}

export default App;