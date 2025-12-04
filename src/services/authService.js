// src/services/authService.js

// URL base de tu backend en Render
const API_BASE_URL = 'https://lunchconnect-backend.onrender.com';

// Clave para guardar el token en localStorage
const TOKEN_KEY = 'jwtToken';

/**
 * Llama a la API de registro para crear un nuevo usuario.
 * @param {object} userData - Datos del usuario a registrar.
 * @returns {object} Respuesta del servidor (puede incluir un token JWT).
 */
export const registerUser = async (userData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Fallo en el registro. Estado: ${response.status}`);
        }

        const result = await response.json();
        return result;

    } catch (error) {
        throw error;
    }
};

/**
 * Llama a la API de login para obtener un token JWT y lo almacena.
 * @param {string} nombreUsuario - Nombre de usuario usado para autenticar.
 * @param {string} contrasena - Contraseña.
 * @returns {string} El token JWT.
 */
export const loginUser = async (correoOUsuario, contrasena) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ correoOUsuario, contrasena }), // ⚠️ campo correcto
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Credenciales inválidas. Estado: ${response.status}`);
        }

        const result = await response.json();
        const jwtToken = result.token;

        if (!jwtToken) throw new Error("Login exitoso, pero el servidor no proporcionó un token.");

        localStorage.setItem(TOKEN_KEY, jwtToken);
        return jwtToken;
    } catch (error) {
        throw error;
    }
};


/**
 * Elimina el token del almacenamiento local.
 */
export const logoutUser = () => {
    localStorage.removeItem(TOKEN_KEY);
};

/**
 * Obtiene el token JWT almacenado.
 * @returns {string | null} El token JWT o null si no existe.
 */
export const getToken = () => {
    return localStorage.getItem(TOKEN_KEY);
};

/**
 * Comprueba si el usuario está autenticado (solo verifica la existencia del token).
 * @returns {boolean} True si hay un token, false si no.
 */
export const isAuthenticated = () => {
    return !!getToken();
};
