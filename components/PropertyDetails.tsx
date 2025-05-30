import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';
import Button from './ui/Button';

const baseSchema = z.object({
  propertyType: z.string().min(1, 'Property type is required'),
  category: z.string().min(1, 'Category is required'),
  location: z.object({
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    locality: z.string().min(1, 'Locality is required'),
    subLocality: z.string().optional(),
    apartment: z.string().min(1, 'Apartment is required'),
    houseNumber: z.string().optional(),
  }),
  description: z.string().optional(),
});

const residentialSchema = baseSchema.extend({
  about: z.object({
    bedrooms: z.string().transform(val => parseInt(val)),
    bathrooms: z.string().transform(val => parseInt(val)),
    balconies: z.string().transform(val => parseInt(val)),
  }),
  furnishingStatus: z.string().min(1, 'Furnishing status is required'),
  totalFloors: z.string().transform(val => parseInt(val) || 0),
  propertyOnFloor: z.string().transform(val => parseInt(val) || 0),
  availabilityStatus: z.string().min(1, 'Availability status is required'),
  availableFrom: z.string().optional(),
  ageOfProperty: z.string().transform(val => parseInt(val) || 0),
});

const pgSchema = baseSchema.extend({
  subCategory: z.string().min(1, 'Sub-category is required'),
  roomDetails: z.object({
    sharingType: z.string().min(1, 'Sharing type is required'),
    bedCount: z.string().transform(val => parseInt(val)),
    attachedBathroom: z.boolean(),
    balcony: z.boolean(),
    roomSize: z.string().optional(),
  }),
  mealDetails: z.object({
    mealIncluded: z.boolean(),
    mealType: z.string().optional(),
    mealFrequency: z.string().optional(),
    customizationAllowed: z.boolean(),
  }),
  ageOfProperty: z.string().transform(val => parseInt(val) || 0),
});

type BaseFormData = {
  propertyType: string;
  category: string;
  location: {
    city: string;
    state: string;
    locality: string;
    subLocality?: string;
    apartment: string;
    houseNumber?: string;
  };
  description?: string;
};

type ResidentialFormData = BaseFormData & {
  about: {
    bedrooms: string;
    bathrooms: string;
    balconies: string;
  };
  furnishingStatus: string;
  totalFloors: string;
  propertyOnFloor: string;
  availabilityStatus: string;
  availableFrom?: string;
  ageOfProperty: string;
};

type PGFormData = BaseFormData & {
  subCategory: string;
  roomDetails: {
    sharingType: string;
    bedCount: string;
    attachedBathroom: boolean;
    balcony: boolean;
    roomSize?: string;
  };
  mealDetails: {
    mealIncluded: boolean;
    mealType?: string;
    mealFrequency?: string;
    customizationAllowed: boolean;
  };
  ageOfProperty: string;
};

type FormData = ResidentialFormData | PGFormData;

interface PropertyDetailsProps {
  formData: {
    propertyType: string;
    propertyCategory: string;
    city: string;
    state: string;
    locality: string;
    subLocality: string;
    apartment: string;
    houseNo: string;
    bedrooms: string;
    bathrooms: string;
    balconies: string;
    furnishingStatus: string;
    totalFloors: string;
    propertyOnFloor: string;
    availabilityStatus: string;
    availableFrom?: string;
    ageOfProperty?: string;
    description?: string;
    pgSubCategory?: string;
    pgSharingType?: string;
    pgBedCount?: string;
    pgAttachedBathroom?: boolean;
    pgBalcony?: boolean;
    pgRoomSize?: string;
    pgMealIncluded?: boolean;
    pgMealType?: string;
    pgMealFrequency?: string;
    pgCustomizationAllowed?: boolean;
  };
  setFormData: (data: any) => void;
}

