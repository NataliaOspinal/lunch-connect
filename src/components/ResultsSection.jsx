import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EventModal from "./EventModal";
import { getToken } from "../services/authService";

const ResultsSection = () => {
  const navigate = useNavigate();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [results, setResults] = useState([]); 
  const [filteredResults, setFilteredResults] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [searchCareer, setSearchCareer] = useState(""); 

  // --- CARGA DE DATOS ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = getToken();
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
        

        // 1. Obtener todos los grupos
        const groupsRes = await fetch('https://lunchconnect-backend.onrender.com/api/grupos', { headers });
        if (!groupsRes.ok) throw new Error("Error loading groups");
        const groupsData = await groupsRes.json();

        // 2. Procesar cada grupo para obtener participantes
        const processedGroups = await Promise.all(groupsData.map(async (group) => {
            const groupId = group.id || group.id_grupo;
            const rawDate = new Date(group.fechaHoraAlmuerzo || group.fecha_hora_almuerzo);
            let participants = [];
            let careerCounts = {}; 

            try {
                const partRes = await fetch(`https://lunchconnect-backend.onrender.com/api/grupos/${groupId}/participantes`, { headers });
                if (partRes.ok) {
                    participants = await partRes.json();
                    
                    // --- CORRECCIÓN AQUÍ ---
                    participants.forEach(p => {
                        // Buscamos 'rubro_profesional' en camelCase o snake_case
                        const career = p.rubroProfesional || p.rubro_profesional || "Sin carrera";
                        
                        // Contamos las ocurrencias
                        careerCounts[career] = (careerCounts[career] || 0) + 1;
                    });
                }
            } catch (e) {
                console.error(`Error fetching participants for group ${groupId}`, e);
            }

            // Convertir objeto de conteo a array para renderizar
            const careersArray = Object.entries(careerCounts).map(([name, count]) => ({ name, count }));

            return {
                id: groupId,
                title: group.nombreGrupo || group.nombre_grupo,
                address: `${group.restauranteDireccion || ''}, ${group.restauranteDistrito || ''}`,
                current: participants.length,
                max: group.maxMiembros || group.max_miembros,
                
                // --- AGREGAR ESTAS DOS LÍNEAS ---
                date: rawDate.toLocaleDateString(), // Ej: 12/12/2025
                time: rawDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), // Ej: 13:00
                // --------------------------------

                careers: careersArray,
                image: null, 
                participants: participants
            };
        }));

        setResults(processedGroups);
        setFilteredResults(processedGroups);

      } catch (error) {
        console.error("General error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- FILTRADO POR CARRERA (Buscador) ---
  useEffect(() => {
      if (!searchCareer.trim()) {
          setFilteredResults(results);
          return;
      }
      
      const term = searchCareer.toLowerCase();
      const filtered = results.filter(group => 
          group.careers.some(c => c.name.toLowerCase().includes(term))
      );
      setFilteredResults(filtered);
  }, [searchCareer, results]);

  // --- LÓGICA DE UNIRSE ---
  const handleJoinGroup = async (group) => {
      const token = getToken();
      if (!token) {
          if(window.confirm("Debes iniciar sesión para unirte. ¿Ir al login?")) {
              navigate('/login');
          }
          return;
      }

      try {
          const response = await fetch(`https://lunchconnect-backend.onrender.com/api/grupos/${group.id}/unirse`, {
              method: 'POST',
              headers: { 
                  'Authorization': `Bearer ${token}`, 
                  'Content-Type': 'application/json' 
              }
          });

          if (response.ok) {
              alert("¡Te has unido exitosamente!");
              // Actualización optimista de la UI
              setResults(prev => prev.map(g => {
                  if (g.id === group.id) {
                      return { ...g, current: g.current + 1 };
                  }
                  return g;
              }));
          } else {
              const errorData = await response.json().catch(() => ({}));
              alert(`Error: ${errorData.message || 'No se pudo unir al grupo'}`);
          }
      } catch (error) {
          alert("Error de conexión.");
      }
  };


  return (
    <section className="bg-white py-10 w-full">
      <EventModal 
        isOpen={!!selectedEvent} 
        onClose={() => setSelectedEvent(null)} 
        event={selectedEvent} 
      />

      <div className="max-w-7xl mx-auto px-6">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div className="flex flex-col md:flex-row md:items-end gap-2">
              <h2 className="text-4xl font-bold text-primary font-secondary">
                Resultados
              </h2>
              <span className="text-lg font-medium text-gray-500 md:mb-1 md:ml-4">
                {filteredResults.length} eventos encontrados
              </span>
          </div>

          {/* Buscador */}
          <div className="relative w-full md:w-64">
              <input 
                  type="text" 
                  placeholder="Filtrar por rubro..." 
                  value={searchCareer}
                  onChange={(e) => setSearchCareer(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none text-black focus:ring-2 focus:ring-primary"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
          </div>
        </div>

        {/* --- LOADING --- */}
        {loading && <p className="text-center text-gray-500">Cargando resultados...</p>}

        {/* --- LISTA DE TARJETAS --- */}
        {!loading && (
            <div className="flex flex-col gap-6">
            {filteredResults.map((item) => (
                <div
                key={item.id}
                className="bg-primary rounded-3xl p-6 text-white shadow-lg flex flex-col lg:flex-row gap-8 items-start lg:items-center"
                >
                
                {/* COLUMNA 1: INFO */}
                <div className="w-full lg:w-5/12 flex flex-col gap-4">
                    <div className="flex flex-wrap items-center gap-4">
                        <h3 className="text-2xl font-bold">{item.title}</h3>
                        <button 
                            onClick={() => handleJoinGroup(item)} 
                            className="bg-[#8B3A3A] cursor-pointer hover:bg-black text-white text-xs px-4 py-1.5 rounded-full font-semibold transition-colors"
                        >
                            Únete
                        </button>
                    </div>

                    <div className="flex gap-4 mt-2">
                        <div className="w-24 h-24 bg-[#8B3A3A] rounded-xl flex items-center justify-center shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white/50" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                            </svg>
                        </div>

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

                {/* COLUMNA 2: CARRERAS (Rubro Profesional) */}
                <div className="w-full lg:w-3/12 flex flex-col gap-3">
                    <p className="font-bold">Rubros:</p>
                    <div className="flex flex-col gap-2 items-start">
                    {item.careers.length > 0 ? (
                        item.careers.slice(0, 3).map((career, index) => (
                            <span
                            key={index}
                            className="bg-white/20 px-4 py-1.5 rounded-full text-sm font-medium"
                            >
                            {career.name} ({career.count})
                            </span>
                        ))
                    ) : (
                        <span className="text-sm text-gray-300 italic">No hay datos</span>
                    )}
                    
                    {item.careers.length > 3 && (
                        <button 
                            onClick={() => setSelectedEvent(item)} 
                            className="text-sm text-gray-300 hover:text-white underline mt-1"
                        >
                            Y otras más...
                        </button>
                    )}
                    </div>
                </div>

                {/* COLUMNA 3: AVATARES */}
                <div className="w-full lg:w-4/12 flex justify-center lg:justify-end flex-col gap-2">
                <p className="text-lg text-white font-medium text-center lg:text-right">Ver perfiles</p>
                    <div className="bg-[#8B3A3A]/40 rounded-2xl p-6 w-full">
                    <div className="grid grid-cols-4 gap-4 justify-items-center">
                        {item.participants.length > 0 ? (
                            item.participants.slice(0, 8).map((p, i) => (
                                <div 
                                    key={i} 
                                    className="bg-[#8B3A3A] rounded-full p-2 w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors" 
                                    title={`${p.nombres || ''} ${p.apellidos || ''}`} 
                                    onClick={() => setSelectedEvent(item)}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
                                    <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            ))
                        ) : (
                            <p className="col-span-4 text-xs text-center opacity-70">Aún no hay miembros</p>
                        )}
                    </div>
                    </div>
                </div>

                </div>
            ))}
            </div>
        )}
      </div>
    </section>
  );
};

export default ResultsSection;