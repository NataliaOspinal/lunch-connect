import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import InputField from '../components/ui/InputField';
import { useNavigate } from 'react-router-dom';
import { logoutUser, getToken } from '../services/authService'; // Importamos getToken

const Perfil = ({ onOpenChat }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('datos');

  // Estados generales
  const [activeChat, setActiveChat] = useState(null);
  const [userGroups, setUserGroups] = useState([]);
  const [loadingGroups, setLoadingGroups] = useState(false);
  // --- ESTADOS DEL PERFIL ---
  const [userId, setUserId] = useState(null);
  const [profileData, setProfileData] = useState({
    nombreUsuario: '',
    linkedin: '',
    contrasena: '', // Solo se envía si el usuario escribe algo
    tituloPrincipal: '' // Para el select de títulos
  });
  const [loadingProfile, setLoadingProfile] = useState(false);
  
  // Modal de Miembros
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [selectedGroupMembers, setSelectedGroupMembers] = useState([]);
  const [selectedGroupName, setSelectedGroupName] = useState('');

  
  // --- AMIGOS: estados ---
  const [friendsList, setFriendsList] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]); // cada item tiene { id: solicitudId, name, tag, ... }
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]); // cada item: { id, nombre, tag, estado }
  const [loadingFriends, setLoadingFriends] = useState(false);
  const [searching, setSearching] = useState(false);

  // Debounce ref
  const searchTimeout = useRef(null);

  // ---------------------------
  // UTIL: logout y manejo 401
  // ---------------------------
  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleAuthError = (status) => {
    if (status === 401 || status === 403) {
      handleLogout();
      return true;
    }
    return false;
  };

