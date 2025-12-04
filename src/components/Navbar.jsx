import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../services/authService';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Verificamos si hay sesión activa consultando el servicio
  const isUserLoggedIn = isAuthenticated(); 

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="relative z-50 p-4 mx-4 my-2 md:mx-12 text-white font-primary">
      <div className="flex items-center justify-between">
        
        {/* LOGO */}
        <Link to="/" className="hover:opacity-80 transition-opacity">
          <h2 className="text-2xl font-semibold">LunchConnect</h2>
        </Link>

        {/* BOTÓN HAMBURGUESA (Móvil) */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="md:hidden p-2 text-white focus:outline-none"
        >
          {isOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

        {/* MENÚ DE ESCRITORIO */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/explorar" className="hover:scale-110 text-[18px] font-semibold transition-transform duration-300">
            Explorar
          </Link>
          
          <Link to="/unete" className="hover:scale-110 text-[18px] font-semibold transition-transform duration-300">
            Unete
          </Link>
          
          {/* ICONO DINÁMICO */}
          {isUserLoggedIn ? (
            // CASO 1: LOGUEADO -> Tu snippet con la imagen
            <Link
              to="/perfil"
              className="p-2 rounded-full border-2 border-transparent hover:border-white/50 
                         hover:scale-110 transition-transform duration-300 cursor-pointer"
            >
              <img className="h-12 w-12 rounded-full" src="/account_circle.png" alt="Mi Perfil" />
            </Link>
          ) : (
            // CASO 2: NO LOGUEADO -> Icono SVG genérico
            <Link 
              to="/login" 
              className="p-2 rounded-full hover:scale-110 transition-transform duration-300 cursor-pointer"
            >
               <img className="h-12 w-12 rounded-full" src="/account_circle.png" alt="Login" />
            </Link>
          )}
        </div>
      </div>

      {/* MENÚ MÓVIL DESPLEGABLE */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-primary shadow-xl rounded-b-lg flex flex-col mt-2 overflow-hidden border-t border-secondary">
          
          <Link 
            to="/explorar" 
            onClick={closeMenu} 
            className="text-center font-medium py-4 border-b border-secondary hover:bg-secondary transition-colors w-full block"
          >
            Explorar
          </Link>

          <Link 
            to="/unete" 
            onClick={closeMenu}
            className="text-center font-medium py-4 border-b border-secondary hover:bg-secondary transition-colors w-full block"
          >
            Unete
          </Link>

          {/* Opción Perfil / Login en Móvil */}
          <div className="flex justify-center py-4 hover:bg-secondary transition-colors w-full cursor-pointer">
             {isUserLoggedIn ? (
               <Link to="/perfil" onClick={closeMenu} className="font-bold flex items-center gap-2">
                 <img className="h-8 w-8 rounded-full border border-white" src="/account_circle.png" alt="Perfil" />
                 Mi Perfil
               </Link>
             ) : (
               <Link to="/login" onClick={closeMenu} className="font-bold">Iniciar Sesión</Link>
             )}
          </div>

        </div>
      )}
    </nav>
  );
};

export default Navbar;