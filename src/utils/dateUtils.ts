import { format, isValid, parse, addMinutes, isBefore, isAfter, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { AppointmentDay, TimeSlot, UserSettings } from '../types';

export { isSameDay };

export const generateTimeSlots = (date: Date, settings: UserSettings): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const dayOfWeek = date.getDay();
  
  if (!settings.workDays.includes(dayOfWeek)) {
    return [];
  }
  
  const startTime = parse(settings.workHours.start, 'HH:mm', date);
  const endTime = parse(settings.workHours.end, 'HH:mm', date);
  const breakStart = parse(settings.breakTime.start, 'HH:mm', date);
  const breakEnd = parse(settings.breakTime.end, 'HH:mm', date);
  
  if (!isValid(startTime) || !isValid(endTime) || !isValid(breakStart) || !isValid(breakEnd)) {
    console.error('Invalid time format in settings');
    return [];
  }
  
  let currentTime = startTime;
  
  while (isBefore(currentTime, endTime)) {
    const isDuringBreak = isAfter(currentTime, breakStart) && isBefore(currentTime, breakEnd);
    
    if (!isDuringBreak) {
      slots.push({
        id: `${format(date, 'yyyy-MM-dd')}-${format(currentTime, 'HH:mm')}`,
        time: format(currentTime, 'HH:mm'),
        available: true,
      });
    }
    
    currentTime = addMinutes(currentTime, settings.slotDuration);
  }
  
  return slots;
};

export const getDaysInMonth = (date: Date, settings: UserSettings): AppointmentDay[] => {
  if (!isValid(date)) {
    console.error('Invalid date provided');
    return [];
  }
  
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days: AppointmentDay[] = [];
  
  // Add days from previous month
  const firstDayOfWeek = firstDay.getDay();
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const prevDate = new Date(year, month, -i);
    days.push({
      date: prevDate,
      slots: [],
      isDisabled: true,
    });
  }
  
  // Add days of current month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const currentDate = new Date(year, month, i);
    days.push({
      date: currentDate,
      slots: generateTimeSlots(currentDate, settings),
      isDisabled: false,
    });
  }
  
  // Add days from next month
  const lastDayOfWeek = lastDay.getDay();
  for (let i = 1; i < 7 - lastDayOfWeek; i++) {
    const nextDate = new Date(year, month + 1, i);
    days.push({
      date: nextDate,
      slots: [],
      isDisabled: true,
    });
  }
  
  return days;
};

export const formatDate = (date: Date): string => {
  if (!isValid(date)) return '';
  return format(date, 'EEEE d \'de\' MMMM', { locale: es });
};

export const formatMonthYear = (date: Date): string => {
  if (!isValid(date)) return '';
  return format(date, 'MMMM yyyy', { locale: es });
};

export const getDaysOfWeek = (): string[] => {
  return ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
};

export const isTimeSlotAvailable = (
  date: Date,
  time: string,
  existingAppointments: { date: Date; timeSlot: string }[]
): boolean => {
  return !existingAppointments.some(
    (appointment) =>
      isSameDay(appointment.date, date) && appointment.timeSlot === time
  );
};