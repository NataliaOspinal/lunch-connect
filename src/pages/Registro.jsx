import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import InputField from '../components/ui/InputField';
import { Link } from 'react-router-dom';

const Registro = () => {
  return (
    <div className="min-h-screen bg-primary flex flex-col font-sans">
      <Navbar />

      <main className="grow flex items-center justify-center px-4 py-12 bg-white font-secondary">
        {/* Aumentamos el max-w para que quepan bien las dos columnas */}
        <div className="w-full max-w-2xl">
          
          {/* Título y Subtítulo */}
          <div className="text-center text-primary mb-10">
            <h1 className="text-4xl md:text-5xl font-semibold mb-4">
              Crea tu cuenta
            </h1>
            <p className="text-lg font-medium">
              Y empieza a conectar con tu rubro profesional
            </p>
          </div>

          {/* Caja del Formulario */}
          <div className="bg-primary rounded-[2.5rem] p-8 md:p-12 shadow-2xl text-center">
            
            <form>
              {/* Grid de 2 columnas en desktop, 1 en móvil */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left mb-8">
                
                <InputField label="Nombres" id="nombres" />
                <InputField label="Apellidos" id="apellidos" />
                
                {/* md:col-span-2 hace que ocupe todo el ancho */}
                <InputField label="Correo electrónico" type="email" id="email" className="md:col-span-2" />
                
                <InputField label="Nombre de usuario" id="username" />
                <InputField label="LinkedIn (opcional)" id="linkedin" />
                
                <InputField label="Contraseña" type="password" id="pass1" />
                <InputField label="Repetir contraseña" type="password" id="pass2" />
                
                <InputField label="Rubro profesional" id="rubro" className="md:col-span-2" />

              </div>
            </form>
          </div>
            <div className="text-center mt-6">
                {/* Enlace a Registro */}
            <p className="text-primary mb-6 text-[20px] font-primary">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="font-bold underline hover:text-secondary">
                Inicia Sesion
              </Link>
            </p>
                {/* Botón Submit */}
              <button className="bg-primary cursor-pointer hover:bg-[#4a1313] text-white font-semibold py-3 px-12 rounded-full transition-colors shadow-md text-lg">
                Crear cuenta
              </button>
            </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Registro;