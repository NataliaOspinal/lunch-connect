import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import InputField from '../components/ui/InputField';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser, loginUser } from '../services/authService';

const Registro = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    correoElectronico: '',
    nombreUsuario: '',
    linkedin: '',
    contrasena: '',
    rubroProfesional: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validaciones básicas
    if (!formData.nombres || !formData.apellidos || !formData.correoElectronico || !formData.contrasena || !formData.rubroProfesional) {
      setError("Por favor completa todos los campos obligatorios.");
      return;
    }

    if (formData.contrasena.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(formData.correoElectronico)) {
      setError("Ingresa un correo electrónico válido.");
      return;
    }

    setLoading(true);

    try {
      // Payload final para enviar al backend
      const payload = {
        ...formData,
        tituloPrincipal: "----",
        linkedin: formData.linkedin || null,
      };

      console.log("Enviando payload al backend:", payload);

      // Registro
      await registerUser(payload);

      // Login automático
      await loginUser(formData.nombreUsuario, formData.contrasena);

      // Redirigir a dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error("Error al registrarse:", err);
      setError(err.message || 'Error al registrarse.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary flex flex-col font-sans">
      <Navbar />

      <main className="grow flex items-center justify-center px-4 py-12 bg-white font-secondary">
        <div className="w-full max-w-2xl">
          <div className="text-center text-primary mb-10">
            <h1 className="text-4xl md:text-5xl font-semibold mb-4">
              Crea tu cuenta
            </h1>
            <p className="text-lg font-medium">
              Y empieza a conectar con tu rubro profesional
            </p>
          </div>

          <div className="bg-primary rounded-[2.5rem] p-8 md:p-12 shadow-2xl text-center">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left mb-8">
                <InputField label="Nombres" id="nombres" value={formData.nombres} onChange={handleChange} />
                <InputField label="Apellidos" id="apellidos" value={formData.apellidos} onChange={handleChange} />
                <InputField label="Correo electrónico" type="email" id="correoElectronico" value={formData.correoElectronico} onChange={handleChange} className="md:col-span-2" />
                <InputField label="Nombre de usuario" id="nombreUsuario" value={formData.nombreUsuario} onChange={handleChange} />
                <InputField label="LinkedIn (opcional)" id="linkedin" value={formData.linkedin} onChange={handleChange} />
                <InputField label="Contraseña" type="password" id="contrasena" value={formData.contrasena} onChange={handleChange} />
                <InputField label="Rubro profesional" id="rubroProfesional" value={formData.rubroProfesional} onChange={handleChange} className="md:col-span-2" />
              </div>

              {error && <p className="text-red-600 mb-4">{error}</p>}

              <button type="submit" disabled={loading} className="bg-primary cursor-pointer hover:bg-[#4a1313] text-white font-semibold py-3 px-12 rounded-full transition-colors shadow-md text-lg">
                {loading ? 'Creando cuenta...' : 'Crear cuenta'}
              </button>
            </form>
          </div>

          <div className="text-center mt-6">
            <p className="text-primary mb-6 text-[20px] font-primary">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="font-bold underline hover:text-secondary">
                Inicia Sesión
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Registro;
