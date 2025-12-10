import React, { useState, useEffect, useRef } from 'react';

const ChatInterface = ({ groupName, onClose }) => {
  // Estado para controlar si está minimizado o abierto
  const [isMinimized, setIsMinimized] = useState(false);
  
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Sistema', text: `Bienvenido al grupo ${groupName}`, isSystem: true },
    { id: 2, sender: 'Ana', text: 'Hola a todos! ¿A qué hora nos encontramos?', isMe: false },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isMinimized]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    const message = { id: Date.now(), sender: 'Tú', text: newMessage, isMe: true };
    setMessages([...messages, message]);
    setNewMessage('');
  };

  // --- VISTA MINIMIZADA (BURBUJA) ---
  if (isMinimized) {
    return (
      <button 
        onClick={() => setIsMinimized(false)}
        className="cursor-pointer fixed bottom-6 right-6 w-16 h-16 bg-primary rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-110 transition-transform z-50 animate-bounce-in border-2 border-white"
        title={`Abrir chat de ${groupName}`}
      >
        {/* Icono de Chat */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.159 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
        </svg>
        {/* Indicador de notificación (puntito rojo/verde) */}
        <span className="absolute top-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
      </button>
    );
  }

  // --- VISTA MAXIMIZADA (VENTANA) ---
  return (
    <div className="fixed bottom-0 right-4 w-80 md:w-96 h-[500px] bg-white rounded-t-2xl shadow-2xl border border-gray-200 flex flex-col z-50 animate-slide-up">
      
      {/* HEADER */}
      <div className="bg-primary p-4 rounded-t-2xl flex justify-between items-center text-white cursor-pointer" onClick={() => setIsMinimized(true)}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
             {/* Icono de usuario o grupo */}
             <span className="font-bold text-xs">{groupName.substring(0, 2).toUpperCase()}</span>
          </div>
          <div>
            <h3 className="font-bold text-sm truncate w-32">{groupName}</h3>
            <p className="text-[10px] text-gray-200">Activo ahora</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Botón Minimizar */}
          <button 
            onClick={(e) => { e.stopPropagation(); setIsMinimized(true); }}
            className="hover:bg-white/20 p-1 rounded transition-colors cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M4 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 10z" clipRule="evenodd" />
            </svg>
          </button>

          {/* Botón Cerrar Totalmente */}
          <button 
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="hover:bg-white/20 p-1 cursor-pointer rounded transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* ÁREA DE MENSAJES (Igual que antes) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.isSystem ? 'justify-center' : msg.isMe ? 'justify-end' : 'justify-start'}`}>
            {msg.isSystem ? (
              <span className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">{msg.text}</span>
            ) : (
              <div className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                msg.isMe ? 'bg-primary text-white rounded-br-none' : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
              }`}>
                {!msg.isMe && <p className="text-[10px] font-bold text-primary mb-1">{msg.sender}</p>}
                <p>{msg.text}</p>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT (Igual que antes) */}
      <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-200 flex items-center gap-2">
        <input 
          type="text" 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Escribe..." 
          className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none"
        />
        <button type="submit" className="bg-primary text-white p-2 rounded-full hover:bg-[#4a1313]" disabled={!newMessage.trim()}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default ChatInterface;