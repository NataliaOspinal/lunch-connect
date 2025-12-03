import { useState } from 'react';

// Componente CreateGroup mejorado
const CreateGroup = ({ onClose, restaurante }) => {
  const [invitados, setInvitados] = useState([]);
  const [capacidad, setCapacidad] = useState('');
  const [dia, setDia] = useState('');
  const [hora, setHora] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [tipoGrupo, setTipoGrupo] = useState('amigos'); // 'amigos' o 'vip'
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  // Lista simulada de amigos y usuarios VIP
  const listaAmigos = [
    { id: 1, nombre: 'Carlos Mendoza', tipo: 'amigo', avatar: 'C' },
    { id: 2, nombre: 'María García', tipo: 'amigo', avatar: 'M' },
    { id: 3, nombre: 'José Rodríguez', tipo: 'amigo', avatar: 'J' },
    { id: 4, nombre: 'Ana Torres', tipo: 'amigo', avatar: 'A' },
    { id: 5, nombre: 'Luis Fernández', tipo: 'amigo', avatar: 'L' },
  ];

  const listaVIP = [
    { id: 6, nombre: 'Roberto Sánchez', tipo: 'vip', avatar: 'R' },
    { id: 7, nombre: 'Patricia Gómez', tipo: 'vip', avatar: 'P' },
    { id: 8, nombre: 'Daniel Vargas', tipo: 'vip', avatar: 'D' },
  ];

  const listaCompleta = tipoGrupo === 'amigos' ? listaAmigos : listaVIP;

  // Filtrar usuarios según la búsqueda
  const usuariosFiltrados = listaCompleta.filter(usuario =>
    usuario.nombre.toLowerCase().includes(busqueda.toLowerCase()) &&
    !invitados.find(inv => inv.id === usuario.id)
  );

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
    console.log({ restaurante, invitados, capacidad, dia, hora });
    alert('¡Reserva confirmada exitosamente!');
    onClose();
  };

  // Vista de confirmación
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

  // Vista principal de creación
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors"
          >
            <span className="text-xl leading-none">✕</span>
          </button>

          {/* Header con imagen del restaurante */}
          <div className="relative h-56 overflow-hidden">
            <img 
              src={restaurante.imagen}
              alt={restaurante.nombre}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h1 className="text-3xl font-bold mb-2 drop-shadow-lg">{restaurante.nombre}</h1>
              <div className="flex items-center text-sm opacity-95 drop-shadow">
                <span>📍 {restaurante.direccion}</span>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Administrador */}
            <div className="mb-6">
              <div className="flex items-center space-x-3 bg-white p-4 rounded-xl shadow-sm">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-md" style={{ background: 'linear-gradient(135deg, #601919 0%, #7b3c3c 100%)' }}>
                  A
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Administrador</p>
                  <p className="font-semibold text-gray-800">Tú</p>
                </div>
              </div>
            </div>

            {/* Selector de tipo de grupo */}
            <div className="mb-4">
              <div className="flex gap-2 bg-white p-1 rounded-lg shadow-sm">
                <button
                  onClick={() => setTipoGrupo('amigos')}
                  className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                    tipoGrupo === 'amigos' 
                      ? 'text-white shadow-md' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  style={tipoGrupo === 'amigos' ? { background: 'linear-gradient(135deg, #601919 0%, #7b3c3c 100%)' } : {}}
                >
                  👥 Solo Amigos
                </button>
                <button
                  onClick={() => setTipoGrupo('vip')}
                  className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                    tipoGrupo === 'vip' 
                      ? 'text-white shadow-md' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  style={tipoGrupo === 'vip' ? { background: 'linear-gradient(135deg, #601919 0%, #7b3c3c 100%)' } : {}}
                >
                  ⭐ VIP
                </button>
              </div>
            </div>

            {/* Barra de búsqueda */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">👥</span>
                  <p className="font-semibold text-gray-800">Invitados</p>
                </div>
                {capacidad && (
                  <span className="text-sm text-gray-600">
                    {totalPersonas}/{capacidad} personas
                  </span>
                )}
              </div>

              <div className="bg-white rounded-xl shadow-sm p-4">
                {/* Barra de búsqueda */}
                <div className="relative mb-4">
                  <input
                    type="text"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    placeholder={`Buscar ${tipoGrupo === 'amigos' ? 'amigos' : 'usuarios VIP'}...`}
                    className="w-full px-4 py-3 pr-10 border border-gray-200 rounded-lg focus:outline-none text-gray-900"
                    style={{ borderColor: '#7b3c3c' }}
                    onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px rgba(96, 25, 25, 0.3)'}
                    onBlur={(e) => e.target.style.boxShadow = ''}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    🔍
                  </span>
                </div>

                {/* Resultados de búsqueda */}
                {busqueda && (
                  <div className="mb-4 max-h-40 overflow-y-auto border border-gray-200 rounded-lg">
                    {usuariosFiltrados.length > 0 ? (
                      usuariosFiltrados.map(usuario => (
                        <button
                          key={usuario.id}
                          onClick={() => agregarInvitado(usuario)}
                          className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                          disabled={capacidad && totalPersonas >= parseInt(capacidad)}
                        >
                          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium" style={{ background: 'linear-gradient(135deg, #7b3c3c 0%, #601919 100%)' }}>
                            {usuario.avatar}
                          </div>
                          <div className="flex-1 text-left">
                            <p className="font-medium text-gray-900">{usuario.nombre}</p>
                            <p className="text-xs text-gray-500">{usuario.tipo === 'vip' ? '⭐ VIP' : '👥 Amigo'}</p>
                          </div>
                          <span className="text-2xl">➕</span>
                        </button>
                      ))
                    ) : (
                      <p className="text-center py-4 text-gray-500 text-sm">No se encontraron resultados</p>
                    )}
                  </div>
                )}

                {/* Lista de invitados agregados */}
                {invitados.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">Invitados agregados:</p>
                    <div className="space-y-2">
                      {invitados.map(invitado => (
                        <div
                          key={invitado.id}
                          className="flex items-center space-x-3 p-2 rounded-lg"
                          style={{ background: 'linear-gradient(135deg, rgba(96, 25, 25, 0.1) 0%, rgba(123, 60, 60, 0.15) 100%)' }}
                        >
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-medium text-sm shadow-sm" style={{ background: 'linear-gradient(135deg, #7b3c3c 0%, #601919 100%)' }}>
                            {invitado.avatar}
                          </div>
                          <span className="flex-1 text-sm font-medium text-gray-700">{invitado.nombre}</span>
                          <button
                            onClick={() => eliminarInvitado(invitado.id)}
                            className="text-gray-500 hover:text-red-500 text-lg leading-none transition-colors"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {invitados.length === 0 && !busqueda && (
                  <p className="text-center py-4 text-gray-400 text-sm">
                    Busca y agrega invitados para tu grupo
                  </p>
                )}
              </div>
            </div>

            {/* Capacidad Máxima */}
            <div className="mb-4">
              <label className="flex items-center space-x-2 mb-2 text-sm font-semibold text-gray-700">
                <span className="text-lg">👥</span>
                <span>Capacidad Máxima *</span>
              </label>
              <input
                type="number"
                value={capacidad}
                onChange={(e) => setCapacidad(e.target.value)}
                min="1"
                placeholder="Ej: 6 personas"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:border-transparent text-gray-900"
                onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px rgba(96, 25, 25, 0.3)'}
                onBlur={(e) => e.target.style.boxShadow = ''}
              />
            </div>

            {/* Día y Hora */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="flex items-center space-x-2 mb-2 text-sm font-semibold text-gray-700">
                  <span className="text-lg">📅</span>
                  <span>Día *</span>
                </label>
                <input
                  type="date"
                  value={dia}
                  onChange={(e) => setDia(e.target.value)}
                  className="w-full px-3 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:border-transparent text-gray-900"
                  style={{ color: '#1f2937' }}
                  onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px rgba(96, 25, 25, 0.3)'}
                  onBlur={(e) => e.target.style.boxShadow = ''}
                />
              </div>
              <div>
                <label className="flex items-center space-x-2 mb-2 text-sm font-semibold text-gray-700">
                  <span className="text-lg">🕐</span>
                  <span>Hora *</span>
                </label>
                <input
                  type="time"
                  value={hora}
                  onChange={(e) => setHora(e.target.value)}
                  className="w-full px-3 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:border-transparent text-gray-900"
                  style={{ color: '#1f2937' }}
                  onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px rgba(96, 25, 25, 0.3)'}
                  onBlur={(e) => e.target.style.boxShadow = ''}
                />
              </div>
            </div>

            {/* Botón Continuar */}
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

// Componente principal RestaurantSection
const RestaurantSection = () => {
  const [categoria, setCategoria] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [restauranteSeleccionado, setRestauranteSeleccionado] = useState(null);

  const restaurantes = [
    {
      id: 1,
      nombre: 'Chifa A',
      rating: 4.6,
      direccion: 'Av. La Marina 456, San Miguel',
      imagen: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop'
    },
    {
      id: 2,
      nombre: 'Chifa B',
      rating: 4.6,
      direccion: 'Jr. Carabaya 789, Cercado de Lima',
      imagen: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop'
    },
    {
      id: 3,
      nombre: 'Chifa C',
      rating: 4.6,
      direccion: 'Av. Arequipa 321, Miraflores',
      imagen: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop'
    },
    {
      id: 4,
      nombre: 'Chifa sdfrdg',
      rating: 4.5,
      direccion: 'Calle Los Olivos 654, San Isidro',
      imagen: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop'
    }
  ];

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
                <option value="">-------</option>
                <option value="chifa">Chifa</option>
                <option value="italiana">Italiana</option>
                <option value="peruana">Peruana</option>
                <option value="japonesa">Japonesa</option>
              </select>
              <svg 
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white pointer-events-none" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
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
                <option value="">-------</option>
                <option value="miraflores">Miraflores</option>
                <option value="san-isidro">San Isidro</option>
                <option value="barranco">Barranco</option>
                <option value="surco">Surco</option>
              </select>
              <svg 
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white pointer-events-none" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurantes.map((restaurante) => (
            <div key={restaurante.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              
              <div className="aspect-video overflow-hidden">
                <img
                  src={restaurante.imagen}
                  alt={restaurante.nombre}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {restaurante.nombre}
                  </h3>
                  <div className="flex items-center gap-1">
                    <span className="text-gray-700 font-medium">{restaurante.rating}</span>
                    <svg 
                      className="w-4 h-4 text-yellow-400" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4">
                  📍 {restaurante.direccion}
                </p>

                <button 
                  onClick={() => abrirModal(restaurante)}
                  className="w-full bg-primary text-white py-2 px-4 rounded hover:bg-terciary transition-colors font-medium"
                >
                  Arma tu grupo
                </button>
              </div>
            </div>
          ))}
        </div>
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
