import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';
import { PropertyCategory } from '@/context/PropertyContext';

// const listingTypeOptions = [
//   'Buy', 'Rent', 'Paying Guest', 'Rent Hourly'
// ] as const;

// const propertyCategoryOptions = [
//   'Residential', 'Pg', 'Hotel', 'Office', 'Shop', 'Warehouse', 'Shared Warehouse', 'EventSpace'
// ] as const;

// type PropertyCategory = typeof propertyCategoryOptions[number];

// const propertyTypeOptions: Record<PropertyCategory, PropertyType[]> = {
//   Residential: ['Flat/Apartment', 'House/Villa', 'Plot/Land'],
//   Pg: ['Flat/Apartment'],
//   Hotel: ['Commercial'],
//   Office: ['Commercial'],
//   Shop: ['Commercial'],
//   Warehouse: ['Warehouse'],
//   'Shared Warehouse': ['Warehouse'],
//   EventSpace: ['Commercial'],
// };

// interface FormData {
//   listingType: 'Buy' | 'Rent' | 'Paying Guest' | 'Rent Hourly';
//   propertyCategory: PropertyCategory;
//   propertyType: PropertyType;
//   title: string;
//   city: string;
//   state: string;
//   locality: string;
//   subLocality: string;
//   apartment: string;
//   houseNo: string;
//   bedrooms: string;
//   bathrooms: string;
//   balconies: string;
//   carpetArea: string;
//   builtUpArea: string;
//   totalFloors: string;
//   propertyOnFloor: string;
//   furnishingStatus: string;
//   coveredParking: string;
//   openParking: string;
//   availabilityStatus: string;
//   buildingType: string;
//   reraStatus: string;
//   images: string[];
//   video: string;
//   amenities: string[];
//   powerBackup: string;
//   facing: string;
//   waterSource: string[];
//   features: string[];
//   flooring: string;
//   roadWidth: string;
//   locationAdvantages: string[];
//   expectedPrice: string;
//   pricePerSqft: string;
//   isAllInclusive: boolean;
//   isNegotiable: boolean;
//   excludedCharges: boolean;
//   maintenance: string;
//   pgSubCategory: string;
//   pgSharingType: string;
//   pgBedCount: string;
//   pgAttachedBathroom: boolean;
//   pgBalcony: boolean;
//   pgRoomSize: string;
//   pgMealIncluded: boolean;
//   pgMealType: string;
//   pgMealFrequency: string;
//   pgCustomizationAllowed: boolean;
//   hotelPropertyName: string;
//   hotelType: string;
//   hotelStarRating: string;
//   hotelTotalRooms: string;
//   hotelRoomType: string;
//   hotelRoomSize: string;
//   hotelBeds: string;
//   hotelBathroomType: string;
//   hotelAirConditioning: boolean;
//   hotelSmokingAllowed: boolean;
//   hotelOccupancy: string;
//   hotelPricePerNight: string;
//   hotelAvailability: boolean;
// }

// interface BasicInformationProps {
//   formData: FormData;
//   setFormData: (data: FormData) => void;
// }r

interface BasicInformationProps{
  propertyType: string;
  setPropertyType: React.Dispatch<React.SetStateAction<string>>;
  propertyCategory: string;
  setPropertyCategory: React.Dispatch<React.SetStateAction<string>>;
}

export default function BasicInformation({ propertyType, setPropertyType, propertyCategory, setPropertyCategory }: BasicInformationProps) {
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme];

  return (
    <View style={styles.formSection}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Basic Information</Text>

      <Text style={[styles.label, { color: colors.text }]}>Are you looking for</Text>
      <View style={styles.optionsContainer}>
        {[
        "Residential",
        "Pg",
        "Hotel",
        "Office",
        "Shop",
        "Warehouse",
        "Shared Warehouse",
        "EventSpace",
      ].map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.optionButton,
              propertyCategory === type && {
                backgroundColor: colors.primaryColor,
              },
            ]}
            onPress={() => setPropertyCategory(type)}
          >
            <Text
              style={[
                styles.optionText,
                propertyCategory === type && { color: 'white' },
              ]}
            >
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      

       <Text style={[styles.label, { color: colors.text }]}>What kind of property</Text>
      <View style={styles.optionsContainer}>
        {["For Sale", "For Rent", "Commercial"].map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.optionButton,
              propertyType === type && {
                backgroundColor: colors.primaryColor,
              },
            ]}
            onPress={() => setPropertyType(type)}
          >
            <Text
              style={[
                styles.optionText,
                propertyType === type && { color: 'white' },
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