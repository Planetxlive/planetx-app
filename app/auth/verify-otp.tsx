import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Image,
  Dimensions,
  ScrollView,
} from 'react-native';
import { router, useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import OTPInput from '@/components/ui/OTPInput';
import Button from '@/components/ui/Button';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';
import { ArrowLeft } from 'lucide-react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

export default function VerifyOTPScreen() {
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme] || Colors['light'];
  const { verifyOTP, pendingPhoneNumber } = useAuth();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
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
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          router.replace('/');
        }, 1800);
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
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.container}>
              <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
                <ArrowLeft size={24} color={colors.text} />
                <Text style={[styles.backText, { color: colors.text }]}>OTP verification</Text>
              </TouchableOpacity>

              <View style={styles.content}>
                {/* Illustration with image */}
                <View style={styles.illustrationContainer}>
                  <Image
                    source={require('@/assets/images/verify-otp.png')}
                    style={styles.illustrationImage}
                    resizeMode="contain"
                  />
                </View>

                <Text style={[styles.message, { color: colors.grayDark }]}>We've sent a Verification Code to</Text>
                <Text style={[styles.phoneNumber, { color: colors.text }]}>{pendingPhoneNumber}</Text>

                <View style={styles.otpContainer}>
                  <OTPInput
                    length={4}
                    value={otp}
                    onChange={setOtp}
                    error={error}
                    style={styles.otpInputBoxes}
                  />
                  {error ? (
                    <Text style={styles.otpErrorText}>{error}</Text>
                  ) : null}
                </View>

                <Button
                  title="Verify OTP"
                  onPress={handleVerifyOTP}
                  loading={isLoading}
                  fullWidth
                  style={styles.button}
                />

                <View style={styles.timerContainer}>
                  <Text style={styles.timerText}>
                    Code expired in{' '}
                    <Text style={styles.timerCountdown}>{formatTime(timeLeft)}</Text>
                  </Text>
                </View>

                <View style={styles.resendContainer}>
                  <Text style={styles.resendText}>Didn't receive the OTP? </Text>
                  <TouchableOpacity
                    onPress={handleResendOTP}
                    disabled={timeLeft > 0 || isResending}
                  >
                    <Text
                      style={
                        timeLeft > 0 || isResending
                          ? styles.resendLinkDisabled
                          : styles.resendLink
                      }
                    >
                      Resend OTP
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Success Modal */}
              <Modal
                visible={showSuccess}
                transparent
                animationType="fade"
              >
                <View style={styles.modalOverlay}>
                  <View style={styles.successModal}>
                    <View style={styles.successCircle}>
                      <Text style={styles.successCheck}>✔️</Text>
                    </View>
                    <Text style={styles.successTitle}>Success</Text>
                    <Text style={styles.successMessage}>You have successfully logged in!</Text>
                  </View>
                </View>
              </Modal>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
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
    justifyContent: 'flex-start',
  },
  illustrationContainer: {
    marginVertical: 16,
    alignItems: 'center',
  },
  illustrationImage: {
    height: SCREEN_HEIGHT * 0.4,
    width: SCREEN_WIDTH * 0.8,
    marginBottom: 8,
    alignSelf: 'center',
  },
  message: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginBottom: 2,
  },
  phoneNumber: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 24,
    textAlign: 'center',
  },
  otpContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  otpInputBoxes: {
    width: '100%',
    marginBottom: 0,
  },
  otpErrorText: {
    color: '#FF3B30',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
    fontFamily: 'Inter-Medium',
  },
  button: {
    marginBottom: 16,
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#8000FF',
  },
  timerContainer: {
    marginBottom: 8,
  },
  timerText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#888',
    textAlign: 'center',
  },
  timerCountdown: {
    color: '#FF3B30',
    fontFamily: 'Inter-SemiBold',
  },
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  resendText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#888',
  },
  resendLink: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#8000FF',
    textDecorationLine: 'underline',
  },
  resendLinkDisabled: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#bbb',
    textDecorationLine: 'underline',
  },
  // Success Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successModal: {
    width: 320,
    backgroundColor: '#fff',
    borderRadius: 24,
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  successCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4CD964',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  successCheck: {
    fontSize: 48,
    color: '#fff',
  },
  successTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
    color: '#222',
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666',
    textAlign: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    minHeight: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
