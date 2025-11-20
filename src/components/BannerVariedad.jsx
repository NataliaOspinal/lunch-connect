import React from "react";

const BannerVariedad = () => {
  return (
    <section className="bg-white py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Contenedor Flex */}
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
          
          {/* --- SECCIÓN DE TEXTO (Izquierda) --- */}
          {/* text-center en móvil, md:text-left en PC para la línea perfecta */}
          <div className="w-full md:w-1/2 text-center md:text-right">
            
            {/* Subtítulo */}
            <span className="uppercase tracking-widest text-m font-medium text-gray-600 mb-3 block">
              CUENTA CON
            </span>
            
            {/* Título Principal */}
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-6 font-secondary leading-tight">
              Variedad de <br className="hidden md:block"/> comidas
            </h2>
            
            {/* Descripción */}
            {/* mx-auto (centrado en móvil) y md:mx-0 (sin margen automático en PC para que se pegue a la izq) */}
            <p className="text-lg md:text-xl text-black max-w-md mx-auto md:mr-0 leading-relaxed">
              Con títulos personalizados para tu cuenta según tu comida favorita
            </p>
          </div>

          {/* --- SECCIÓN DE IMAGEN (Derecha) --- */}
          <div className="w-full md:w-1/2">
            <img
              src="/ComidaSegundoBanner.png" 
              alt="Buffet con variedad de comidas"
              className="rounded-lg shadow-lg w-full h-auto object-cover transform hover:scale-105 transition-transform duration-500"
            />
          </div>

        </div>
      </div>
    </section>
  );
};

export default BannerVariedad;