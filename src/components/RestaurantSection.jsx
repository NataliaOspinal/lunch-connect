import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated, getToken } from '../services/authService';

// --- HELPER: Obtener ID del usuario desde el JWT ---
const getUserIdFromToken = () => {
  const token = getToken();
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    const decoded = JSON.parse(jsonPayload);
    // Ajusta esto: puede ser 'id', 'userId', 'sub' o 'id_usuario' dependiendo de tu backend Java/Node
    return decoded.id || decoded.userId || decoded.sub; 
  } catch (e) {
    console.error("Error al decodificar token", e);
    return null;
  }
};

// --- COMPONENTE INTERNO: CreateGroup (Modal) ---
const CreateGroup = ({ onClose, restaurante }) => {
  const [nombreGrupo, setNombreGrupo] = useState('');
  const [capacidad, setCapacidad] = useState('');
  const [dia, setDia] = useState('');
  const [hora, setHora] = useState('');
  const [soloAmigos, setSoloAmigos] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [invitados, setInvitados] = useState([]);
  const [busqueda, setBusqueda] = useState('');

  // Simulación de amigos (Frontend puro por ahora)
  const listaAmigos = [
    { id: 101, nombre: 'Carlos Mendoza', esAmigo: true, avatar: 'C' },
    { id: 102, nombre: 'María García', esAmigo: true, avatar: 'M' },
  ];

  const usuariosFiltrados = listaAmigos.filter(usuario => {
    const coincideBusqueda = usuario.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const noEstaAgregado = !invitados.find(inv => inv.id === usuario.id);
    return coincideBusqueda && noEstaAgregado;
  });

  const agregarInvitado = (usuario) => {
    setInvitados([...invitados, usuario]);
    setBusqueda('');
  };

  const eliminarInvitado = (id) => {
    setInvitados(invitados.filter(inv => inv.id !== id));
  };

  const totalPersonas = invitados.length + 1;

  const confirmarReserva = () => {
    if (!capacidad || !dia || !hora || !nombreGrupo) {
      alert('Por favor completa: Nombre del grupo, Capacidad, Día y Hora.');
      return;
    }
    setMostrarConfirmacion(true);
  };

  const finalizarReserva = async () => {
    setIsSubmitting(true);
    const token = getToken();
    const creadorId = getUserIdFromToken();

    if (!token || !creadorId) {
        alert("Tu sesión ha expirado. Por favor inicia sesión nuevamente.");
        onClose();
        return;
    }

    const fechaHoraISO = `${dia}T${hora}:00`;

    const payload = {
      nombreGrupo: nombreGrupo,
      maxMiembros: parseInt(capacidad),
      fechaHoraAlmuerzo: fechaHoraISO,
      restauranteId: restaurante.id,
      creadorId: creadorId 
    };

    try {
      const response = await fetch('https://lunchconnect-backend.onrender.com/api/grupos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert('¡Grupo creado exitosamente!');
        onClose();
      } else {
        const errorData = await response.json();
        alert(`Error al crear: ${errorData.message || 'Verifica los datos'}`);
      }
    } catch (error) {
      console.error("Error de red:", error);
      alert('Hubo un error de conexión al crear el grupo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- VISTA DE CONFIRMACIÓN ---
  if (mostrarConfirmacion) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl bg-[#601919]">✓</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Resumen</h2>
                <p className="text-gray-600">Confirma los detalles de tu grupo</p>
              </div>

              {/* TEXTO OSCURO AQUÍ */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6 space-y-2 border border-gray-200 text-gray-800">
                 <p><span className="font-bold">Grupo:</span> {nombreGrupo}</p>
                 <p><span className="font-bold">Restaurante:</span> {restaurante.nombre}</p>
                 <p><span className="font-bold">Fecha:</span> {dia} a las {hora}</p>
                 <p><span className="font-bold">Total Personas:</span> {totalPersonas} / {capacidad}</p>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setMostrarConfirmacion(false)} disabled={isSubmitting} className="flex-1 py-3 border-2 border-[#601919] text-[#601919] font-bold rounded-xl">Editar</button>
                <button onClick={finalizarReserva} disabled={isSubmitting} className="flex-1 py-3 bg-[#601919] text-white font-bold rounded-xl hover:bg-[#4a1313]">
                    {isSubmitting ? 'Creando...' : 'Confirmar'}
                </button>
              </div>
            </div>
        </div>
      </div>
    );
  }

  // --- VISTA FORMULARIO PRINCIPAL ---
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 z-10 w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-600 font-bold shadow hover:bg-gray-100">✕</button>

        <div className="relative h-48">
            <img src={restaurante.imagen} alt={restaurante.nombre} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            <div className="absolute bottom-4 left-6 text-white">
                <h2 className="text-2xl font-bold">{restaurante.nombre}</h2>
                <p className="text-sm opacity-90">{restaurante.direccion}</p>
            </div>
        </div>

        <div className="p-6 space-y-5 text-gray-800"> {/* TEXTO GRIS OSCURO */}
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Nombre del Grupo</label>
                <input type="text" value={nombreGrupo} onChange={(e) => setNombreGrupo(e.target.value)} className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-[#601919] outline-none text-black" placeholder="Ej: Los Comelones" />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-1">Capacidad Máxima</label>
                    <input type="number" min="2" value={capacidad} onChange={(e) => setCapacidad(e.target.value)} className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-[#601919] outline-none text-black" placeholder="Ej: 5" />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Día</label>
                    <input type="date" value={dia} onChange={(e) => setDia(e.target.value)} className="w-full border border-gray-300 p-3 rounded-xl outline-none text-black" />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Hora</label>
                    <input type="time" value={hora} onChange={(e) => setHora(e.target.value)} className="w-full border border-gray-300 p-3 rounded-xl outline-none text-black" />
                </div>
            </div>

            <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl cursor-pointer">
                <input type="checkbox" checked={soloAmigos} onChange={(e) => setSoloAmigos(e.target.checked)} className="w-5 h-5 accent-[#601919]" />
                <div>
                    <p className="font-bold text-gray-800">🔒 Solo Amigos</p>
                    <p className="text-xs text-gray-500">Solo personas en tu lista podrán unirse</p>
                </div>
            </label>

            <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Invitar Amigos</label>
                <input type="text" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar por nombre..." className="w-full border border-gray-300 p-3 rounded-xl mb-2 text-black" />
                
                {busqueda && (
                    <div className="max-h-32 overflow-y-auto border rounded-lg mb-2">
                        {usuariosFiltrados.map(user => (
                            <div key={user.id} onClick={() => agregarInvitado(user)} className="p-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between text-black">
                                <span className="text-sm">{user.nombre}</span>
                                <span className="text-xs font-bold text-[#601919]">+</span>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex flex-wrap gap-2">
                    {invitados.map(inv => (
                        <span key={inv.id} className="bg-[#601919]/10 text-[#601919] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2">
                            {inv.nombre}
                            <button onClick={() => eliminarInvitado(inv.id)} className="hover:text-red-700 font-bold">✕</button>
                        </span>
                    ))}
                </div>
            </div>

            <button onClick={confirmarReserva} className="w-full py-4 bg-[#601919] text-white font-bold rounded-xl shadow-lg hover:bg-[#4a1313] transition-transform active:scale-95">
                Continuar
            </button>
        </div>
      </div>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL: RestaurantSection ---
const RestaurantSection = () => {
  const navigate = useNavigate();
  
  const [categoria, setCategoria] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [restaurantes, setRestaurantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [restauranteSeleccionado, setRestauranteSeleccionado] = useState(null);

  useEffect(() => {
    const fetchRestaurantes = async () => {
        try {
            console.log("Iniciando fetch...");
            const response = await fetch('https://lunchconnect-backend.onrender.com/api/restaurantes');
            console.log("Respuesta API:", response);
            
            if (!response.ok) throw new Error("Error en la respuesta del servidor");
            
            const data = await response.json();
            console.log("Datos JSON:", data);

            const dataFormateada = data.map(r => ({
                id: r.id_restaurante,
                nombre: r.nombre,
                rating: r.calificacion_promedio || 4.5,
                direccion: r.direccion,
                distrito: r.distrito,
                categoria: r.categoria,
                imagen: r.urlImagen || r.url_imagen || "https://via.placeholder.com/400x300"
            }));
            setRestaurantes(dataFormateada);
        } catch (error) { 
            console.error("Error cargando restaurantes:", error); 
        } finally {
            setLoading(false);
        }
    };
    fetchRestaurantes();
  }, []);

  const restaurantesFiltrados = restaurantes.filter((r) => {
     const matchCategoria = categoria ? r.categoria?.toLowerCase() === categoria.toLowerCase() : true;
     const matchUbicacion = ubicacion ? r.distrito?.toLowerCase() === ubicacion.toLowerCase() : true;
     return matchCategoria && matchUbicacion;
  });

  const abrirModal = (restaurante) => {
    if (!isAuthenticated()) {
      alert("Debes iniciar sesión para armar un grupo.");
      navigate('/login');
      return;
    }
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Explora restaurantes</h1>
        
        {/* Filtros */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="flex items-center gap-3">
                <label className="text-gray-700 font-medium">Categoría:</label>
                <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className="flex-1 bg-[#601919] text-white p-2 rounded">
                    <option value="">Todas</option>
                    <option value="chifa">Chifa</option>
                    <option value="italiana">Italiana</option>
                    <option value="criolla">Criolla</option>
                </select>
            </div>
            <div className="flex items-center gap-3">
                <label className="text-gray-700 font-medium">Ubicación:</label>
                <select value={ubicacion} onChange={(e) => setUbicacion(e.target.value)} className="flex-1 bg-[#601919] text-white p-2 rounded">
                    <option value="">Todas</option>
                    <option value="miraflores">Miraflores</option>
                    <option value="san isidro">San Isidro</option>
                    <option value="lince">Lince</option>
                </select>
            </div>
        </div>

        {loading ? (
            <p className="text-center text-gray-600 font-bold">Cargando restaurantes...</p>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurantesFiltrados.length > 0 ? restaurantesFiltrados.map((restaurante) => (
                <div key={restaurante.id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
                    <div className="aspect-video overflow-hidden bg-gray-200">
                        <img src={restaurante.imagen} alt={restaurante.nombre} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" onError={(e) => e.target.src = 'https://via.placeholder.com/400x300'}/>
                    </div>
                    <div className="p-4 flex flex-col flex-1 justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 truncate">{restaurante.nombre}</h3>
                            <p className="text-gray-600 text-sm mb-1 truncate">📍 {restaurante.direccion}</p>
                        </div>
                        <button onClick={() => abrirModal(restaurante)} className="w-full bg-[#601919] text-white py-2 px-4 rounded hover:bg-[#7b3c3c] transition-colors font-medium mt-auto">
                            Arma tu grupo
                        </button>
                    </div>
                </div>
            )) : <p className="text-center text-gray-500 col-span-3">No se encontraron restaurantes</p>}
            </div>
        )}
      </div>

      {modalAbierto && restauranteSeleccionado && (
        <CreateGroup onClose={cerrarModal} restaurante={restauranteSeleccionado} />
      )}
    </div>
  );
}

export default RestaurantSection;