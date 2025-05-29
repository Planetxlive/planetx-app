import React, { createContext, useState, useContext, useEffect } from 'react';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosResponse } from 'axios';
import { Use } from 'react-native-svg';

// type User = {
//   id: string;
//   phoneNumber: string;
//   name?: string;
//   email?: string;
//   profileImage?: string;
// };

type User = {
  id: string;
  name: string;
  email: string;
  mobile: string;
  numberOfProperty: string;
  whatsappMobile: string;
  state: string;
  role: string;
  city: string;
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
// const MOCK_USER: User = {
//   id: '123456',
//   phoneNumber: '+919876543210',
//   name: 'John Doe',
//   email: 'john.doe@example.com',
// };

const updateUser = async (token: string): Promise<User> => {
  const url = `${process.env.EXPO_PUBLIC_API_URL}/auth/get-user/`;
  const res = await axios.get(url, {
    headers: {
      Authorization: token,
    },
  });
  return makeUserFromResponse(res);
};

const makeUserFromResponse = (res: AxiosResponse<any, any>) => {
    const user: User = {
    id: res.data.user._id,
    name: res.data.user.name,
    email: res.data.user.email,
    mobile: res.data.user.mobile,
    numberOfProperty: res.data.user.properties.length,
    whatsappMobile: res.data.user.whatsappMobile,
    state: res.data.user.state,
    role: res.data.user.role,
    city: res.data.user.city,
  };
  return user;
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingPhoneNumber, setPendingPhoneNumber] = useState<string | null>(
    null
  );

  useEffect(() => {
    // Check for existing auth
    const loadUser = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (token) {
          setUser(await updateUser(token));
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
      // console.log(phoneNumber);
      const url = `${process.env.EXPO_PUBLIC_API_URL}/auth/send-otp/`;
      // console.log(process.env.EXPO_PUBLIC_API_URL);
      // console.log(url);
      const res = await axios.post(url, {
        mobile: phoneNumber,
      });
      // console.log(res.data)
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
        try {
          const url = `${process.env.EXPO_PUBLIC_API_URL}/auth/verify-otp/`;
          // console.log(process.env.EXPO_PUBLIC_API_URL);
          // console.log(url);
          const res = await axios.post(url, {
            mobile: pendingPhoneNumber,
            otp: otp,
          });
          delete res.data.message;
          console.log(res.data);
          if (res.status == 200) {
            // setUser(res.data.user);
            const user = await updateUser(res.data.accessToken);
            setUser(user);
            await AsyncStorage.setItem('accessToken', res.data.accessToken);
            return true;
          } else {
            return false;
          }
        } catch (error) {
          console.error('OTP verification error', error);
          return false;
        }
      }
      return false;
    } catch (error) {
      console.error('OTP verification error', error);
      return false;
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('accessToken');
      setUser(null);
      router.replace('/auth/login');
    } catch (error) {
      console.error('Sign out error', error);
    }
  };

  const updateUserProfile = async (data: Partial<User>) => {
    try {
      if (user) {
        const token = await AsyncStorage.getItem('accessToken');
        const updatedUser = { ...user, ...data };
        const url = `${process.env.EXPO_PUBLIC_API_URL}/auth/update-user`;
        console.log(url);
        const res = await axios.patch(url, data, {
          headers: {
            Authorization: token,
          },
        });
        console.log(makeUserFromResponse(res));
        setUser(makeUserFromResponse(res));
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
