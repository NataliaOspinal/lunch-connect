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
// Ahora activeChat guardará un objeto: { id: 1, name: "Grupo A" }
  const [activeChat, setActiveChat] = useState(null);

  const closeChat = () => setActiveChat(null);

  // Recibimos el objeto completo del grupo
  const openChat = (groupData) => setActiveChat(groupData);

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
          groupId={activeChat.id} 
          groupName={activeChat.name} 
          onClose={closeChat} 
        />
      )}
    </BrowserRouter>
  );
}

export default App;
