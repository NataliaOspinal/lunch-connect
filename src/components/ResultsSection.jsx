import React from "react";

const ResultsSection = () => {
  // Datos simulados 
  const results = [
    {
      id: 1,
      title: "Shawarma El Egipcio",
      address: "Av. Avenida 999, Lince, Lima-Peru",
      current: 9,
      max: 15,
      careers: [
        { name: "Diseño gráfico", count: 3 },
        { name: "Ing. Sistemas", count: 2 },
        { name: "Ing. Industrial", count: 2 },
      ],
      image: null, // null para usar placeholder
    },
    {
      id: 2,
      title: "Chifa LongWa",
      address: "Jr. Las Begonias 450, San Isidro",
      current: 4,
      max: 8,
      careers: [
        { name: "Marketing", count: 2 },
        { name: "Arquitectura", count: 1 },
      ],
      image: null,
    },
  ];

  // Variable temporal (calculada según la longitud del array)
  const eventosEncontrados = results.length;

  return (
    <section className="bg-white py-10 w-full">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* --- HEADER: TÍTULO + VARIABLE TEMPORAL --- */}
        <div className="flex flex-col md:flex-row md:items-end gap-2 mb-8">
          <h2 className="text-4xl font-bold text-primary font-secondary">
            Resultados
          </h2>
          <span className="text-lg font-medium text-gray-500 md:mb-1 md:ml-4">
            {eventosEncontrados} eventos encontrados
          </span>
        </div>

        {/* --- LISTA DE TARJETAS --- */}
        <div className="flex flex-col gap-6">
          {results.map((item) => (
            <div
              key={item.id}
              className="bg-[#601919] rounded-3xl p-6 text-white shadow-lg flex flex-col lg:flex-row gap-8 items-start lg:items-center"
            >
              
              {/* COLUMNA 1: INFO PRINCIPAL (40% del ancho en PC) */}
              <div className="w-full lg:w-5/12 flex flex-col gap-4">
                
                {/* Título + Botón Únete */}
                <div className="flex flex-wrap items-center gap-4">
                  <h3 className="text-2xl font-bold">{item.title}</h3>
                  <button className="bg-[#3D0F0F] hover:bg-black text-white text-xs px-4 py-1.5 rounded-full font-semibold transition-colors">
                    Únete
                  </button>
                </div>

                {/* Imagen + Dirección + Aforo */}
                <div className="flex gap-4 mt-2">
                  {/* Imagen Placeholder */}
                  <div className="w-24 h-24 bg-[#3D0F0F]/50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white/20" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                  </div>

                  {/* Info Texto */}
                  <div className="flex flex-col justify-center gap-2">
                    <p className="text-sm leading-tight">
                      <span className="font-bold">Dirección:</span> {item.address}
                    </p>
                    <div className="flex items-center gap-2 text-2xl font-bold">
                      {item.current}/{item.max}
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* COLUMNA 2: CARRERAS (30% del ancho en PC) */}
              <div className="w-full lg:w-3/12 flex flex-col gap-3">
                <p className="font-bold">Carreras:</p>
                <div className="flex flex-col gap-2 items-start">
                  {item.careers.map((career, index) => (
                    <span
                      key={index}
                      className="bg-white/20 px-4 py-1.5 rounded-full text-sm font-medium"
                    >
                      {career.name} ({career.count})
                    </span>
                  ))}
                  <button className="text-sm text-gray-300 hover:text-white underline mt-1">
                    Y otras más...
                  </button>
                </div>
              </div>

              {/* COLUMNA 3: AVATARES GRID (30% del ancho en PC) */}
              <div className="w-full lg:w-4/12 flex justify-center lg:justify-end flex-col gap-2">
              <p className="text-lg text-white font-medium">Ver perfiles</p>
                <div className="bg-[#8B3A3A]/40 rounded-2xl p-6 w-full max-w-xs">
                  {/* Grid de 4 columnas para los iconos */}
                  <div className="grid grid-cols-4 gap-4 justify-items-center">
                    {/* 8 iconos placeholder para simular la imagen */}
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="bg-secondary rounded-full p-2 w-10 h-10 flex items-center justify-center">
                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-gray-400">
                          <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                        </svg>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ResultsSection;