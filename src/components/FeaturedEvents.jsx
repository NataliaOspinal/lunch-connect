import { useRef, useState, useEffect } from "react";
import EventModal from "./EventModal";

const FeaturedEvents = () => {
  const scrollRef = useRef(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // 💡 Estado para almacenar los grupos reales de la BD
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // =========================================================
  // 💡 LÓGICA DE CARGA DE DATOS DESDE LA API (useEffect)
  // =========================================================
  useEffect(() => {
    const fetchGroups = async () => {
      const API_URL = "https://lunchconnect-backend.onrender.com/api/grupos"; // ⚠️ REEMPLAZA ESTO

      try {
        setLoading(true);
        const response = await fetch(API_URL);

        if (!response.ok) {
          // Si el servidor responde con un error HTTP (4xx, 5xx)
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Asume que tu API de Spring Boot devuelve una lista de objetos Grupo
        const data = await response.json();

        // ⚠️ Nota: Tendrás que mapear los campos del backend (ej: 'nombre', 'capacidad') 
        // a los campos del frontend (ej: 'title', 'maxUsers') si no coinciden.
        setEvents(data);
        setError(null);

      } catch (err) {
        console.error("Error al obtener grupos:", err);
        setError("No se pudieron cargar los grupos. ¿Está el backend corriendo?");
        // Opcional: Si falla, puedes cargar los mocks para que la UI no esté vacía
        // setEvents(mockEvents); 
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []); // El array vacío asegura que solo se ejecuta al montar

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

  // Función para abrir el modal
  const handleOpenModal = (event) => {
    setSelectedEvent(event);
  };

  // Función para cerrar
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
          Eventos destacados
        </h2>

        {/* 💡 Estados de Carga y Error */}
        {loading && <p className="text-center text-primary text-lg">Cargando grupos...</p>}
        {error && <p className="text-center text-red-500 text-lg font-bold">{error}</p>}

        <div className="relative flex items-center group">


          {/* Flecha Izquierda (Oculta en móvil) */}
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
            {events.map((event) => (
              <div
                key={event.id}
                className="flex-none min-w-full md:min-w-[500px] bg-primary rounded-2xl p-6 text-white snap-center shadow-lg relative"
              >
                {/* HEADER TARJETA */}
                <div className="flex justify-between items-start mb-4">
                  {/* 1. TÍTULO: Usar 'nombreGrupo' */}
                  <h3 className="text-2xl font-bold">{event.nombreGrupo}</h3>
                  <div className="flex items-center gap-1 text-xl font-semibold">
                    {/* 2. USUARIOS: Usar 'participantesCount' y 'maxMiembros' */}
                    <span>{event.participantesCount}/{event.maxMiembros}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>

                {/* BODY TARJETA */}
                <div className="flex flex-col md:flex-row gap-4 md:gap-6">

                  {/* Imagen + Botón */}
                  <div className="w-full md:w-1/3 flex flex-col gap-3">
                    <div className="aspect-square bg-secondary/50 rounded-lg flex items-center justify-center h-32 md:h-auto">
                      {/* Nota: Forcé h-32 en móvil para que la imagen no sea gigante verticalmente */}
                      {event.image ? (
                        <img src={event.image} alt={event.title} className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white/20" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>

                    <button onClick={() => handleOpenModal(event)} className="w-full py-2 cursor-pointer bg-secondary rounded-full font-semibold hover:bg-black transition-colors text-sm">
                      Únete
                    </button>
                  </div>

                  {/* Información */}
                  <div className="w-full md:w-2/3 flex flex-col justify-between gap-4 md:gap-0">
                    <div>
                      {/* 3. DIRECCIÓN: Usar 'restauranteDireccion' y 'restauranteDistrito' */}
                      <p className="text-sm font-bold mb-1">
                        Dirección:
                        <span className="font-normal text-gray-200">
                          {event.restauranteDireccion}, {event.restauranteDistrito}
                        </span>
                      </p>
                      {/* Podemos agregar aquí más detalles, como la fecha y hora */}
                      <p className="text-sm font-bold mb-1">
                        Fecha:
                        <span className="font-normal text-gray-200">
                          {new Date(event.fechaHoraAlmuerzo).toLocaleString('es-PE', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-bold mb-2">Carreras:</p>
                      <div className="flex flex-wrap gap-2">
                        {/* 4. CARRERAS: Esta propiedad no existe en tu JSON, se reemplaza por un placeholder hasta que el backend la proporcione. */}
                        <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full whitespace-nowrap">
                          💡 No hay datos de carrera disponibles
                        </span>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={scrollRight}
            className="hidden md:block cursor-pointer right-0 z-10 p-2 -mr-5 text-4xl font-bold text-primary hover:scale-110 transition-transform"
          >
            &gt;
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedEvents;