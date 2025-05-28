import React, { useEffect } from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import Logo from '@/assets/images/logo';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';

export default function SplashScreen() {
  const { user, isLoading } = useAuth();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  useEffect(() => {
    const checkAuthAndNavigate = async () => {
      // Wait for auth state to be determined
      if (!isLoading) {
        // Wait for a short time to show the splash screen
        setTimeout(() => {
          if (user) {
            // User is authenticated, go to main app
            router.replace('/(tabs)');
          } else {
            // User is not authenticated, go to onboarding
            router.replace('/onboarding');
          }
        }, 2000);
      }
    };

    checkAuthAndNavigate();
  }, [isLoading, user]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Logo width={160} height={160} />
      <Text style={[styles.title, { color: colors.text }]}>PLANET X</Text>
      <Text style={[styles.subtitle, { color: colors.grayDark }]}>
        Every Space for every Need
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginTop: 8,
  },
});