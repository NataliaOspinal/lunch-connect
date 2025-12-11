import React from "react";
import { getToken } from "../services/authService"; 

const EventModal = ({ isOpen, onClose, event }) => {
  if (!isOpen || !event) return null;

  const members = event.participants || [];

  return (
    <div className="fixed inset-0 bg-black/60 z-60 font-primary flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
      
      <div 
        className="bg-primary w-full max-w-4xl rounded-[2.5rem] p-8 md:p-12 relative shadow-2xl overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()} 
      >
        
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-8 font-secondary">
          Unete a {event.title}
        </h2>

        <div className="bg-white rounded-4xl p-6 md:p-8 mb-8 shadow-lg">
          
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-primary">{event.title}</h3>
            <span className="text-xl font-bold text-primary">
              {event.current}/{event.max}
            </span>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/2">
              <div className="w-full h-64 bg-gray-200 rounded-xl overflow-hidden flex items-center justify-center">
                 {event.image ? (
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                 ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                 )}
              </div>
            </div>

            <div className="w-full md:w-1/2 flex flex-col justify-between">
              <div className="space-y-6">
                
                {/* Dirección */}
                <div className="flex items-start gap-4">
                  <div className="text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                      <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-primary font-bold text-lg">{event.address}</p>
                  </div>
                </div>

                {/* Fecha (CORREGIDO) */}
                <div className="flex items-center gap-4">
                  <div className="text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" />
                    </svg>
                  </div>
                  {/* Aquí mostramos la fecha real que viene del prop */}
                  <p className="text-primary font-bold text-lg">
                    {event.date || 'Fecha pendiente'}
                  </p> 
                </div>

                {/* Hora (CORREGIDO) */}
                <div className="flex items-center gap-4">
                  <div className="text-primary">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                      <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  {/* Aquí mostramos la hora real */}
                  <p className="text-primary font-bold text-lg">
                    {event.time || '--:--'}
                  </p>
                </div>
              </div>

              <div className="flex justify-end mt-6 md:mt-0">
                <button 
                    onClick={() => {
                        alert("Por favor, únete desde la tarjeta principal.");
                        onClose();
                    }} 
                    className="bg-[#8B3A3A] text-white px-10 py-3 cursor-pointer rounded-full font-bold text-lg hover:bg-black transition-colors"
                >
                  Únete
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sección Integrantes */}
        <h3 className="text-white text-2xl font-semibold text-center mb-6 font-primary">Integrantes</h3>
        
        {members.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {members.map((member, idx) => (
                <div key={idx} className="bg-[#FFE5E5] rounded-xl p-4 flex flex-col items-center justify-center border-[5px] border-[#8B3A3A] border-solid text-center aspect-square shadow-md">
                    <div className="bg-primary rounded-full p-2 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-white">
                            <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <p className="text-primary text-xs font-medium opacity-80 mb-1">
                        {member.titulo_principal || member.carrera || "Miembro"}
                    </p>
                    <p className="text-primary font-semibold text-sm leading-tight">
                        {member.nombres} {member.apellidos}
                    </p>
                </div>
            ))}
            </div>
        ) : (
            <p className="text-white text-center italic">Aún no hay integrantes en este grupo.</p>
        )}

        <button 
          onClick={onClose}
          className="cursor-pointer absolute top-4 right-4 md:top-8 md:right-8 text-white/50 hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

      </div>
    </div>
  );
};

export default EventModal;