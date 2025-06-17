import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  useProperties,
  Property,
  PropertyCategory,
} from '@/context/PropertyContext';
import PropertyCard from '@/components/PropertyCard';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';
import {
  ArrowLeft,
  Search as SearchIcon,
  X,
  ChevronDown,
} from 'lucide-react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SearchScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const { properties } = useProperties();
  const insets = useSafeAreaInsets();

  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedType, setSelectedType] = useState<PropertyCategory | null>(
    null
  );
  const [selectedListingType, setSelectedListingType] = useState<string | null>(
    null
  );
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const propertyTypes: PropertyCategory[] = [
    'Residential',
    'Pg',
    'Hotel',
    'Office',
    'Shop',
    'Warehouse',
    'Shared Warehouse',
    'EventSpace',
  ];

  const listingTypes = ['For Sale', 'For Rent', 'Paying Guest', 'Rent Hourly'];

  // Filter properties based on search query and filters
  const filteredProperties = properties.filter((property) => {
    // Search query filter
    if (
      searchQuery &&
      !property.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !property.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !property.location.city.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Property type filter
    if (selectedType && property.category !== selectedType) {
      return false;
    }

    // Listing type filter
    if (selectedListingType && property.propertyType !== selectedListingType) {
      return false;
    }

    // Price range filter
    if (minPrice && property.pricing.expectedPrice < parseFloat(minPrice)) {
      return false;
    }

    if (maxPrice && property.pricing.expectedPrice > parseFloat(maxPrice)) {
      return false;
    }

    return true;
  });

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const clearFilters = () => {
    setSelectedType(null);
    setSelectedListingType(null);
    setMinPrice('');
    setMaxPrice('');
  };

  const renderItem = ({ item }: { item: Property }) => (
    <PropertyCard property={item} />
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: colors.background },
          { paddingTop: insets.top }
        ]}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>

          <View
            style={[
              styles.searchContainer,
              { backgroundColor: colors.grayLight },
            ]}
          >
            <SearchIcon size={20} color={colors.grayDark} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search properties, locations..."
              placeholderTextColor={colors.grayDark}
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
            />
            {searchQuery ? (
              <TouchableOpacity onPress={handleClearSearch}>
                <X size={20} color={colors.grayDark} />
              </TouchableOpacity>
            ) : null}
          </View>

          <TouchableOpacity
            style={[
              styles.filterButton,
              {
                backgroundColor: showFilters
                  ? colors.primaryColor
                  : colors.grayLight,
              },
            ]}
            onPress={toggleFilters}
          >
            <ChevronDown
              size={20}
              color={showFilters ? 'white' : colors.text}
            />
          </TouchableOpacity>
        </View>

        {showFilters && (
          <View
            style={[
              styles.filtersContainer,
              { backgroundColor: colors.cardBackground },
            ]}
          >
            <View style={styles.filterSection}>
              <Text style={[styles.filterTitle, { color: colors.text }]}>
                Property Type
              </Text>
              <View style={styles.typeContainer}>
                {propertyTypes.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.typeButton,
                      selectedType === type && {
                        backgroundColor: colors.primaryColor,
                      },
                    ]}
                    onPress={() =>
                      setSelectedType(selectedType === type ? null : type)
                    }
                  >
                    <Text
                      style={[
                        styles.typeButtonText,
                        selectedType === type && { color: 'white' },
                      ]}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.filterSection}>
              <Text style={[styles.filterTitle, { color: colors.text }]}>
                Listing Type
              </Text>
              <View style={styles.typeContainer}>
                {listingTypes.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.typeButton,
                      selectedListingType === type && {
                        backgroundColor: colors.primaryColor,
                      },
                    ]}
                    onPress={() =>
                      setSelectedListingType(
                        selectedListingType === type ? null : type
                      )
                    }
                  >
                    <Text
                      style={[
                        styles.typeButtonText,
                        selectedListingType === type && { color: 'white' },
                      ]}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.filterSection}>
              <Text style={[styles.filterTitle, { color: colors.text }]}>
                Price Range
              </Text>
              <View style={styles.priceRangeContainer}>
                <TextInput
                  style={[
                    styles.priceInput,
                    { backgroundColor: colors.grayLight, color: colors.text },
                  ]}
                  placeholder="Min Price"
                  placeholderTextColor={colors.grayDark}
                  value={minPrice}
                  onChangeText={setMinPrice}
                  keyboardType="numeric"
                />
                <Text
                  style={[styles.priceSeparator, { color: colors.grayDark }]}
                >
                  to
                </Text>
                <TextInput
                  style={[
                    styles.priceInput,
                    { backgroundColor: colors.grayLight, color: colors.text },
                  ]}
                  placeholder="Max Price"
                  placeholderTextColor={colors.grayDark}
                  value={maxPrice}
                  onChangeText={setMaxPrice}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.filterActions}>
              <TouchableOpacity
                style={[
                  styles.clearButton,
                  { borderColor: colors.primaryColor },
                ]}
                onPress={clearFilters}
              >
                <Text
                  style={[
                    styles.clearButtonText,
                    { color: colors.primaryColor },
                  ]}
                >
                  Clear All
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.applyButton,
                  { backgroundColor: colors.primaryColor },
                ]}
                onPress={() => setShowFilters(false)}
              >
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <FlatList
          data={filteredProperties}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: colors.text }]}>
                No properties found
              </Text>
              <Text style={[styles.emptySubtext, { color: colors.grayDark }]}>
                Try adjusting your search or filters
              </Text>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  backButton: {
    marginRight: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderRadius: 8,
    height: 40,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 8,
    fontFamily: 'Inter-Regular',
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  filtersContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  filterSection: {
    marginBottom: 16,
  },
  filterTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  typeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#7C3AED',
    marginRight: 8,
    marginBottom: 8,
  },
  typeButtonText: {
    color: '#7C3AED',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  priceRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceInput: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  priceSeparator: {
    marginHorizontal: 8,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  filterActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  clearButton: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  clearButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  applyButton: {
    flex: 2,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyButtonText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  listContent: {
    padding: 16,
    paddingBottom: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
});
