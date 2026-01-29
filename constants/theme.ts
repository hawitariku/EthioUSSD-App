/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    primary: '#2563EB',       // Blue 600
    text: '#0F172A',          // Slate 900
    textSecondary: '#64748B', // Slate 500
    background: '#F8FAFC',    // Slate 50
    card: '#FFFFFF',
    tint: '#2563EB',
    icon: '#64748B',
    border: '#E2E8F0',        // Slate 200
    success: '#10B981',
    error: '#EF4444',
    tabIconDefault: '#94A3B8',
    tabIconSelected: '#2563EB',
    inputBackground: '#F1F5F9',
  },
  dark: {
    primary: '#3B82F6',       // Blue 500
    text: '#F8FAFC',          // Slate 50
    textSecondary: '#94A3B8', // Slate 400
    background: '#0F172A',    // Slate 900
    card: '#1E293B',          // Slate 800
    tint: '#3B82F6',
    icon: '#94A3B8',
    border: '#334155',        // Slate 700
    success: '#34D399',
    error: '#F87171',
    tabIconDefault: '#64748B',
    tabIconSelected: '#3B82F6',
    inputBackground: '#1E293B',
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 8,
  md: 16,
  lg: 24,
  full: 9999,
};

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 10,
  },
};

export const Fonts = {
  regular: Platform.select({ ios: 'System', android: 'Roboto', default: 'sans-serif' }),
  bold: Platform.select({ ios: 'System', android: 'Roboto', default: 'sans-serif-bold' }),
  medium: Platform.select({ ios: 'System', android: 'Roboto', default: 'sans-serif-medium' }),
  // Keep existing selectors if needed, but 'bold' and 'regular' are what tsc demands
  sans: Platform.select({ ios: 'system-ui', default: 'sans-serif' }),
  serif: Platform.select({ ios: 'ui-serif', default: 'serif' }),
  mono: Platform.select({ ios: 'ui-monospace', default: 'monospace' }),
  rounded: Platform.select({ ios: 'ui-rounded', default: 'sans-serif-rounded' }),
};
