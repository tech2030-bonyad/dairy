import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { formStyles } from '../styles/form.styles';
import { TimePicker } from './TimePicker';
import { CategoryPicker } from './CategoryPicker';
import { RoutineFormData, ValidationErrors } from '../types/routine';
import { validateRoutineForm } from '../utils/validation';

interface RoutineFormProps {
  onSave: (formData: RoutineFormData) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<RoutineFormData>;
  isLoading?: boolean;
}

/**
 * RoutineForm component for creating and editing routines
 * Handles form state, validation, and submission
 */
export const RoutineForm: React.FC<RoutineFormProps> = ({
  onSave,
  onCancel,
  initialData,
  isLoading = false,
}) => {
  // Form state
  const [formData, setFormData] = useState<RoutineFormData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    time: initialData?.time || '',
    category: initialData?.category || '',
  });

  // Validation state
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  /**
   * Updates form field value and clears related error
   */
  const updateField = useCallback((field: keyof RoutineFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  /**
   * Marks field as touched for validation display
   */
  const markFieldTouched = useCallback((field: keyof RoutineFormData) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  }, []);

  /**
   * Handles form submission with validation
   */
  const handleSubmit = useCallback(async () => {
    // Validate form
    const validationErrors = validateRoutineForm(formData);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setTouched({
        name: true,
        description: true,
        time: true,
        category: true,
      });
      
      // Show alert for validation errors
      Alert.alert(
        'Validation Error',
        'Please fix the errors in the form before submitting.',
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      await onSave(formData);
    } catch (error) {
      console.error('Error saving routine:', error);
      Alert.alert(
        'Error',
        'Failed to save routine. Please try again.',
        [{ text: 'OK' }]
      );
    }
  }, [formData, onSave]);

  /**
   * Handles cancel action with confirmation if form has changes
   */
  const handleCancel = useCallback(() => {
    const hasChanges = Object.keys(formData).some(key => {
      const field = key as keyof RoutineFormData;
      return formData[field] !== (initialData?.[field] || '');
    });

    if (hasChanges) {
      Alert.alert(
        'Discard Changes',
        'Are you sure you want to discard your changes?',
        [
          { text: 'Keep Editing', style: 'cancel' },
          { text: 'Discard', style: 'destructive', onPress: onCancel },
        ]
      );
    } else {
      onCancel();
    }
  }, [formData, initialData, onCancel]);

  /**
   * Checks if form is valid for submission
   */
  const isFormValid = useCallback(() => {
    const validationErrors = validateRoutineForm(formData);
    return Object.keys(validationErrors).length === 0;
  }, [formData]);

  return (
    <KeyboardAvoidingView
      style={formStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView
        style={formStyles.scrollContainer}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={formStyles.formContainer}>
          {/* Routine Name Field */}
          <View style={formStyles.fieldContainer}>
            <Text style={formStyles.label}>
              Routine Name
              <Text style={formStyles.requiredAsterisk}> *</Text>
            </Text>
            <TextInput
              style={[
                formStyles.input,
                touched.name && errors.name && formStyles.inputError,
              ]}
              value={formData.name}
              onChangeText={(text) => updateField('name', text)}
              onBlur={() => markFieldTouched('name')}
              placeholder="Enter routine name"
              placeholderTextColor="#6c757d"
              maxLength={50}
              returnKeyType="next"
              accessibilityLabel="Routine name input"
              accessibilityHint="Enter a name for your routine"
            />
            {touched.name && errors.name && (
              <Text style={formStyles.errorText}>{errors.name}</Text>
            )}
          </View>

          {/* Description Field */}
          <View style={formStyles.fieldContainer}>
            <Text style={formStyles.label}>
              Description
              <Text style={formStyles.requiredAsterisk}> *</Text>
            </Text>
            <TextInput
              style={[
                formStyles.input,
                formStyles.textArea,
                touched.description && errors.description && formStyles.inputError,
              ]}
              value={formData.description}
              onChangeText={(text) => updateField('description', text)}
              onBlur={() => markFieldTouched('description')}
              placeholder="Describe your routine"
              placeholderTextColor="#6c757d"
              maxLength={200}
              multiline
              numberOfLines={4}
              returnKeyType="done"
              accessibilityLabel="Routine description input"
              accessibilityHint="Enter a description for your routine"
            />
            {touched.description && errors.description && (
              <Text style={formStyles.errorText}>{errors.description}</Text>
            )}
          </View>

          {/* Time Picker */}
          <TimePicker
            value={formData.time}
            onTimeChange={(time) => updateField('time', time)}
            label="Time"
            error={touched.time ? errors.time : undefined}
            required
          />

          {/* Category Picker */}
          <CategoryPicker
            value={formData.category}
            onCategoryChange={(category) => updateField('category', category)}
            label="Category"
            error={touched.category ? errors.category : undefined}
            required
          />

          {/* Action Buttons */}
          <View style={formStyles.buttonContainer}>
            <TouchableOpacity
              style={[formStyles.button, formStyles.secondaryButton]}
              onPress={handleCancel}
              disabled={isLoading}
              accessibilityLabel="Cancel routine creation"
            >
              <Text style={[formStyles.buttonText, formStyles.secondaryButtonText]}>
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                formStyles.button,
                formStyles.primaryButton,
                (!isFormValid() || isLoading) && formStyles.primaryButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={!isFormValid() || isLoading}
              accessibilityLabel="Save routine"
            >
              <Text style={[formStyles.buttonText, formStyles.primaryButtonText]}>
                {isLoading ? 'Saving...' : 'Save Routine'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Loading Overlay */}
      {isLoading && (
        <View style={formStyles.loadingContainer}>
          <View style={formStyles.loadingContent}>
            <ActivityIndicator size="large" color="#007bff" />
            <Text style={formStyles.loadingText}>Saving routine...</Text>
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};