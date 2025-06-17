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

export default function OnboardingPage1() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  const handleSkip = async () => {
    await storage.setOnboardingCompleted();
    router.replace('/auth/login');
  };

  const handleNext = () => {
    router.push('/onboarding/page2');
  };

  return (
    <SafeAreaProvider>
      <ImageBackground
        source={{
          uri: 'https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg',
        }}
        style={styles.background}
      >
        <View style={styles.overlay} />
        <SafeAreaView style={styles.container}>
          <View style={styles.contentContainer}>
            <View style={styles.content}>
              <Text style={styles.title}>Keep Track of What You Love</Text>
              <Text style={styles.description}>
                Easily save your favorite listings and access them anytime. Create a
                personalized shortlist of homes that catch your eye!
              </Text>
            </View>

            <View style={styles.footer}>
              <TouchableOpacity onPress={handleSkip}>
                <Text style={styles.skipText}>Skip</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.nextButton}
                onPress={handleNext}
              >
                <Text style={styles.nextButtonText}>Next</Text>
              </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 20,
  },
  skipText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: 'white',
  },
  nextButton: {
    backgroundColor: '#7C3AED',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
}); 