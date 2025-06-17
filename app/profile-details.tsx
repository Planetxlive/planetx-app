import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';
import { ArrowLeft, CreditCard as Edit } from 'lucide-react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProfileDetailsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  const renderInfoItem = (label: string, value: string) => (
    <View style={styles.infoItem}>
      <Text style={[styles.infoLabel, { color: colors.grayDark }]}>
        {label}
      </Text>
      <Text style={[styles.infoValue, { color: colors.text }]}>{value}</Text>
    </View>
  );

  return (
    <SafeAreaProvider>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { paddingTop: insets.top }]}>
          <TouchableOpacity 
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Profile Details
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.profileSection}>
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
              <Text style={[styles.initialsText, { color: colors.background }]}>
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
            <TouchableOpacity
              style={[
                styles.editButton,
                { backgroundColor: colors.primaryColor },
              ]}
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
            {renderInfoItem(
              'WhatsApp Number',
              user?.whatsappMobile || 'Not set'
            )}
            {renderInfoItem('State', user?.state || 'Not set')}
            {renderInfoItem('City', user?.city || 'Not set')}
          </View>
        </ScrollView>
      </View>
    </SafeAreaProvider>
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
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 32,
    position: 'relative',
  },
  profileImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  editButton: {
    position: 'absolute',
    bottom: 32,
    right: '35%',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  infoSection: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  infoItem: {
    marginBottom: 20,
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 6,
    opacity: 0.7,
  },
  infoValue: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  initialsText: {
    fontSize: 52,
    fontFamily: 'Inter-Bold',
  },
});
