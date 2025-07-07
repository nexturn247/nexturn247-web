import React from 'react';
import { X, MessageCircle, Clock } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  time: string;
  isUser: boolean;
  date?: string;
}

interface NotificationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  latestMessage: Message | null;
}

export const NotificationPopup: React.FC<NotificationPopupProps> = ({
  isOpen,
  onClose,
  latestMessage,
}) => {
  if (!isOpen) return null;

  const formatDateTime = (message: Message) => {
    const now = new Date();
    const today = now.toLocaleDateString('es-ES');
    const messageDate = message.date || today;
    
    return {
      date: messageDate,
      time: message.time
    };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md transition-colors duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-primary">
          <div className="flex items-center space-x-2">
            <MessageCircle className="text-white" size={20} />
            <h3 className="text-lg font-semibold text-white">
              Último Mensaje
            </h3>
          </div>
          <button 
            onClick={onClose} 
            className="text-white hover:text-gray-200 transition-colors duration-200"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          {latestMessage ? (
            <div className="space-y-4">
              {/* Message content */}
              <div className={`p-4 rounded-lg ${
                latestMessage.isUser
                  ? 'bg-secondary/10 dark:bg-blue-900/30 border-l-4 border-secondary'
                  : 'bg-primary/10 dark:bg-green-900/30 border-l-4 border-primary'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-medium ${
                    latestMessage.isUser 
                      ? 'text-secondary dark:text-blue-400' 
                      : 'text-primary dark:text-green-400'
                  }`}>
                    {latestMessage.isUser ? 'Tú' : 'Cliente'}
                  </span>
                  <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                    <Clock size={12} />
                    <span>{formatDateTime(latestMessage).time}</span>
                  </div>
                </div>
                <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
                  {latestMessage.text}
                </p>
              </div>

              {/* Date and time info */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Fecha:</span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    {formatDateTime(latestMessage).date}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-gray-600 dark:text-gray-400">Hora:</span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    {formatDateTime(latestMessage).time}
                  </span>
                </div>
              </div>

              {/* Action button */}
              <button
                onClick={onClose}
                className="w-full py-2 px-4 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Ver Chat Completo
              </button>
            </div>
          ) : (
            <div className="text-center py-8">
              <MessageCircle className="mx-auto text-gray-400 dark:text-gray-600 mb-4" size={48} />
              <p className="text-gray-500 dark:text-gray-400">
                No hay mensajes recientes
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};