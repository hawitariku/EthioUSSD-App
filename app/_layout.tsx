import React, { useState } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { AuthScreen } from '../src/screens/AuthScreen';
import { OnboardingScreen } from '../src/screens/OnboardingScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useEffect } from 'react';
import { loadLanguage } from '../src/i18n/translations';
import { checkForUpdates } from '../src/utils/updateChecker';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isOnboarded, setIsOnboarded] = useState<boolean | null>(null);
  const [isI18nReady, setIsI18nReady] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      // Load i18n first
      await loadLanguage();
      setIsI18nReady(true);

      // Then check onboarding status
      const val = await AsyncStorage.getItem('has_onboarded');
      setIsOnboarded(val === 'true');

      // Check for updates silently in background (after 2 seconds delay)
      setTimeout(() => {
        checkForUpdates(false, true); // Auto check, silent mode
      }, 2000);
    };

    initialize();
  }, []);

  const completeOnboarding = async () => {
    await AsyncStorage.setItem('has_onboarded', 'true');
    setIsOnboarded(true);
  };

  // Wait for i18n and storage to initialize
  if (!isI18nReady || isOnboarded === null) return null;

  if (!isOnboarded) {
    return <OnboardingScreen onComplete={completeOnboarding} />;
  }

  if (!isAuthenticated) {
    return <AuthScreen onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
