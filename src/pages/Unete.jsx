import React from 'react';
import Navbar from '../components/Navbar';
import FeaturedEvents from '../components/FeaturedEvents';
import MapSection from '../components/MapSection';
import ResultsSection from '../components/ResultsSection';
import Footer from '../components/Footer';

const Unete = () => {
  return (
    <div className="min-h-screen bg-primary text-white flex flex-col">
      {/* Navbar reutilizado */}
      <Navbar />

      {/* Contenido Principal */}
      <main className="grow flex items-center justify-center px-6">
        <div className="max-w-7xl w-full mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          
          {/* Texto Izquierda */}
          <div className="w-full md:w-1/2 text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight font-secondary">
              ¡Unete a tu <br /> primer grupo!
            </h1>
            <p className="text-lg md:text-xl font-light opacity-90">
              Y amplía tu networking como nunca antes
            </p>
          </div>

          {/* Imagen Derecha */}
          <div className="w-full md:w-1/2 flex justify-center md:justify-end">
            <img 
              src="/NetworkingImg.png" 
              alt="Personas haciendo networking online" 
              className="w-full max-w-md h-auto object-contain"
            />
          </div>

        </div>
      </main>
      <FeaturedEvents />
      <MapSection />
      <ResultsSection />
      <Footer  />
    </div>
  );
};

export default Unete;