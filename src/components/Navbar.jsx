import React, { useState } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    // z-50 relative al nav para asegurar que el menú flote sobre todo
    <nav className="relative z-50 p-4 mx-4 md:mx-12">
      <div className="flex items-center justify-between">
        
        {/* LOGO */}
        <h2>LunchConnect</h2>

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
          <a href="#" className="hover:scale-110 font-medium transition-transform duration-300">Explorar</a>
          <a href="#" className="hover:scale-110 font-medium transition-transform duration-300">Acerca de</a>
          <button className="p-2 rounded-full hover:cursor-pointer hover:scale-110 transition-transform duration-300">
            <img
              className="h-12 w-12 rounded-full"
              src="/account_circle.png"
              alt="User Avatar"
            />
          </button>
        </div>
      </div>

      {/* MENÚ MÓVIL DESPLEGABLE (Personalizado) */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-primary shadow-xl rounded-b-lg flex flex-col mt-2 overflow-hidden">
          
          {/* Opción 1 */}
          <a 
            href="#" 
            className="text-center font-medium py-4 border-b border-secondary hover:bg-secondary transition-colors w-full block"
          >
            Explorar
          </a>

          {/* Opción 2 */}
          <a 
            href="#" 
            className="text-center font-medium py-4 border-b border-secondary hover:bg-secondary transition-colors w-full block"
          >
            Acerca de
          </a>

          {/* Opción 3 (Perfil) */}
          <div className="flex justify-center py-4 border-b border-secondary hover:bg-secondary transition-colors w-full cursor-pointer">
             <a href="#">Perfil</a>
          </div>

        </div>
      )}
    </nav>
  );
};

export default Navbar;