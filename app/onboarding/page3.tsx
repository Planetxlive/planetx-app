import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { storage } from '@/utils/storage';

const { width, height } = Dimensions.get('window');

export default function OnboardingPage3() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  const handleGetStarted = async () => {
    await storage.setOnboardingCompleted();
    router.replace('/auth/login');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaProvider>
      <ImageBackground
        source={{
          uri: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg',
        }}
        style={styles.background}
      >
        <View style={styles.overlay} />
        <SafeAreaView style={styles.container}>
          <View style={styles.contentContainer}>
            <View style={styles.content}>
              <Text style={styles.title}>Connect with Property Owners</Text>
              <Text style={styles.description}>
                Chat directly with property owners, schedule viewings, and make
                informed decisions. Our platform makes communication seamless and
                efficient.
              </Text>
            </View>

            <View style={styles.footer}>
              <View style={styles.buttonGroup}>
                <TouchableOpacity 
                  style={[styles.button, styles.backButton]} 
                  onPress={handleBack}
                >
                  <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.button, styles.nextButton]}
                  onPress={handleGetStarted}
                >
                  <Text style={styles.nextButtonText}>Get Started</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width,
    height,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 50,
  },
  content: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: 'white',
    marginBottom: 8,
    textAlign: 'left',
  },
  description: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    color: 'white',
    lineHeight: 22,
    textAlign: 'left',
  },
  footer: {
    paddingHorizontal: 24,
    marginTop: 20,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  nextButton: {
    backgroundColor: '#7C3AED',
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
}); 