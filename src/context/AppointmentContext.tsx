import React, { createContext, useContext, useState, useCallback } from 'react';
import { Appointment, AppointmentDay, TimeSlot, UserSettings } from '../types';
import { generateTimeSlots, getDaysInMonth } from '../utils/dateUtils';
import { playNotificationSound } from '../utils/sounds';

// Default user settings
const defaultSettings: UserSettings = {
  workDays: [1, 2, 3, 4, 5], // Monday to Friday
  workHours: {
    start: "09:00",
    end: "17:00",
  },
  slotDuration: 30, // 30 minutes per slot
  breakTime: {
    start: "12:00",
    end: "13:00",
  },
  whatsappNumber: "",
  profession: "Médico",
  specialization: "Clínica General",
  notifications: {
    confirmationEnabled: true,
    reminderEnabled: true,
    reminderHoursBefore: 24,
    soundEnabled: true,
    notificationSound: 'default',
  },
};

// Example appointments with different statuses
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);
const dayAfterTomorrow = new Date(today);
dayAfterTomorrow.setDate(today.getDate() + 2);

const exampleAppointments: Appointment[] = [
  {
    id: '1',
    date: today,
    timeSlot: '10:00',
    customerName: 'Juan Pérez',
    customerPhone: '+541122334455',
    customerEmail: 'juan@email.com',
    status: 'confirmed',
    notes: 'Control mensual',
    createdAt: new Date(),
  },
  {
    id: '2',
    date: today,
    timeSlot: '11:00',
    customerName: 'María García',
    customerPhone: '+541122334466',
    customerEmail: 'maria@email.com',
    status: 'pending',
    notes: 'Primera consulta',
    createdAt: new Date(),
  },
  {
    id: '3',
    date: today,
    timeSlot: '14:00',
    customerName: 'Carlos López',
    customerPhone: '+541122334477',
    status: 'cancelled',
    notes: 'Cancelado por el paciente',
    createdAt: new Date(),
  },
  {
    id: '4',
    date: tomorrow,
    timeSlot: '09:00',
    customerName: 'Ana Martínez',
    customerPhone: '+541122334488',
    status: 'confirmed',
    notes: 'Consulta de seguimiento',
    createdAt: new Date(),
  },
  {
    id: '5',
    date: tomorrow,
    timeSlot: '15:30',
    customerName: 'Pedro Rodríguez',
    customerPhone: '+541122334499',
    status: 'cancelled',
    notes: 'Cancelado por emergencia',
    createdAt: new Date(),
  },
  {
    id: '6',
    date: dayAfterTomorrow,
    timeSlot: '11:30',
    customerName: 'Laura Sánchez',
    customerPhone: '+541122334400',
    status: 'pending',
    notes: 'Consulta inicial',
    createdAt: new Date(),
  },
  // Add sobreturno example
  {
    id: '7',
    date: today,
    timeSlot: '16:30',
    customerName: 'Roberto Gómez',
    customerPhone: '+541122334411',
    status: 'sobreturno',
    notes: 'Urgencia - Sobre Turno',
    createdAt: new Date(),
  }
];

type AppointmentContextType = {
  currentMonth: Date;
  calendarDays: AppointmentDay[];
  appointments: Appointment[];
  userSettings: UserSettings;
  selectedDay: AppointmentDay | null;
  showSobreturnoForm: boolean;
  setCurrentMonth: (date: Date) => void;
  setSelectedDay: (day: AppointmentDay | null) => void;
  setShowSobreturnoForm: (show: boolean) => void;
  updateUserSettings: (settings: Partial<UserSettings>) => void;
  createAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt' | 'status'>, isSobreturno?: boolean) => void;
  cancelAppointment: (id: string) => void;
};

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

export const AppointmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>(exampleAppointments);
  const [userSettings, setUserSettings] = useState<UserSettings>(defaultSettings);
  const [selectedDay, setSelectedDay] = useState<AppointmentDay | null>(null);
  const [showSobreturnoForm, setShowSobreturnoForm] = useState(false);
  const [calendarDays, setCalendarDays] = useState<AppointmentDay[]>([]);
  
  React.useEffect(() => {
    const days = getDaysInMonth(currentMonth, userSettings);
    setCalendarDays(days);
  }, [currentMonth, userSettings]);

  const updateUserSettings = useCallback((newSettings: Partial<UserSettings>) => {
    setUserSettings(prev => ({
      ...prev,
      ...newSettings,
    }));
  }, []);

  const createAppointment = useCallback((
    appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'status'>,
    isSobreturno = false
  ) => {
    const newAppointment: Appointment = {
      ...appointmentData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      status: isSobreturno ? 'sobreturno' : 'pending',
    };
    
    setAppointments(prev => [...prev, newAppointment]);
    
    // Play notification sound when new appointment is created
    if (userSettings.notifications.soundEnabled) {
      playNotificationSound(userSettings);
    }
    
    return newAppointment;
  }, [userSettings]);

  const cancelAppointment = useCallback((id: string) => {
    setAppointments(prev => 
      prev.map(app => app.id === id ? { ...app, status: 'cancelled' } : app)
    );
  }, []);

  return (
    <AppointmentContext.Provider
      value={{
        currentMonth,
        calendarDays,
        appointments,
        userSettings,
        selectedDay,
        showSobreturnoForm,
        setCurrentMonth,
        setSelectedDay,
        setShowSobreturnoForm,
        updateUserSettings,
        createAppointment,
        cancelAppointment,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
};

export const useAppointments = (): AppointmentContextType => {
  const context = useContext(AppointmentContext);
  if (context === undefined) {
    throw new Error('useAppointments must be used within an AppointmentProvider');
  }
  return context;
};