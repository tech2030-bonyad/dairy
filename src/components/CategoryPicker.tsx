import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formStyles } from '../styles/form.styles';
import { ROUTINE_CATEGORIES, RoutineCategory } from '../types/routine';

interface CategoryPickerProps {
  value: string;
  onCategoryChange: (category: string) => void;
  label: string;
  error?: string;
  required?: boolean;
}

/**
 * CategoryPicker component for selecting routine category
 * Displays a modal with list of available categories
 */
export const CategoryPicker: React.FC<CategoryPickerProps> = ({
  value,
  onCategoryChange,
  label,
  error,
  required = false,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  /**
   * Handles category selection
   */
  const handleCategorySelect = (category: string) => {
    onCategoryChange(category);
    setModalVisible(false);
  };

  /**
   * Opens the category selection modal
   */
  const openModal = () => {
    setModalVisible(true);
  };

  /**
   * Closes the category selection modal
   */
  const closeModal = () => {
    setModalVisible(false);
  };

  /**
   * Renders individual category item
   */
  const renderCategoryItem = ({ item }: { item: RoutineCategory }) => {
    const isSelected = item === value;
    
    return (
      <TouchableOpacity
        style={[
          formStyles.categoryItem,
          isSelected && formStyles.categoryItemSelected,
        ]}
        onPress={() => handleCategorySelect(item)}
        accessibilityLabel={`Select ${item} category`}
        accessibilityState={{ selected: isSelected }}
      >
        <Text
          style={[
            formStyles.categoryItemText,
            isSelected && formStyles.categoryItemTextSelected,
          ]}
        >
          {item}
        </Text>
      </TouchableOpacity>
    );
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
          onPress={openModal}
          accessibilityLabel={`Select ${label.toLowerCase()}`}
          accessibilityHint="Opens category selection modal"
        >
          <Text
            style={[
              formStyles.pickerButtonText,
              !value && formStyles.pickerPlaceholder,
            ]}
          >
            {value || 'Select category'}
          </Text>
          <Ionicons
            name="chevron-down"
            size={20}
            color="#6c757d"
            style={formStyles.pickerIcon}
          />
        </TouchableOpacity>
      </View>

      {error && <Text style={formStyles.errorText}>{error}</Text>}

      {/* Category Selection Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <TouchableOpacity
          style={formStyles.modalOverlay}
          activeOpacity={1}
          onPress={closeModal}
        >
          <TouchableOpacity
            style={formStyles.modalContent}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={formStyles.modalHeader}>
              <Text style={formStyles.modalTitle}>Select Category</Text>
              <TouchableOpacity
                style={formStyles.modalCloseButton}
                onPress={closeModal}
                accessibilityLabel="Close category picker"
              >
                <Ionicons name="close" size={24} color="#6c757d" />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={ROUTINE_CATEGORIES}
              renderItem={renderCategoryItem}
              keyExtractor={(item) => item}
              style={formStyles.categoryList}
              showsVerticalScrollIndicator={false}
              bounces={false}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};