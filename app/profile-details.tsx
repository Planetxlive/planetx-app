import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';
import { ArrowLeft, CreditCard as Edit } from 'lucide-react-native';

export default function ProfileDetailsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const { user } = useAuth();

  const renderInfoItem = (label: string, value: string) => (
    <View style={styles.infoItem}>
      <Text style={[styles.infoLabel, { color: colors.grayDark }]}>{label}</Text>
      <Text style={[styles.infoValue, { color: colors.text }]}>{value}</Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Profile Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.profileSection}>
          <View style={[styles.profileImage, { backgroundColor: colors.primaryColor, justifyContent: 'center', alignItems: 'center' }]}>
            <Text style={[styles.initialsText, { color: colors.background }]}>
              {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'U'}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.editButton, { backgroundColor: colors.primaryColor }]}
            onPress={() => router.push('/edit-profile')}
          >
            <Edit size={20} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.infoSection}>
          {renderInfoItem('Name', user?.name || 'Not set')}
          {renderInfoItem('Role', 'Property Owner')}
          {renderInfoItem('Email ID', user?.email || 'Not set')}
          {renderInfoItem('Primary Number', user?.mobile || 'Not set')}
          {renderInfoItem('WhatsApp Number', user?.whatsappMobile || 'Not set')}
          {renderInfoItem('State', user?.state || 'Not set')}
          {renderInfoItem('City', user?.city || 'Not set')}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
  content: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 24,
    position: 'relative',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  editButton: {
    position: 'absolute',
    bottom: 24,
    right: '35%',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoSection: {
    padding: 16,
  },
  infoItem: {
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  initialsText: {
    fontSize: 48,
    fontFamily: 'Inter-Bold',
  },
});