import React from "react";

const BenefitsSection = () => {
  // Datos de las tarjetas para mantener el código limpio
  const benefits = [
    {
      id: 1,
      text: "Almuerza con personas de tus mismos gustos y establece conexiones importantes",
      icon: (
        <img src="/GroupsBenefits.png" alt="Conexiones" className="w-12 h-12" />
      ),
    },
    {
      id: 2,
      text: "Encuentra nuevos restaurantes locales y súmalos a tu lista de favoritos",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
          <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      id: 3,
      text: "Agenda una comida con tu grupo y permite visualización de otros grupos en la zona",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
          <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z" clipRule="evenodd" />
        </svg>
      ),
    },
  ];

  return (
    <section className="bg-white py-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Grid Container: 1 columna en móvil, 3 en desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          
          {benefits.map((item) => (
            <div key={item.id} className="flex flex-col items-center">
              {/* Icono */}
              <div className="text-primary mb-6">
                {item.icon}
              </div>
              
              {/* Texto */}
              <p className="text-primary font-medium text-lg md:text-xl leading-relaxed max-w-xs mx-auto">
                {item.text}
              </p>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;