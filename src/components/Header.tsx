import React from 'react';
import { View, Text, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { dashboardStyles } from '../styles/dashboard.styles';

interface HeaderProps {
  title: string;
  showDate?: boolean;
  completedCount?: number;
  totalCount?: number;
  subtitle?: string;
}

const Header: React.FC<HeaderProps> = ({
  title,
  showDate = true,
  completedCount = 0,
  totalCount = 0,
  subtitle,
}) => {
  // Get current date formatted
  const getCurrentDate = (): string => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return today.toLocaleDateString('en-US', options);
  };

  // Get greeting based on time of day
  const getGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Calculate completion percentage
  const getCompletionPercentage = (): number => {
    if (totalCount === 0) return 0;
    return Math.round((completedCount / totalCount) * 100);
  };

  // Get progress color based on completion percentage
  const getProgressColor = (): string => {
    const percentage = getCompletionPercentage();
    if (percentage >= 80) return '#00aa00';
    if (percentage >= 50) return '#ff8800';
    return '#ff4444';
  };

  return (
    <View style={dashboardStyles.header}>
      {/* Status bar spacing for Android */}
      {Platform.OS === 'android' && (
        <View style={{ height: StatusBar.currentHeight }} />
      )}

      {/* Main Header Content */}
      <View style={dashboardStyles.headerContent}>
        {/* Greeting and Date */}
        <View style={dashboardStyles.headerLeft}>
          <Text style={dashboardStyles.greeting}>
            {getGreeting()}! 👋
          </Text>
          
          {showDate && (
            <Text style={dashboardStyles.date}>
              {getCurrentDate()}
            </Text>
          )}
          
          {subtitle && (
            <Text style={dashboardStyles.subtitle}>
              {subtitle}
            </Text>
          )}
        </View>

        {/* Progress Indicator */}
        {totalCount > 0 && (
          <View style={dashboardStyles.progressContainer}>
            <View style={dashboardStyles.progressInfo}>
              <Text style={dashboardStyles.progressText}>
                {completedCount}/{totalCount}
              </Text>
              <Text style={dashboardStyles.progressPercentage}>
                {getCompletionPercentage()}%
              </Text>
            </View>
            
            {/* Circular Progress Indicator */}
            <View style={dashboardStyles.circularProgress}>
              <View style={[
                dashboardStyles.progressCircle,
                { borderColor: getProgressColor() }
              ]}>
                <Ionicons
                  name={getCompletionPercentage() === 100 ? "checkmark" : "time-outline"}
                  size={16}
                  color={getProgressColor()}
                />
              </View>
            </View>
          </View>
        )}
      </View>

      {/* Title Section */}
      <View style={dashboardStyles.titleSection}>
        <Text style={dashboardStyles.headerTitle}>
          {title}
        </Text>
        
        {totalCount > 0 && (
          <View style={dashboardStyles.progressBar}>
            <View style={dashboardStyles.progressBarBackground}>
              <View style={[
                dashboardStyles.progressBarFill,
                {
                  width: `${getCompletionPercentage()}%`,
                  backgroundColor: getProgressColor(),
                }
              ]} />
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default Header;