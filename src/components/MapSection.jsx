import React, { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useNavigate } from "react-router-dom"; 
import { getToken } from "../services/authService"; 
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

// --- CONFIGURACIÓN LEAFLET ---
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const RestaurantIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const MapUpdater = ({ center }) => {
  const map = useMap();
  map.setView(center, 15);
  return null;
};

// --- SUB-COMPONENTE: MARCADOR ---
const RestaurantMarker = ({ data }) => {
    const navigate = useNavigate();
    const [grupos, setGrupos] = useState([]);
    const [loadingGrupos, setLoadingGrupos] = useState(false);
    const [loaded, setLoaded] = useState(false);

    const fetchGruposDelRestaurante = async () => {
        setLoadingGrupos(true);
        try {
            const response = await fetch('https://lunchconnect-backend.onrender.com/api/grupos');
            if (response.ok) {
                const todosLosGrupos = await response.json();
                const idRestauranteActual = data.id || data.id_restaurante;
                const gruposDelLocal = todosLosGrupos.filter(g => {
                    const rId = g.restauranteId || g.restaurante_elegido_id;
                    return String(rId) === String(idRestauranteActual);
                });
                setGrupos(gruposDelLocal);
                setLoaded(true);
            }
        } catch (error) {
            console.error("Error cargando grupos:", error);
        } finally {
            setLoadingGrupos(false);
        }
    };

    const handlePopupOpen = () => {
        if (!loaded) fetchGruposDelRestaurante();
    };

    const handleJoinGroup = async (groupId) => {
        const token = getToken();
        if (!token) {
            if(window.confirm("Debes iniciar sesión para unirte. ¿Ir al login?")) navigate('/login');
            return;
        }
        try {
            const response = await fetch(`https://lunchconnect-backend.onrender.com/api/grupos/${groupId}/unirse`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
            });
            if (response.ok) {
                alert("¡Te has unido exitosamente!");
                fetchGruposDelRestaurante();
            } else {
                const errorData = await response.json().catch(() => ({}));
                alert(`Error: ${errorData.message || 'No se pudo unir al grupo'}`);
            }
        } catch (error) {
            alert("Error de conexión.");
        }
    };

    return (
        <Marker 
            position={[data.lat, data.lng]} 
            icon={RestaurantIcon}
            eventHandlers={{ click: handlePopupOpen }}
        >
            <Popup className="custom-popup">
                <div className="text-black min-w-60">
                    <h3 className="font-bold text-lg border-b border-gray-200 pb-2 mb-2 text-primary">{data.nombre}</h3>
                    <p className="text-xs text-gray-500 mb-3 flex items-center gap-1">📍 {data.direccion}</p>
                    
                    <div className="bg-gray-50 p-2 rounded-lg border border-gray-100">
                        {loadingGrupos ? (
                            <p className="text-center text-xs text-gray-400 animate-pulse">Buscando grupos...</p>
                        ) : grupos.length > 0 ? (
                            <>
                                <p className="font-bold text-primary text-xs mb-2">Grupos disponibles ({grupos.length}):</p>
                                <ul className="list-none p-0 m-0 max-h-40 overflow-y-auto custom-scrollbar space-y-2">
                                    {grupos.map(g => (
                                        <li key={g.id || g.id_grupo} className="flex flex-col bg-white p-2 rounded border border-gray-200 shadow-sm">
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="font-bold text-xs">{g.nombreGrupo || g.nombre_grupo}</span>
                                                <span className="text-[10px] bg-gray-100 px-1 rounded">{g.participantesCount || 0}/{g.maxMiembros || g.max_miembros}</span>
                                            </div>
                                            <div className="flex justify-between items-center mt-1">
                                                <span className="text-[10px] text-gray-500">{new Date(g.fechaHoraAlmuerzo || g.fecha_hora_almuerzo).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                                <button onClick={() => handleJoinGroup(g.id || g.id_grupo)} className="bg-primary text-white text-[10px] px-3 py-1 rounded font-bold hover:bg-black transition-colors cursor-pointer border-none">Unirme</button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        ) : (
                            <div className="text-center py-2">
                                <p className="text-xs text-gray-400 mb-2">No hay grupos activos aquí.</p>
                                <a href="/unete" className="text-primary text-xs font-bold underline cursor-pointer">¡Crea el primero!</a>
                            </div>
                        )}
                    </div>
                </div>
            </Popup>
        </Marker>
    );
};

// --- COMPONENTE TAGS (MODIFICADO PARA MANEJAR "REMOVE") ---
const TagSection = ({ title, tags, setTags, selectedTag, onSelectTag, onRemoveTag }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const inputRef = useRef(null);

    useEffect(() => { if (isEditing && inputRef.current) inputRef.current.focus(); }, [isEditing]);

    const handleAddTag = () => { 
        if (inputValue.trim() !== "") { 
            setTags([...tags, inputValue.trim()]); 
            setInputValue(""); 
        } 
        setIsEditing(false); 
    };

    const removeTag = (index, e) => {
        e.stopPropagation(); 
        const tagToRemove = tags[index];
        
        // 1. Quitamos visualmente
        setTags(tags.filter((_, i) => i !== index));
        
        // 2. Limpiamos selección si era el activo
        if (selectedTag === tagToRemove && onSelectTag) onSelectTag(null);

        // 3. Notificamos al padre para excluirlo de la búsqueda
        if (onRemoveTag) onRemoveTag(tagToRemove);
    };

    return (
        <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
                <label className="font-bold text-lg">{title}:</label>
                {isEditing ? (
                    <input ref={inputRef} type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddTag()} onBlur={handleAddTag} className="bg-secondary border border-red-500/50 text-white text-sm rounded px-2 py-1 w-32 focus:outline-none focus:ring-1 focus:ring-red-400" />
                ) : (
                    <button onClick={() => setIsEditing(true)} className="bg-secondary/40 hover:bg-secondary px-3 py-1 rounded text-sm text-red-200 hover:text-white flex items-center gap-2 transition-colors border border-transparent hover:border-red-900">Agrega un tag</button>
                )}
            </div>
            <div className="flex flex-wrap gap-3">
                {tags.map((tag, i) => {
                    const isSelected = selectedTag === tag;
                    return (
                        <button 
                            key={i} 
                            onClick={() => onSelectTag && onSelectTag(isSelected ? null : tag)} 
                            className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-all border-2 cursor-pointer
                                ${isSelected 
                                    ? "bg-white text-primary border-white font-bold scale-105" 
                                    : "bg-[#8B3A3A] text-white border-transparent hover:bg-[#a64444]"
                                }`
                            }
                        >
                            {tag}
                            <div onClick={(e) => removeTag(i, e)} className={`rounded-full p-0.5 transition-colors ${isSelected ? "hover:bg-gray-200" : "hover:text-red-200 hover:bg-black/10"}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

// --- COMPONENTE PRINCIPAL ---
const MapSection = () => {
  const [position, setPosition] = useState([-12.0464, -77.0428]); 
  const [searchTerm, setSearchTerm] = useState("Lima"); 
  const [mapMarkers, setMapMarkers] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Estados de Filtros
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [excludedCategories, setExcludedCategories] = useState([]); // NUEVO: Categorías excluidas
  const [foodTags, setFoodTags] = useState([
      "Chifa", "Criolla", "Italiana", "Japonesa", "Comida Rápida", "Árabe"
  ]);
  const [careerTags, setCareerTags] = useState(["Ing. Sistemas", "Ing. Software"]);

  // --- LÓGICA DE BÚSQUEDA ---
  const executeSearch = async (term, centerMap = true, categoryFilter = null, exclusions = []) => {
    const queryTerm = term.trim() === "" ? "Lima" : term;
    setLoading(true);
    setMapMarkers([]); 
    
    // Mensaje dinámico
    let msg = `Buscando en ${queryTerm}...`;
    if (categoryFilter) msg = `Buscando ${categoryFilter} en ${queryTerm}...`;
    if (exclusions.length > 0) msg = `Buscando en ${queryTerm} (excluyendo ${exclusions.length})...`;
    setStatusMessage(msg);

    try {
        if (centerMap) {
            const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(queryTerm + ', Peru')}&limit=1`);
            const geoData = await geoRes.json();
            if (geoData && geoData.length > 0) {
                setPosition([parseFloat(geoData[0].lat), parseFloat(geoData[0].lon)]);
            }
        }

        const baseUrl = 'https://lunchconnect-backend.onrender.com/api/restaurantes/filtrar';
        const params = new URLSearchParams();
        if (queryTerm !== "Lima") params.append('distrito', queryTerm);
        if (categoryFilter) params.append('categoria', categoryFilter);

        const apiRes = await fetch(`${baseUrl}?${params.toString()}`);
        
        if (apiRes.ok) {
            let restaurantesEncontrados = await apiRes.json();

            // --- FILTRADO DE EXCLUSIÓN (FRONTEND) ---
            if (exclusions.length > 0) {
                restaurantesEncontrados = restaurantesEncontrados.filter(r => {
                    // Verificamos si la categoría del restaurante está en la lista de excluidos
                    return !exclusions.includes(r.categoria); 
                });
            }

            if (restaurantesEncontrados.length > 0) {
                setStatusMessage(`Ubicando ${restaurantesEncontrados.length} locales...`);
                
                const delay = ms => new Promise(res => setTimeout(res, ms));

                for (const rest of restaurantesEncontrados) {
                    const query = `${rest.direccion}, ${rest.distrito}, Lima, Peru`;
                    try {
                        await delay(500); 
                        const coordsRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`);
                        
                        if (coordsRes.ok) {
                            const coordsData = await coordsRes.json();
                            if (coordsData && coordsData.length > 0) {
                                setMapMarkers(prev => [...prev, {
                                    ...rest,
                                    lat: parseFloat(coordsData[0].lat),
                                    lng: parseFloat(coordsData[0].lon)
                                }]);
                            }
                        }
                    } catch (e) {
                        console.error("Fallo geo:", e);
                    }
                }
                setStatusMessage(""); 
            } else {
                setStatusMessage("No se encontraron restaurantes.");
            }
        } else {
            setStatusMessage("Error consultando restaurantes.");
        }

    } catch (error) {
        console.error(error);
        setStatusMessage("Error de conexión.");
    } finally {
        setLoading(false);
        setTimeout(() => { if(!loading) setStatusMessage("") }, 3000);
    }
  };

  useEffect(() => {
      executeSearch("Lima", true, null, []);
  }, []);

  const handleSearch = () => executeSearch(searchTerm, true, selectedCategory, excludedCategories);
  
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleCategorySelect = (tag) => {
      const newCategory = selectedCategory === tag ? null : tag;
      setSelectedCategory(newCategory);
      executeSearch(searchTerm, false, newCategory, excludedCategories);
  };

  // --- NUEVO: HANDLER PARA EXCLUIR CATEGORÍA ---
  const handleExcludeCategory = (tag) => {
      const newExclusions = [...excludedCategories, tag];
      setExcludedCategories(newExclusions); // Guardamos estado
      
      // Ejecutamos búsqueda inmediatamente pasando la nueva lista de exclusión
      executeSearch(searchTerm, false, selectedCategory, newExclusions);
  };

  const handleUseLocation = () => {
      if (navigator.geolocation) {
          setLoading(true);
          setStatusMessage("Obteniendo GPS...");
          navigator.geolocation.getCurrentPosition(async (pos) => {
              const { latitude, longitude } = pos.coords;
              setPosition([latitude, longitude]);

              try {
                  setStatusMessage("Detectando zona...");
                  const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                  const data = await response.json();
                  const addr = data.address;
                  const detectedDistrict = addr.suburb || addr.neighbourhood || addr.district || addr.city_district || addr.town;

                  if (detectedDistrict) {
                      const cleanTerm = detectedDistrict.replace('Distrito de ', '').trim();
                      setStatusMessage(`Zona: ${cleanTerm}`);
                      setSearchTerm(cleanTerm);
                      await executeSearch(cleanTerm, false, selectedCategory, excludedCategories);
                  } else {
                      alert("Zona no detectada.");
                      await executeSearch("Lima", false, selectedCategory, excludedCategories);
                  }
              } catch (error) {
                  setLoading(false);
              }
          }, () => { alert("Error GPS"); setLoading(false); });
      }
  };

  return (
    <section className="bg-primary py-12 md:py-16 text-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-8">Busca por ubicación</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative grow">
                <input
                  type="text"
                  placeholder="Ej: Miraflores, Lince..."
                  className="w-full bg-secondary/40 border border-red-900/30 rounded-lg py-3 pl-4 pr-12 text-white placeholder-red-200/50 focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button onClick={handleSearch} className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-red-200 hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </button>
              </div>
              <button onClick={handleUseLocation} className="bg-secondary hover:bg-black text-white font-medium py-3 px-6 rounded-lg transition-colors whitespace-nowrap shadow-md">
                Utilizar mi ubicación
              </button>
            </div>

            <div className="w-full h-[400px] rounded-xl overflow-hidden shadow-2xl border-4 border-white/10 z-0 relative bg-gray-800">
              {loading && (
                  <div className="absolute inset-0 z-1000 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-center">
                      <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                      <p className="text-white text-sm font-bold">{statusMessage}</p>
                  </div>
              )}
              
              <MapContainer center={position} zoom={15} scrollWheelZoom={false} className="h-full w-full">
                <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <MapUpdater center={position} />
                <Marker position={position}><Popup>Zona de búsqueda</Popup></Marker>

                {mapMarkers.map((rest, index) => (
                    <RestaurantMarker 
                        key={rest.id || rest.id_restaurante || index} 
                        data={rest} 
                    />
                ))}
              </MapContainer>
            </div>
          </div>

          <div className="lg:col-span-1 flex flex-col mt-4 lg:mt-0">
            {/* SECCIÓN DE COMIDA */}
            <TagSection 
                title="Categorías de comida" 
                tags={foodTags} 
                setTags={setFoodTags}
                selectedTag={selectedCategory} 
                onSelectTag={handleCategorySelect} 
                onRemoveTag={handleExcludeCategory} // <--- NUEVA PROP CONECTADA
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default MapSection;