// ─────────────────────────────────────────────────────────────────────
// MARKETERO — Esquema de validación Zod para el formulario de cotización
// Centralizado aquí para reutilizarse en backend/CRM en el futuro.
// ─────────────────────────────────────────────────────────────────────
import { z } from 'zod';

export const quoteSchema = z.object({
  nombre: z
    .string()
    .min(3, 'Mínimo 3 caracteres.')
    .max(80, 'Máximo 80 caracteres.')
    .transform(v => v.replace(/<[^>]*>/g, '').replace(/\s\s+/g, ' ').trim()),

  empresa: z
    .string()
    .min(2, 'Mínimo 2 caracteres.')
    .max(120, 'Máximo 120 caracteres.')
    .transform(v => v.replace(/<[^>]*>/g, '').replace(/\s\s+/g, ' ').trim()),

  correo: z
    .string()
    .email('Formato de correo inválido.')
    .max(120, 'Máximo 120 caracteres.')
    .transform(v => v.trim().toLowerCase()),

  telefono: z
    .string()
    .min(7, 'Teléfono inválido.')
    .max(20, 'Teléfono demasiado largo.'),

  pais: z
    .string()
    .min(2, 'Selecciona un país.'),

  estado: z
    .string()
    .min(1, 'Selecciona un estado.'),

  ciudad: z
    .string()
    .min(1, 'Selecciona una ciudad.'),

  giro: z
    .string()
    .min(1, 'Selecciona el giro de tu empresa.'),

  mensaje: z
    .string()
    .max(800, 'Máximo 800 caracteres.')
    .optional()
    .transform(v => v ? v.replace(/<[^>]*>/g, '').replace(/\s\s+/g, ' ').trim() : ''),

  // Honeypot — debe estar vacío siempre
  website: z.string().max(0, 'Spam detectado.').optional(),
});
