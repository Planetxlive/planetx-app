import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { router, useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import OTPInput from '@/components/ui/OTPInput';
import Button from '@/components/ui/Button';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';
import { ArrowLeft } from 'lucide-react-native';

export default function VerifyOTPScreen() {
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme] || Colors['light'];
  const { verifyOTP, pendingPhoneNumber } = useAuth();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!pendingPhoneNumber) {
      router.replace('/auth/login');
    }
  }, [pendingPhoneNumber]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (timeLeft > 0) {
        setTimeLeft(timeLeft - 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleVerifyOTP = async () => {
    if (otp.length !== 4) {
      setError('Please enter a valid 4-digit OTP');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const success = await verifyOTP(otp);
      if (success) {
        // If verification is successful, user will be redirected to main app
        router.push("/")
      } else {
        setError('Invalid OTP. Please try again.');
      }
    } catch (error) {
      setError('Failed to verify OTP. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = () => {
    setIsResending(true);
    // Mock resend action
    setTimeout(() => {
      setTimeLeft(60);
      setIsResending(false);
    }, 1000);
  };

  const handleGoBack = () => {
    router.back();
  };

  const formatTime = (seconds: number) => {
    return `${seconds}s`;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleGoBack}
          >
            <ArrowLeft size={24} color={colors.text} />
            <Text style={[styles.backText, { color: colors.text }]}>
              OTP verification
            </Text>
          </TouchableOpacity>

          <View style={styles.content}>
            <View style={styles.illustrationContainer}>
              <View style={styles.illustration}>
                {/* Illustration can be an SVG or Image */}
                <View style={[styles.illustrationCircle, { backgroundColor: colors.grayLight }]}>
                  <View style={[styles.checkmark, { backgroundColor: colors.primaryColor }]}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                </View>
              </View>
            </View>

            <Text style={[styles.message, { color: colors.grayDark }]}>
              We've sent a Verification Code to
            </Text>
            <Text style={[styles.phoneNumber, { color: colors.text }]}>
              {pendingPhoneNumber}
            </Text>

            <View style={styles.otpContainer}>
              <OTPInput
                length={4}
                value={otp}
                onChange={setOtp}
                error={error}
              />
            </View>

            <Button
              title="Verify OTP"
              onPress={handleVerifyOTP}
              loading={isLoading}
              fullWidth
              style={styles.button}
            />

            <View style={styles.timerContainer}>
              <Text style={[styles.timerText, { color: colors.grayDark }]}>
                Code expired in{' '}
                <Text style={{ color: timeLeft === 0 ? colors.errorColor : '#FF6B6B' }}>
                  {formatTime(timeLeft)}
                </Text>
              </Text>
            </View>

            <View style={styles.resendContainer}>
              <Text style={[styles.resendText, { color: colors.grayDark }]}>
                Didn't receive the OTP?{' '}
              </Text>
              <TouchableOpacity
                onPress={handleResendOTP}
                disabled={timeLeft > 0 || isResending}
              >
                <Text
                  style={[
                    styles.resendLink,
                    {
                      color:
                        timeLeft > 0 || isResending
                          ? colors.grayDark
                          : colors.primaryColor,
                    },
                  ]}
                >
                  Resend OTP
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 8,
  },
  content: {
    flex: 1,
    alignItems: 'center',
  },
  illustrationContainer: {
    marginVertical: 32,
    alignItems: 'center',
  },
  illustration: {
    width: 180,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustrationCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  message: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginBottom: 8,
  },
  phoneNumber: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 32,
  },
  otpContainer: {
    width: '100%',
    marginBottom: 24,
  },
  button: {
    marginBottom: 16,
  },
  timerContainer: {
    marginBottom: 16,
  },
  timerText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resendText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  resendLink: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
});