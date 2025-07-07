import React, { useState } from 'react';
import { Calendar, Settings, Bell, Plus, LogOut, User } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { NotificationPopup } from './NotificationPopup';
import { useAppointments } from '../context/AppointmentContext';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  onSettingsClick: () => void;
  hasNewMessages?: boolean;
  unreadCount?: number;
  onNotificationClick?: () => void;
  latestMessage?: {
    id: number;
    text: string;
    time: string;
    isUser: boolean;
    date?: string;
  } | null;
}

export const Header: React.FC<HeaderProps> = ({ 
  onSettingsClick, 
  hasNewMessages = false, 
  unreadCount = 0,
  onNotificationClick,
  latestMessage 
}) => {
  const { setShowSobreturnoForm } = useAppointments();
  const { user, logout } = useAuth();
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleBellClick = () => {
    console.log("🔔 Click en campana del header");
    setShowNotificationPopup(true);
    if (onNotificationClick) {
      onNotificationClick();
    }
  };

  const handleLogout = () => {
    console.log("🚪 CLICK EN BOTÓN LOGOUT - Header.tsx");
    console.log("👤 Usuario antes del logout:", user?.email);
    
    // Cerrar menú inmediatamente
    setShowUserMenu(false);
    
    // Confirmar logout
    const confirmLogout = window.confirm("¿Estás seguro que quieres cerrar sesión?");
    
    if (confirmLogout) {
      console.log("✅ Usuario confirmó logout");
      
      try {
        // Llamar función logout del contexto
        logout();
        console.log("🔄 Función logout ejecutada");
      } catch (error) {
        console.error("❌ Error en handleLogout:", error);
        // Forzar recarga en caso de error
        window.location.reload();
      }
    } else {
      console.log("❌ Usuario canceló logout");
    }
  };

  const formatUnreadCount = (count: number): string => {
    if (count === 0) return '';
    if (count > 99) return '99+';
    return count.toString();
  };

  return (
    <>
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-900 shadow-sm transition-colors duration-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Calendar className="h-7 w-7 text-teal-600 dark:text-teal-400" />
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              NEXTURN<span className="text-teal-600 dark:text-teal-400"> 24/7</span>
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBellClick}
              className="relative p-2 rounded-full transition-colors duration-200 ease-in-out
                bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600
                focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400"
              aria-label="Notificaciones"
            >
              <Bell className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1 animate-pulse font-bold shadow-lg border-2 border-white">
                  {formatUnreadCount(unreadCount)}
                </span>
              )}
            </button>
            
            <button
              onClick={() => setShowSobreturnoForm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200"
            >
              <Plus size={18} />
              <span className="font-montserrat">Sobre Turno</span>
            </button>
            
            <ThemeToggle />
            
            <button
              onClick={onSettingsClick}
              className="p-2 rounded-full transition-colors duration-200 ease-in-out
                bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600
                focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400"
              aria-label="Configuración"
            >
              <Settings size={20} className="text-gray-800 dark:text-gray-200" />
            </button>
            
            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => {
                  console.log("👤 Click en menú de usuario");
                  setShowUserMenu(!showUserMenu);
                }}
                className="flex items-center space-x-2 p-2 rounded-full transition-colors duration-200 ease-in-out
                  bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600
                  focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400"
              >
                <User size={20} className="text-gray-800 dark:text-gray-200" />
                <span className="hidden md:block text-sm font-medium text-gray-800 dark:text-gray-200">
                  {user?.name || 'Usuario'}
                </span>
              </button>
              
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-20">
                  <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user?.name || 'Usuario'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user?.email || 'email@ejemplo.com'}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-2 transition-colors duration-200"
                  >
                    <LogOut size={16} />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <NotificationPopup
        isOpen={showNotificationPopup}
        onClose={() => setShowNotificationPopup(false)}
        latestMessage={latestMessage}
      />
      
      {/* Overlay to close user menu */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={() => {
            console.log("🖱️ Click en overlay - cerrando menú");
            setShowUserMenu(false);
          }}
        />
      )}
    </>
  );
};