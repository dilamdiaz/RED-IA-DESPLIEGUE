const BASE_URL = import.meta.env.VITE_API_URL + "/api/auth";
const API_URL = "https://red-ia-despliegue.onrender.com";

const handleResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || data.message || 'Error en la solicitud');
  }

  return data;
};

const login = async (credentials) => {
  const response = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  const data = await handleResponse(response);

  // 🔥 guardar token automáticamente
  if (data.token) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.usuario));
  }

  return data;
};

const register = async (payload) => {
  const response = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
};

const getProfile = async () => {
  const token = localStorage.getItem('token');

  const response = await fetch(`${BASE_URL}/profile`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse(response);
};

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export default {
  login,
  register,
  getProfile,
  logout,
};