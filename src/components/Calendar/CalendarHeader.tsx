import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatMonthYear } from '../../utils/dateUtils';

interface CalendarHeaderProps {
  currentMonth: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentMonth,
  onPrevMonth,
  onNextMonth,
}) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
        {formatMonthYear(currentMonth)}
      </h2>
      
      <div className="flex space-x-2">
        <button
          onClick={onPrevMonth}
          className="p-2 rounded-full transition-colors duration-200 ease-in-out
            bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600
            focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400"
          aria-label="Mes anterior"
        >
          <ChevronLeft size={20} className="text-gray-800 dark:text-gray-200" />
        </button>
        
        <button
          onClick={onNextMonth}
          className="p-2 rounded-full transition-colors duration-200 ease-in-out
            bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600
            focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400"
          aria-label="Mes siguiente"
        >
          <ChevronRight size={20} className="text-gray-800 dark:text-gray-200" />
        </button>
      </div>
    </div>
  );
};