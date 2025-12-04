import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// 1. IMPORTAMOS EL SERVICIO DE AUTENTICACIÓN
import { isAuthenticated, getToken } from '../services/authService';

// --- FUNCIÓN AUXILIAR PARA DECODIFICAR EL TOKEN (Obtener el ID del usuario) ---
// Esto sirve para sacar el 'creadorId' que está oculto en el token JWT
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
    // IMPORTANTE: Verifica cómo se llama el campo ID en tu token (suele ser 'id', 'sub', 'userId' o 'uid')
    return decoded.id || decoded.userId || decoded.sub; 
  } catch (e) {
    console.error("Error al decodificar token", e);
    return null;
  }
};

// --- COMPONENTE CreateGroup ---
// Ya no recibimos userId ni token por props
const CreateGroup = ({ onClose, restaurante }) => {
  const [invitados, setInvitados] = useState([]);
  const [capacidad, setCapacidad] = useState('');
  const [dia, setDia] = useState('');
  const [hora, setHora] = useState('');
  const [nombreGrupo, setNombreGrupo] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [soloAmigos, setSoloAmigos] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ... (Tus constantes y lógica de amigos se mantienen igual) ...
  const usuarioEsVIP = true; 
  const mostrarOpcionVIP = usuarioEsVIP && parseInt(capacidad) > 5;
  const listaAmigos = [ 
      { id: 1, nombre: 'Carlos Mendoza', esAmigo: true, avatar: 'C' }, 
      // ... resto de amigos ...
  ];
  // ... (Funciones usuariosFiltrados, agregarInvitado, eliminarInvitado, totalPersonas) ...
  
  // Como simplificación para este ejemplo, replicaré la lógica básica:
  const usuariosFiltrados = listaAmigos; // (Aquí iría tu filtro real)
  const agregarInvitado = (u) => setInvitados([...invitados, u]);
  const eliminarInvitado = (id) => setInvitados(invitados.filter(i => i.id !== id));
  const totalPersonas = invitados.length + 1;

  const confirmarReserva = () => {
    if (!capacidad || !dia || !hora || !nombreGrupo) {
      alert('Por favor completa todos los campos requeridos.');
      return;
    }
    setMostrarConfirmacion(true);
  };

  const editarReserva = () => {
    setMostrarConfirmacion(false);
  };

  // --- NUEVA LÓGICA DE FINALIZAR CON AUTH SERVICE ---
  const finalizarReserva = async () => {
    setIsSubmitting(true);

    // 2. Obtener Token y ID desde el servicio
    const token = getToken();
    const creadorId = getUserIdFromToken();

    if (!token || !creadorId) {
        alert("Error de sesión. Por favor inicia sesión nuevamente.");
        onClose();
        return;
    }

    const fechaHoraISO = `${dia}T${hora}:00`;

    const payload = {
      nombreGrupo: nombreGrupo,
      maxMiembros: parseInt(capacidad),
      fechaHoraAlmuerzo: fechaHoraISO,
      restauranteId: restaurante.id,
      creadorId: creadorId // ID extraído del token
    };

    try {
      const response = await fetch('https://lunchconnect-backend.onrender.com/api/grupos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Agregamos el token al header
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert('¡Grupo creado exitosamente!');
        onClose();
      } else {
        const errorData = await response.json();
        alert(`Error al crear grupo: ${errorData.message || 'Inténtalo de nuevo'}`);
      }
    } catch (error) {
      console.error("Error de red:", error);
      alert('Error de conexión al crear el grupo');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (mostrarConfirmacion) {
    // ... (Tu JSX de confirmación se mantiene IDÉNTICO) ...
    return (
       // Copia aquí tu JSX de confirmación existente
       <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-lg">
             <h2>Confirmando grupo: {nombreGrupo}</h2>
             <button onClick={finalizarReserva} disabled={isSubmitting}>
                {isSubmitting ? 'Creando...' : 'Confirmar'}
             </button>
             <button onClick={editarReserva}>Volver</button>
          </div>
       </div>
    );
  }

  // ... (Tu JSX del formulario principal se mantiene IDÉNTICO) ...
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4" onClick={onClose}>
        <div className="w-full max-w-md bg-white rounded-2xl p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4">Crear Grupo en {restaurante.nombre}</h2>
            {/* ... Tus inputs ... */}
            <input type="text" placeholder="Nombre Grupo" value={nombreGrupo} onChange={e => setNombreGrupo(e.target.value)} className="border p-2 w-full mb-2" />
            <input type="number" placeholder="Capacidad" value={capacidad} onChange={e => setCapacidad(e.target.value)} className="border p-2 w-full mb-2" />
            <input type="date" value={dia} onChange={e => setDia(e.target.value)} className="border p-2 w-full mb-2" />
            <input type="time" value={hora} onChange={e => setHora(e.target.value)} className="border p-2 w-full mb-2" />
            
            <button onClick={confirmarReserva} className="bg-primary text-white w-full py-2 rounded">Continuar</button>
            <button onClick={onClose} className="mt-2 w-full text-gray-500">Cancelar</button>
        </div>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL RestaurantSection ---
// Ya no necesitamos recibir props de autenticación aquí
const RestaurantSection = () => {
  const navigate = useNavigate();
  
  const [categoria, setCategoria] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [restaurantes, setRestaurantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [restauranteSeleccionado, setRestauranteSeleccionado] = useState(null);

  // 1. FETCH RESTAURANTES (Igual que antes)
  useEffect(() => {
    const fetchRestaurantes = async () => {
        try {
            const response = await fetch('https://lunchconnect-backend.onrender.com/api/restaurantes');
            const data = await response.json();
            // Mapeo simple para el ejemplo
            const dataFormateada = data.map(r => ({
                id: r.id_restaurante,
                nombre: r.nombre,
                rating: r.calificacion_promedio || 4.5,
                direccion: r.direccion,
                distrito: r.distrito,
                categoria: r.categoria,
                imagen: r.url_imagen || 'https://via.placeholder.com/400x300'
            }));
            setRestaurantes(dataFormateada);
            setLoading(false);
        } catch (error) { console.error(error); setLoading(false); }
    };
    fetchRestaurantes();
  }, []);

  const restaurantesFiltrados = restaurantes.filter((r) => {
     const matchCategoria = categoria ? r.categoria?.toLowerCase() === categoria.toLowerCase() : true;
     const matchUbicacion = ubicacion ? r.distrito?.toLowerCase() === ubicacion.toLowerCase() : true;
     return matchCategoria && matchUbicacion;
  });

  // 3. FUNCIÓN ABRIR MODAL CON AUTH SERVICE
  const abrirModal = (restaurante) => {
    // Usamos la función del servicio importado
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
        {/* ... TUS FILTROS (Igual que antes) ... */}

        {/* GRID DE RESULTADOS */}
        {loading ? (
            <p className="text-center">Cargando...</p>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurantesFiltrados.map((restaurante) => (
                <div key={restaurante.id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
                    <div className="aspect-video overflow-hidden bg-gray-200">
                        <img src={restaurante.imagen} alt={restaurante.nombre} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                    </div>
                    <div className="p-4 flex flex-col flex-1 justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 truncate">{restaurante.nombre}</h3>
                            <p className="text-gray-600 text-sm mb-1 truncate">📍 {restaurante.direccion}</p>
                        </div>
                        <button 
                        onClick={() => abrirModal(restaurante)}
                        className="w-full bg-primary text-white py-2 px-4 rounded hover:bg-[#7b3c3c] transition-colors font-medium mt-auto"
                        >
                        Arma tu grupo
                        </button>
                    </div>
                </div>
            ))}
            </div>
        )}
      </div>

      {/* MODAL: Ya no necesitamos pasar userId ni token */}
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