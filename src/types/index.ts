export interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

export interface AppointmentDay {
  date: Date;
  slots: TimeSlot[];
  isDisabled: boolean;
}

export interface Message {
  id: string;
  text: string;
  time: string;
  isUser: boolean;
  sentAt: Date;
  readAt?: Date;
}

export interface Appointment {
  id: string;
  date: Date;
  timeSlot: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'sobreturno';
  notes?: string;
  createdAt: Date;
}

export interface UserSettings {
  workDays: number[]; // 0-6, where 0 is Sunday
  workHours: {
    start: string; // Format: "HH:MM"
    end: string; // Format: "HH:MM"
  };
  slotDuration: number; // in minutes
  breakTime: {
    start: string; // Format: "HH:MM"
    end: string; // Format: "HH:MM"
  };
  whatsappNumber: string;
  whatsappApiKey?: string;
  profession: string;
  specialization: string;
  notifications: {
    confirmationEnabled: boolean;
    reminderEnabled: boolean;
    reminderHoursBefore: number;
    soundEnabled: boolean;
    notificationSound: 'default' | 'chime' | 'bell' | 'ding';
  };
}

export type ThemeMode = 'light' | 'dark';