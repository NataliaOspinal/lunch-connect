import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import InputField from '../components/ui/InputField';
import { Link } from 'react-router-dom';
import { registerUser } from '../services/authService';

const Registro = () => {
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    correoElectronico: '',
    nombreUsuario: '',
    contrasena: '',
    rubroProfesional: '',
    linkedin: '', // opcional
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validación mínima de campos obligatorios
    if (!formData.nombres || !formData.apellidos || !formData.correoElectronico || !formData.nombreUsuario || !formData.contrasena || !formData.rubroProfesional) {
      setError('Completa todos los campos obligatorios.');
      return;
    }

    if (formData.contrasena.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(formData.correoElectronico)) {
      setError('Ingresa un correo electrónico válido.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...formData,
        tituloPrincipal: "-----", // Valor por defecto
        linkedin: formData.linkedin || null, // opcional
      };

      await registerUser(payload);

      setSuccess('Usuario registrado correctamente.');
      setFormData({
        nombres: '',
        apellidos: '',
        correoElectronico: '',
        nombreUsuario: '',
        contrasena: '',
        rubroProfesional: '',
        linkedin: '',
      });
    } catch (err) {
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
          <h1 className="text-4xl md:text-5xl font-semibold text-center mb-6 text-primary">
            Registro de Usuario
          </h1>

          <div className="bg-primary rounded-[2.5rem] p-8 md:p-12 shadow-2xl text-center">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 text-left gap-6 mb-6">
                <InputField label="Nombres" id="nombres" value={formData.nombres} onChange={handleChange} />
                <InputField label="Apellidos" id="apellidos" value={formData.apellidos} onChange={handleChange} />
                <InputField label="Correo electrónico" type="email" id="correoElectronico" value={formData.correoElectronico} onChange={handleChange} className="md:col-span-2" />
                <InputField label="Nombre de usuario" id="nombreUsuario" value={formData.nombreUsuario} onChange={handleChange} />
                <InputField label="LinkedIn (opcional)" id="linkedin" value={formData.linkedin} onChange={handleChange} />
                <InputField label="Contraseña" type="password" id="contrasena" value={formData.contrasena} onChange={handleChange} />
                <InputField label="Rubro profesional" id="rubroProfesional" value={formData.rubroProfesional} onChange={handleChange} className="md:col-span-2" />
              </div>

              {error && <p className="text-red-600 mb-4">{error}</p>}
              {success && <p className="text-green-600 mb-4">{success}</p>}

              <button type="submit" disabled={loading} className="bg-secondary hover:bg-[#4a1313] text-white font-semibold py-3 px-12 rounded-3xl mt-2 cursor-pointer transition-colors shadow-md text-lg">
                {loading ? 'Registrando...' : 'Registrar'}
              </button>
            </form>
          </div>

          <p className="text-center mt-6 text-primary text-[20px]">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="font-bold underline hover:text-secondary">
              Inicia Sesión
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Registro;
