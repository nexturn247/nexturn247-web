import React from 'react';
import { Appointment } from '../../types';
import { Clock, User, Phone, Mail, FileText } from 'lucide-react';

interface AppointmentsViewerProps {
  appointments: Appointment[];
  selectedDate: Date | null;
}

export const AppointmentsViewer: React.FC<AppointmentsViewerProps> = ({
  appointments,
  selectedDate,
}) => {
  if (!selectedDate) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 h-full transition-colors duration-200">
        <p className="text-gray-500 dark:text-gray-400 text-center">
          Selecciona una fecha para ver las citas
        </p>
      </div>
    );
  }

  const dateAppointments = appointments.filter(
    (app) => app.date.toDateString() === selectedDate.toDateString()
  ).sort((a, b) => a.timeSlot.localeCompare(b.timeSlot));

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 h-full transition-colors duration-200">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Citas para el {formatDate(selectedDate)}
      </h3>

      {dateAppointments.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center">
          No hay citas programadas para este día
        </p>
      ) : (
        <div className="space-y-4">
          {dateAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className={`border rounded-lg p-4 transition-colors duration-200
                ${
                  appointment.status === 'confirmed'
                    ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20'
                    : appointment.status === 'cancelled'
                    ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20'
                    : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50'
                }
              `}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Clock size={16} className="text-gray-500 dark:text-gray-400" />
                  <span className="font-medium text-gray-900 dark:text-white">
                    {appointment.timeSlot}
                  </span>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full
                    ${
                      appointment.status === 'confirmed'
                        ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                        : appointment.status === 'cancelled'
                        ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                        : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                    }
                  `}
                >
                  {appointment.status === 'confirmed'
                    ? 'Confirmada'
                    : appointment.status === 'cancelled'
                    ? 'Cancelada'
                    : 'Pendiente'}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <User size={16} className="text-gray-500 dark:text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {appointment.customerName}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <Phone size={16} className="text-gray-500 dark:text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {appointment.customerPhone}
                  </span>
                </div>

                {appointment.customerEmail && (
                  <div className="flex items-center space-x-2">
                    <Mail size={16} className="text-gray-500 dark:text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {appointment.customerEmail}
                    </span>
                  </div>
                )}

                {appointment.notes && (
                  <div className="flex items-start space-x-2">
                    <FileText size={16} className="text-gray-500 dark:text-gray-400 mt-1" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {appointment.notes}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};