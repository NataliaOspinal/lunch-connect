import React from 'react';

const InputField = ({ label, type = "text", placeholder, id, className = "" }) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label htmlFor={id} className="text-white font-bold text-lg">
        {label}
      </label>
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        // Estilos del input blanco redondeado
        className="w-full bg-white rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  );
};

export default InputField;