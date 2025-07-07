import React from 'react';
import { AppointmentDay, TimeSlot } from '../../types';

interface TimeSlotsProps {
  selectedDay: AppointmentDay | null;
  onSelectTimeSlot: (timeSlot: TimeSlot) => void;
}

export const TimeSlots: React.FC<TimeSlotsProps> = ({ 
  selectedDay, 
  onSelectTimeSlot 
}) => {
  if (!selectedDay || selectedDay.slots.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500 dark:text-gray-400">
        No hay horarios disponibles para este día
      </div>
    );
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Horarios disponibles - {formatDate(selectedDay.date)}
      </h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {selectedDay.slots.map((slot) => (
          <button
            key={slot.id}
            onClick={() => onSelectTimeSlot(slot)}
            disabled={!slot.available}
            className={`
              py-2 px-4 rounded-lg text-center text-sm font-medium transition-colors duration-200
              ${slot.available
                ? 'bg-white dark:bg-gray-800 border border-teal-500 dark:border-teal-400 text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-gray-700'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'}
            `}
          >
            {slot.time}
          </button>
        ))}
      </div>
    </div>
  );
};