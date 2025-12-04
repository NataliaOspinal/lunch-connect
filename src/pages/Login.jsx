import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import InputField from '../components/ui/InputField'; // Importamos el input

const Login = () => {
  return (
    <div className="min-h-screen bg-primary flex flex-col font-sans">
      <Navbar />

      {/* Contenido Principal Centrado */}
      <main className="grow flex items-center justify-center px-4 py-12 bg-white font-secondary">
        <div className="w-full max-w-lg">
          
          {/* Título Principal */}
          <h1 className="text-4xl md:text-5xl font-semibold text-primary text-center mb-10 font-secondary">
            Inicia sesión
          </h1>

          {/* Caja del Formulario (Rojo más oscuro #3D0F0F) */}
          <div className="bg-primary rounded-[2.5rem] p-8 md:p-12 shadow-2xl text-center">
            
            <form className="flex flex-col gap-6 text-left">
              <InputField 
                label="Nombre de usuario o correo electrónico" 
                id="identificador" 
              />
              <InputField 
                label="Contraseña" 
                type="password" 
                id="password" 
              />
            </form>

          </div>
          <div className="text-center mt-6">
            {/* Enlace a Registro */}
            <p className="text-primary mb-6 text-[20px] font-primary">
              ¿No tienes cuenta?{' '}
              <Link to="/registro" className="font-bold underline hover:text-secondary">
                Regístrate
              </Link>
            </p>

            {/* Botón Submit */}
            <button className="bg-primary hover:bg-secondary cursor-pointer text-white font-bold py-3 px-12 rounded-full transition-colors shadow-md text-lg">
              Iniciar sesión
            </button>
            </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;