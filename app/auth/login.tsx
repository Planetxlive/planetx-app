import React, { useState } from 'react';
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

export default function LoginScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const { signIn } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOTP = async () => {
    // Simple validation
    if (!phoneNumber || phoneNumber.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    try {
      // Format phone number with country code if needed
      const formattedNumber = phoneNumber.startsWith('+') 
      ? phoneNumber 
      : `+91${phoneNumber}`;
      
      await signIn(formattedNumber);
      // Navigation to OTP screen is handled in the signIn function
    } catch (error) {
      setError('Failed to send OTP. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
          <View style={styles.logoContainer}>
            <View style={[styles.logoCircle, { backgroundColor: colors.grayLight }]}>
              <Logo width={80} height={80} />
            </View>
            <Text style={[styles.title, { color: colors.text }]}>Login</Text>
            <Text style={[styles.subtitle, { color: colors.grayDark }]}>
              Login to continue using the app
            </Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Mobile number</Text>
            <View style={styles.phoneInputContainer}>
              <TouchableOpacity 
                style={[styles.countryCode, { borderColor: colors.grayMedium }]}
                activeOpacity={0.7}
              >
                <Image
                  source={{ uri: 'https://flagcdn.com/w80/in.png' }}
                  style={styles.flagIcon}
                />
                <Text style={[styles.countryCodeText, { color: colors.text }]}>+91</Text>
              </TouchableOpacity>
              <Input
                placeholder="Enter Mobile Number"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                style={styles.phoneInput}
                leftIcon={<Phone size={20} color={colors.grayDark} />}
                error={error}
              />
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginBottom: 8,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  countryCode: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 8,
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
  phoneInput: {
    flex: 1,
  },
  button: {
    marginTop: 8,
  },
});