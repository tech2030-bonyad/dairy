import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

export const dashboardStyles = StyleSheet.create({
  // Main Container
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },

  // Header Styles
  header: {
    backgroundColor: '#ffffff',
    paddingBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },

  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 16,
  },

  headerLeft: {
    flex: 1,
  },

  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },

  date: {
    fontSize: 16,
    color: '#666',
    fontWeight: '400',
  },

  subtitle: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },

  titleSection: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },

  // Progress Indicator Styles
  progressContainer: {
    alignItems: 'center',
    marginLeft: 16,
  },

  progressInfo: {
    alignItems: 'center',
    marginBottom: 8,
  },

  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },

  progressPercentage: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },

  circularProgress: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  progressCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },

  progressBar: {
    marginTop: 8,
  },

  progressBarBackground: {
    height: 4,
    backgroundColor: '#e9ecef',
    borderRadius: 2,
    overflow: 'hidden',
  },

  progressBarFill: {
    height: '100%',
    borderRadius: 2,
    minWidth: 4,
  },

  // Content Styles
  content: {
    flex: 1,
    paddingTop: 8,
  },

  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100, // Space for FAB
  },

  emptyListContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },

  separator: {
    height: 12,
  },

  // Error Styles
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffe6e6',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#ff4444',
  },

  errorText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#cc0000',
  },

  // Empty State Styles
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },

  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 24,
  },

  // Routine Item Styles
  routineItem: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },

  completedRoutineItem: {
    backgroundColor: '#f8f9fa',
    opacity: 0.8,
  },

  // Checkbox Styles
  checkboxContainer: {
    marginRight: 16,
  },

  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },

  checkedCheckbox: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },

  // Routine Content Styles
  routineContent: {
    flex: 1,
  },

  routineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },

  routineTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    flex: 1,
    marginRight: 8,
  },

  completedRoutineTitle: {
    textDecorationLine: 'line-through',
    color: '#666',
  },

  routineDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },

  completedRoutineDescription: {
    color: '#999',
  },

  routineFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },

  // Priority Styles
  priorityContainer: {
    marginLeft: 8,
  },

  // Category Styles
  categoryBadge: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },

  categoryText: {
    fontSize: 12,
    color: '#1976d2',
    fontWeight: '500',
  },

  completionTime: {
    fontSize: 12,
    color: '#00aa00',
    fontStyle: 'italic',
  },

  // Action Button Styles
  actionButton: {
    marginLeft: 12,
    padding: 4,
  },

  // Floating Action Button Styles
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },

  // Responsive Design
  '@media (max-width: 375)': {
    headerContent: {
      paddingHorizontal: 16,
    },
    titleSection: {
      paddingHorizontal: 16,
    },
    listContainer: {
      paddingHorizontal: 12,
    },
    routineItem: {
      padding: 12,
    },
    greeting: {
      fontSize: 22,
    },
    headerTitle: {
      fontSize: 18,
    },
  },

  // Platform-specific styles
  ...Platform.select({
    ios: {
      fab: {
        shadowColor: '#007AFF',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
    },
    android: {
      fab: {
        elevation: 8,
      },
      header: {
        elevation: 4,
      },
    },
  }),
});

// Export additional utility functions for dynamic styling
export const getDynamicStyles = {
  // Get responsive font size based on screen width
  getResponsiveFontSize: (baseSize: number): number => {
    const scale = screenWidth / 375; // Base width (iPhone X)
    return Math.round(baseSize * Math.max(scale, 0.85));
  },

  // Get responsive spacing
  getResponsiveSpacing: (baseSpacing: number): number => {
    const scale = screenWidth / 375;
    return Math.round(baseSpacing * Math.max(scale, 0.9));
  },

  // Get theme colors (can be extended for dark mode)
  getThemeColors: (isDarkMode: boolean = false) => ({
    background: isDarkMode ? '#1a1a1a' : '#f8f9fa',
    surface: isDarkMode ? '#2d2d2d' : '#ffffff',
    text: isDarkMode ? '#ffffff' : '#1a1a1a',
    textSecondary: isDarkMode ? '#cccccc' : '#666666',
    border: isDarkMode ? '#404040' : '#f0f0f0',
    primary: '#007AFF',
    success: '#00aa00',
    warning: '#ff8800',
    error: '#ff4444',
  }),
};