const handleUpdateProfile = async () => {
    const token = getToken();
    
    if (!token || !userId) {
        alert("Error de sesión. Recarga la página.");
        return;
    }

    setLoadingProfile(true);

    // --- CORRECCIÓN: TRADUCIMOS A SNAKE_CASE PARA EL BACKEND ---
    // Tu DB usa: nombre_usuario, titulo_principal, linkedin, contrasena
    const payload = {
      nombre_usuario: profileData.nombreUsuario,
      linkedin: profileData.linkedin,
      // Si el título es la opción por defecto, enviamos string vacío o lo que tienes
      titulo_principal: profileData.tituloPrincipal === '-------' ? '' : profileData.tituloPrincipal
    };

    // Solo enviamos la contraseña si el usuario escribió una nueva
    if (profileData.contrasena && profileData.contrasena.trim() !== "") {
      payload.contrasena = profileData.contrasena; 
    }

    console.log("Enviando payload corregido:", payload); // Para verificar en consola

    try {
      const response = await fetch(`https://lunchconnect-backend.onrender.com/api/usuarios/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert("¡Datos actualizados correctamente!");
        setProfileData(prev => ({ ...prev, contrasena: '' })); // Limpiar campo contraseña
      } else {
        // Intentar leer el error si es JSON, sino texto
        const errorText = await response.text();
        console.error("Error del servidor:", errorText);
        alert("Error al actualizar. Revisa la consola para más detalles.");
      }
    } catch (error) {
      console.error("Error de red:", error);
      alert("Error de conexión.");
    } finally {
      setLoadingProfile(false);
    }
  };

// Helper para decodificar el ID del token
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
    
    // --- DEBUG: MIRA ESTO EN LA CONSOLA (F12) ---
    console.log("🔑 CONTENIDO DEL TOKEN:", decoded); 
    // --------------------------------------------

    // Buscamos el ID en todas las propiedades comunes.
    // Tu base de datos usa 'id_usuario', así que agregamos esa opción.
    return decoded.id || decoded.userId || decoded.id_usuario || decoded.sub;
  } catch (e) {
    console.error("Error al decodificar token:", e);
    return null;
  }
};

useEffect(() => {
    // El helper ahora nos devuelve el EMAIL (porque es lo que hay en el 'sub' del token)
    const emailFromToken = getUserIdFromToken(); 
    console.log("Email obtenido del token:", emailFromToken);

    if (emailFromToken) {
      const fetchUserData = async () => {
        const token = getToken();
        try {
          // PASO A: Pedimos la lista de TODOS los usuarios
          // (Esto evita el Error 500 por enviar un string en vez de un número)
          const response = await fetch('https://lunchconnect-backend.onrender.com/api/usuarios', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          if (response.ok) {
            const users = await response.json();
            
            // PASO B: Buscamos manualmente cuál es nuestro usuario usando el correo
            const currentUser = users.find(u => 
                u.correo_electronico === emailFromToken || 
                u.correoElectronico === emailFromToken ||
                u.email === emailFromToken
            );

            if (currentUser) {
                console.log("Usuario encontrado en BD:", currentUser);
                
                // Guardamos el ID numérico REAL para usarlo al guardar cambios
                setUserId(currentUser.id_usuario || currentUser.id); 

                // Rellenamos el formulario
                setProfileData({
                  nombreUsuario: currentUser.nombre_usuario || currentUser.nombreUsuario || '',
                  linkedin: currentUser.linkedin || '',
                  tituloPrincipal: currentUser.titulo_principal || currentUser.tituloPrincipal || '',
                  contrasena: ''
                });
            } else {
                console.error("No se encontró ningún usuario con el correo:", emailFromToken);
            }
          } else {
              console.error("Error al obtener lista de usuarios:", response.status);
          }
        } catch (error) {
          console.error("Error de red cargando perfil:", error);
        }
      };
      fetchUserData();
    } else {
      console.error("No se pudo leer el correo del token.");
    }
  }, []);
  // ---------------------------
  // GRUPOS: carga inicial (igual a tu código)
  // ---------------------------

  useEffect(() => {
    const fetchUserGroups = async () => {
      const token = getToken();
      if (!token) return;

      setLoadingGroups(true);
      try {
        // 1. Obtener mis grupos
        const response = await fetch('https://lunchconnect-backend.onrender.com/api/grupos/mis-grupos', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (handleAuthError(response.status)) return;

        if (!response.ok) throw new Error('Error al cargar mis grupos');

        const data = await response.json();

        // 2. Para cada grupo, obtener sus participantes individuales
        // Usamos Promise.all para esperar a que todas las peticiones terminen
        const groupsWithMembers = await Promise.all(data.map(async (grupo) => {
            let members = [];
            
            // CORRECCIÓN: Usamos grupo.id (del JSON) no grupo.id_grupo
            if (grupo.id) {
                try {
                    const resMembers = await fetch(`https://lunchconnect-backend.onrender.com/api/grupos/${grupo.id}/participantes`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (resMembers.ok) {
                        const dataMembers = await resMembers.json();
                        // Mapeamos la data de participantes
                        members = dataMembers.map(m => ({
                            id: m.id,
                            name: m.nombreCompleto || m.nombreUsuario || m.nombre || "Usuario",
                            role: m.id === grupo.creadorId ? "Admin" : "Miembro"
                        }));
                    }
                } catch (err) {
                    console.error(`Error cargando miembros del grupo ${grupo.id}`, err);
                }
            }

            // Si no se cargaron miembros (o falló), ponemos al usuario actual o vacío
            if (members.length === 0) {
                members = [{ name: "Tú", role: "Miembro" }];
            }

            return {
                id: grupo.id, 
                name: grupo.nombreGrupo,
                date: new Date(grupo.fechaHoraAlmuerzo).toLocaleDateString(),
                time: new Date(grupo.fechaHoraAlmuerzo).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                creator: grupo.creadorNombre || "Usuario",
                currentMembers: members.length, // Usamos la longitud real de los miembros obtenidos
                maxMembers: grupo.maxMiembros,
                members: members // Guardamos la lista real para el modal
            };
        }));

        setUserGroups(groupsWithMembers);
      } catch (error) {
        console.error("Error fetching user groups:", error);
      } finally {
        setLoadingGroups(false);
      }
    };

    fetchUserGroups();
  }, []);

  // ---------------------------
  // AMIGOS: funciones para llamar al backend
  // ---------------------------

  // Cargar lista de amigos
  const cargarAmigos = async () => {
    const token = getToken();
    if (!token) return;
    setLoadingFriends(true);
    try {
      const res = await fetch('https://lunchconnect-backend.onrender.com/api/amigos', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (handleAuthError(res.status)) return;

      if (!res.ok) throw new Error('Error al obtener amigos');

      const data = await res.json();
      // Suponemos que cada item tiene { id, nombre, tag, role? }
      setFriendsList(data.map(u => ({
        id: u.id,
        name: u.nombre || u.name || u.nombreCompleto || u.nombreUsuario || u.nombreUsuarioPublico || u.nombre,
        tag: u.tag || u.nombreUsuario || u.nombreUsuarioPublico || '',
        role: u.role || u.titulo || u.tituloPrincipal || ''
      })));
    } catch (e) {
      console.error("cargarAmigos:", e);
    } finally {
      setLoadingFriends(false);
    }
  };

  // Cargar solicitudes pendientes
  const cargarPendientes = async () => {
    const token = getToken();
    if (!token) return;
    try {
      const res = await fetch('https://lunchconnect-backend.onrender.com/api/amigos/pendientes', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (handleAuthError(res.status)) return;

      if (!res.ok) throw new Error('Error al obtener pendientes');

      const data = await res.json();
      // Según tu servicio, cada elemento podría venir con id = solicitudId y name/tag del remitente
      setPendingRequests(data.map(p => ({
        id: p.id, // solicitudId según tu mapping del backend
        userId: p.usuarioId || p.usuario_id || p.userId || null,
        name: p.nombre || p.name || p.nombreCompleto || '',
        tag: p.tag || p.nombreUsuario || ''
      })));
    } catch (e) {
      console.error("cargarPendientes:", e);
    }
  };

  // Buscar usuarios (debounced)
  const buscarUsuarios = async (term) => {
    const token = getToken();
    if (!token) return;

    if (!term || term.trim().length === 0) {
      setSearchResults([]);
      setSearching(false);
      return;
    }

    setSearching(true);

    try {
      const res = await fetch(`https://lunchconnect-backend.onrender.com/api/amigos/buscar?term=${encodeURIComponent(term)}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (handleAuthError(res.status)) return;

      if (!res.ok) throw new Error('Error buscando usuarios');

      const data = await res.json();
      // data items: { id, nombre, tag, estado } según confirmaste
      setSearchResults(data.map(u => ({
        id: u.id,
        name: u.nombre || u.name || u.nombreCompleto || '',
        tag: u.tag || u.nombreUsuario || '',
        status: u.estado || u.status || 'NINGUNO' // NINGUNO | AMIGO | SOLICITUD_PENDIENTE
      })));
    } catch (e) {
      console.error("buscarUsuarios:", e);
    } finally {
      setSearching(false);
    }
  };

  // Enviar solicitud
  const enviarSolicitud = async (destinatarioId) => {
    const token = getToken();
    if (!token) return false;
    try {
      const res = await fetch(`https://lunchconnect-backend.onrender.com/api/amigos/solicitar/${destinatarioId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (handleAuthError(res.status)) return false;

      if (!res.ok) {
        const txt = await res.text().catch(() => null);
        console.error("Error enviar solicitud:", res.status, txt);
        return false;
      }

      // Si se envió correctamente, actualizamos la búsqueda y pendientes
      // Volvemos a ejecutar búsqueda para actualizar estado del usuario (si estaba en resultados)
      setSearchResults(prev => prev.map(s => s.id === destinatarioId ? { ...s, status: 'SOLICITUD_PENDIENTE' } : s));
      await cargarPendientes();
      return true;
    } catch (e) {
      console.error("enviarSolicitud:", e);
      return false;
    }
  };

  // Aceptar solicitud (usa id = solicitudId)
  const aceptarSolicitud = async (solicitudId) => {
    const token = getToken();
    if (!token) return false;
    try {
      const res = await fetch(`https://lunchconnect-backend.onrender.com/api/amigos/aceptar/${solicitudId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (handleAuthError(res.status)) return false;

      if (!res.ok) {
        console.error("Error aceptar solicitud:", res.status);
        return false;
      }

      await cargarPendientes();
      await cargarAmigos();
      return true;
    } catch (e) {
      console.error("aceptarSolicitud:", e);
      return false;
    }
  };

  // Rechazar solicitud
  const rechazarSolicitud = async (solicitudId) => {
    const token = getToken();
    if (!token) return false;
    try {
      const res = await fetch(`https://lunchconnect-backend.onrender.com/api/amigos/rechazar/${solicitudId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (handleAuthError(res.status)) return false;

      if (!res.ok) {
        console.error("Error rechazar solicitud:", res.status);
        return false;
      }

      await cargarPendientes();
      return true;
    } catch (e) {
      console.error("rechazarSolicitud:", e);
      return false;
    }
  };

  // ---------------------------
  // EFFECT: cargar amigos y pendientes cuando entramos a la pestaña "amigos"
  // ---------------------------
  useEffect(() => {
    if (activeTab === 'amigos') {
      cargarAmigos();
      cargarPendientes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // ---------------------------
  // DEBOUNCE searchTerm
  // ---------------------------
  useEffect(() => {
    // Limpia timeout previo
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    if (!searchTerm || searchTerm.trim() === '') {
      setSearchResults([]);
      setSearching(false);
      return;
    }

    // Espera 400ms tras última tecla
    searchTimeout.current = setTimeout(() => {
      buscarUsuarios(searchTerm);
    }, 400);

    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  const handleOpenChat = (group) => {
    if (onOpenChat) {
      onOpenChat({ id: group.id, name: group.name });
    }else {
      setActiveChat({ id: group.id, name: group.name });
    }
  };
  
  const closeLocalChat = () => setActiveChat(null);

  // NUEVA FUNCIÓN: Abrir Modal de Miembros
  const handleOpenMembersModal = (groupName, members) => {
    setSelectedGroupName(groupName);
    setSelectedGroupMembers(members || []);
    setShowMembersModal(true);
  };

  // ---------------------------
  // Datos mock (historial)
  // ---------------------------
  const historyGroups = [
{ id: 101, name: "Grupo comelones", date: "12/12/2025", time: "22:30", creator: "Maria L.", image: null, currentMembers: 9, maxMembers: 10, members: [{ name: "Amelia A." }, { name: "Rodolfo B." }] }
  ];

  // ---------------------------
  // RENDER
  // ---------------------------
  return (
    <div className="min-h-screen bg-primary flex flex-col font-secondary">
      <Navbar />

      <main className="grow flex flex-col items-center justify-start px-4 py-8 bg-white">

        {/* TÍTULO Y BOTÓN DE CERRAR SESIÓN */}
        <div className="w-full max-w-5xl flex justify-between items-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-primary font-secondary">
            Perfil
          </h1>
          <button
            onClick={handleLogout}
            className="bg-secondary hover:bg-red-800 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition-colors"
          >
            Cerrar sesión
          </button>
        </div>

        <div className="w-full max-w-5xl">

          {/* --- PESTAÑAS (TABS) --- */}
          <div className="flex w-full pl-4 md:pl-0 overflow-x-auto">
            {['Datos', 'Grupos', 'Historial', 'Amigos'].map((tab) => {
              const tabKey = tab.toLowerCase();
              const isActive = activeTab === tabKey;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tabKey)}
                  className={`px-10 cursor-pointer py-3 rounded-t-2xl font-semibold text-lg transition-colors whitespace-nowrap ${isActive
                      ? "bg-primary text-white"
                      : "bg-[#F3E5E5] text-black hover:bg-[#e0d0d0]"
                    }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* --- CONTENEDOR PRINCIPAL --- */}
          <div className="bg-primary rounded-b-[2.5rem] rounded-tr-[2.5rem] p-8 md:p-16 shadow-2xl">

            {/* --- PESTAÑA DATOS (CON LÓGICA) --- */}
            {activeTab === 'datos' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
                
                {/* COLUMNA IZQUIERDA: Avatar y Título */}
                <div className="col-span-1 flex flex-col items-center gap-6">
                  <div className="relative">
                    <div className="w-40 h-40 bg-white rounded-full flex items-center justify-center border-4 border-[#8B3A3A] overflow-hidden">
                      {/* Avatar SVG */}
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#3D0F0F" className="w-32 h-32"><path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" /></svg>
                    </div>
                  </div>

                  <div className="w-full">
                    <label className="text-white font-bold text-lg mb-2 block text-center">
                      Título Principal
                    </label>
                    <div className="relative">
                      <select 
                        name="tituloPrincipal"
                        value={profileData.tituloPrincipal}
                        onChange={handleInputChange}
                        className="w-full bg-white rounded-xl px-4 py-3 text-gray-800 appearance-none focus:outline-none cursor-pointer font-medium"
                      >
                        <option value="">Selecciona un título</option>
                        <option value="Chifa Lover">Chifa Lover</option>
                        <option value="Rey del Buffet">Rey del Buffet</option>
                        <option value="Networking Master">Networking Master</option>
                        <option value="Ingeniero Hambriento">Ingeniero Hambriento</option>
                      </select>
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-600">▼</div>
                    </div>
                  </div>
                </div>

                {/* COLUMNA DERECHA: Inputs Editables */}
                <div className="col-span-1 md:col-span-2 flex flex-col gap-6">
                  
                  {/* Usuario */}
                  <div className="flex flex-col gap-2">
                    <label className="text-white font-bold text-lg">Nombre de Usuario</label>
                    <input 
                      type="text" 
                      name="nombreUsuario"
                      value={profileData.nombreUsuario} 
                      onChange={handleInputChange}
                      className="w-full bg-white rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#8B3A3A]"
                    />
                  </div>

                  {/* Contraseña */}
                  <div className="flex flex-col gap-2">
                    <label className="text-white font-bold text-lg">Actualizar contraseña</label>
                    <input 
                      type="password" 
                      name="contrasena"
                      value={profileData.contrasena} 
                      onChange={handleInputChange}
                      placeholder="(Dejar en blanco para mantener la actual)"
                      className="w-full bg-white rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#8B3A3A]"
                    />
                  </div>

                  {/* LinkedIn */}
                  <div className="flex flex-col gap-2">
                    <label className="text-white font-bold text-lg">LinkedIn (URL)</label>
                    <input 
                      type="text" 
                      name="linkedin"
                      value={profileData.linkedin} 
                      onChange={handleInputChange}
                      className="w-full bg-white rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#8B3A3A]"
                    />
                  </div>

                </div>

                {/* Botón Guardar */}
                <div className="col-span-1 md:col-span-3 flex justify-center mt-8 font-secondary">
                  <button 
                    onClick={handleUpdateProfile}
                    disabled={loadingProfile}
                    className="bg-[#8B3A3A] hover:bg-red-800 cursor-pointer text-white font-semibold py-3 px-12 rounded-xl transition-colors shadow-lg text-lg disabled:opacity-50"
                  >
                    {loadingProfile ? 'Guardando...' : 'Guardar cambios'}
                  </button>
                </div>
              </div>
            )}

            {/* TAB GRUPOS (ACTUALIZADO) */}
            {activeTab === 'grupos' && (
              <div className="flex flex-col gap-8 animate-fade-in">
                {loadingGroups ? (
                  <p className="text-white text-center text-xl">Cargando tus grupos...</p>
                ) : userGroups.length > 0 ? (
                  userGroups.map((group) => (
                    <div key={group.id}>
                      <h3 className="text-white text-xl font-medium mb-3 ml-2">{group.name}</h3>
                      <div className="bg-white rounded-4xl p-6 flex flex-col lg:flex-row gap-6 items-stretch shadow-lg">
                        
                        {/* 1. Icono + Botón Chat */}
                        <div className="w-full lg:w-auto shrink-0 flex flex-col items-center">
                          <div className="w-32 h-32 bg-primary rounded-2xl flex items-center justify-center border-4 border-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-16 h-16"><path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" /></svg>
                          </div>
                          <button onClick={() => handleOpenChat(group)} className="cursor-pointer mt-4 flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full text-xs font-bold shadow-md hover:bg-[#4a1313] hover:scale-105 transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223zM8.25 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM10.875 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z" clipRule="evenodd" /></svg>
                            Chat grupal
                          </button>
                        </div>

                        {/* 2. Información */}
                        <div className="grow flex flex-col justify-center gap-3 text-primary font-bold px-2">
                          <p className="text-lg">Fecha: <span className="font-medium text-black">{group.date}</span></p>
                          <p className="text-lg">Hora: <span className="font-medium text-black">{group.time}</span></p>
                          <p className="text-lg">Creador: <span className="font-medium text-black">{group.creator}</span></p>
                        </div>

                        {/* 3. Integrantes */}
                        <div className="w-full lg:w-[40%] bg-primary rounded-2xl p-5 text-white flex flex-col justify-between">
                          <div className="flex justify-between items-center mb-4 text-sm">
                            <span className="font-medium">Integrantes: {group.currentMembers}/{group.maxMembers}</span>
                            <button onClick={() => handleOpenMembersModal(group.name, group.members)} className="text-gray-300 hover:text-white underline text-xs cursor-pointer">Ver Todos</button>
                          </div>
                          <div className="flex justify-between items-start">
                            {/* Mostramos solo los primeros 4 para no saturar la tarjeta */}
                            {group.members.slice(0, 4).map((member, idx) => (
                              <div key={idx} className="flex flex-col items-center gap-1">
                                <div className="bg-white rounded-full p-1 w-10 h-10 flex items-center justify-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#3D0F0F" className="w-6 h-6"><path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" /></svg>
                                </div>
                                <span className="text-[10px] text-gray-300 text-center leading-tight max-w-[50px] truncate">{member.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-white text-center text-lg mt-10">Aún no tienes grupos activos.</p>
                )}
              </div>
            )}

            {/* --- PESTAÑA: HISTORIAL --- */}
            {activeTab === 'historial' && (
              <div className="flex flex-col gap-8 animate-fade-in">
                {historyGroups.map((group) => (
                  <div key={group.id}>
                    <h3 className="text-white text-xl font-medium mb-3 ml-2">{group.name}</h3>
                    <div className="border-[3px] border-[#F6E7E7] bg-[#7E3333] rounded-4xl p-6 flex flex-col lg:flex-row gap-6 items-stretch">
                      <div className="w-full lg:w-auto shrink-0 flex justify-center">
                        <div className="w-32 h-32 bg-secondary rounded-2xl flex items-center justify-center border-4 border-secondary/50">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-16 h-16 opacity-50">
                            <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      <div className="grow flex flex-col justify-center gap-3 text-white font-bold px-2">
                        <p className="text-lg text-white"> <span className="text-gray-300 font-normal">Fecha:</span> {group.date} </p>
                        <p className="text-lg"> <span className="text-gray-300 font-normal">Hora:</span> {group.time} </p>
                        <p className="text-lg"> <span className="text-gray-300 font-normal">Creador:</span> {group.creator} </p>
                      </div>
                      <div className="w-full lg:w-[40%] bg-secondary rounded-2xl p-5 text-white flex flex-col justify-between">
                        <div className="flex justify-between items-center mb-4 text-sm">
                          <span className="font-medium">Integrantes: {group.currentMembers}/{group.maxMembers}</span>
                          <button className="text-gray-300 hover:text-white underline text-xs">Ver Todos</button>
                        </div>
                        <div className="flex justify-between items-start">
                          {group.members.map((member, idx) => (
                            <div key={idx} className="flex flex-col items-center gap-1">
                              <div className="bg-white rounded-full p-1 w-10 h-10 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#3D0F0F" className="w-6 h-6">
                                  <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <span className="text-[10px] text-gray-300 text-center leading-tight max-w-[50px]">{member.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* --- PESTAÑA: AMIGOS --- */}
            {activeTab === 'amigos' && (
              <div className="flex flex-col gap-8 animate-fade-in">

                {/* BUSCADOR */}
                <div className="relative w-full">
                  <input
                    type="text"
                    placeholder="Buscar amigos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[#EAE0E0] rounded-xl px-6 py-4 text-secondary focus:outline-none placeholder-primary/80 font-medium"
                  />
                  <div className="absolute right-6 top-1/2 transform -translate-y-1/2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white bg-secondary rounded-full p-1 box-content" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>

                {/* RESULTADOS DE BÚSQUEDA */}
                {searching && <p className="text-white">Buscando...</p>}
                {searchResults.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {searchResults.map((u) => (
                      <div key={u.id} className="bg-white rounded-2xl p-4 shadow flex flex-col items-center">
                        <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-2">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-10 h-10">
                            <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <p className="font-bold text-primary text-center">{u.name}</p>
                        <p className="text-xs text-gray-500">{u.tag}</p>

                        <div className="mt-3 w-full flex justify-center">
                          {u.status === 'NINGUNO' && (
                            <button
                              onClick={async () => {
                                const ok = await enviarSolicitud(u.id);
                                if (ok) {
                                  // opcional: mostrar feedback
                                } else {
                                  alert('No se pudo enviar la solicitud');
                                }
                              }}
                              className="bg-primary text-white px-4 py-2 rounded-xl"
                            >
                              Enviar solicitud
                            </button>
                          )}
                          {u.status === 'SOLICITUD_PENDIENTE' && (
                            <div className="px-3 py-2 rounded-xl bg-yellow-400 text-black font-semibold">Solicitud enviada</div>
                          )}
                          {u.status === 'AMIGO' && (
                            <div className="px-3 py-2 rounded-xl bg-green-600 text-white font-semibold">Amigo</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* SOLICITUDES PENDIENTES */}
                <div>
                  <h3 className="text-white text-xl font-bold mb-4">Solicitudes pendientes</h3>
                  {pendingRequests.length === 0 && <p className="text-white/80">No tienes solicitudes pendientes.</p>}
                  <div className="flex flex-col gap-3">
                    {pendingRequests.map((p) => (
                      <div key={p.id} className="bg-white rounded-xl p-4 flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-primary">{p.name}</p>
                          <p className="text-xs text-gray-500">{p.tag}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={async () => {
                              const ok = await aceptarSolicitud(p.id);
                              if (!ok) alert('No se pudo aceptar la solicitud');
                            }}
                            className="bg-green-600 text-white px-4 py-2 rounded-xl"
                          >
                            Aceptar
                          </button>
                          <button
                            onClick={async () => {
                              const ok = await rechazarSolicitud(p.id);
                              if (!ok) alert('No se pudo rechazar la solicitud');
                            }}
                            className="bg-red-600 text-white px-4 py-2 rounded-xl"
                          >
                            Rechazar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* MIS AMIGOS */}
                <div>
                  <h3 className="text-white text-xl font-bold mb-4">Mis amigos</h3>
                  {loadingFriends ? <p className="text-white">Cargando amigos...</p> : null}
                  {friendsList.length === 0 && !loadingFriends && <p className="text-white/80">Aún no tienes amigos.</p>}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {friendsList.map((friend) => (
                      <div key={friend.id} className="bg-[#FFEDED] rounded-2xl p-4 flex flex-col items-center justify-between shadow-lg">
                        <span className="text-sm font-bold text-secondary mb-2">{friend.tag}</span>
                        <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-2">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-12 h-12">
                            <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="text-center mb-3">
                          <p className="text-[10px] md:text-xs text-black/70 font-semibold">{friend.role}</p>
                          <p className="text-md md:text-base font-bold text-primary leading-tight mt-1">{friend.name}</p>
                        </div>
                        <div className="w-full flex justify-center gap-2">
                          <button
                            //onClick={() => handleOpenChatLocal(friend.name)}
                            className="bg-primary text-white px-4 py-2 rounded-xl"
                          >
                            Chat
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

          </div>
        </div>
      </main>

      <Footer />

      {showMembersModal && (
        <div className="fixed inset-0 bg-black/50 z-100 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setShowMembersModal(false)}>
          <div className="bg-primary w-full max-w-lg rounded-3xl p-6 relative shadow-2xl border-2 border-white/20" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowMembersModal(false)} className="absolute top-4 right-4 text-white hover:text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="cursor-pointer w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <h3 className="text-2xl font-bold text-white text-center mb-6 border-b border-white/20 pb-4">
              Integrantes de {selectedGroupName}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              {selectedGroupMembers.map((member, idx) => (
                <div key={idx} className="bg-white/10 rounded-xl p-3 flex flex-col items-center gap-2 hover:bg-white/20 transition-colors">
                  <div className="bg-white rounded-full p-2 w-12 h-12 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#3D0F0F" className="w-8 h-8"><path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" /></svg>
                  </div>
                  <span className="text-sm font-medium text-white text-center truncate w-full">{member.name}</span>
                  <span className="text-[10px] text-gray-300 bg-black/20 px-2 py-0.5 rounded-full">{member.role}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Perfil;
