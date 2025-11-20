import React from 'react';
import Navbar from '../components/Navbar';
import BannerInicio from '../components/BannerInicio';
import BenefitsSection from '../components/BenefitsSection';
import BannerFeature from '../components/BannerFeature';
import BannerVariedad from '../components/BannerVariedad';
import Testimonials from '../components/Testimonials';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <BannerInicio />
        <BenefitsSection />
        <BannerFeature />
        <BannerVariedad />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
};

export default Home;