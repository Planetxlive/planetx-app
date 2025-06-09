import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { AuthProvider } from '@/context/AuthContext';
import { PropertyProvider } from '@/context/PropertyContext';
import { BlogProvider } from '@/context/BlogContext';
import { SplashScreen } from 'expo-router';
import { GymProvider } from '@/context/GymContext';
import { ParkingProvider } from '@/context/ParkingContext';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();

  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      // Hide the splash screen once fonts are loaded
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // If fonts are not loaded and there's no error, return null to keep the splash screen
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <AuthProvider>
      <PropertyProvider>
        <BlogProvider>
          <ParkingProvider>
        <GymProvider>
          <>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="auto" />
          </>
          </GymProvider>
          </ParkingProvider>
        </BlogProvider>
      </PropertyProvider>
    </AuthProvider>
  );
}