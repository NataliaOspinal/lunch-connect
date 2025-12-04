import React, { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
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

const MapUpdater = ({ center }) => {
  const map = useMap();
  map.setView(center, 15);
  return null;
};

// --- COMPONENTE REUTILIZABLE PARA SECCIÓN DE TAGS ---
const TagSection = ({ title, tags, setTags }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);

  // Enfocar el input automáticamente cuando se activa el modo edición
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  // Función para agregar tag
  const handleAddTag = () => {
    if (inputValue.trim() !== "") {
      setTags([...tags, inputValue.trim()]);
      setInputValue("");
    }
    setIsEditing(false);
  };

  // Manejar teclas (Enter para guardar, Escape para cancelar)
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleAddTag();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setInputValue("");
    }
  };

  // Función para eliminar tag
  const removeTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="mb-6">
      {/* Encabezado: Título + Botón de Agregar */}
      <div className="flex items-center justify-between mb-3">
        <label className="font-bold text-lg">{title}:</label>
        
        {isEditing ? (
          // MODO EDICIÓN: Input pequeño
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleAddTag} // Guardar si hace clic fuera (opcional)
            className="bg-secondary border border-red-500/50 text-white text-sm rounded px-2 py-1 w-32 focus:outline-none focus:ring-1 focus:ring-red-400"
            placeholder="Escribe..."
          />
        ) : (
          // MODO BOTÓN: "Agrega un tag"
          <button
            onClick={() => setIsEditing(true)}
            className="bg-secondary/40 hover:bg-secondary px-3 py-1 rounded text-sm text-red-200 hover:text-white flex items-center gap-2 transition-colors border border-transparent hover:border-red-900"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            Agrega un tag
          </button>
        )}
      </div>

      {/* Lista de Badges */}
      <div className="flex flex-wrap gap-3">
        {tags.map((tag, i) => (
          <span
            key={i}
            className="bg-[#8B3A3A] text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 animate-fade-in"
          >
            {tag}
            <button
              onClick={() => removeTag(i)}
              className="hover:text-red-200 font-bold cursor-pointer focus:outline-none p-0.5 rounded-full hover:bg-black/10 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL ---
const MapSection = () => {
  const [position, setPosition] = useState([-12.0464, -77.0428]);
  const [searchTerm, setSearchTerm] = useState("");

  // Estados de los tags
  const [foodTags, setFoodTags] = useState(["Chifa", "Broster"]);
  const [careerTags, setCareerTags] = useState(["Ing. Sistemas", "Ing. Software"]);

  const handleSearch = async () => {
    if (!searchTerm) return;
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${searchTerm}`);
      const data = await response.json();
      if (data && data.length > 0) {
        setPosition([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
      } else {
        alert("No se encontró la ubicación");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <section className="bg-primary py-12 md:py-16 text-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-8">Busca por ubicación</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          {/* COLUMNA IZQUIERDA (Mapa) */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative grow">
                <input
                  type="text"
                  placeholder="Ingresa una dirección (ej. Lince, Lima)"
                  className="w-full bg-secondary/40 border border-red-900/30 rounded-lg py-3 pl-4 pr-12 text-white placeholder-red-200/50 focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button onClick={handleSearch} className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-red-200 hover:text-white">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </button>
              </div>
              <button className="bg-secondary hover:bg-black text-white font-medium py-3 px-6 rounded-lg transition-colors whitespace-nowrap shadow-md">
                Utilizar mi ubicación
              </button>
            </div>

            <div className="w-full h-[400px] rounded-xl overflow-hidden shadow-2xl border-4 border-white/10 z-0 relative">
              <MapContainer center={position} zoom={15} scrollWheelZoom={false} className="h-full w-full">
                <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <MapUpdater center={position} />
                <Marker position={position}><Popup>¡Hola! Aquí te encuentras</Popup></Marker>
              </MapContainer>
            </div>
          </div>

          {/* COLUMNA DERECHA (Tags Interactivos) */}
          <div className="lg:col-span-1 flex flex-col mt-4 lg:mt-0">
            
            {/* Usamos el componente reutilizable TagSection */}
            <TagSection 
              title="Categorías de comida" 
              tags={foodTags} 
              setTags={setFoodTags} 
            />

            <TagSection 
              title="Carreras network" 
              tags={careerTags} 
              setTags={setCareerTags} 
            />

          </div>
        </div>
      </div>
    </section>
  );
};

export default MapSection;