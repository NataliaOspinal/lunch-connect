import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import InputField from '../components/ui/InputField';
import { loginUser } from '../services/authService';

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    identificador: '', // nombreUsuario o correo
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.identificador || !formData.password) {
      setError('Por favor completa todos los campos.');
      setLoading(false);
      return;
    }

    try {
      // Login usando authService.js
      await loginUser(formData.identificador, formData.password);

      // Redirigir a Home si login exitoso
      navigate('/');
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary flex flex-col font-sans">
      <Navbar />

      <main className="grow flex items-center justify-center px-4 py-12 bg-white font-secondary">
        <div className="w-full max-w-lg">
          <h1 className="text-4xl md:text-5xl font-semibold text-primary text-center mb-10 font-secondary">
            Inicia sesión
          </h1>

          <div className="bg-primary rounded-[2.5rem] p-8 md:p-12 shadow-2xl text-center">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-left">
              <InputField
                label="Nombre de usuario o correo electrónico"
                id="identificador"
                value={formData.identificador}
                onChange={handleChange}
              />
              <InputField
                label="Contraseña"
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
              />

              {error && <p className="text-red-600 mt-2">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="bg-secondary hover:bg-[#4a1313] cursor-pointer text-white font-bold py-3 px-12 rounded-full transition-colors shadow-md text-lg mt-4"
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </button>
            </form>
          </div>

          <p className="text-center mt-6 text-primary text-[20px] font-primary">
            ¿No tienes cuenta?{' '}
            <Link to="/registro" className="font-bold underline hover:text-secondary">
              Regístrate
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;
