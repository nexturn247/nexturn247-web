import React, { useState } from 'react';
import { UserSettings } from '../types';
import { useAppointments } from '../context/AppointmentContext';
import { X, Check, AlertCircle, Key, User, Briefcase, Volume2 } from 'lucide-react';
import { playNotificationSound, testBellSounds } from '../utils/sounds';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose }) => {
  const { userSettings, updateUserSettings } = useAppointments();
  const [settings, setSettings] = useState<UserSettings>({ ...userSettings });
  const [whatsappVerified, setWhatsappVerified] = useState(!!userSettings.whatsappNumber);
  const [whatsappApiKey, setWhatsappApiKey] = useState(userSettings.whatsappApiKey || '');
  
  if (!isOpen) return null;
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    
    if (name === 'confirmationEnabled' || name === 'reminderEnabled') {
      setSettings(prev => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          [name]: checked
        }
      }));
    } else if (name.startsWith('workDay')) {
      const day = parseInt(name.replace('workDay', ''), 10);
      
      setSettings(prev => {
        const workDays = checked
          ? [...prev.workDays, day].sort()
          : prev.workDays.filter(d => d !== day);
        
        return {
          ...prev,
          workDays
        };
      });
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'whatsappNumber') {
      setSettings(prev => ({
        ...prev,
        [name]: value
      }));
      setWhatsappVerified(false);
    } else if (name === 'whatsappApiKey') {
      setWhatsappApiKey(value);
      setSettings(prev => ({
        ...prev,
        whatsappApiKey: value
      }));
    } else if (name === 'profession' || name === 'specialization') {
      setSettings(prev => ({
        ...prev,
        [name]: value
      }));
    } else if (name === 'reminderHoursBefore') {
      setSettings(prev => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          [name]: parseInt(value, 10)
        }
      }));
    } else if (name === 'slotDuration') {
      setSettings(prev => ({
        ...prev,
        [name]: parseInt(value, 10)
      }));
    } else if (name === 'workHoursStart' || name === 'workHoursEnd') {
      setSettings(prev => ({
        ...prev,
        workHours: {
          ...prev.workHours,
          [name === 'workHoursStart' ? 'start' : 'end']: value
        }
      }));
    } else if (name === 'breakTimeStart' || name === 'breakTimeEnd') {
      setSettings(prev => ({
        ...prev,
        breakTime: {
          ...prev.breakTime,
          [name === 'breakTimeStart' ? 'start' : 'end']: value
        }
      }));
    }
  };
  
  const verifyWhatsApp = () => {
    if (!settings.whatsappNumber || !whatsappApiKey) {
      return;
    }
    setWhatsappVerified(true);
  };
  
  const saveSettings = () => {
    updateUserSettings({
      ...settings,
      whatsappApiKey
    });
    onClose();
  };
  
  const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  
  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transition-colors duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Configuración
          </h3>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4">
          <div className="space-y-6">
            {/* Professional Information */}
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h4 className="text-md font-medium text-gray-800 dark:text-white mb-4 flex items-center">
                <User className="mr-2" size={20} />
                Información Profesional
              </h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Profesión
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="profession"
                      value={settings.profession}
                      onChange={handleInputChange}
                      placeholder="Ej: Médico, Dentista, Psicólogo"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors duration-200 dark:bg-gray-700 dark:text-white"
                    />
                    <Briefcase size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Especialización
                  </label>
                  <input
                    type="text"
                    name="specialization"
                    value={settings.specialization}
                    onChange={handleInputChange}
                    placeholder="Ej: Clínica General, Ortodoncia, Terapia Cognitiva"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors duration-200 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* WhatsApp Integration */}
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h4 className="text-md font-medium text-gray-800 dark:text-white mb-4">
                Integración con WhatsApp
              </h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Número de WhatsApp Business
                  </label>
                  <input
                    type="tel"
                    name="whatsappNumber"
                    value={settings.whatsappNumber}
                    onChange={handleInputChange}
                    placeholder="+521234567890"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors duration-200 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    API Key de WhatsApp Business
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      name="whatsappApiKey"
                      value={whatsappApiKey}
                      onChange={handleInputChange}
                      placeholder="Ingresa tu API Key de WhatsApp Business"
                      className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors duration-200 dark:bg-gray-700 dark:text-white"
                    />
                    <Key size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Encuentra tu API Key en el panel de WhatsApp Business
                  </p>
                </div>
                
                <button
                  onClick={verifyWhatsApp}
                  disabled={!settings.whatsappNumber || !whatsappApiKey || whatsappVerified}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {whatsappVerified ? (
                    <>
                      <Check size={16} className="mr-1" />
                      Verificado
                    </>
                  ) : (
                    'Verificar'
                  )}
                </button>
              </div>
              
              {!whatsappVerified && (
                <div className="mt-2 flex items-start text-yellow-600 dark:text-yellow-400 text-sm">
                  <AlertCircle size={16} className="mr-1 mt-0.5 flex-shrink-0" />
                  <span>
                    Se requiere verificar tu número de WhatsApp y API Key para enviar notificaciones
                  </span>
                </div>
              )}
            </div>
            
            {/* Availability Settings */}
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h4 className="text-md font-medium text-gray-800 dark:text-white mb-4">
                Horarios de disponibilidad
              </h4>
              
              {/* Work days */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Días laborales
                </label>
                <div className="flex flex-wrap gap-2">
                  {daysOfWeek.map((day, index) => (
                    <label key={index} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name={`workDay${index}`}
                        checked={settings.workDays.includes(index)}
                        onChange={handleCheckboxChange}
                        className="form-checkbox h-4 w-4 text-teal-600 transition duration-150 ease-in-out"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{day}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Work hours */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Hora de inicio
                  </label>
                  <input
                    type="time"
                    name="workHoursStart"
                    value={settings.workHours.start}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors duration-200 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Hora de fin
                  </label>
                  <input
                    type="time"
                    name="workHoursEnd"
                    value={settings.workHours.end}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors duration-200 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
              
              {/* Break time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Hora de inicio del descanso
                  </label>
                  <input
                    type="time"
                    name="breakTimeStart"
                    value={settings.breakTime.start}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors duration-200 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Hora de fin del descanso
                  </label>
                  <input
                    type="time"
                    name="breakTimeEnd"
                    value={settings.breakTime.end}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors duration-200 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
              
              {/* Slot duration */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Duración de cada cita (minutos)
                </label>
                <select
                  name="slotDuration"
                  value={settings.slotDuration}
                  onChange={(e) => handleInputChange({ ...e, target: { ...e.target, value: e.target.value } } as any)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors duration-200 dark:bg-gray-700 dark:text-white"
                >
                  <option value="15">15 minutos</option>
                  <option value="30">30 minutos</option>
                  <option value="45">45 minutos</option>
                  <option value="60">1 hora</option>
                  <option value="90">1 hora 30 minutos</option>
                  <option value="120">2 horas</option>
                </select>
              </div>
            </div>
            
            {/* Notification Settings */}
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h4 className="text-md font-medium text-gray-800 dark:text-white mb-4">
                Notificaciones
              </h4>
              
              <div className="space-y-4">
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="confirmationEnabled"
                      checked={settings.notifications.confirmationEnabled}
                      onChange={handleCheckboxChange}
                      className="form-checkbox h-4 w-4 text-teal-600 transition duration-150 ease-in-out"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Enviar confirmación por WhatsApp cuando se agende una cita
                    </span>
                  </label>
                </div>
                
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="reminderEnabled"
                      checked={settings.notifications.reminderEnabled}
                      onChange={handleCheckboxChange}
                      className="form-checkbox h-4 w-4 text-teal-600 transition duration-150 ease-in-out"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Enviar recordatorio antes de la cita
                    </span>
                  </label>
                  
                  {settings.notifications.reminderEnabled && (
                    <div className="mt-2 pl-6">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Horas antes
                      </label>
                      <select
                        name="reminderHoursBefore"
                        value={settings.notifications.reminderHoursBefore}
                        onChange={(e) => handleInputChange({ ...e, target: { ...e.target, value: e.target.value } } as any)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors duration-200 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="1">1 hora</option>
                        <option value="2">2 horas</option>
                        <option value="3">3 horas</option>
                        <option value="6">6 horas</option>
                        <option value="12">12 horas</option>
                        <option value="24">24 horas</option>
                        <option value="48">2 días</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Notification Sound Settings */}
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h4 className="text-md font-medium text-gray-800 dark:text-white mb-4 flex items-center">
                <Volume2 className="mr-2" size={20} />
                Sonidos de Campanita
              </h4>
              
              <div className="space-y-4">
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="soundEnabled"
                      checked={settings.notifications.soundEnabled}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        notifications: {
                          ...prev.notifications,
                          soundEnabled: e.target.checked
                        }
                      }))}
                      className="form-checkbox h-4 w-4 text-teal-600 transition duration-150 ease-in-out"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Activar sonido de campanita para mensajes nuevos
                    </span>
                  </label>
                </div>
                
                {settings.notifications.soundEnabled && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Tipo de campanita
                      </label>
                      <select
                        name="notificationSound"
                        value={settings.notifications.notificationSound}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          notifications: {
                            ...prev.notifications,
                            notificationSound: e.target.value as 'default' | 'chime' | 'bell' | 'ding'
                          }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors duration-200 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="default">🔔 Campanita Realista (Recomendada)</option>
                        <option value="chime">🎵 Campanita Simple</option>
                        <option value="bell">🔔 Campana Básica</option>
                        <option value="ding">🎶 Ding Suave</option>
                      </select>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => playNotificationSound(settings)}
                        className="px-3 py-1 text-sm bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors duration-200 flex items-center"
                      >
                        🔔 Probar Campanita
                      </button>
                      
                      <button
                        onClick={testBellSounds}
                        className="px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors duration-200 flex items-center"
                      >
                        🎵 Probar Todas
                      </button>
                    </div>
                    
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                      <p className="text-xs text-blue-700 dark:text-blue-300">
                        💡 <strong>Campanita Realista:</strong> Sonido armónico con múltiples tonos como una campana real<br/>
                        🎵 <strong>Campanita Simple:</strong> Dos tonos melódicos suaves<br/>
                        🔔 <strong>Campana Básica:</strong> Sonido tradicional de campana<br/>
                        🎶 <strong>Ding Suave:</strong> Tono simple y discreto
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancelar
            </button>
            <button
              onClick={saveSettings}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};