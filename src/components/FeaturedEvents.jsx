import React, { useRef, useState, useEffect } from "react";
import EventModal from "./EventModal";

const FeaturedEvents = () => {
  const scrollRef = useRef(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  // 1. Estado para almacenar los datos que vienen de la API
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. Consumir la API real de Render al cargar el componente
  useEffect(() => {
    const fetchRestaurantes = async () => {
      try {
        const response = await fetch('https://lunchconnect-backend.onrender.com/api/restaurantes');
        
        if (!response.ok) {
          throw new Error('Error al conectar con el servidor');
        }

        const data = await response.json();

        // 3. Transformar (Map) los datos de la Base de Datos al formato de tus tarjetas
        const mappedEvents = data.map((restaurante) => ({
          id: restaurante.id_restaurante,      // Viene de tu tabla 'restaurante'
          title: restaurante.nombre,           // Viene de tu tabla 'restaurante'
          address: restaurante.direccion,      // Viene de tu tabla 'restaurante'
          image: restaurante.url_imagen,       // Viene de tu tabla 'restaurante'
          
          // --- DATOS SIMULADOS / CALCULADOS ---
          // Como la API de restaurantes no trae grupos activos, simulamos esto
          // o usamos la capacidad máxima del local si existe.
          currentUsers: 0, 
          maxUsers: restaurante.capacidad_maxima || 10, 
          careers: ["Disponible para todos"],   // Texto por defecto al ser un local
        }));

        setEvents(mappedEvents);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantes();
  }, []);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  // Funciones del Modal
  const handleOpenModal = (event) => {
    setSelectedEvent(event);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  return (
    <section className="py-12 w-full bg-white relative">
      <EventModal 
        isOpen={!!selectedEvent} 
        onClose={handleCloseModal} 
        event={selectedEvent} 
      />
      
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-10 font-primary">
          Lugares para armar tu grupo
        </h2>

        {/* LOADING STATE */}
        {loading && (
          <p className="text-center text-gray-500">Cargando restaurantes disponibles...</p>
        )}

        {!loading && (
          <div className="relative flex items-center group">
            <button
              onClick={scrollLeft}
              className="hidden md:block cursor-pointer left-0 z-10 p-2 -ml-5 text-4xl font-bold text-primary hover:scale-110 transition-transform"
            >
              &lt;
            </button>

            {/* CONTENEDOR DEL SLIDER */}
            <div
              ref={scrollRef}
              className="flex gap-4 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide w-full"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {events.length > 0 ? (
                events.map((event) => (
                  <div
                    key={event.id}
                    className="flex-none min-w-full md:min-w-[500px] bg-primary rounded-2xl p-6 text-white snap-center shadow-lg relative"
                  >
                    {/* HEADER TARJETA */}
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-2xl font-bold truncate pr-4">{event.title}</h3>
                      <div className="flex items-center gap-1 text-xl font-semibold whitespace-nowrap">
                        {/* Mostramos capacidad del local */}
                        <span>Cap: {event.maxUsers}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    </div>

                    {/* BODY TARJETA */}
                    <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                      
                      {/* Imagen + Botón */}
                      <div className="w-full md:w-1/3 flex flex-col gap-3">
                        <div className="aspect-square bg-secondary/50 rounded-lg flex items-center justify-center h-32 md:h-auto overflow-hidden">
                          {event.image ? (
                            <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white/20" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        
                        {/* CAMBIO DE TEXTO: Al ser restaurantes para armar grupo, "Crear Grupo" o "Ver local" tiene más sentido, pero mantengo "Únete" si prefieres */}
                        <button onClick={() => handleOpenModal(event)} className="w-full py-2 cursor-pointer bg-secondary rounded-full font-semibold hover:bg-black transition-colors text-sm">
                          Ver local
                        </button>
                      </div>

                      {/* Información */}
                      <div className="w-full md:w-2/3 flex flex-col justify-between gap-4 md:gap-0">
                        <div>
                          <p className="text-sm font-bold mb-1">Dirección: <span className="font-normal text-gray-200">{event.address}</span></p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-bold mb-2">Ideal para:</p>
                          <div className="flex flex-wrap gap-2">
                            {event.careers.map((career, index) => (
                              <span 
                                key={index} 
                                className="bg-white/20 text-white text-xs px-3 py-1 rounded-full whitespace-nowrap"
                              >
                                {career}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                ))
              ) : (
                <div className="w-full text-center py-10 text-gray-500 bg-gray-100 rounded-xl">
                  No se encontraron restaurantes disponibles.
                </div>
              )}
            </div>

            <button
              onClick={scrollRight}
              className="hidden md:block cursor-pointer right-0 z-10 p-2 -mr-5 text-4xl font-bold text-primary hover:scale-110 transition-transform"
            >
              &gt;
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedEvents;