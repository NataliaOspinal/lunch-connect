import { useState, useEffect, useRef } from 'react';
import { getToken } from '../services/authService';
import { Client } from '@stomp/stompjs';

// Helper para obtener ID del usuario desde el JWT
const getUserIdFromToken = () => {
  const token = getToken();
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const decoded = JSON.parse(jsonPayload);
    return decoded.id || decoded.userId || decoded.sub;
  } catch (e) {
    return null;
  }
};

const ChatInterface = ({ groupId, groupName, onClose }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  const stompClient = useRef(null);
  const myId = getUserIdFromToken();

  // -----------------------
  // 1. CONECTAR WEBSOCKET
  // -----------------------
useEffect(() => {
  const token = getToken();

  const client = new Client({
    brokerURL: "wss://lunchconnect-backend.onrender.com/ws",
    reconnectDelay: 3000,
    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },
    debug: () => {},
  });

  client.onConnect = () => {
    console.log("WebSocket conectado");

    client.subscribe(`/topic/grupos/${groupId}`, (message) => {
      const msg = JSON.parse(message.body);

      setMessages(prev => [
        ...prev,
        {
          id: msg.id || Date.now(),
          text: msg.content,
          sender: msg.senderId === myId ? "Tú" : "Usuario",
          isMe: msg.senderId === myId,
          time: new Date(msg.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
          })
        }
      ]);
    });
  };

  client.activate();
  stompClient.current = client;

  return () => {
    client.deactivate();
  };
}, [groupId]);


  // Scroll al fondo
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // -----------------------
  // 2. ENVIAR MENSAJE WS
  // -----------------------
  const handleSendMessage = (e) => {
  e.preventDefault();
  if (!newMessage.trim()) return;

  if (!stompClient.current || !stompClient.current.connected) {
    console.warn("STOMP no está conectado");
    return;
  }

  const msg = {
    grupoId: groupId.toString(),
    content: newMessage,
    type: "CHAT",
  };

  stompClient.current.publish({
    destination: "/app/chat.sendMessage",
    body: JSON.stringify(msg),
  });

  setNewMessage("");
};


  // -----------------------
  // 3. UI DEL CHAT
  // -----------------------
  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-primary rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-110 transition-transform z-50 border-2 border-white animate-bounce-in"
      >
        💬
      </button>
    );
  }

  return (
    <div className="fixed bottom-0 right-4 w-80 md:w-96 h-[500px] bg-white rounded-t-2xl shadow-2xl border border-gray-200 flex flex-col z-50 animate-slide-up">
      
      {/* HEADER */}
      <div
        className="bg-primary p-4 rounded-t-2xl flex justify-between items-center text-white cursor-pointer"
        onClick={() => setIsMinimized(true)}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold text-xs">
            {groupName.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <h3 className="font-bold text-sm truncate w-32">{groupName}</h3>
            <p className="text-[10px] text-gray-200">En línea</p>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="hover:bg-white/20 p-1 rounded"
        >
          ❌
        </button>
      </div>

      {/* LISTA MENSAJES */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 && (
          <p className="text-center text-gray-400 text-xs mt-10">
            Sé el primero en escribir...
          </p>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.isMe ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                msg.isMe
                  ? "bg-primary text-white rounded-br-none"
                  : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
              }`}
            >
              {!msg.isMe && (
                <p className="text-[10px] font-bold text-primary mb-1">
                  {msg.sender}
                </p>
              )}
              <p>{msg.text}</p>
              <p
                className={`text-[10px] text-right mt-1 ${
                  msg.isMe ? "text-red-200" : "text-gray-400"
                }`}
              >
                {msg.time}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT */}
      <form
        onSubmit={handleSendMessage}
        className="p-3 bg-white border-t border-gray-200 flex items-center gap-2"
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="flex-1 bg-gray-100 text-black rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <button
          type="submit"
          className="bg-primary text-white p-2 rounded-full hover:bg-[#4a1313] transition-colors"
        >
          ➤
        </button>
      </form>
    </div>
  );
};

export default ChatInterface;
