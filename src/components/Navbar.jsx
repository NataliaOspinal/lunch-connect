import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../services/authService';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(isAuthenticated()); // Actualiza si hay sesión
  }, []);

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="relative z-50 p-4 mx-4 md:mx-12 text-white">
      <div className="flex items-center justify-between">
        <Link to="/" className="hover:opacity-80 cursor-pointer transition-opacity">
          <h2>LunchConnect</h2>
        </Link>

        {/* Botón hamburguesa */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 text-white focus:outline-none">
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

        {/* Menú escritorio */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/explorar" className="hover:scale-110 font-medium transition-transform duration-300">Explorar</Link>
          <Link to="/unete" className="hover:scale-110 font-medium transition-transform duration-300">Únete</Link>

          {/* Icono perfil según sesión */}
          <Link to={loggedIn ? '/perfil' : '/login'} className="hover:scale-110 transition-transform duration-300">
            <button className="p-2 rounded-full hover:cursor-pointer border-2 border-transparent hover:border-white/50">
              <img className="h-12 w-12 rounded-full" src="/account_circle.png" alt="Mi Perfil" />
            </button>
          </Link>
        </div>
      </div>

      {/* Menú móvil */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-primary shadow-xl rounded-b-lg flex flex-col mt-2 overflow-hidden border-t border-secondary">
          <Link to="/explorar" onClick={closeMenu} className="text-center font-medium py-4 border-b border-secondary hover:bg-secondary w-full block">Explorar</Link>
          <Link to="/unete" onClick={closeMenu} className="text-center font-medium py-4 border-b border-secondary hover:bg-secondary w-full block">Únete</Link>
          <Link to={loggedIn ? '/perfil' : '/login'} onClick={closeMenu} className="flex justify-center py-4 hover:bg-secondary w-full cursor-pointer">
            Perfil
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
