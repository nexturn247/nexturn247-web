import React, { useState } from 'react';
import { X, Clock, AlertCircle } from 'lucide-react';
import { useAppointments } from '../context/AppointmentContext';

export const SobreturnoForm: React.FC = () => {
  const { showSobreturnoForm, setShowSobreturnoForm, createAppointment } = useAppointments();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    notes: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!showSobreturnoForm) return null;

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
    
    if (!formData.date) {
      newErrors.date = 'La fecha es obligatoria';
    }
    
    if (!formData.time) {
      newErrors.time = 'La hora es obligatoria';
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Ingresa un correo electrónico válido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    try {
      const [hours, minutes] = formData.time.split(':');
      const appointmentDate = new Date(formData.date);
      appointmentDate.setHours(parseInt(hours), parseInt(minutes));

      await createAppointment({
        date: appointmentDate,
        timeSlot: formData.time,
        customerName: formData.name,
        customerPhone: formData.phone,
        customerEmail: formData.email,
        notes: formData.notes,
      }, true);
      
      setIsSuccess(true);
      
      setTimeout(() => {
        setShowSobreturnoForm(false);
        setFormData({
          name: '',
          phone: '',
          email: '',
          date: '',
          time: '',
          notes: '',
        });
        setIsSuccess(false);
      }, 2000);
      
    } catch (error) {
      console.error('Error creating sobre turno:', error);
      setErrors({ submit: 'Ocurrió un error al agendar el sobre turno. Inténtalo de nuevo.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-purple-200 dark:border-purple-800 bg-purple-100 dark:bg-purple-900/30">
          <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100">
            Agendar Sobre Turno
          </h3>
          <button 
            onClick={() => {
              setShowSobreturnoForm(false);
              setFormData({
                name: '',
                phone: '',
                email: '',
                date: '',
                time: '',
                notes: '',
              });
              setErrors({});
              setIsSuccess(false);
            }}
            className="text-purple-500 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-200"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          {isSuccess ? (
            <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg text-center">
              <p className="text-green-700 dark:text-green-300 font-medium">
                ¡Tu sobre turno ha sido agendado con éxito!
              </p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                Recibirás una confirmación por WhatsApp
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-purple-900 dark:text-purple-100 mb-1">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200 bg-white dark:bg-purple-900/10 dark:text-purple-100
                    ${errors.name 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-purple-300 dark:border-purple-700 focus:ring-purple-500'}`}
                  placeholder="Ingresa tu nombre"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-900 dark:text-purple-100 mb-1">
                  Teléfono (WhatsApp) *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200 bg-white dark:bg-purple-900/10 dark:text-purple-100
                    ${errors.phone 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-purple-300 dark:border-purple-700 focus:ring-purple-500'}`}
                  placeholder="+541234567890"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-900 dark:text-purple-100 mb-1">
                  Correo electrónico (opcional)
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200 bg-white dark:bg-purple-900/10 dark:text-purple-100
                    ${errors.email 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-purple-300 dark:border-purple-700 focus:ring-purple-500'}`}
                  placeholder="correo@ejemplo.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-purple-900 dark:text-purple-100 mb-1">
                    Fecha *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200 bg-white dark:bg-purple-900/10 dark:text-purple-100
                      ${errors.date 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-purple-300 dark:border-purple-700 focus:ring-purple-500'}`}
                  />
                  {errors.date && (
                    <p className="mt-1 text-sm text-red-500">{errors.date}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-purple-900 dark:text-purple-100 mb-1">
                    Hora *
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200 bg-white dark:bg-purple-900/10 dark:text-purple-100
                      ${errors.time 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-purple-300 dark:border-purple-700 focus:ring-purple-500'}`}
                  />
                  {errors.time && (
                    <p className="mt-1 text-sm text-red-500">{errors.time}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-900 dark:text-purple-100 mb-1">
                  Notas adicionales (opcional)
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-purple-300 dark:border-purple-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors duration-200 bg-white dark:bg-purple-900/10 dark:text-purple-100"
                  placeholder="Información adicional importante"
                />
              </div>

              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-start space-x-2">
                <AlertCircle className="text-purple-600 dark:text-purple-400 mt-0.5" size={16} />
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  Los sobre turnos están sujetos a disponibilidad y confirmación del profesional
                </p>
              </div>

              {errors.submit && (
                <div className="p-3 bg-red-50 dark:bg-red-900/30 rounded-lg">
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.submit}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Procesando...' : 'Solicitar Sobre Turno'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};