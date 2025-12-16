import { createContext, useState, useEffect, useContext } from 'react';
import { getCurrentUser, logout as apiLogout, initializeCsrfToken } from '../services/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Inicializar auth al montar el componente
  useEffect(() => {
    async function initAuth() {
      try {
        // Obtener CSRF token una sola vez
        await initializeCsrfToken();
        
        // Intentar obtener usuario actual
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }
      } catch (err) {
        // Si no hay usuario autenticado, es normal que falle
        setError('');
      } finally {
        setLoading(false);
      }
    }
    initAuth();
  }, []);

  const logout = async () => {
    try {
      await apiLogout();
      setUser(null);
      setError('');
    } catch (err) {
      setError(err.message || 'Error al cerrar sesión');
      throw err;
    }
  };

  const value = {
    user,
    setUser,
    loading,
    error,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook personalizado para usar el contexto
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}
