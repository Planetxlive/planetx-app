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

export default function GymScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const { gyms } = useGym();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGyms = gyms.filter((gym) =>
    gym.gymName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    gym.locality?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    gym.city?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Gyms & Fitness</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: colors.grayLight }]}>
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
          style={[styles.filterButton, { backgroundColor: colors.grayLight }]}
        >
          <SlidersHorizontal size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredGyms}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <GymCard gym={item} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={[styles.emptyStateText, { color: colors.text }]}>
              No gyms found
            </Text>
          </View>
        }
      />
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
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 40,
    borderRadius: 8,
    marginRight: 8,
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
  listContent: {
    padding: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
});
