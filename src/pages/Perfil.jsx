// ===== PARTE 1: ESTADOS Y FUNCIONES PARA AGREGAR =====

// Estados para amigos (agregar después de los estados de grupos)
const [friendsList, setFriendsList] = useState([]);
const [pendingRequests, setPendingRequests] = useState([]);
const [searchTerm, setSearchTerm] = useState('');
const [searchResults, setSearchResults] = useState([]);
const [loadingFriends, setLoadingFriends] = useState(false);
const [loadingSearch, setLoadingSearch] = useState(false);

// ===== USEEFFECT PARA CARGAR AMIGOS =====
useEffect(() => {
  if (activeTab === 'amigos') {
    fetchFriends();
    fetchPendingRequests();
  }
}, [activeTab]);

// ===== FUNCIONES DE API =====

// Cargar lista de amigos
const fetchFriends = async () => {
  const token = getToken();
  if (!token) return;

  setLoadingFriends(true);
  try {
    const response = await fetch('https://lunchconnect-backend.onrender.com/api/amigos', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 401 || response.status === 403) {
      handleLogout();
      return;
    }

    if (response.ok) {
      const data = await response.json();
      setFriendsList(data);
    }
  } catch (error) {
    console.error("Error fetching friends:", error);
  } finally {
    setLoadingFriends(false);
  }
};

// Cargar solicitudes pendientes
const fetchPendingRequests = async () => {
  const token = getToken();
  if (!token) return;

  try {
    const response = await fetch('https://lunchconnect-backend.onrender.com/api/amigos/pendientes', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      setPendingRequests(data);
    }
  } catch (error) {
    console.error("Error fetching pending requests:", error);
  }
};

// Buscar usuarios
const handleSearchUsers = async () => {
  if (!searchTerm.trim()) {
    setSearchResults([]);
    return;
  }

  const token = getToken();
  if (!token) return;

  setLoadingSearch(true);
  try {
    const response = await fetch(`https://lunchconnect-backend.onrender.com/api/amigos/buscar?term=${encodeURIComponent(searchTerm)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      setSearchResults(data);
    }
  } catch (error) {
    console.error("Error searching users:", error);
  } finally {
    setLoadingSearch(false);
  }
};

// Enviar solicitud de amistad
const handleSendFriendRequest = async (destinatarioId) => {
  const token = getToken();
  if (!token) return;

  try {
    const response = await fetch(`https://lunchconnect-backend.onrender.com/api/amigos/solicitar/${destinatarioId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      alert('✅ Solicitud de amistad enviada');
      handleSearchUsers();
    } else {
      const message = await response.text();
      alert(message || 'Error al enviar solicitud');
    }
  } catch (error) {
    console.error("Error sending friend request:", error);
    alert('Error al enviar solicitud');
  }
};

// Aceptar solicitud
const handleAcceptRequest = async (solicitudId) => {
  const token = getToken();
  if (!token) return;

  try {
    const response = await fetch(`https://lunchconnect-backend.onrender.com/api/amigos/aceptar/${solicitudId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      alert('✅ Solicitud aceptada. ¡Ahora son amigos!');
      fetchFriends();
      fetchPendingRequests();
    }
  } catch (error) {
    console.error("Error accepting request:", error);
    alert('Error al aceptar solicitud');
  }
};

// Rechazar solicitud
const handleRejectRequest = async (solicitudId) => {
  const token = getToken();
  if (!token) return;

  try {
    const response = await fetch(`https://lunchconnect-backend.onrender.com/api/amigos/rechazar/${solicitudId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      alert('Solicitud rechazada');
      fetchPendingRequests();
    }
  } catch (error) {
    console.error("Error rejecting request:", error);
    alert('Error al rechazar solicitud');
  }
};

{/* --- PESTAÑA: AMIGOS --- */}
{activeTab === 'amigos' && (
  <div className="flex flex-col gap-8 animate-fade-in">
    
    {/* BARRA DE BÚSQUEDA */}
    <div className="relative w-full">
      <input 
        type="text" 
        placeholder="Buscar usuarios..." 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSearchUsers()}
        className="w-full bg-[#EAE0E0] rounded-xl px-6 py-4 text-secondary focus:outline-none placeholder-primary/80 font-medium" 
      />
      <button 
        onClick={handleSearchUsers}
        className="absolute right-6 top-1/2 transform -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white bg-secondary rounded-full p-1 box-content" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
    </div>

    {/* RESULTADOS DE BÚSQUEDA */}
    {loadingSearch && (
      <p className="text-white text-center">Buscando...</p>
    )}
    
    {searchResults.length > 0 && (
      <div>
        <h3 className="text-white text-xl font-semibold mb-4">Resultados de búsqueda</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {searchResults.map((user) => (
            <div key={user.id} className="bg-[#FFEDED] rounded-2xl p-4 flex flex-col items-center justify-between shadow-lg">
              <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-12 h-12">
                  <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-center mb-3">
                <p className="text-md md:text-base font-bold text-primary leading-tight">{user.nombre}</p>
                <p className="text-[10px] md:text-xs text-black/70 font-semibold mt-1">{user.email}</p>
              </div>
              <button 
                onClick={() => handleSendFriendRequest(user.id)}
                className="bg-secondary hover:bg-red-900 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer"
              >
                Enviar solicitud
              </button>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* SOLICITUDES PENDIENTES */}
    {pendingRequests.length > 0 && (
      <div>
        <h3 className="text-white text-xl font-semibold mb-4">
          Solicitudes pendientes ({pendingRequests.length})
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {pendingRequests.map((request) => (
            <div key={request.id} className="bg-[#FFF5E1] rounded-2xl p-4 flex flex-col items-center justify-between shadow-lg border-2 border-yellow-400">
              <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-12 h-12">
                  <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-center mb-3">
                <p className="text-md md:text-base font-bold text-primary leading-tight">{request.nombre}</p>
                <p className="text-[10px] md:text-xs text-black/70 font-semibold mt-1">{request.email}</p>
              </div>
              <div className="flex gap-2 w-full">
                <button 
                  onClick={() => handleAcceptRequest(request.id)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  Aceptar
                </button>
                <button 
                  onClick={() => handleRejectRequest(request.id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  Rechazar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* LISTA DE AMIGOS */}
    <div>
      <h3 className="text-white text-xl font-semibold mb-4">
        Mis amigos {friendsList.length > 0 && `(${friendsList.length})`}
      </h3>
      
      {loadingFriends ? (
        <p className="text-white text-center">Cargando amigos...</p>
      ) : friendsList.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {friendsList.map((friend) => (
            <div key={friend.id} className="bg-[#FFEDED] rounded-2xl p-4 flex flex-col items-center justify-between shadow-lg aspect-3/4">
              <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-12 h-12">
                  <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-center mb-3 flex-grow">
                <p className="text-md md:text-base font-bold text-primary leading-tight mt-1">{friend.nombre}</p>
                {friend.email && (
                  <p className="text-[10px] md:text-xs text-black/70 font-semibold">{friend.email}</p>
                )}
              </div>
              {friend.linkedinUrl && (
                <a 
                  href={friend.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:scale-110 transition-transform cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-primary">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-white text-center text-lg">
          Aún no tienes amigos. ¡Busca usuarios y envía solicitudes!
        </p>
      )}
    </div>

  </div>
)}