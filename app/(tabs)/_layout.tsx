import React from 'react';
import { Tabs, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';
import { Chrome as Home, Heart, Video, User, Plus } from 'lucide-react-native';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

function AddButton() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const router = useRouter();
  
  return (
    <View style={styles.addButtonContainer}>
      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: colors.primaryColor }]}
        activeOpacity={0.8}
        onPress={() => router.push('/add-property')}
      >
        <Plus size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['bottom']}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primaryColor,
          tabBarInactiveTintColor: colors.grayDark,
          tabBarStyle: {
            borderTopWidth: 1,
            borderTopColor: colors.divider,
            height: 60,
            paddingBottom: 2,
            paddingTop: 2,
            backgroundColor: colors.background,
          },
          tabBarLabelStyle: {
            fontFamily: 'Inter-Medium',
            fontSize: 12,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="wishlist"
          options={{
            title: 'Wishlist',
            tabBarIcon: ({ color, size }) => <Heart size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="add"
          options={{
            title: '',
            tabBarButton: () => <AddButton />,
          }}
        />
        <Tabs.Screen
          name="highlight"
          options={{
            title: 'Highlight',
            tabBarIcon: ({ color, size }) => <Video size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  addButtonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 60, // Match tab bar height
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});