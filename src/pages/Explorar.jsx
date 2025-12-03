import React from 'react';
import Navbar from '../components/Navbar';
import Explore from '../components/Explore';
import RestaurantSection from '../components/RestaurantSection';
import Footer from '../components/Footer';

const Explorar = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Explore />
        <RestaurantSection />
      </main>
      <Footer />
    </div>
  );
};
