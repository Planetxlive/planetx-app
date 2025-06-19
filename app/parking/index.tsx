import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  TextInput,
  Platform,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { useParking } from '@/context/ParkingContext';
import ParkingCard from '@/components/ParkingCard';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';
import { ArrowLeft, Search, SlidersHorizontal } from 'lucide-react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function ParkingScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const { parkingSpots } = useParking();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSpots = parkingSpots.filter(
    (spot) =>
      spot.spotNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spot.locality?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spot.city?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: colors.background, flex: 1, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
        ]}
      >
        <View style={styles.headerWrapper}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.headerIcon}>
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Parking Spots</Text>
            <View style={styles.headerIcon} />
          </View>
        </View>

        <View style={styles.searchContainer}>
          <View
            style={[
              styles.searchBar,
              { backgroundColor: colors.grayLight, shadowColor: colors.text },
            ]}
          >
            <Search size={20} color={colors.grayDark} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search parking spots..."
              placeholderTextColor={colors.grayDark}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity
            style={[
              styles.filterButton,
              { backgroundColor: colors.grayLight, shadowColor: colors.text },
            ]}
          >
            <SlidersHorizontal size={20} color={colors.text} />
          </TouchableOpacity>
        </View>

        <FlatList
          data={filteredSpots}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              <ParkingCard parkingSpot={item} />
            </View>
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={[styles.emptyStateIcon, { color: colors.grayDark }]}>🅿️</Text>
              <Text style={[styles.emptyStateText, { color: colors.text }]}>No parking spots found</Text>
              <Text style={[styles.emptyStateSub, { color: colors.grayDark }]}>Try adjusting your search or filters.</Text>
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
  headerWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    zIndex: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerIcon: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    letterSpacing: 0.2,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 8,
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 10,
    marginRight: 10,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 2,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 2,
    elevation: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  cardWrapper: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 17,
    fontFamily: 'Inter-Medium',
    marginBottom: 4,
  },
  emptyStateSub: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#888',
  },
});
