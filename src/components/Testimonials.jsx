import React, { useState } from "react";

const Testimonials = () => {
  // 1. Estado para saber cuál reseña está activa (empezamos con la 0)
  const [activeIndex, setActiveIndex] = useState(0);

  // 2. Datos de las reseñas
  const reviews = [
    {
      id: 0,
      role: "Ingeniero de Sistemas",
      details: ["Usuario de 3 meses", "Chifita lover", "Lima-Perú"],
      quote: "Gracias a esta página conocí a mi mejor amigo y ahora estamos desarrollando un videojuego juntos",
      author: "Juan P., 27 años",
    },
    {
      id: 1,
      role: "Diseñadora",
      details: ["Usuario de 6 meses", "Broster sister", "Lima-Perú"],
      quote: "Al fin encontré gente creativa para almorzar cerca de mi oficina. ¡El networking es increíble!",
      author: "Ana M., 24 años",
    },
    {
      id: 2,
      role: "Ingeniero Civil",
      details: ["Usuario de 9 meses", "Makis aficionado", "Lima-Perú"],
      quote: "Siempre comía solo en la obra, ahora organizamos almuerzos grupales cada viernes.",
      author: "Carlos R., 30 años",
    },
  ];

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* TÍTULO DE LA SECCIÓN */}
        <h2 className="text-4xl md:text-5xl font-bold text-center text-primary mb-16 font-primary">
          Nuestras Reseñas
        </h2>

        <div className="flex flex-col md:flex-row gap-8 md:gap-0">
          
          {/* --- COLUMNA IZQUIERDA: Lista de Perfiles --- */}
          <div className="w-full md:w-5/12 flex flex-col space-y-2 relative">
            
            {/* Línea divisoria vertical (Solo visible en desktop) */}
            <div className="hidden md:block absolute right-0 top-0 h-full w-0.5 bg-primary/50"></div>

            {reviews.map((review, index) => (
              <div
                key={review.id}
                onClick={() => setActiveIndex(index)}
                className={`
                  cursor-pointer p-6 rounded-4x1 transition-all duration-250 md:mr-8
                  ${activeIndex === index 
                    ? "bg-primary text-white shadow-xl scale-105 rounded-2xl" // Estilo Activo (Tarjeta oscura)
                    : "bg-transparent text-primary hover:bg-gray-50 border-b md:border-b-0 border-gray-200 rounded-2xl" // Estilo Inactivo
                  }
                `}
              >
                <h3 className="text-xl font-bold mb-2">{review.role}</h3>
                <ul className="text-sm font-medium leading-relaxed opacity-90">
                  {review.details.map((detail, i) => (
                    <li key={i}>{detail}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* --- COLUMNA DERECHA: Citas --- */}
          <div className="w-full md:w-7/12 flex flex-col justify-center items-center md:items-start px-4 md:pl-16">
            
            {/* Texto de la cita */}
            {/* key={activeIndex} fuerza una pequeña animación al cambiar */}
            <div key={activeIndex} className="animate-fade-in-up">
              <p className="text-2xl md:text-3xl font-medium text-primary mb-10 leading-normal">
                “{reviews[activeIndex].quote}”
              </p>

              {/* Autor e Icono */}
              <div className="flex items-center gap-4">
                {/* Icono de imagen (SVG Placeholder) */}
                <div className="w-12 h-12 border-2 border-primary rounded-lg flex items-center justify-center p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#3D0F0F" className="w-full h-full">
                    <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
                  </svg>
                </div>
                
                {/* Nombre */}
                <span className="text-xl font-bold text-primary">
                  {reviews[activeIndex].author}
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;