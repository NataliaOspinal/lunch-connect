import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import InputField from '../components/ui/InputField';
import { useNavigate } from 'react-router-dom';
import { logoutUser, getToken } from '../services/authService'; // Importamos getToken

const Perfil = ({ onOpenChat }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('datos');

  // Estado para controlar qué chat está abierto
  const [activeChat, setActiveChat] = useState(null);
  
  // Estado para los grupos reales que vienen de la API
  const [userGroups, setUserGroups] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- EFECTO: CARGAR MIS GRUPOS ---
  useEffect(() => {
    const fetchUserGroups = async () => {
      const token = getToken();
      
      if (!token) {
        // Si no hay token, no podemos cargar grupos. Redirigir o no hacer nada.
        return;
      }

      setLoading(true);
      try {
        const response = await fetch('https://lunchconnect-backend.onrender.com/api/grupos/mis-grupos', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Header de autenticación
            'Content-Type': 'application/json'
          }
        });

        if (response.status === 401 || response.status === 403) {
          // Token inválido o expirado
          handleLogout();
          return;
        }

        if (!response.ok) {
          throw new Error('Error al cargar mis grupos');
        }

        const data = await response.json();
        
        // Mapear los datos de la DB a la estructura visual de tu tarjeta
        const mappedGroups = data.map(grupo => ({
          id: grupo.id,
          name: grupo.nombreGrupo,
          // Formatear fecha y hora
          date: new Date(grupo.fechaHoraAlmuerzo).toLocaleDateString(),
          time: new Date(grupo.fechaHoraAlmuerzo).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          creator: grupo.creadorNombre || "Tú", // Si el backend no manda nombre, asumimos que es el usuario
          // Datos calculados
          currentMembers: grupo.participantesCount || 1, 
          maxMembers: grupo.maxMiembros,
          // Generamos miembros visuales (placeholder o reales si el backend los manda)
          members: grupo.participantes ? grupo.participantes : [{ name: "Tú" }] 
        }));

        setUserGroups(mappedGroups);

      } catch (error) {
        console.error("Error fetching user groups:", error);
      } finally {
        setLoading(false);
      }
    };

    // Llamamos a la función solo si estamos en la pestaña grupos (opcional, para optimizar)
    // O la llamamos siempre al inicio. 
    fetchUserGroups();
  }, []); // Se ejecuta una vez al montar

  // --- DATOS MOCK PARA HISTORIAL Y AMIGOS---
  const historyGroups = [
    {
      id: 101,
      name: "Grupo comelones",
      date: "12/12/2025",
      time: "22:30",
      creator: "Maria L.",
      image: null,
      currentMembers: 9,
      maxMembers: 10,
      members: [{ name: "Amelia A." }, { name: "Francisco C." }, { name: "Rodolfo B." }, { name: "Rodolfo B." }]
    }
  ];

  const friendsList = [];

  // Función para cerrar sesión
  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  // Función para abrir el chat
  const handleOpenChat = (groupName) => {
    if (onOpenChat) {
      onOpenChat(groupName);
    }
  };

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

            {/* --- PESTAÑA: DATOS --- */}
            {activeTab === 'datos' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
                {/* COLUMNA IZQUIERDA: Avatar y Títulos */}
                <div className="col-span-1 flex flex-col items-center gap-6">
                  <div className="relative">
                    <div className="w-40 h-40 bg-white rounded-full flex items-center justify-center border-4 border-secondary overflow-hidden">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#3D0F0F" className="w-32 h-32">
                        <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <button className="absolute bottom-2 right-2 bg-secondary border-2 border-white p-2 rounded-full text-white hover:bg-red-900 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                      </svg>
                    </button>
                  </div>

                  <div className="w-full">
                    <label className="text-white font-bold text-lg mb-2 block text-center">
                      Títulos desbloqueados
                    </label>
                    <div className="relative">
                      <select className="w-full bg-white rounded-xl px-4 py-3 text-gray-800 appearance-none focus:outline-none cursor-pointer font-medium">
                        <option>-------</option>
                        <option>Chifa Lover</option>
                        <option>Rey del Buffet</option>
                        <option>Networking Master</option>
                      </select>
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* COLUMNA DERECHA: Inputs */}
                <div className="col-span-1 md:col-span-2 flex flex-col gap-6">
                  <InputField label="Usuario" id="usuario" />
                  <InputField label="Actualizar contraseña" type="password" id="new-password" />
                  <InputField label="LinkedIn" id="linkedin-profile" />
                </div>

                <div className="col-span-1 md:col-span-3 flex justify-center mt-8 font-secondary">
                  <button className="bg-secondary hover:bg-red cursor-pointer text-white font-semibold py-3 px-12 rounded-xl transition-colors shadow-lg text-lg">
                    Guardar cambios
                  </button>
                </div>
              </div>
            )}

            {/* --- PESTAÑA: GRUPOS (CONECTADO A API) --- */}
            {activeTab === 'grupos' && (
              <div className="flex flex-col gap-8 animate-fade-in">
                {loading ? (
                  <p className="text-white text-center text-xl">Cargando tus grupos...</p>
                ) : userGroups.length > 0 ? (
                  userGroups.map((group) => (
                    <div key={group.id}>
                      {/* Nombre del Grupo */}
                      <h3 className="text-white text-xl font-medium mb-3 ml-2">{group.name}</h3>

                      {/* Tarjeta Blanca */}
                      <div className="bg-white rounded-4xl p-6 flex flex-col lg:flex-row gap-6 items-stretch shadow-lg">

                        {/* 1. Icono/Imagen */}
                        <div className="w-full lg:w-auto shrink-0 flex flex-col items-center">
                          <div className="w-32 h-32 bg-secondary rounded-2xl flex items-center justify-center border-4 border-secondary">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-16 h-16">
                              <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                          
                          {/* BOTÓN "VER CHAT GRUPAL" */}
                          <button 
                            onClick={() => handleOpenChat(group.name)} // <--- USAMOS LA PROP AQUÍ
                            className="cursor-pointer mt-4 flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full text-xs font-bold shadow-md hover:bg-[#7b3c3c] hover:scale-105 transition-all"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                              <path fillRule="evenodd" d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223zM8.25 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM10.875 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z" clipRule="evenodd" />
                            </svg>
                            Chat grupal
                          </button>
                        </div>

                        {/* 2. Información Central */}
                        <div className="grow flex flex-col justify-center gap-3 text-secondary font-bold px-2">
                          <p className="text-lg">Fecha: <span className="font-medium text-black">{group.date}</span></p>
                          <p className="text-lg">Hora: <span className="font-medium text-black">{group.time}</span></p>
                          <p className="text-lg">Creador: <span className="font-medium text-black">{group.creator}</span></p>
                        </div>

                        {/* 3. Caja de Integrantes */}
                        <div className="w-full lg:w-[40%] bg-secondary rounded-2xl p-5 text-white flex flex-col justify-between">
                          <div className="flex justify-between items-center mb-4 text-sm">
                            <span className="font-medium">Integrantes: {group.currentMembers}/{group.maxMembers}</span>
                            <button className="text-gray-300 hover:text-white underline text-xs">Ver Todos</button>
                          </div>

                          <div className="flex justify-between items-start">
                            {/* Renderizamos hasta 4 miembros visuales */}
                            {group.members.slice(0, 4).map((member, idx) => (
                              <div key={idx} className="flex flex-col items-center gap-1">
                                <div className="bg-white rounded-full p-1 w-10 h-10 flex items-center justify-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#3D0F0F" className="w-6 h-6">
                                    <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                                  </svg>
                                </div>
                                <span className="text-[10px] text-gray-300 text-center leading-tight max-w-[50px]">{member.name || "Usuario"}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-white text-center text-lg mt-10">Aún no tienes grupos activos. ¡Ve a "Explorar" para unirte o crear uno!</p>
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
                {/* ... (Tu código de amigos igual que antes) ... */}
                <div className="relative w-full">
                  <input type="text" placeholder="Buscar amigos..." className="w-full bg-[#EAE0E0] rounded-xl px-6 py-4 text-secondary focus:outline-none placeholder-primary/80 font-medium" />
                  <div className="absolute right-6 top-1/2 transform -translate-y-1/2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white bg-secondary rounded-full p-1 box-content" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {friendsList.map((friend) => (
                    <div key={friend.id} className="bg-[#FFEDED] rounded-2xl p-4 flex flex-col items-center justify-between shadow-lg aspect-3/4">
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
                      <button className="hover:scale-110 transition-transform">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-primary">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </main>

      <Footer />

    </div>
  );
};

export default Perfil;