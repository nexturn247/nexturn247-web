import React, { useState } from 'react';
import { CalendarHeader } from './CalendarHeader';
import { CalendarGrid } from './CalendarGrid';
import { TimeSlots } from './TimeSlots';
import { AppointmentsViewer } from './AppointmentsViewer';
import { AppointmentForm } from '../AppointmentForm';
import { AppointmentDay, TimeSlot } from '../../types';
import { useAppointments } from '../../context/AppointmentContext';
import { Circle } from 'lucide-react';

export const CalendarView: React.FC = () => {
  const { 
    currentMonth, 
    calendarDays, 
    appointments,
    selectedDay,
    setCurrentMonth,
    setSelectedDay
  } = useAppointments();
  
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  
  const handlePrevMonth = () => {
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    setCurrentMonth(prevMonth);
  };
  
  const handleNextMonth = () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setCurrentMonth(nextMonth);
  };
  
  const handleSelectDay = (day: AppointmentDay) => {
    setSelectedDay(day);
    setSelectedTimeSlot(null);
    setShowAppointmentForm(false);
  };
  
  const handleSelectTimeSlot = (timeSlot: TimeSlot) => {
    setSelectedTimeSlot(timeSlot);
    setShowAppointmentForm(true);
  };
  
  const handleFormClose = () => {
    setShowAppointmentForm(false);
    setSelectedTimeSlot(null);
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-4 transition-colors duration-200">
        <CalendarHeader 
          currentMonth={currentMonth}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
        />
        
        <CalendarGrid 
          days={calendarDays}
          selectedDay={selectedDay}
          onSelectDay={handleSelectDay}
        />

        {/* Status Legend */}
        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Estado de los turnos
          </h4>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Circle className="h-4 w-4 text-green-500 fill-current" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Confirmado</span>
            </div>
            <div className="flex items-center gap-2">
              <Circle className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Por confirmar</span>
            </div>
            <div className="flex items-center gap-2">
              <Circle className="h-4 w-4 text-red-500 fill-current" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Cancelado</span>
            </div>
            <div className="flex items-center gap-2">
              <Circle className="h-4 w-4 text-purple-500 fill-current" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Sobre Turno</span>
            </div>
          </div>
        </div>
        
        {selectedDay && (
          <TimeSlots 
            selectedDay={selectedDay}
            onSelectTimeSlot={handleSelectTimeSlot}
          />
        )}
        
        {showAppointmentForm && selectedDay && selectedTimeSlot && (
          <AppointmentForm 
            selectedDay={selectedDay}
            selectedTimeSlot={selectedTimeSlot}
            onClose={handleFormClose}
          />
        )}
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md transition-colors duration-200">
        <AppointmentsViewer
          appointments={appointments}
          selectedDate={selectedDay?.date || null}
        />
      </div>
    </div>
  );
};