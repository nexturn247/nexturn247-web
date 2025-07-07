import React, { useState } from 'react';
import { AppointmentDay, TimeSlot } from '../types';
import { useAppointments } from '../context/AppointmentContext';
import { X } from 'lucide-react';

interface AppointmentFormProps {
  selectedDay: AppointmentDay;
  selectedTimeSlot: TimeSlot;
  onClose: () => void;
}

export const AppointmentForm: React.FC<AppointmentFormProps> = ({ 
  selectedDay, 
  selectedTimeSlot, 
  onClose 
}) => {
  const { createAppointment, userSettings } = useAppointments();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    notes: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es obligatorio';
    } else if (!/^\+?[0-9]{8,15}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Ingresa un número de teléfono válido';
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Ingresa un correo electrónico válido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    try {
      // Create appointment
      await createAppointment({
        date: selectedDay.date,
        timeSlot: selectedTimeSlot.time,
        customerName: formData.name,
        customerPhone: formData.phone,
        customerEmail: formData.email,
        notes: formData.notes,
      });
      
      setIsSuccess(true);
      
      // Reset form after 2 seconds
      setTimeout(() => {
        onClose();
        setFormData({ name: '', phone: '', email: '', notes: '' });
        setIsSuccess(false);
      }, 2000);
      
    } catch (error) {
      console.error('Error creating appointment:', error);
      setErrors({ submit: 'Ocurrió un error al agendar la cita. Inténtalo de nuevo.' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const formatDateDisplay = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  };
  
  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto transition-colors duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Agendar cita
          </h3>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4">
          {/* Appointment details */}
          <div className="mb-6 p-3 bg-teal-50 dark:bg-teal-900/30 rounded-lg">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-semibold">Fecha: </span>
              {formatDateDisplay(selectedDay.date)}
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-semibold">Hora: </span>
              {selectedTimeSlot.time}
            </p>
          </div>
          
          {isSuccess ? (
            <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg text-center">
              <p className="text-green-700 dark:text-green-300 font-medium">
                ¡Tu cita ha sido agendada con éxito!
              </p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                Recibirás una confirmación por WhatsApp
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Name input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200 dark:bg-gray-700 dark:text-white
                    ${errors.name 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 dark:border-gray-600 focus:ring-teal-500'}`}
                  placeholder="Ingresa tu nombre"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                )}
              </div>
              
              {/* Phone input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Teléfono (WhatsApp) *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200 dark:bg-gray-700 dark:text-white
                    ${errors.phone 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 dark:border-gray-600 focus:ring-teal-500'}`}
                  placeholder="+521234567890"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                )}
              </div>
              
              {/* Email input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Correo electrónico (opcional)
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200 dark:bg-gray-700 dark:text-white
                    ${errors.email 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 dark:border-gray-600 focus:ring-teal-500'}`}
                  placeholder="correo@ejemplo.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>
              
              {/* Notes input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Notas adicionales (opcional)
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors duration-200 dark:bg-gray-700 dark:text-white"
                  placeholder="Alguna información adicional que quieras compartir"
                />
              </div>
              
              {/* WhatsApp notification info */}
              <div className="mb-6 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Al agendar, recibirás una confirmación por WhatsApp en el número proporcionado.
                  {userSettings.notifications.reminderEnabled && 
                    ` También recibirás un recordatorio ${userSettings.notifications.reminderHoursBefore} horas antes de tu cita.`
                  }
                </p>
              </div>
              
              {errors.submit && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 rounded-lg">
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.submit}</p>
                </div>
              )}
              
              {/* Submit button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2 px-4 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Procesando...' : 'Confirmar cita'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};