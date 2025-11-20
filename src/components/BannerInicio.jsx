import React from "react";

const BannerInicio = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10 md:py-20 flex flex-col md:flex-row items-center gap-10 md:gap-16">
      
      {/* SECCIÓN DE TEXTO */}
      <div className="w-full md:w-1/2 flex flex-col justify-left text-left md:items-start md:text-left">
        
        {/* TÍTULO */}
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight">
          Descubre y Comparte <br className="hidden md:block" /> Platos Deliciosos
        </h1>
        
        {/* PÁRRAFO */}
        <p className="text-lg text-gray-200 mb-8 leading-relaxed">
          Conéctate con profesionales de tu carrera u otras, mientras disfrutan su almuerzo favorito.
        </p>
        
        {/* BOTÓN */}
        {/* El 'w-fit' es importante para que el botón no ocupe todo el ancho si usas flex-col */}
        <button className="bg-red-700 font-semibold px-8 py-3 rounded-full hover:cursor-pointer hover:bg-secondary transition-colors duration-300 shadow-lg w-fit">
          Comenzar Ahora
        </button>

      </div>

      {/* SECCIÓN DE IMAGEN */}
      <div className="w-full md:w-1/2 flex justify-center md:justify-end">
        <img
          src="/ComidaInicioBanner.png" 
          alt="Variedad de platos de comida"
          className="rounded-xl shadow-xl max-w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
        />
      </div>
    </div>
  );
};

export default BannerInicio;