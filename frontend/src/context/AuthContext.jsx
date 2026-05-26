import { createContext, useContext, useEffect, useState } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(false);

  const saveSession = (tokenValue, userData) => {
    localStorage.setItem('token', tokenValue);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(tokenValue);
    setUser(userData);
  };

  const login = (tokenValue, userData) => {
    saveSession(tokenValue, userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    setToken(null);
    setUser(null);
  };
  useEffect(() => {
    const loadProfile = async () => {
      if (token && !user) {
        setLoading(true);
        try {
          const profile = await authService.getProfile(token);
          if (profile && !profile.error) {
            saveSession(token, profile);
          } else {
            logout();
          }
        } catch (error) {
          logout();
        } finally {
          setLoading(false);
        }
      }
    };

    loadProfile();
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, user, loading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

export default AuthContext;
