import { RoutineFormData, ValidationErrors } from '../types/routine';

/**
 * Validates routine form data and returns validation errors
 * @param formData - The form data to validate
 * @returns Object containing validation errors, if any
 */
export const validateRoutineForm = (formData: RoutineFormData): ValidationErrors => {
  const errors: ValidationErrors = {};

  // Validate routine name
  if (!formData.name.trim()) {
    errors.name = 'Routine name is required';
  } else if (formData.name.trim().length < 2) {
    errors.name = 'Routine name must be at least 2 characters';
  } else if (formData.name.trim().length > 50) {
    errors.name = 'Routine name must be less than 50 characters';
  }

  // Validate description
  if (!formData.description.trim()) {
    errors.description = 'Description is required';
  } else if (formData.description.trim().length < 5) {
    errors.description = 'Description must be at least 5 characters';
  } else if (formData.description.trim().length > 200) {
    errors.description = 'Description must be less than 200 characters';
  }

  // Validate time
  if (!formData.time) {
    errors.time = 'Time is required';
  } else if (!isValidTimeFormat(formData.time)) {
    errors.time = 'Invalid time format';
  }

  // Validate category
  if (!formData.category) {
    errors.category = 'Category is required';
  }

  return errors;
};

/**
 * Checks if the provided time string is in valid HH:MM format
 * @param time - Time string to validate
 * @returns Boolean indicating if time format is valid
 */
export const isValidTimeFormat = (time: string): boolean => {
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
};

/**
 * Formats time from Date object to HH:MM string
 * @param date - Date object containing time
 * @returns Formatted time string
 */
export const formatTime = (date: Date): string => {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

/**
 * Parses time string to create Date object for today
 * @param timeString - Time in HH:MM format
 * @returns Date object with today's date and specified time
 */
export const parseTimeString = (timeString: string): Date => {
  const [hours, minutes] = timeString.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
};