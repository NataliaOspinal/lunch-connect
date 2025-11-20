import React from "react";

const BannerFeature = () => {
  return (
    <section className="bg-white py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Franja Superior "Totalmente gratis" */}
        <div className="flex flex-col md:flex-row items-center justify-center mb-20">
          
          {/* Lado Izquierdo */}
          <div className="w-full md:w-1/2 text-center md:text-right px-4 md:px-10 py-4 md:border-r-4 border-primary">
            <h2 className="text-3xl md:text-4xl font-bold text-black">
              Totalmente gratis
            </h2>
          </div>

          {/* Lado Derecho */}
          <div className="w-full md:w-1/2 text-center md:text-left px-4 md:px-10 py-4">
            <p className="text-lg md:text-xl text-black font-medium max-w-md mx-auto md:mx-0">
              Puedes optar por una experiencia totalmente gratuita, en grupos de hasta 5 personas
            </p>
          </div>
        </div>

        {/* --- Sección Imagen + Texto --- */}
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
          
          {/* Imagen (Izquierda) */}
          <div className="w-full md:w-1/2">
            <img
              src="/ComidaFeature.png" 
              alt="Hamburguesa y comida rápida"
              className="rounded-lg shadow-lg w-full h-auto object-cover transform hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Texto (Derecha) */}
          <div className="w-full md:w-1/2 text-center md:text-left">
            <span className="uppercase tracking-widest text-m font-bold text-gray-500 mb-2 block">
              TE MUESTRA
            </span>
            
            <h3 className="text-4xl md:text-5xl font-bold text-black mb-6 font-secondary leading-tight">
              Restaurantes <br /> cercanos
            </h3>
            
            <p className="text-lg text-black font-medium leading-relaxed">
              En tiempo real, promocionando <br className="hidden md:block" />
              nuevos y/o pequeños <br className="hidden md:block" />
              emprendimientos
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default BannerFeature;