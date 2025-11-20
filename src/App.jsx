import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home'; // Asegúrate de crear este archivo con el código del Paso 2
import Unete from './pages/Unete'; // La nueva página

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta principal (Home) */}
        <Route path="/" element={<Home />} />
        
        {/* Nueva ruta (/Unete) */}
        <Route path="/unete" element={<Unete />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;