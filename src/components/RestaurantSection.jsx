import { useState, useEffect } from 'react';

// --- COMPONENTE CreateGroup (Mantenemos tu lógica original) ---
const CreateGroup = ({ onClose, restaurante }) => {
  const [invitados, setInvitados] = useState([]);
  const [capacidad, setCapacidad] = useState('');
  const [dia, setDia] = useState('');
  const [hora, setHora] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [soloAmigos, setSoloAmigos] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  
  const usuarioEsVIP = true;
  const mostrarOpcionVIP = usuarioEsVIP && parseInt(capacidad) > 5;

  const listaAmigos = [
    { id: 1, nombre: 'Carlos Mendoza', esAmigo: true, avatar: 'C' },
    { id: 2, nombre: 'María García', esAmigo: true, avatar: 'M' },
    { id: 3, nombre: 'José Rodríguez', esAmigo: true, avatar: 'J' },
    { id: 4, nombre: 'Ana Torres', esAmigo: true, avatar: 'A' },
    { id: 5, nombre: 'Luis Fernández', esAmigo: true, avatar: 'L' },
    { id: 6, nombre: 'Roberto Sánchez', esAmigo: false, avatar: 'R' },
    { id: 7, nombre: 'Patricia Gómez', esAmigo: false, avatar: 'P' },
    { id: 8, nombre: 'Daniel Vargas', esAmigo: false, avatar: 'D' },
  ];

  const usuariosFiltrados = listaAmigos.filter(usuario => {
    const coincideBusqueda = usuario.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const noEstaAgregado = !invitados.find(inv => inv.id === usuario.id);
    const cumpleFiltroAmigos = soloAmigos ? usuario.esAmigo : true;
    return coincideBusqueda && noEstaAgregado && cumpleFiltroAmigos;
  });

  const agregarInvitado = (usuario) => {
    if (!capacidad || invitados.length < parseInt(capacidad) - 1) {
      setInvitados([...invitados, usuario]);
      setBusqueda('');
    }
  };

  const eliminarInvitado = (id) => {
    setInvitados(invitados.filter(inv => inv.id !== id));
  };

  const totalPersonas = invitados.length + 1;

  const confirmarReserva = () => {
    if (!capacidad || !dia || !hora) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }
    setMostrarConfirmacion(true);
  };

  const editarReserva = () => {
    setMostrarConfirmacion(false);
  };

  const finalizarReserva = () => {
    // AQUÍ PODRÍAS HACER EL POST A TU API PARA CREAR EL GRUPO REALMENTE
    console.log({ 
        restaurante_id: restaurante.id, 
        invitados, 
        capacidad, 
        fecha: dia, 
        hora 
    });
    alert('¡Reserva confirmada exitosamente!');
    onClose();
  };

  if (mostrarConfirmacion) {
    return (
      <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4" onClick={onClose}>
        <div className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors"
            >
              <span className="text-xl leading-none">✕</span>
            </button>

            <div className="p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl" style={{ background: 'linear-gradient(135deg, #601919 0%, #7b3c3c 100%)' }}>
                  ✓
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Resumen de tu Reserva</h2>
                <p className="text-gray-600">Revisa los detalles antes de confirmar</p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Restaurante</p>
                  <p className="font-semibold text-gray-900">{restaurante.nombre}</p>
                  <p className="text-sm text-gray-600">📍 {restaurante.direccion}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">📅 Fecha</p>
                    <p className="font-semibold text-gray-900">{new Date(dia).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">🕐 Hora</p>
                    <p className="font-semibold text-gray-900">{hora}</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-2">👥 Invitados ({totalPersonas} personas)</p>
                  {soloAmigos && <p className="text-xs text-gray-600 mb-2">🔒 Grupo privado - Solo amigos</p>}
                  {mostrarOpcionVIP && (
                    <div className="mb-2 px-3 py-2 rounded-lg text-sm font-medium" style={{ background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.2) 0%, rgba(218, 165, 32, 0.2) 100%)', color: '#B8860B' }}>
                      ⭐ Grupo VIP - Capacidad extendida
                    </div>
                  )}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium" style={{ background: 'linear-gradient(135deg, #601919 0%, #7b3c3c 100%)' }}>
                        A
                      </div>
                      <span className="text-sm font-medium text-gray-700">Tú (Administrador)</span>
                    </div>
                    {invitados.map(invitado => (
                      <div key={invitado.id} className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium" style={{ background: 'linear-gradient(135deg, #7b3c3c 0%, #601919 100%)' }}>
                          {invitado.avatar}
                        </div>
                        <span className="text-sm text-gray-700">{invitado.nombre}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={editarReserva}
                  className="flex-1 py-3 border-2 font-semibold rounded-xl transition-colors"
                  style={{ borderColor: '#601919', color: '#601919' }}
                >
                  Editar
                </button>
                <button 
                  onClick={finalizarReserva}
                  className="flex-1 py-3 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                  style={{ background: 'linear-gradient(135deg, #3D0F0F 0%, #601919 50%, #7b3c3c 100%)' }}
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors"
          >
            <span className="text-xl leading-none">✕</span>
          </button>

          <div className="relative h-56 overflow-hidden">
            <img 
              src={restaurante.imagen || 'https://via.placeholder.com/400'}
              alt={restaurante.nombre}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h1 className="text-3xl font-bold mb-2 drop-shadow-lg">{restaurante.nombre}</h1>
              <div className="flex items-center text-sm opacity-95 drop-shadow">
                <span>📍 {restaurante.direccion}</span>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-6">
              <div className="flex items-center space-x-3 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-md" style={{ background: 'linear-gradient(135deg, #601919 0%, #7b3c3c 100%)' }}>
                  A
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Administrador</p>
                  <p className="font-semibold text-gray-800">Tú</p>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={soloAmigos}
                    onChange={(e) => setSoloAmigos(e.target.checked)}
                    className="w-5 h-5 rounded cursor-pointer"
                    style={{ accentColor: '#601919' }}
                  />
                  <div>
                    <p className="font-medium text-gray-800">🔒 Solo Amigos</p>
                    <p className="text-xs text-gray-500">Solo tus amigos podrán unirse a este grupo</p>
                  </div>
                </label>
              </div>
            </div>

            {mostrarOpcionVIP && (
              <div className="mb-4 p-4 rounded-xl shadow-sm" style={{ background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.15) 0%, rgba(218, 165, 32, 0.15) 100%)' }}>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">⭐</span>
                  <div>
                    <p className="font-semibold" style={{ color: '#B8860B' }}>Grupo VIP Activado</p>
                    <p className="text-xs text-gray-600">Tienes acceso a capacidad extendida y beneficios exclusivos</p>
                  </div>
                </div>
              </div>
            )}

            {/* Configuración del grupo */}
            <div className="space-y-4 mb-6">
                <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1 block">Capacidad Máxima *</label>
                    <input type="number" value={capacidad} onChange={(e) => setCapacidad(e.target.value)} min="1" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Ej: 4" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-semibold text-gray-700 mb-1 block">Día *</label>
                        <input type="date" value={dia} onChange={(e) => setDia(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-gray-700 mb-1 block">Hora *</label>
                        <input type="time" value={hora} onChange={(e) => setHora(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    </div>
                </div>
            </div>

            <button 
              onClick={confirmarReserva}
              className="w-full py-4 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg, #3D0F0F 0%, #601919 50%, #7b3c3c 100%)' }}
            >
              Continuar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL CONECTADO A LA API ---
const RestaurantSection = () => {
  // Estados para filtros y datos
  const [categoria, setCategoria] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  
  // Estado para la data de la API
  const [restaurantes, setRestaurantes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [modalAbierto, setModalAbierto] = useState(false);
  const [restauranteSeleccionado, setRestauranteSeleccionado] = useState(null);

  // 1. FETCH A LA API DE RENDER
  useEffect(() => {
    const fetchRestaurantes = async () => {
      try {
        const response = await fetch('https://lunchconnect-backend.onrender.com/api/restaurantes');
        const data = await response.json();
        
        // Mapeamos los datos de la BD a la estructura que usa tu componente
        const dataFormateada = data.map(r => ({
            id: r.id_restaurante,
            nombre: r.nombre,
            rating: r.calificacion_promedio || 4.5, // Valor por defecto si es null
            direccion: r.direccion,
            distrito: r.distrito,
            categoria: r.categoria,
            imagen: r.url_imagen || 'https://via.placeholder.com/400x300?text=Restaurante' // Imagen por defecto
        }));

        setRestaurantes(dataFormateada);
        setLoading(false);
      } catch (error) {
        console.error("Error cargando restaurantes:", error);
        setLoading(false);
      }
    };

    fetchRestaurantes();
  }, []);

  // 2. LÓGICA DE FILTRADO (Cliente-Side)
  // Filtramos los datos que ya descargamos basándonos en los selects
  const restaurantesFiltrados = restaurantes.filter((r) => {
    // Si hay categoría seleccionada, verificamos si coincide (ignorando mayúsculas/minúsculas)
    const matchCategoria = categoria 
        ? r.categoria?.toLowerCase() === categoria.toLowerCase() 
        : true;
    
    // Si hay ubicación seleccionada, verificamos el distrito
    const matchUbicacion = ubicacion 
        ? r.distrito?.toLowerCase() === ubicacion.toLowerCase() 
        : true;

    return matchCategoria && matchUbicacion;
  });

  const abrirModal = (restaurante) => {
    setRestauranteSeleccionado(restaurante);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setRestauranteSeleccionado(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Explora restaurantes
        </h1>

        {/* --- FILTROS --- */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          
          <div className="flex items-center gap-3">
            <label className="text-gray-700 font-medium whitespace-nowrap">
              Buscar por categoría:
            </label>
            <div className="relative flex-1">
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="w-full appearance-none bg-primary text-white px-4 py-2 pr-10 rounded cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-700"
              >
                <option value="">Todas</option>
                <option value="chifa">Chifa</option>
                <option value="italiana">Italiana</option>
                <option value="criolla">Criolla</option>
                <option value="japonesa">Japonesa</option>
                <option value="comida rapida">Comida Rápida</option>
              </select>
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-gray-700 font-medium whitespace-nowrap">
              Buscar por ubicación:
            </label>
            <div className="relative flex-1">
              <select
                value={ubicacion}
                onChange={(e) => setUbicacion(e.target.value)}
                className="w-full appearance-none bg-primary text-white px-4 py-2 pr-10 rounded cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-700"
              >
                <option value="">Todas</option>
                <option value="miraflores">Miraflores</option>
                <option value="san isidro">San Isidro</option>
                <option value="lince">Lince</option>
                <option value="jesus maria">Jesús María</option>
                <option value="surco">Surco</option>
              </select>
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* --- GRID DE RESULTADOS --- */}
        {loading ? (
            <p className="text-center text-gray-500">Cargando restaurantes...</p>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurantesFiltrados.length > 0 ? (
                restaurantesFiltrados.map((restaurante) => (
                    <div key={restaurante.id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
                    
                    <div className="aspect-video overflow-hidden bg-gray-200">
                        <img
                        src={restaurante.imagen}
                        alt={restaurante.nombre}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        onError={(e) => {e.target.src = 'https://via.placeholder.com/400x300?text=Sin+Imagen'}} // Fallback si falla la imagen
                        />
                    </div>

                    <div className="p-4 flex flex-col flex-1 justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-2 justify-between">
                                <h3 className="text-lg font-semibold text-gray-900 truncate">
                                    {restaurante.nombre}
                                </h3>
                                <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-xs">
                                    <span className="text-gray-700 font-bold">{restaurante.rating}</span>
                                    <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                </div>
                            </div>

                            <p className="text-gray-600 text-sm mb-1 truncate">
                                📍 {restaurante.direccion}
                            </p>
                            <p className="text-gray-400 text-xs mb-4 uppercase font-semibold">
                                {restaurante.categoria} • {restaurante.distrito}
                            </p>
                        </div>

                        <button 
                        onClick={() => abrirModal(restaurante)}
                        className="w-full bg-primary text-white py-2 px-4 rounded hover:bg-[#7b3c3c] transition-colors font-medium mt-auto"
                        >
                        Arma tu grupo
                        </button>
                    </div>
                    </div>
                ))
            ) : (
                <div className="col-span-full text-center py-10">
                    <p className="text-xl text-gray-500">No se encontraron restaurantes con esos filtros.</p>
                </div>
            )}
            </div>
        )}
      </div>

      {/* Modal */}
      {modalAbierto && restauranteSeleccionado && (
        <CreateGroup 
          onClose={cerrarModal}
          restaurante={restauranteSeleccionado}
        />
      )}
    </div>
  );
}

export default RestaurantSection;