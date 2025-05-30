import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { X } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';

type PropertyCategory =
  | 'Residential'
  | 'Pg'
  | 'Hotel'
  | 'Office'
  | 'Shop'
  | 'Warehouse'
  | 'Shared Warehouse'
  | 'EventSpace';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterOptions) => void;
}

export interface FilterOptions {
  minPrice: string;
  maxPrice: string;
  categories: PropertyCategory[];
  propertyTypes: ('For Sale' | 'For Rent')[];
}

const categories: PropertyCategory[] = [
  'Residential',
  'Pg',
  'Hotel',
  'Office',
  'Shop',
  'Warehouse',
  'Shared Warehouse',
  'EventSpace',
];

const propertyTypes: ('For Sale' | 'For Rent')[] = ['For Sale', 'For Rent'];

export default function FilterModal({ visible, onClose, onApply }: FilterModalProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const [filters, setFilters] = useState<FilterOptions>({
    minPrice: '',
    maxPrice: '',
    categories: [],
    propertyTypes: [],
  });

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({
      minPrice: '',
      maxPrice: '',
      categories: [],
      propertyTypes: [],
    });
  };

  const togglePropertyType = (type: 'For Sale' | 'For Rent') => {
    setFilters(prev => ({
      ...prev,
      propertyTypes: prev.propertyTypes.includes(type)
        ? prev.propertyTypes.filter(t => t !== type)
        : [...prev.propertyTypes, type]
    }));
  };

  const toggleCategory = (category: PropertyCategory) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Filter Properties</Text>
          <TouchableOpacity onPress={onClose}>
            <X size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Price Range</Text>
            <View style={styles.priceInputs}>
              <TextInput
                style={[styles.input, { backgroundColor: colors.grayLight, color: colors.text }]}
                placeholder="Min Price"
                placeholderTextColor={colors.grayDark}
                keyboardType="numeric"
                value={filters.minPrice}
                onChangeText={(text) => setFilters({ ...filters, minPrice: text })}
              />
              <TextInput
                style={[styles.input, { backgroundColor: colors.grayLight, color: colors.text }]}
                placeholder="Max Price"
                placeholderTextColor={colors.grayDark}
                keyboardType="numeric"
                value={filters.maxPrice}
                onChangeText={(text) => setFilters({ ...filters, maxPrice: text })}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Property Type</Text>
            <View style={styles.optionsContainer}>
              {propertyTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.option,
                    filters.propertyTypes.includes(type) && { backgroundColor: colors.primaryColor },
                  ]}
                  onPress={() => togglePropertyType(type)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      { color: filters.propertyTypes.includes(type) ? '#fff' : colors.text },
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Category</Text>
            <View style={styles.optionsContainer}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.option,
                    filters.categories.includes(category) && { backgroundColor: colors.primaryColor },
                  ]}
                  onPress={() => toggleCategory(category)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      { color: filters.categories.includes(category) ? '#fff' : colors.text },
                    ]}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.button, styles.resetButton]}
            onPress={handleReset}
          >
            <Text style={[styles.buttonText, { color: colors.text }]}>Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.applyButton, { backgroundColor: colors.primaryColor }]}
            onPress={handleApply}
          >
            <Text style={[styles.buttonText, { color: '#fff' }]}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    marginTop: 50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 12,
  },
  priceInputs: {
    flexDirection: 'row',
    gap: 12,
  },
  input: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  option: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  optionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetButton: {
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  applyButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
}); 