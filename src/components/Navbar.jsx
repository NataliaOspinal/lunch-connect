import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // 1. Importamos Link

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Función auxiliar para cerrar el menú al hacer clic en un enlace (solo móvil)
  const closeMenu = () => setIsOpen(false);

  // VARIABLE TEMPORAL PARA PROBAR (Ponla en true para ver el perfil)
  const isUserLoggedIn = true;

  return (
    <nav className="relative z-50 p-4 mx-4 md:mx-12 text-white">
      <div className="flex items-center justify-between">
        
        {/* LOGO  */}
        <Link to="/" className="hover:opacity-80 cursor-pointer transition-opacity">
          <h2>LunchConnect</h2>
        </Link>

        {/* BOTÓN HAMBURGUESA */}
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
          <Link to="/explorar" className="hover:scale-110 font-medium transition-transform duration-300">Explorar</Link>
          <Link to="/unete" className="hover:scale-110 font-medium transition-transform duration-300">Unete</Link>
          
          {/* LÓGICA DE ICONO DE PERFIL */}
          {isUserLoggedIn ? (
            // CASO 1: SI HAY SESIÓN -> Va a /perfil
            <Link to="/perfil" className="hover:scale-110 transition-transform duration-300">
              <button className="p-2 rounded-full hover:cursor-pointer border-2 border-transparent hover:border-white/50">
                <img className="h-12 w-12 rounded-full" src="/account_circle.png" alt="Mi Perfil" />
              </button>
            </Link>
          ) : (
            // CASO 2: NO HAY SESIÓN -> Va a /login
            <Link to="/login" className="hover:scale-110 transition-transform duration-300">
              <button className="p-2 rounded-full hover:cursor-pointer">
                 {/* Icono genérico o texto "Login" */}
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* MENÚ MÓVIL DESPLEGABLE */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-primary shadow-xl rounded-b-lg flex flex-col mt-2 overflow-hidden border-t border-secondary">
          
          {/* Opción 1: Explorar */}
          <Link 
            to="/explorar" 
            onClick={closeMenu} // Cierra el menú al dar clic
            className="text-center font-medium py-4 border-b border-secondary hover:bg-secondary transition-colors w-full block"
          >
            Explorar
          </Link>

          {/* Opción 2: Únete */}
          <Link 
            to="/unete" 
            onClick={closeMenu} // Cierra el menú al dar clic
            className="text-center font-medium py-4 border-b border-secondary hover:bg-secondary transition-colors w-full block"
          >
            Unete
          </Link>

          {/* Opción 3 (Perfil) */}
          <Link to="/login" onClick={closeMenu} className="flex justify-center py-4 hover:bg-secondary transition-colors w-full cursor-pointer">
            Perfil
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
