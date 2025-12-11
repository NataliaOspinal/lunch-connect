import { useState } from 'react';

// Recibimos onSearch como prop
const Explore = ({ onSearch }) => {

  const [input, setInput] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setInput(value);
    if (onSearch) {
      onSearch(val);
    }
  };

  return (
    <div className="bg-primary py-32 px-16 rounded-b-[2.5rem] rounded-tr-[2.5rem]"> {/* Ajusté bordes para coincidir con tu estilo */}
      <div className="w-full max-w-2xl mx-auto">
        <h1 className="text-white text-3xl md:text-4xl font-semibold text-center mb-12 font-secondary">
          ¿De qué tienes antojo?
        </h1>
        
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={handleChange} // Usamos nuestra función conectada
            placeholder="Buscar grupo, dirección o distrito..."
            className="w-full px-6 py-4 pr-12 rounded-full bg-white text-gray-800 placeholder-gray-400 focus:outline-none shadow-lg text-lg font-secondary"
          />
  
          <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full transition-colors">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Explore;