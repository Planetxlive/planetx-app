import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useProperties, PropertyType } from '@/context/PropertyContext';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';
import { ArrowLeft } from 'lucide-react-native';
import Button from '@/components/ui/Button';
import BasicInformation from '@/components/BasicInformation';
import PropertyDetails from '@/components/PropertyDetails';
import MediaUpload from '@/components/MediaUploads';
import Amenities from '@/components/Amenities';
import PriceDetails from '@/components/PriceDetails';

type Step = 'basic' | 'details' | 'media' | 'amenities' | 'price';

export default function AddPropertyScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const { user } = useAuth();
  const { addProperty } = useProperties();
  const [currentStep, setCurrentStep] = useState<Step>('basic');
  const [formData, setFormData] = useState({
    listingType: 'Buy' as 'Buy' | 'Rent' | 'Paying Guest' | 'Rent Hourly',
    propertyCategory: 'Residential' as 'Residential' | 'Pg' | 'Hotel' | 'Office' | 'Shop' | 'Warehouse' | 'Shared Warehouse' | 'EventSpace',
    propertyType: 'Flat/Apartment' as PropertyType,
    title: '',
    city: '',
    state: '',
    locality: '',
    subLocality: '',
    apartment: '',
    houseNo: '',
    bedrooms: '1',
    bathrooms: '1',
    balconies: '0',
    carpetArea: '',
    builtUpArea: '',
    totalFloors: '',
    propertyOnFloor: '',
    furnishingStatus: 'Unfurnished',
    coveredParking: '0',
    openParking: '0',
    availabilityStatus: 'Ready to move',
    buildingType: 'Resale',
    reraStatus: 'RERA-Registered',
    images: [] as string[],
    video: '',
    amenities: [] as string[],
    powerBackup: 'None',
    facing: 'North',
    waterSource: [] as string[],
    features: [] as string[],
    flooring: '',
    roadWidth: '',
    locationAdvantages: [] as string[],
    expectedPrice: '',
    pricePerSqft: '',
    isAllInclusive: false,
    isNegotiable: true,
    excludedCharges: true,
    maintenance: '',
    // Additional fields for other property types
    pgSubCategory: 'Boys PG',
    pgSharingType: 'Single Sharing',
    pgBedCount: '1',
    pgAttachedBathroom: false,
    pgBalcony: false,
    pgRoomSize: '',
    pgMealIncluded: false,
    pgMealType: 'Vegetarian',
    pgMealFrequency: 'Breakfast',
    pgCustomizationAllowed: false,
    hotelPropertyName: '',
    hotelType: 'Budget',
    hotelStarRating: '3',
    hotelTotalRooms: '10',
    hotelRoomType: 'Standard',
    hotelRoomSize: 'Medium',
    hotelBeds: '1',
    hotelBathroomType: 'Attached',
    hotelAirConditioning: true,
    hotelSmokingAllowed: false,
    hotelOccupancy: '2',
    hotelPricePerNight: '',
    hotelAvailability: true,
  });

  const handleNext = () => {
    switch (currentStep) {
      case 'basic':
        setCurrentStep('details');
        break;
      case 'details':
        setCurrentStep('media');
        break;
      case 'media':
        setCurrentStep('amenities');
        break;
      case 'amenities':
        setCurrentStep('price');
        break;
      case 'price':
        handleSubmit();
        break;
    }
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'details':
        setCurrentStep('basic');
        break;
      case 'media':
        setCurrentStep('details');
        break;
      case 'amenities':
        setCurrentStep('media');
        break;
      case 'price':
        setCurrentStep('amenities');
        break;
    }
  };

  const handleSubmit = async () => {
    try {
      const propertyData = {
        title: formData.title,
        description: `${formData.bedrooms} BHK ${formData.propertyType} in ${formData.locality}`,
        type: formData.propertyType,
        price: parseFloat(formData.expectedPrice),
        priceUnit: formData.listingType === 'Buy' ? 'total' as const : 'perMonth' as const,
        area: parseFloat(formData.carpetArea),
        areaUnit: 'sqft' as const,
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        location: {
          address: `${formData.houseNo}, ${formData.apartment}, ${formData.locality}`,
          city: formData.city,
          state: formData.state,
          country: 'India',
        },
        features: formData.features,
        furnishing: [formData.furnishingStatus],
        nearbyPlaces: formData.locationAdvantages.map(place => ({ name: place })),
        images: formData.images,
        owner: {
          id: user?.id || '',
          name: user?.name || '',
          image: user?.profileImage || '',
          phone: user?.phoneNumber || '',
          rating: 0,
          reviews: 0,
        },
        parking: {
          covered: parseInt(formData.coveredParking),
          open: parseInt(formData.openParking),
        },
        ownerId: user?.id || '',
        listingType: formData.listingType,
      };

      await addProperty(propertyData);
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error adding property:', error);
    }
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {['basic', 'details', 'media', 'amenities', 'price'].map((step, index) => (
        <View key={step} style={styles.stepContainer}>
          <View
            style={[
              styles.stepDot,
              {
                backgroundColor:
                  currentStep === step
                    ? colors.primaryColor
                    : ['basic', 'details', 'media', 'amenities', 'price'].indexOf(currentStep) >
                      index
                    ? colors.successColor
                    : colors.grayLight,
              },
            ]}
          >
            {['basic', 'details', 'media', 'amenities', 'price'].indexOf(currentStep) > index && (
              <Text style={styles.checkmark}>✓</Text>
            )}
          </View>
          {index < 4 && <View style={styles.stepLine} />}
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Add Property</Text>
        <View style={{ width: 24 }} />
      </View>

      {renderStepIndicator()}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {currentStep === 'basic' && (
          <BasicInformation formData={formData} setFormData={setFormData} />
        )}
        {currentStep === 'details' && (
          <PropertyDetails formData={formData} setFormData={setFormData} />
        )}
        {currentStep === 'media' && (
          <MediaUpload formData={formData} setFormData={setFormData} />
        )}
        {currentStep === 'amenities' && (
          <Amenities formData={formData} setFormData={setFormData} />
        )}
        {currentStep === 'price' && (
          <PriceDetails formData={formData} setFormData={setFormData} />
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={currentStep === 'price' ? 'Submit Property' : 'Next'}
          onPress={handleNext}
          fullWidth
        />
      </View>
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
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: '#EEEEEE',
    marginHorizontal: 4,
  },
  checkmark: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
});