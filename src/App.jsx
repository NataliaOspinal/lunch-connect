import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importa tus páginas
import Home from './pages/Home';
import Explorar from './pages/Explorar';
import Unete from './pages/Unete';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Perfil from './pages/Perfil';
import ChatInterface from './components/ChatInterface';
import { useState } from 'react';

function App() {
  // ESTADO GLOBAL DEL CHAT
  const [activeChat, setActiveChat] = useState(null);

  // Función para cerrar el chat completamente
  const closeChat = () => setActiveChat(null);

  // Función para abrir el chat (se la pasamos a Perfil)
  const openChat = (groupName) => setActiveChat(groupName);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explorar" element={<Explorar />} /> 
        <Route path="/unete" element={<Unete />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route 
          path="/perfil" 
          element={<Perfil onOpenChat={openChat} />} 
        />
      </Routes>
      {activeChat && (
        <ChatInterface 
          groupName={activeChat} 
          onClose={closeChat} 
        />
      )}
    </BrowserRouter>
  );
}

export default App;
