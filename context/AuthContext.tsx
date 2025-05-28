import React, { createContext, useState, useContext, useEffect } from 'react';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

type User = {
  id: string;
  phoneNumber: string;
  name?: string;
  email?: string;
  profileImage?: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  signIn: (phoneNumber: string) => Promise<void>;
  verifyOTP: (otp: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  signIn: async () => {},
  verifyOTP: async () => false,
  signOut: async () => {},
  updateUserProfile: async () => {},
});

// Mock data for demo purposes
const MOCK_USER: User = {
  id: '123456',
  phoneNumber: '+919876543210',
  name: 'John Doe',
  email: 'john.doe@example.com',
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingPhoneNumber, setPendingPhoneNumber] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing auth
    const loadUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Failed to load user data', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const signIn = async (phoneNumber: string) => {
    try {
      // In a real app, you would call your auth API here
      // For now, we'll just store the phone number for verification
      setPendingPhoneNumber(phoneNumber);
      
      // Navigate to OTP verification screen
      router.push('/auth/verify-otp');
    } catch (error) {
      console.error('Sign in error', error);
      throw error;
    }
  };

  const verifyOTP = async (otp: string): Promise<boolean> => {
    try {
      // In a real app, you would verify the OTP with your auth API
      // For mock purposes, any OTP will work
      if (pendingPhoneNumber) {
        // Create user from the phone number
        const newUser = { ...MOCK_USER, phoneNumber: pendingPhoneNumber };
        setUser(newUser);
        
        // Save user data
        await AsyncStorage.setItem('user', JSON.stringify(newUser));
        setPendingPhoneNumber(null);
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('OTP verification error', error);
      return false;
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('user');
      setUser(null);
      router.replace('/auth/login');
    } catch (error) {
      console.error('Sign out error', error);
    }
  };

  const updateUserProfile = async (data: Partial<User>) => {
    try {
      if (user) {
        const updatedUser = { ...user, ...data };
        setUser(updatedUser);
        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Update profile error', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        verifyOTP,
        signOut,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);