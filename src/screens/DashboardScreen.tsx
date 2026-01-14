import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

import Header from '../components/Header';
import RoutineItem from '../components/RoutineItem';
import { dashboardStyles } from '../styles/dashboard.styles';

// TypeScript interfaces
export interface Routine {
  id: string;
  title: string;
  description?: string;
  isCompleted: boolean;
  completedAt?: Date;
  createdAt: Date;
  category?: string;
  priority: 'low' | 'medium' | 'high';
}

interface DashboardScreenProps {
  navigation: any;
}

// Storage keys
const STORAGE_KEYS = {
  ROUTINES: '@routines',
  COMPLETED_ROUTINES: '@completed_routines',
} as const;

const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  // State management
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load routines from AsyncStorage
  const loadRoutines = useCallback(async () => {
    try {
      setError(null);
      const storedRoutines = await AsyncStorage.getItem(STORAGE_KEYS.ROUTINES);
      
      if (storedRoutines) {
        const parsedRoutines: Routine[] = JSON.parse(storedRoutines);
        // Sort by priority and creation date
        const sortedRoutines = parsedRoutines.sort((a, b) => {
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
            return priorityOrder[b.priority] - priorityOrder[a.priority];
          }
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        });
        setRoutines(sortedRoutines);
      } else {
        // Set placeholder routines for demo purposes
        setRoutines(getPlaceholderRoutines());
      }
    } catch (err) {
      console.error('Error loading routines:', err);
      setError('Failed to load routines. Please try again.');
      // Fallback to placeholder data
      setRoutines(getPlaceholderRoutines());
    } finally {
      setLoading(false);
    }
  }, []);

  // Save routines to AsyncStorage
  const saveRoutines = async (updatedRoutines: Routine[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ROUTINES, JSON.stringify(updatedRoutines));
    } catch (err) {
      console.error('Error saving routines:', err);
      Alert.alert('Error', 'Failed to save routine changes.');
    }
  };

  // Toggle routine completion status
  const toggleRoutineCompletion = useCallback(async (routineId: string) => {
    try {
      const updatedRoutines = routines.map(routine => {
        if (routine.id === routineId) {
          const isCompleted = !routine.isCompleted;
          return {
            ...routine,
            isCompleted,
            completedAt: isCompleted ? new Date() : undefined,
          };
        }
        return routine;
      });

      setRoutines(updatedRoutines);
      await saveRoutines(updatedRoutines);
    } catch (err) {
      console.error('Error toggling routine completion:', err);
      Alert.alert('Error', 'Failed to update routine status.');
    }
  }, [routines]);

  // Handle pull-to-refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadRoutines();
    setRefreshing(false);
  }, [loadRoutines]);

  // Navigate to add routine screen
  const handleAddRoutine = () => {
    navigation.navigate('AddRoutine');
  };

  // Handle routine item press (navigate to details)
  const handleRoutinePress = (routine: Routine) => {
    navigation.navigate('RoutineDetails', { routine });
  };

  // Load routines when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadRoutines();
    }, [loadRoutines])
  );

  // Render individual routine item
  const renderRoutineItem = ({ item }: { item: Routine }) => (
    <RoutineItem
      routine={item}
      onToggleCompletion={toggleRoutineCompletion}
      onPress={handleRoutinePress}
    />
  );

  // Get item key for FlatList optimization
  const getItemKey = (item: Routine) => item.id;

  // Empty state component
  const renderEmptyState = () => (
    <View style={dashboardStyles.emptyState}>
      <Ionicons name="calendar-outline" size={64} color="#ccc" />
      <View style={dashboardStyles.emptyStateText}>
        No routines for today. Tap the + button to add your first routine!
      </View>
    </View>
  );

  return (
    <SafeAreaView style={dashboardStyles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header Component */}
      <Header 
        title="Today's Routines"
        showDate={true}
        completedCount={routines.filter(r => r.isCompleted).length}
        totalCount={routines.length}
      />

      {/* Main Content */}
      <View style={dashboardStyles.content}>
        {error && (
          <View style={dashboardStyles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={20} color="#ff4444" />
            <View style={dashboardStyles.errorText}>{error}</View>
          </View>
        )}

        <FlatList
          data={routines}
          renderItem={renderRoutineItem}
          keyExtractor={getItemKey}
          contentContainerStyle={[
            dashboardStyles.listContainer,
            routines.length === 0 && dashboardStyles.emptyListContainer
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#007AFF']}
              tintColor="#007AFF"
            />
          }
          ListEmptyComponent={!loading ? renderEmptyState : null}
          ItemSeparatorComponent={() => <View style={dashboardStyles.separator} />}
          initialNumToRender={10}
          maxToRenderPerBatch={5}
          windowSize={10}
          removeClippedSubviews={true}
        />
      </View>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={dashboardStyles.fab}
        onPress={handleAddRoutine}
        activeOpacity={0.8}
        accessibilityLabel="Add new routine"
        accessibilityRole="button"
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

// Placeholder routines for demo purposes
const getPlaceholderRoutines = (): Routine[] => [
  {
    id: '1',
    title: 'Morning Meditation',
    description: '10 minutes of mindfulness meditation',
    isCompleted: false,
    createdAt: new Date(),
    category: 'Wellness',
    priority: 'high',
  },
  {
    id: '2',
    title: 'Drink Water',
    description: 'Have a glass of water to start the day',
    isCompleted: true,
    completedAt: new Date(),
    createdAt: new Date(),
    category: 'Health',
    priority: 'medium',
  },
  {
    id: '3',
    title: 'Review Daily Goals',
    description: 'Check and prioritize today\'s objectives',
    isCompleted: false,
    createdAt: new Date(),
    category: 'Productivity',
    priority: 'high',
  },
  {
    id: '4',
    title: 'Exercise',
    description: '30 minutes of physical activity',
    isCompleted: false,
    createdAt: new Date(),
    category: 'Fitness',
    priority: 'medium',
  },
];

export default DashboardScreen;