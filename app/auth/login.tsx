import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Logo from '@/assets/images/logo';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';
import { Phone } from 'lucide-react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { storage } from '@/utils/storage';

export default function LoginScreen() {
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme];
  const { signIn } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    checkOnboarding();
  }, []);

  const checkOnboarding = async () => {
    const isCompleted = await storage.isOnboardingCompleted();
    if (!isCompleted) {
      router.replace('/onboarding');
    }
  };

  const handleSendOTP = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      const formattedNumber = phoneNumber.startsWith('+')
        ? phoneNumber
        : `+91${phoneNumber.replace(/\s+/g, '')}`;
      await signIn(formattedNumber);
    } catch (error) {
      setError('Failed to send OTP. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaProvider>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[styles.container, { backgroundColor: colors.background }]}>  
            <View style={styles.centerContent}>
              <View style={styles.logoContainer}>
                <View style={[styles.logoCircle, { backgroundColor: colors.grayLight }]}>  
                  <Logo width={160} height={160} />
                </View>
                <Text style={[styles.title, { color: colors.text }]}>Login</Text>
                <Text style={[styles.subtitle, { color: colors.grayDark }]}>Login to continue using the app</Text>
              </View>

              <View style={styles.formContainer}>
                <Text style={[styles.label, { color: colors.text }]}>Mobile number</Text>
                <View style={styles.inputWrapper}>
                  <View style={styles.phoneInputUnified}>
                    <View style={styles.countryCodeContainer}>
                      <Image source={{ uri: 'https://flagcdn.com/w80/in.png' }} style={styles.flagIcon} />
                      <Text style={[styles.countryCodeText, { color: colors.text }]}>+91</Text>
                    </View>
                    <Input
                      placeholder="Enter Mobile Number"
                      value={phoneNumber}
                      onChangeText={setPhoneNumber}
                      keyboardType="phone-pad"
                      style={styles.phoneInputUnifiedInput}
                      leftIcon={<Phone size={20} color={colors.grayDark} />}
                      error={error}
                    />
                  </View>
                </View>
                <Button
                  title="Send OTP"
                  onPress={handleSendOTP}
                  loading={isLoading}
                  fullWidth
                  style={styles.button}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    minHeight: '100%',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100%',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginBottom: 0,
  },
  formContainer: {
    width: '100%',
    marginTop: 32,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputWrapper: {
    marginBottom: 24,
  },
  phoneInputUnified: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 12,
    height: 56,
  },
  countryCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 8,
    borderRightWidth: 1,
    borderRightColor: '#E0E0E0',
    marginRight: 8,
  },
  flagIcon: {
    width: 24,
    height: 16,
    marginRight: 4,
  },
  countryCodeText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  phoneInputUnifiedInput: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 0,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    height: 56,
    paddingVertical: 0,
    marginTop: 0,
    marginBottom: 0,
    alignSelf: 'center',
  },
  button: {
    marginTop: 8,
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#8000FF',
  },
});
