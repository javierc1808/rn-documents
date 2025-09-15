import { DarkTheme, DefaultTheme } from "@react-navigation/native";
import { useColorScheme } from "react-native";

export const useTheme = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const baseTheme = isDark ? DarkTheme : DefaultTheme;

  return {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      // Custom colors for the application
      card: isDark ? '#1C1C1E' : '#FFFFFF',
      text: isDark ? '#FFFFFF' : '#000000',
      textSecondary: isDark ? '#8E8E93' : '#6D6D70',
      textTertiary: isDark ? '#8E8E93' : '#999999',
      border: isDark ? '#38383A' : '#E5E5EA',
      borderLight: isDark ? '#2C2C2E' : '#F2F2F7',
      backgroundSecondary: isDark ? '#2C2C2E' : '#F2F2F7',
      backgroundTertiary: isDark ? '#1C1C1E' : '#FFFFFF',
      primary: '#007AFF',
      primaryDisabled: isDark ? '#4A4A4A' : '#C7C7CC',
      error: '#FF3B30',
      success: '#34C759',
      warning: '#FF9500',
      icon: isDark ? '#8E8E93' : '#6D6D70',
      placeholder: isDark ? '#8E8E93' : '#999999',
    },
    isDark,
  };
};