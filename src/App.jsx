import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importa tus páginas
import Home from './pages/Home';
import Explorar from './pages/Explorar';
import Unete from './pages/Unete';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Perfil from './pages/Perfil';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Explorar contiene RestaurantSection */}
        <Route path="/explorar" element={<Explorar />} /> 
        <Route path="/unete" element={<Unete />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/perfil" element={<Perfil />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
