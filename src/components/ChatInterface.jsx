import { useState, useEffect, useRef } from "react";
import { getToken } from "../services/authService";
import { Client } from "@stomp/stompjs";

const getUserIdFromToken = () => {
  const token = getToken();
  if (!token) return null;

  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload).id;
  } catch {
    return null;
  }
};

const ChatInterface = ({ groupId, groupName, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const stompClient = useRef(null);

  const myId = getUserIdFromToken();

  // -------------------------
  // 1. Conectar WebSocket
  // -------------------------
  useEffect(() => {
    const token = getToken();

    const client = new Client({
      brokerURL: `wss://lunchconnect-backend.onrender.com/ws?token=${token}`, // 🔥 FIX IMPORTANTE
      reconnectDelay: 3000,
      debug: () => {},
    });

    client.onConnect = () => {
      console.log("WebSocket conectado");

      client.subscribe(`/topic/grupos/${groupId}`, (message) => {
        const body = JSON.parse(message.body);

        setMessages((prev) => [
          ...prev,
          {
            id: body.id || Date.now(),
            text: body.content,
            sender: body.senderId === myId ? "Tú" : "Usuario",
            isMe: body.senderId === myId,
            time: new Date(body.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);
      });
    };

    client.activate();
    stompClient.current = client;

    return () => client.deactivate();
  }, [groupId]);

  // Scroll al fondo
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // -------------------------
  // 2. Enviar mensaje
  // -------------------------
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    if (!stompClient.current || !stompClient.current.connected) {
      console.warn("STOMP no conectado todavía");
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

  return (
    <div className="fixed bottom-0 right-4 w-80 md:w-96 h-[500px] bg-white rounded-t-2xl shadow-2xl flex flex-col z-50">
      {/* HEADER */}
      <div className="bg-primary p-4 rounded-t-2xl flex justify-between items-center text-white">
        <h3 className="font-bold">{groupName}</h3>
        <button onClick={onClose} className="text-white">❌</button>
      </div>

      {/* MENSAJES */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.isMe ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                msg.isMe
                  ? "bg-primary text-white"
                  : "bg-white text-gray-800 border"
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
        className="p-3 bg-white border-t flex items-center gap-2"
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm"
        />
        <button
          type="submit"
          className="bg-primary text-white p-2 rounded-full"
        >
          ➤
        </button>
      </form>
    </div>
  );
};

export default ChatInterface;
