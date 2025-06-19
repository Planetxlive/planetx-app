import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { router } from 'expo-router';
import { useGym } from '@/context/GymContext';
import GymCard from '@/components/GymCard';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';
import { ArrowLeft, Search, SlidersHorizontal } from 'lucide-react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function GymScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const { gyms } = useGym();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGyms = gyms.filter(
    (gym) =>
      gym.gymName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gym.locality?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gym.city?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background, flex: 1 }]}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Gyms & Fitness</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.searchContainer}>
          <View
            style={[
              styles.searchBar,
              { backgroundColor: colors.grayLight, shadowColor: colors.grayDark },
              styles.searchBarShadow,
            ]}
          >
            <Search size={20} color={colors.grayDark} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search gyms..."
              placeholderTextColor={colors.grayDark}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity
            style={styles.fabFilterButton}
            activeOpacity={0.8}
          >
            <SlidersHorizontal size={22} color={colors.text} />
          </TouchableOpacity>
        </View>

        <FlatList
          data={filteredGyms}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <GymCard gym={item} />}
          contentContainerStyle={[styles.listContent, { paddingBottom: 40 }]}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={[styles.emptyStateIcon, { color: colors.grayDark }]}>🏋️‍♂️</Text>
              <Text style={[styles.emptyStateText, { color: colors.text }]}>No gyms found</Text>
            </View>
          }
        />
      </SafeAreaView>
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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    backgroundColor: 'transparent',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 22,
    marginRight: 8,
    backgroundColor: '#F5F5F5',
  },
  searchBarShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabFilterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
    color: '#888',
  },
});