export default function PropertyDetails({ formData, setFormData }: PropertyDetailsProps) {
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme];
  const schema = formData.propertyCategory === 'Residential' ? residentialSchema : pgSchema;

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: formData.propertyCategory === 'Residential' ? {
      propertyType: formData.propertyType,
      category: formData.propertyCategory,
      location: {
        city: formData.city,
        state: formData.state,
        locality: formData.locality,
        subLocality: formData.subLocality,
        apartment: formData.apartment,
        houseNumber: formData.houseNo,
      },
      description: formData.description,
      about: {
        bedrooms: formData.bedrooms,
        bathrooms: formData.bathrooms,
        balconies: formData.balconies,
      },
      furnishingStatus: formData.furnishingStatus,
      totalFloors: formData.totalFloors,
      propertyOnFloor: formData.propertyOnFloor,
      availabilityStatus: formData.availabilityStatus,
      availableFrom: formData.availableFrom || '',
      ageOfProperty: formData.ageOfProperty || '0',
    } : {
      propertyType: formData.propertyType,
      category: formData.propertyCategory,
      location: {
        city: formData.city,
        state: formData.state,
        locality: formData.locality,
        subLocality: formData.subLocality,
        apartment: formData.apartment,
        houseNumber: formData.houseNo,
      },
      description: formData.description,
      subCategory: formData.pgSubCategory || '',
      roomDetails: {
        sharingType: formData.pgSharingType || '',
        bedCount: formData.pgBedCount || '',
        attachedBathroom: formData.pgAttachedBathroom || false,
        balcony: formData.pgBalcony || false,
        roomSize: formData.pgRoomSize,
      },
      mealDetails: {
        mealIncluded: formData.pgMealIncluded || false,
        mealType: formData.pgMealType,
        mealFrequency: formData.pgMealFrequency,
        customizationAllowed: formData.pgCustomizationAllowed || false,
      },
      ageOfProperty: formData.ageOfProperty || '0',
    },
  });

  const onSubmit = (data: any) => {
    setFormData({ ...formData, ...data });
  };

  return (
    <View style={styles.formSection}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Property Details</Text>
      <Controller
        control={control}
        name="location.city"
        render={({ field }) => (
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, { backgroundColor: colors.inputBackground }]}
              placeholder="City"
              value={field.value}
              onChangeText={field.onChange}
              placeholderTextColor={colors.grayDark}
            />
            {errors.location?.city && (
              <Text style={styles.errorText}>{errors.location.city.message}</Text>
            )}
          </View>
        )}
      />
      <Controller
        control={control}
        name="location.state"
        render={({ field }) => (
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, { backgroundColor: colors.inputBackground }]}
              placeholder="State"
              value={field.value}
              onChangeText={field.onChange}
              placeholderTextColor={colors.grayDark}
            />
            {errors.location?.state && (
              <Text style={styles.errorText}>{errors.location.state.message}</Text>
            )}
          </View>
        )}
      />
      {formData.propertyCategory === 'Residential' && (
        <>
          <Controller
            control={control}
            name="about.bedrooms"
            render={({ field }) => (
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.inputBackground }]}
                  placeholder="Bedrooms"
                  value={field.value?.toString()}
                  onChangeText={field.onChange}
                  keyboardType="numeric"
                  placeholderTextColor={colors.grayDark}
                />
                {errors.about?.bedrooms && (
                  <Text style={styles.errorText}>{errors.about.bedrooms.message}</Text>
                )}
              </View>
            )}
          />
          <Controller
            control={control}
            name="about.bathrooms"
            render={({ field }) => (
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.inputBackground }]}
                  placeholder="Bathrooms"
                  value={field.value?.toString()}
                  onChangeText={field.onChange}
                  keyboardType="numeric"
                  placeholderTextColor={colors.grayDark}
                />
                {errors.about?.bathrooms && (
                  <Text style={styles.errorText}>{errors.about.bathrooms.message}</Text>
                )}
              </View>
            )}
          />
        </>
      )}
      {formData.propertyCategory === 'Pg' && (
        <>
          <Controller
            control={control}
            name="roomDetails.bedCount"
            render={({ field }) => (
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.inputBackground }]}
                  placeholder="Number of Beds"
                  value={field.value?.toString()}
                  onChangeText={field.onChange}
                  keyboardType="numeric"
                  placeholderTextColor={colors.grayDark}
                />
                {errors.roomDetails?.bedCount && (
                  <Text style={styles.errorText}>{errors.roomDetails.bedCount.message}</Text>
                )}
              </View>
            )}
          />
        </>
      )}
      <Button title="Submit Details" onPress={handleSubmit(onSubmit)} fullWidth />
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
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
    fontFamily: 'Inter-Regular',
  },
});