import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Explore from '../components/Explore';
import RestaurantSection from '../components/RestaurantSection';
import Footer from '../components/Footer';

const Explorar = () => {
  // Estado compartido para la búsqueda
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        {/*  Pasamos la función para actualizar el estado a Explore */}
        <Explore onSearch={setSearchTerm} />
        
        {/* Pasamos el valor del estado a RestaurantSection para que filtre */}
        <RestaurantSection searchTerm={searchTerm} />
      </main>
      <Footer />
    </div>
  );
};

export default Explorar;