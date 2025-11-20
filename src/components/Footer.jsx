import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-primary py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start">
        
        {/* --- COLUMNA IZQUIERDA: Logo y Copyright --- */}
        <div className="flex flex-col justify-between h-full mb-10 md:mb-0">
          {/* Logo */}
          <h2 className="text-2xl md:text-3xl mb-8 md:mb-24">
            LunchConnect
          </h2>
          
          {/* Copyright */}
          <p className="text-xs md:text-sm text-white font-light">
            @2025 Todos los derechos reservados
          </p>
        </div>

        {/* --- COLUMNA DERECHA: Enlaces --- */}
        <div className="flex flex-col space-y-4 text-lg font-medium">
          <a href="#" className="hover:text-gray-300 transition-colors">
            Explorar
          </a>
          <a href="#" className="hover:text-gray-300 transition-colors">
            Acerca de
          </a>
          <a href="#" className="hover:text-gray-300 transition-colors">
            Términos y condiciones
          </a>
          <a href="#" className="hover:text-gray-300 transition-colors">
            Contáctanos
          </a>
        </div>

      </div>
    </footer>
  );
};

export default Footer;