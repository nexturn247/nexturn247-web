import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simulación de base de datos de usuarios (en producción usar una base de datos real)
const USERS_STORAGE_KEY = 'nexturn_users';
const CURRENT_USER_KEY = 'nexturn_current_user';

interface StoredUser {
  id: string;
  name: string;
  email: string;
  password: string; // En producción, esto debería estar hasheado
  createdAt: string;
}

const getStoredUsers = (): StoredUser[] => {
  try {
    const users = localStorage.getItem(USERS_STORAGE_KEY);
    return users ? JSON.parse(users) : [];
  } catch {
    return [];
  }
};

const saveUsers = (users: StoredUser[]) => {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (error) {
    console.error('Error saving users:', error);
  }
};

const getCurrentUser = (): User | null => {
  try {
    const user = localStorage.getItem(CURRENT_USER_KEY);
    if (user) {
      const parsedUser = JSON.parse(user);
      return {
        ...parsedUser,
        createdAt: new Date(parsedUser.createdAt)
      };
    }
    return null;
  } catch {
    return null;
  }
};

const setCurrentUser = (user: User | null) => {
  try {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      console.log("💾 Usuario guardado en localStorage:", user.email);
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
      console.log("🗑️ Usuario removido de localStorage");
    }
  } catch (error) {
    console.error('Error setting current user:', error);
  }
};

// Función simple de hash (en producción usar bcrypt o similar)
const simpleHash = (password: string): string => {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash.toString();
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay un usuario logueado al cargar la aplicación
    console.log("🔍 Verificando usuario al cargar...");
    try {
      const currentUser = getCurrentUser();
      if (currentUser) {
        console.log("✅ Usuario encontrado:", currentUser.email);
        setUser(currentUser);
      } else {
        console.log("❌ No hay usuario logueado");
        setUser(null);
      }
    } catch (error) {
      console.error('Error loading user:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!email || !password) {
        return { success: false, error: 'Email y contraseña son requeridos' };
      }

      const users = getStoredUsers();
      const hashedPassword = simpleHash(password);
      
      const foundUser = users.find(u => 
        u.email.toLowerCase() === email.toLowerCase() && 
        u.password === hashedPassword
      );

      if (!foundUser) {
        return { success: false, error: 'Credenciales incorrectas' };
      }

      const userSession: User = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        createdAt: new Date(foundUser.createdAt)
      };

      console.log("🔑 Iniciando sesión para:", userSession.email);
      setUser(userSession);
      setCurrentUser(userSession);
      
      console.log("✅ Login exitoso para:", userSession.email);
      return { success: true };
    } catch (error) {
      console.error('Error en login:', error);
      return { success: false, error: 'Error interno del servidor' };
    }
  };

  const register = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Validaciones básicas
      if (!name || !email || !password) {
        return { success: false, error: 'Todos los campos son requeridos' };
      }

      if (name.trim().length < 2) {
        return { success: false, error: 'El nombre debe tener al menos 2 caracteres' };
      }

      if (password.length < 6) {
        return { success: false, error: 'La contraseña debe tener al menos 6 caracteres' };
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return { success: false, error: 'Ingresa un email válido' };
      }

      const users = getStoredUsers();
      
      // Verificar si el email ya existe
      const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existingUser) {
        return { success: false, error: 'Este email ya está registrado' };
      }

      // Crear nuevo usuario
      const newUser: StoredUser = {
        id: crypto.randomUUID(),
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: simpleHash(password),
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      saveUsers(users);

      // Loguear automáticamente al usuario recién registrado
      const userSession: User = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        createdAt: new Date(newUser.createdAt)
      };

      console.log("📝 Registrando usuario:", userSession.email);
      setUser(userSession);
      setCurrentUser(userSession);

      console.log("✅ Registro exitoso para:", userSession.email);
      return { success: true };
    } catch (error) {
      console.error('Error en registro:', error);
      return { success: false, error: 'Error interno del servidor' };
    }
  };

  const logout = () => {
    console.log("🚪 INICIANDO LOGOUT...");
    console.log("👤 Usuario actual antes del logout:", user?.email);
    
    try {
      // 1. Limpiar estado del usuario
      console.log("1️⃣ Limpiando estado del usuario...");
      setUser(null);
      
      // 2. Limpiar localStorage
      console.log("2️⃣ Limpiando localStorage...");
      setCurrentUser(null);
      
      // 3. Limpiar cualquier otro dato de sesión
      console.log("3️⃣ Limpiando datos adicionales...");
      try {
        // Limpiar otros datos si existen
        localStorage.removeItem('nexturn_settings');
        localStorage.removeItem('nexturn_appointments');
      } catch (storageError) {
        console.warn("⚠️ Error limpiando datos adicionales:", storageError);
      }
      
      // 4. Forzar re-render
      console.log("4️⃣ Forzando actualización...");
      
      console.log("✅ LOGOUT COMPLETADO EXITOSAMENTE");
      console.log("👤 Usuario después del logout:", null);
      
      // 5. Recargar la página para asegurar limpieza completa
      setTimeout(() => {
        console.log("🔄 Recargando página para limpieza completa...");
        window.location.reload();
      }, 100);
      
    } catch (error) {
      console.error("❌ ERROR DURANTE LOGOUT:", error);
      // En caso de error, forzar recarga de página
      window.location.reload();
    }
  };

  // Debug: Mostrar estado actual
  useEffect(() => {
    console.log("🔍 Estado de autenticación:", {
      user: user?.email || 'No logueado',
      isAuthenticated: !!user,
      isLoading
    });
  }, [user, isLoading]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};