import React, { memo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Routine } from '../screens/DashboardScreen';
import { dashboardStyles } from '../styles/dashboard.styles';

interface RoutineItemProps {
  routine: Routine;
  onToggleCompletion: (routineId: string) => void;
  onPress: (routine: Routine) => void;
}

const RoutineItem: React.FC<RoutineItemProps> = ({
  routine,
  onToggleCompletion,
  onPress,
}) => {
  // Animation value for completion state
  const scaleValue = React.useRef(new Animated.Value(1)).current;

  // Handle checkbox press with animation
  const handleCheckboxPress = () => {
    // Animate scale down and up
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    onToggleCompletion(routine.id);
  };

  // Handle item press
  const handleItemPress = () => {
    onPress(routine);
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return '#ff4444';
      case 'medium':
        return '#ff8800';
      case 'low':
        return '#00aa00';
      default:
        return '#666';
    }
  };

  // Get priority icon
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'arrow-up-circle';
      case 'medium':
        return 'remove-circle';
      case 'low':
        return 'arrow-down-circle';
      default:
        return 'remove-circle';
    }
  };

  // Format completion time
  const getCompletionTime = () => {
    if (!routine.completedAt) return '';
    const time = new Date(routine.completedAt);
    return `Completed at ${time.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })}`;
  };

  return (
    <Animated.View style={[
      dashboardStyles.routineItem,
      routine.isCompleted && dashboardStyles.completedRoutineItem,
      { transform: [{ scale: scaleValue }] }
    ]}>
      {/* Checkbox */}
      <Pressable
        onPress={handleCheckboxPress}
        style={dashboardStyles.checkboxContainer}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: routine.isCompleted }}
        accessibilityLabel={`Mark ${routine.title} as ${routine.isCompleted ? 'incomplete' : 'complete'}`}
      >
        <View style={[
          dashboardStyles.checkbox,
          routine.isCompleted && dashboardStyles.checkedCheckbox
        ]}>
          {routine.isCompleted && (
            <Ionicons name="checkmark" size={16} color="#fff" />
          )}
        </View>
      </Pressable>

      {/* Content */}
      <TouchableOpacity
        style={dashboardStyles.routineContent}
        onPress={handleItemPress}
        activeOpacity={0.7}
      >
        <View style={dashboardStyles.routineHeader}>
          <Text style={[
            dashboardStyles.routineTitle,
            routine.isCompleted && dashboardStyles.completedRoutineTitle
          ]}>
            {routine.title}
          </Text>
          
          {/* Priority Indicator */}
          <View style={dashboardStyles.priorityContainer}>
            <Ionicons
              name={getPriorityIcon(routine.priority)}
              size={16}
              color={getPriorityColor(routine.priority)}
            />
          </View>
        </View>

        {/* Description */}
        {routine.description && (
          <Text style={[
            dashboardStyles.routineDescription,
            routine.isCompleted && dashboardStyles.completedRoutineDescription
          ]}>
            {routine.description}
          </Text>
        )}

        {/* Category and Completion Info */}
        <View style={dashboardStyles.routineFooter}>
          {routine.category && (
            <View style={dashboardStyles.categoryBadge}>
              <Text style={dashboardStyles.categoryText}>
                {routine.category}
              </Text>
            </View>
          )}
          
          {routine.isCompleted && routine.completedAt && (
            <Text style={dashboardStyles.completionTime}>
              {getCompletionTime()}
            </Text>
          )}
        </View>
      </TouchableOpacity>

      {/* Action Button */}
      <TouchableOpacity
        style={dashboardStyles.actionButton}
        onPress={handleItemPress}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        accessibilityLabel={`View details for ${routine.title}`}
      >
        <Ionicons name="chevron-forward" size={20} color="#ccc" />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default memo(RoutineItem);