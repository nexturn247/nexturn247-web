import { z } from 'zod';

export const appointmentSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  phone: z.string().regex(/^\+?[0-9]{8,15}$/, 'Ingresa un número de teléfono válido'),
  email: z.string().email('Ingresa un correo electrónico válido').optional().or(z.literal('')),
  date: z.string().min(1, 'La fecha es requerida'),
  time: z.string().min(1, 'La hora es requerida'),
  notes: z.string().optional(),
});

export const userSettingsSchema = z.object({
  workDays: z.array(z.number().min(0).max(6)),
  workHours: z.object({
    start: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    end: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  }),
  slotDuration: z.number().min(15).max(120),
  breakTime: z.object({
    start: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    end: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  }),
  whatsappNumber: z.string().regex(/^\+?[0-9]{8,15}$/).optional(),
  whatsappApiKey: z.string().optional(),
  profession: z.string().min(2),
  specialization: z.string().min(2),
  notifications: z.object({
    confirmationEnabled: z.boolean(),
    reminderEnabled: z.boolean(),
    reminderHoursBefore: z.number().min(1).max(72),
  }),
});

export type AppointmentFormData = z.infer<typeof appointmentSchema>;
export type UserSettingsData = z.infer<typeof userSettingsSchema>;