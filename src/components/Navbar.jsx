import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // <--- IMPORTANTE
import { isAuthenticated, logoutUser } from '../services/authService';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate(); // <--- IMPORTANTE: Inicializar hook
  
  // Verificamos si hay sesión
  const isUserLoggedIn = isAuthenticated(); 

  const handleLogout = () => {
    logoutUser(); 
    navigate('/login'); 
    window.location.reload(); // Recarga limpia para reiniciar estados
  };

  return (
    <nav className="relative z-50 p-4 mx-4 md:mx-12 text-white font-primary mt-1">
      <div className="flex items-center justify-between">
        
        <Link to="/" className="hover:opacity-80 transition-opacity">
          <h2 className="text-2xl font-semibold">LunchConnect</h2>
        </Link>

        {/* Botón Hamburguesa (Móvil) */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="md:hidden cursor-pointer p-2 text-white focus:outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>

        {/* Menú escritorio */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/explorar" className="hover:scale-110 font-medium transition-transform duration-300">Explorar</Link>
          <Link to="/unete" className="hover:scale-110 font-medium transition-transform duration-300">Unete</Link>
          
          {isUserLoggedIn ? (
            <div className="flex items-center gap-4">
               <Link to="/perfil" className="hover:scale-110 transition-transform duration-300">
                <button className="p-2 rounded-full hover:cursor-pointer border-2 border-transparent hover:border-white/50">
                  <img className="h-12 w-12 rounded-full bg-white" src="/account_circle.png" alt="Perfil" />
                </button>
              </Link>
              <button onClick={handleLogout} className="text-sm font-semibold hover:underline">Salir</button>
            </div>
          ) : (
            <Link to="/login" className="hover:scale-110 transition-transform duration-300">
              <button className="p-2 rounded-full hover:cursor-pointer flex items-center gap-2">
                 <span className='font-semibold'>Ingresar</span>
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
              </button>
            </Link>
          )}
        </div>
      </div>
      
      {/* MENÚ MÓVIL */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-primary shadow-xl rounded-b-lg flex flex-col mt-2 border-t border-secondary">
          <Link to="/explorar" className="py-4 text-center border-b border-secondary hover:bg-secondary">Explorar</Link>
          <Link to="/unete" className="py-4 text-center border-b border-secondary hover:bg-secondary">Unete</Link>
          {isUserLoggedIn ? (
             <Link to="/perfil" className="py-4 text-center hover:bg-secondary">Mi Perfil</Link>
          ) : (
             <Link to="/login" className="py-4 text-center hover:bg-secondary">Iniciar Sesión</Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;