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
import { useProperties } from '@/context/PropertyContext';
import PropertyCard from '@/components/PropertyCard';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';
import { ArrowLeft, Search, SlidersHorizontal } from 'lucide-react-native';
import FilterModal, { FilterOptions } from '@/components/FilterModal';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function AllPropertiesScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const {
    properties,
    getPropertiesByCategory,
    getPropertiesByPostingType,
    getPropertiesByPriceRange,
  } = useProperties();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterOptions>({
    minPrice: '',
    maxPrice: '',
    categories: [],
    propertyTypes: [],
  });

  const applyFilters = (filters: FilterOptions) => {
    setActiveFilters(filters);
  };

  const getFilteredProperties = () => {
    let filtered = [...properties];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (property) =>
          property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          property.location.state
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          property.location.city
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (activeFilters.categories.length > 0) {
      filtered = filtered.filter((property) =>
        activeFilters.categories.includes(property.category)
      );
    }

    // Apply property type filter
    if (activeFilters.propertyTypes.length > 0) {
      filtered = filtered.filter((property) =>
        activeFilters.propertyTypes.includes(
          property.propertyType as 'For Sale' | 'For Rent'
        )
      );
    }

    // Apply price range filter
    if (activeFilters.minPrice || activeFilters.maxPrice) {
      const minPrice = activeFilters.minPrice
        ? parseInt(activeFilters.minPrice)
        : 0;
      const maxPrice = activeFilters.maxPrice
        ? parseInt(activeFilters.maxPrice)
        : Number.MAX_SAFE_INTEGER;
      filtered = filtered.filter(
        (property) =>
          property.pricing.expectedPrice >= minPrice &&
          property.pricing.expectedPrice <= maxPrice
      );
    }

    return filtered;
  };

  const filteredProperties = getFilteredProperties();

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            All Properties
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.searchContainer}>
          <View
            style={[styles.searchBar, { backgroundColor: colors.grayLight }]}
          >
            <Search size={20} color={colors.grayDark} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search properties..."
              placeholderTextColor={colors.grayDark}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity
            style={[styles.filterButton, { backgroundColor: colors.grayLight }]}
            onPress={() => setShowFilters(true)}
          >
            <SlidersHorizontal size={20} color={colors.text} />
          </TouchableOpacity>
        </View>

        <FlatList
          data={filteredProperties}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <PropertyCard property={item} />}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={[styles.emptyStateText, { color: colors.text }]}>
                No properties found
              </Text>
            </View>
          }
        />

        <FilterModal
          visible={showFilters}
          onClose={() => setShowFilters(false)}
          onApply={applyFilters}
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
