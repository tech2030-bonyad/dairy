import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { formStyles } from '../styles/form.styles';
import { formatTime, parseTimeString } from '../utils/validation';

interface TimePickerProps {
  value: string; // Time in HH:MM format
  onTimeChange: (time: string) => void;
  label: string;
  error?: string;
  required?: boolean;
}

/**
 * TimePicker component for selecting time in routine form
 * Handles platform-specific time picker implementations
 */
export const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onTimeChange,
  label,
  error,
  required = false,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    if (value) {
      return parseTimeString(value);
    }
    return new Date();
  });

  /**
   * Handles time selection from the picker
   */
  const handleTimeChange = (event: any, selectedTime?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }

    if (selectedTime) {
      setSelectedDate(selectedTime);
      const timeString = formatTime(selectedTime);
      onTimeChange(timeString);
    }
  };

  /**
   * Shows the time picker
   */
  const showTimePicker = () => {
    if (Platform.OS === 'ios') {
      // For iOS, we'll show an alert with the picker
      setShowPicker(true);
    } else {
      // For Android, the picker shows immediately
      setShowPicker(true);
    }
  };

  /**
   * Handles iOS picker confirmation
   */
  const handleIOSConfirm = () => {
    setShowPicker(false);
    const timeString = formatTime(selectedDate);
    onTimeChange(timeString);
  };

  /**
   * Handles iOS picker cancellation
   */
  const handleIOSCancel = () => {
    setShowPicker(false);
    // Reset to previous value
    if (value) {
      setSelectedDate(parseTimeString(value));
    }
  };

  return (
    <View style={formStyles.fieldContainer}>
      <Text style={formStyles.label}>
        {label}
        {required && <Text style={formStyles.requiredAsterisk}> *</Text>}
      </Text>
      
      <View
        style={[
          formStyles.pickerContainer,
          error && formStyles.pickerContainerError,
        ]}
      >
        <TouchableOpacity
          style={formStyles.pickerButton}
          onPress={showTimePicker}
          accessibilityLabel={`Select ${label.toLowerCase()}`}
          accessibilityHint="Opens time picker"
        >
          <View style={formStyles.timePickerContainer}>
            <Text
              style={[
                formStyles.timeDisplay,
                !value && formStyles.pickerPlaceholder,
              ]}
            >
              {value || 'Select time'}
            </Text>
            <TouchableOpacity
              style={formStyles.timeButton}
              onPress={showTimePicker}
            >
              <Text style={formStyles.timeButtonText}>Change</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </View>

      {error && <Text style={formStyles.errorText}>{error}</Text>}

      {/* Time Picker for Android */}
      {showPicker && Platform.OS === 'android' && (
        <DateTimePicker
          value={selectedDate}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={handleTimeChange}
        />
      )}

      {/* Time Picker for iOS */}
      {showPicker && Platform.OS === 'ios' && (
        <View style={formStyles.modalOverlay}>
          <View style={formStyles.modalContent}>
            <View style={formStyles.modalHeader}>
              <TouchableOpacity onPress={handleIOSCancel}>
                <Text style={formStyles.headerButtonText}>Cancel</Text>
              </TouchableOpacity>
              <Text style={formStyles.modalTitle}>Select Time</Text>
              <TouchableOpacity onPress={handleIOSConfirm}>
                <Text style={formStyles.headerButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
            <DateTimePicker
              value={selectedDate}
              mode="time"
              is24Hour={true}
              display="spinner"
              onChange={(event, selectedTime) => {
                if (selectedTime) {
                  setSelectedDate(selectedTime);
                }
              }}
              style={{ height: 200 }}
            />
          </View>
        </View>
      )}
    </View>
  );
};