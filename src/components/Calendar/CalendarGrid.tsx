import React from 'react';
import { AppointmentDay } from '../../types';
import { getDaysOfWeek, isSameDay } from '../../utils/dateUtils';
import { useAppointments } from '../../context/AppointmentContext';

interface CalendarGridProps {
  days: AppointmentDay[];
  selectedDay: AppointmentDay | null;
  onSelectDay: (day: AppointmentDay) => void;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  days,
  selectedDay,
  onSelectDay,
}) => {
  const daysOfWeek = getDaysOfWeek();
  const today = new Date();
  const { appointments } = useAppointments();

  const getAppointmentStatus = (date: Date) => {
    const dayAppointments = appointments.filter(
      app => isSameDay(app.date, date)
    );

    if (dayAppointments.length === 0) return null;

    if (dayAppointments.some(app => app.status === 'sobreturno')) {
      return 'sobreturno';
    }
    if (dayAppointments.some(app => app.status === 'confirmed')) {
      return 'confirmed';
    }
    if (dayAppointments.some(app => app.status === 'pending')) {
      return 'pending';
    }
    if (dayAppointments.every(app => app.status === 'cancelled')) {
      return 'cancelled';
    }

    return null;
  };

  return (
    <div className="calendar-grid">
      {/* Days of week header */}
      <div className="grid grid-cols-7 mb-2">
        {daysOfWeek.map((day) => (
          <div 
            key={day} 
            className="text-center text-sm font-medium text-gray-500 dark:text-gray-400"
          >
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          const isToday = isSameDay(day.date, today);
          const isSelected = selectedDay && isSameDay(day.date, selectedDay.date);
          const hasAvailableSlots = day.slots.some(slot => slot.available);
          const appointmentStatus = getAppointmentStatus(day.date);
          
          const statusColors = {
            confirmed: 'ring-2 ring-green-500 dark:ring-green-400',
            pending: 'ring-2 ring-yellow-500 dark:ring-yellow-400',
            cancelled: 'ring-2 ring-red-500 dark:ring-red-400',
            sobreturno: 'ring-2 ring-purple-500 dark:ring-purple-400'
          };
          
          return (
            <button
              key={index}
              onClick={() => !day.isDisabled && onSelectDay(day)}
              disabled={day.isDisabled || !hasAvailableSlots}
              className={`
                h-12 flex items-center justify-center rounded-lg transition-all duration-200 relative
                ${day.isDisabled 
                  ? 'text-gray-400 dark:text-gray-600 bg-gray-100 dark:bg-gray-800 opacity-50' 
                  : isSelected
                    ? 'bg-teal-500 text-white font-medium'
                    : isToday
                      ? 'bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 font-medium'
                      : hasAvailableSlots
                        ? 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                }
                ${appointmentStatus ? statusColors[appointmentStatus] : ''}
                ${day.isDisabled ? 'cursor-default' : hasAvailableSlots ? 'cursor-pointer' : 'cursor-not-allowed'}
              `}
            >
              <span className={`text-sm ${isSelected ? 'text-white' : ''}`}>
                {day.date.getDate()}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};