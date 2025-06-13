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
import Button from '@/components/ui/Button';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export default function OnboardingScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  const handleSkip = () => {
    router.replace('/auth/login');
  };

  const handleNext = () => {
    router.replace('/auth/login');
  };

  return (
    <SafeAreaProvider>
      <ImageBackground
        source={{
          uri: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg',
        }}
        style={styles.background}
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={handleSkip}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>Discover the Best Neighborhoods</Text>
            <Text style={styles.description}>
              Explore a vast selection of properties tailored to your
              preferences. Whether you're buying, selling, or renting, we've got
              you covered!
            </Text>
          </View>

          <View style={styles.footer}>
            <Button
              title="Next"
              onPress={handleNext}
              size="large"
              style={styles.button}
            />
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
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    alignItems: 'flex-start',
  },
  skipText: {
    fontSize: 16,
    color: 'white',
    fontFamily: 'Inter-Medium',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: 'white',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: 'white',
    lineHeight: 24,
  },
  footer: {
    padding: 20,
  },
  button: {
    alignSelf: 'flex-end',
  },
});
