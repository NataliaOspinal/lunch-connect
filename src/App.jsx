import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home'; // Asegúrate de crear este archivo con el código del Paso 2
import Unete from './pages/Unete'; // La nueva página
import Explorar from './pages/Explorar';
import Login from './pages/Login';
import Registro from './pages/Registro';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta principal (Home) */}
        <Route path="/" element={<Home />} />
        
        {/* Nueva ruta (/Unete) */}
        <Route path="/unete" element={<Unete />} />
        
        {/* Nueva ruta (/Explorar) */}
        <Route path="/explorar" element={<Explorar />} />
        
        {/* Rutas de Login y Registro */}
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
