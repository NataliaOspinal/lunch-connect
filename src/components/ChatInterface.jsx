import React, { useState, useEffect, useRef } from 'react';
import { getToken } from '../services/authService';

// Helper para obtener ID del usuario (para saber quién envía)
const getUserIdFromToken = () => {
  const token = getToken();
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
    const decoded = JSON.parse(jsonPayload);
    return decoded.id || decoded.userId || decoded.sub;
  } catch (e) { return null; }
};

const ChatInterface = ({ groupId, groupName, onClose }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  
  // Obtenemos mi ID una sola vez
  const myId = getUserIdFromToken();

  // --- FUNCIÓN: CARGAR MENSAJES (GET) ---
  const fetchMessages = async () => {
    try {
      const token = getToken();
      // Asumimos que tu backend tiene un endpoint para filtrar por grupo
      // Si no, tendrás que filtrar en el front (menos eficiente)
      const response = await fetch(`https://lunchconnect-backend.onrender.com/api/mensaje?grupo_id=${groupId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Mapeamos las columnas de tu DB a la UI
        const formattedMessages = data.map(msg => ({
          id: msg.id || msg.id_mensaje,
          text: msg.contenido,
          sender: msg.remitente_id === myId ? 'Tú' : 'Usuario', // Podrías traer el nombre con un JOIN en el backend
          isMe: msg.remitente_id === myId,
          time: new Date(msg.fecha_envio).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        }));
        
        // Solo actualizamos si hay cambios para evitar re-renders innecesarios
        // (En una app real compararíamos longitudes o IDs)
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error("Error cargando chat:", error);
    }
  };

  // --- EFECTO: POLLING (Consultar cada 3 segundos) ---
  useEffect(() => {
    fetchMessages(); // Carga inicial
    
    const interval = setInterval(() => {
      if (!isMinimized) fetchMessages();
    }, 3000); // Polling cada 3 segundos

    return () => clearInterval(interval);
  }, [groupId, isMinimized]);

  // Scroll al fondo al llegar mensajes
  useEffect(() => {
    if (!isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isMinimized]);

  // --- FUNCIÓN: ENVIAR MENSAJE (POST) ---
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const token = getToken();
    const tempId = Date.now();
    
    // 1. Optimistic UI (Mostrar mensaje inmediatamente antes de que el servidor responda)
    const optimisticMsg = { 
        id: tempId, 
        text: newMessage, 
        sender: 'Tú', 
        isMe: true, 
        time: new Date().toLocaleTimeString() 
    };
    setMessages(prev => [...prev, optimisticMsg]);
    setNewMessage('');

    try {
      // Estructura basada en tu tabla 'mensaje'
      const payload = {
        contenido: optimisticMsg.text,
        fecha_envio: new Date().toISOString(),
        tipo: 'TEXTO', // Asumiendo un valor por defecto para la columna 'tipo'
        grupo_id: groupId,
        remitente_id: myId
      };

      await fetch('https://lunchconnect-backend.onrender.com/api/mensaje', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      
      // El polling actualizará la lista real en unos segundos
    } catch (error) {
      console.error("Error enviando mensaje:", error);
      // Aquí podrías mostrar un error visual en el mensaje
    }
  };

  // --- VISTA MINIMIZADA ---
  if (isMinimized) {
    return (
      <button 
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-primary rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-110 transition-transform z-50 border-2 border-white animate-bounce-in"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.159 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
        </svg>
      </button>
    );
  }

  // --- VISTA MAXIMIZADA ---
  return (
    <div className="fixed bottom-0 right-4 w-80 md:w-96 h-[500px] bg-white rounded-t-2xl shadow-2xl border border-secondary flex flex-col z-50 animate-slide-up">
      
      {/* HEADER */}
      <div className="bg-primary p-4 rounded-t-2xl flex justify-between items-center text-white cursor-pointer" onClick={() => setIsMinimized(true)}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold text-xs">
             {groupName.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <h3 className="font-bold text-sm truncate w-32">{groupName}</h3>
            <p className="text-[10px] text-gray-200">En línea</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={(e) => {e.stopPropagation(); setIsMinimized(true)}} className="hover:bg-white/20 p-1 rounded">
             <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
          </button>
          <button onClick={(e) => {e.stopPropagation(); onClose()}} className="hover:bg-white/20 p-1 rounded">
             <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      </div>

      {/* LISTA MENSAJES */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 && <p className="text-center text-gray-400 text-xs mt-10">Sé el primero en escribir...</p>}
        
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
              msg.isMe 
                ? 'bg-primary text-white rounded-br-none' 
                : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
            }`}>
              {!msg.isMe && <p className="text-[10px] font-bold text-primary mb-1">{msg.sender}</p>}
              <p>{msg.text}</p>
              <p className={`text-[10px] text-right mt-1 ${msg.isMe ? 'text-red-200' : 'text-gray-400'}`}>
                {msg.time}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT */}
      <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-200 flex items-center gap-2">
        <input 
          type="text" 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Escribe un mensaje..." 
          className="flex-1 text-black bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <button type="submit" className="bg-primary text-white p-2 rounded-full hover:bg-[#4a1313] transition-colors" disabled={!newMessage.trim()}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default ChatInterface;