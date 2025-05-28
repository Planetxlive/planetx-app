import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';
import { PropertyType } from '@/context/PropertyContext';

const listingTypeOptions = [
  'Buy', 'Rent', 'Paying Guest', 'Rent Hourly'
] as const;

const propertyCategoryOptions = [
  'Residential', 'Pg', 'Hotel', 'Office', 'Shop', 'Warehouse', 'Shared Warehouse', 'EventSpace'
] as const;

type PropertyCategory = typeof propertyCategoryOptions[number];

const propertyTypeOptions: Record<PropertyCategory, PropertyType[]> = {
  Residential: ['Flat/Apartment', 'House/Villa', 'Plot/Land'],
  Pg: ['Flat/Apartment'],
  Hotel: ['Commercial'],
  Office: ['Commercial'],
  Shop: ['Commercial'],
  Warehouse: ['Warehouse'],
  'Shared Warehouse': ['Warehouse'],
  EventSpace: ['Commercial'],
};

interface FormData {
  listingType: 'Buy' | 'Rent' | 'Paying Guest' | 'Rent Hourly';
  propertyCategory: PropertyCategory;
  propertyType: PropertyType;
  title: string;
  city: string;
  state: string;
  locality: string;
  subLocality: string;
  apartment: string;
  houseNo: string;
  bedrooms: string;
  bathrooms: string;
  balconies: string;
  carpetArea: string;
  builtUpArea: string;
  totalFloors: string;
  propertyOnFloor: string;
  furnishingStatus: string;
  coveredParking: string;
  openParking: string;
  availabilityStatus: string;
  buildingType: string;
  reraStatus: string;
  images: string[];
  video: string;
  amenities: string[];
  powerBackup: string;
  facing: string;
  waterSource: string[];
  features: string[];
  flooring: string;
  roadWidth: string;
  locationAdvantages: string[];
  expectedPrice: string;
  pricePerSqft: string;
  isAllInclusive: boolean;
  isNegotiable: boolean;
  excludedCharges: boolean;
  maintenance: string;
  pgSubCategory: string;
  pgSharingType: string;
  pgBedCount: string;
  pgAttachedBathroom: boolean;
  pgBalcony: boolean;
  pgRoomSize: string;
  pgMealIncluded: boolean;
  pgMealType: string;
  pgMealFrequency: string;
  pgCustomizationAllowed: boolean;
  hotelPropertyName: string;
  hotelType: string;
  hotelStarRating: string;
  hotelTotalRooms: string;
  hotelRoomType: string;
  hotelRoomSize: string;
  hotelBeds: string;
  hotelBathroomType: string;
  hotelAirConditioning: boolean;
  hotelSmokingAllowed: boolean;
  hotelOccupancy: string;
  hotelPricePerNight: string;
  hotelAvailability: boolean;
}

interface BasicInformationProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
}

export default function BasicInformation({ formData, setFormData }: BasicInformationProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  return (
    <View style={styles.formSection}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Basic Information</Text>

      <Text style={[styles.label, { color: colors.text }]}>Are you looking for</Text>
      <View style={styles.optionsContainer}>
        {listingTypeOptions.map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.optionButton,
              formData.listingType === type && {
                backgroundColor: colors.primaryColor,
              },
            ]}
            onPress={() => setFormData({ ...formData, listingType: type })}
          >
            <Text
              style={[
                styles.optionText,
                formData.listingType === type && { color: 'white' },
              ]}
            >
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[styles.label, { color: colors.text }]}>What kind of property</Text>
      <View style={styles.optionsContainer}>
        {propertyCategoryOptions.map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.optionButton,
              formData.propertyCategory === type && {
                backgroundColor: colors.primaryColor,
              },
            ]}
            onPress={() => setFormData({ ...formData, propertyCategory: type, propertyType: propertyTypeOptions[type][0] })}
          >
            <Text
              style={[
                styles.optionText,
                formData.propertyCategory === type && { color: 'white' },
              ]}
            >
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[styles.label, { color: colors.text }]}>Select Property Type</Text>
      <View style={styles.optionsContainer}>
        {propertyTypeOptions[formData.propertyCategory]?.map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.optionButton,
              formData.propertyType === type && {
                backgroundColor: colors.primaryColor,
              },
            ]}
            onPress={() => setFormData({ ...formData, propertyType: type })}
          >
            <Text
              style={[
                styles.optionText,
                formData.propertyType === type && { color: 'white' },
              ]}
            >
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  formSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginBottom: 8,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#7C3AED',
    marginRight: 8,
    marginBottom: 8,
  },
  optionText: {
    color: '#7C3AED',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
});