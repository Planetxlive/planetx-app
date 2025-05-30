import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';
import { User, Chrome as Home, Heart, Globe, Bell, MessageSquare, Share, FileText, Book, LogOut, ChevronRight, CreditCard as Edit } from 'lucide-react-native';

const MenuItem = ({ icon: Icon, title, onPress, color = 'black', isLogout = false }:any) => {
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme];

  return (
    <TouchableOpacity
      style={[
        styles.menuItem,
        isLogout && { borderTopWidth: 1, borderTopColor: colors.divider },
      ]}
      onPress={onPress}
    >
      <View style={styles.menuItemLeft}>
        <Icon size={24} color={color} />
        <Text
          style={[
            styles.menuItemText,
            { color: color },
            isLogout && styles.logoutText,
          ]}
        >
          {title}
        </Text>
      </View>
      <ChevronRight size={20} color={colors.grayDark} />
    </TouchableOpacity>
  );
};

export default function ProfileScreen() {
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme];
  const { user, signOut } = useAuth();

  const menuItems = [
    {
      icon: User,
      title: 'Profile Details',
      onPress: () => router.push('/profile-details'),
    },
    {
      icon: Home,
      title: 'My Property',
      onPress: () => router.push('/my-property'),
    },
    {
      icon: Heart,
      title: 'Wishlist',
      onPress: () => router.push('/wishlist'),
    },
    // {
    //   icon: Globe,
    //   title: 'Language',
    //   onPress: () => router.push('/language'),
    // },
    {
      icon: Bell,
      title: 'Notification',
      onPress: () => router.push('/notifications'),
    },
    {
      icon: MessageSquare,
      title: 'Share Feedback',
      onPress: () => router.push('/feedback'),
    },
    {
      icon: Share,
      title: 'Share App',
      onPress: () => router.push('/share'),
    },
    {
      icon: FileText,
      title: 'Privacy & Policy',
      onPress: () => router.push('/privacy-policy'),
    },
    {
      icon: Book,
      title: 'Terms & Conditions',
      onPress: () => router.push('/terms'),
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView>
        <View style={styles.header}>
          <View style={styles.profileSection}>
            <Image
              source={{ uri: user?.profileImage || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg' }}
              style={styles.profileImage}
            />
            <View style={styles.profileInfo}>
              <Text style={[styles.name, { color: colors.text }]}>
                {user?.name || 'Hello, User'}
              </Text>
              <Text style={[styles.lastLogin, { color: colors.grayDark }]}>
                Last Login: Nov 21, 2024
              </Text>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => router.push('/edit-profile')}
              >
                <Text style={[styles.editButtonText, { color: colors.primaryColor }]}>
                  Edit Profile
                </Text>
                <Edit size={16} color={colors.primaryColor} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <MenuItem
              key={index}
              icon={item.icon}
              title={item.title}
              onPress={item.onPress}
              color={colors.text}
            />
          ))}
          <MenuItem
            icon={LogOut}
            title="Logout"
            onPress={signOut}
            color={colors.errorColor}
            isLogout
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  lastLogin: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 8,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginRight: 4,
  },
  menuContainer: {
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginLeft: 12,
  },
  logoutText: {
    fontFamily: 'Inter-SemiBold',
  },
});