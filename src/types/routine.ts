// Type definitions for routine-related data structures
export interface Routine {
  id: string;
  name: string;
  description: string;
  time: string; // Format: "HH:MM"
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface RoutineFormData {
  name: string;
  description: string;
  time: string;
  category: string;
}

export interface ValidationErrors {
  name?: string;
  description?: string;
  time?: string;
  category?: string;
}

export const ROUTINE_CATEGORIES = [
  'Morning',
  'Afternoon',
  'Evening',
  'Night',
  'Exercise',
  'Work',
  'Health',
  'Personal',
  'Study',
  'Other'
] as const;

export type RoutineCategory = typeof ROUTINE_CATEGORIES[number];