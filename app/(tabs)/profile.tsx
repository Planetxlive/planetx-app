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
import {
  User,
  Chrome as Home,
  Heart,
  Globe,
  Bell,
  MessageSquare,
  Share,
  FileText,
  Book,
  LogOut,
  ChevronRight,
  CreditCard as Edit,
  BookOpen,
  House,
} from 'lucide-react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const MenuItem = ({
  icon: Icon,
  title,
  onPress,
  color = 'black',
  isLogout = false,
}: any) => {
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
      icon: House,
      title: 'My Property',
      onPress: () => router.push('/my-property'),
    },
    {
      icon: Heart,
      title: 'Wishlist',
      onPress: () => router.push('/wishlist'),
    },
    {
      icon: BookOpen,
      title: 'My Blog',
      onPress: () => router.push('/my-blog'),
    },
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
    <SafeAreaProvider>
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: colors.background },
        ]}
      >
        <ScrollView
          contentContainerStyle={{
            paddingBottom: 40, // Extra bottom padding for Android nav bar
          }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.profileCard}>
              <View
                style={[
                  styles.profileImage,
                  {
                    backgroundColor: colors.primaryColor,
                    justifyContent: 'center',
                    alignItems: 'center',
                  },
                ]}
              >
                <Text
                  style={[styles.initialsText, { color: colors.background }]}
                >
                  {user?.name
                    ? user.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()
                        .substring(0, 2)
                    : 'U'}
                </Text>
              </View>
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
                  activeOpacity={0.8}
                >
                  <View style={styles.editButtonInner}>
                    <Edit size={16} color={colors.primaryColor} style={{ marginRight: 6 }} />
                    <Text
                      style={[
                        styles.editButtonText,
                        { color: colors.primaryColor },
                      ]}
                    >
                      Edit Profile
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.menuContainer}>
            {menuItems.map((item, index) => (
              <View key={index}>
                <MenuItem
                  icon={item.icon}
                  title={item.title}
                  onPress={item.onPress}
                  color={colors.text}
                />
                <View style={styles.divider} />
              </View>
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
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 0,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4, // Android shadow
    marginBottom: 18,
  },
  profileSection: {
    display: 'none', // Hide old style
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  initialsText: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
  },
  profileInfo: {
    marginLeft: 18,
    flex: 1,
  },
  name: {
    fontSize: 22,
    fontFamily: 'Inter-Bold',
    marginBottom: 2,
  },
  lastLogin: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    marginBottom: 10,
  },
  editButton: {
    alignSelf: 'flex-start',
    marginTop: 2,
    borderRadius: 20,
    backgroundColor: '#F3F6FA',
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  editButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 15,
    fontFamily: 'Inter-Medium',
  },
  menuContainer: {
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 18,
    marginHorizontal: 8,
    marginTop: 8,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
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
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginLeft: 36,
  },
});
