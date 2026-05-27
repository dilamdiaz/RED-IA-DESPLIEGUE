const BASE_URL = import.meta.env.VITE_API_URL + "/api/auth";

const handleResponse = async (response) => {

  const data = await response.json();

  if (!response.ok) {

    throw new Error(
      data.error ||
      data.message ||
      'Error en la solicitud'
    );
  }

  return data;
};

// ========================
// 🔐 LOGIN
// ========================

const login = async (credentials) => {

  const response = await fetch(`${BASE_URL}/login`, {

    method: 'POST',

    headers: {
      'Content-Type': 'application/json'
    },

    body: JSON.stringify(credentials),
  });

  const data = await handleResponse(response);

  if (data.token) {

    localStorage.setItem('token', data.token);

    localStorage.setItem(
      'user',
      JSON.stringify(data.usuario)
    );
  }

  return data;
};

// ========================
// 📝 REGISTER
// ========================

const register = async (payload) => {

  const response = await fetch(`${BASE_URL}/register`, {

    method: 'POST',

    headers: {
      'Content-Type': 'application/json'
    },

    body: JSON.stringify(payload),
  });

  return handleResponse(response);
};

// ========================
// 👤 PROFILE
// ========================

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

// ========================
// 🔐 FORGOT PASSWORD
// ========================

const forgotPassword = async (email) => {

  const response = await fetch(
    `${BASE_URL}/forgot-password`,
    {

      method: 'POST',

      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({ email }),
    }
  );

  return handleResponse(response);
};

// ========================
// 🔐 RESET PASSWORD
// ========================

const resetPassword = async ({
  token,
  nuevaPassword
}) => {

  const response = await fetch(
    `${BASE_URL}/reset-password`,
    {

      method: 'POST',

      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({
        token,
        nuevaPassword
      }),
    }
  );

  return handleResponse(response);
};

// ========================
// 🚪 LOGOUT
// ========================

const logout = () => {

  localStorage.removeItem('token');

  localStorage.removeItem('user');
};

export default {
  login,
  register,
  getProfile,
  forgotPassword,
  resetPassword,
  logout,
};