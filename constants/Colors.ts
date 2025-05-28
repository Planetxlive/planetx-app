const tintColorLight = '#7C3AED';
const tintColorDark = '#9168FB';

export default {
  light: {
    text: '#000000',
    background: '#FFFFFF',
    tint: tintColorLight,
    tabIconDefault: '#CCC',
    tabIconSelected: tintColorLight,
    primaryColor: '#7C3AED', // Main purple color
    secondaryColor: '#9ACD32', // Green accent
    accentColor: '#FF6B6B', // Soft red for accents
    successColor: '#10B981', // Green for success states
    warningColor: '#F59E0B', // Amber for warnings
    errorColor: '#EF4444', // Red for errors
    grayLight: '#F3F4F6',
    grayMedium: '#D1D5DB',
    grayDark: '#6B7280',
    cardBackground: '#FFFFFF',
    inputBackground: '#F9FAFB',
    divider: '#E5E7EB',
    shadow: 'rgba(0, 0, 0, 0.1)',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  dark: {
    text: '#FFFFFF',
    background: '#121212',
    tint: tintColorDark,
    tabIconDefault: '#999',
    tabIconSelected: tintColorDark,
    primaryColor: '#9168FB', // Lighter purple for dark mode
    secondaryColor: '#B5E361', // Lighter green for dark mode
    accentColor: '#FF8A8A', // Lighter red for dark mode
    successColor: '#34D399', // Lighter green for success
    warningColor: '#FBBF24', // Lighter amber for warnings
    errorColor: '#F87171', // Lighter red for errors
    grayLight: '#374151',
    grayMedium: '#4B5563',
    grayDark: '#9CA3AF',
    cardBackground: '#1F2937',
    inputBackground: '#374151',
    divider: '#4B5563',
    shadow: 'rgba(0, 0, 0, 0.3)',
    overlay: 'rgba(0, 0, 0, 0.7)',
  },
};