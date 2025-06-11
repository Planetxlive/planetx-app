import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';
import Button from './ui/Button';
import { Switch } from 'react-native-gesture-handler';


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
      {/* Sub Category */}
      <Controller
        control={control}
        name="subCategory"
        render={({ field }) => (
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Sub Category</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.inputBackground }]}
              placeholder="Sub Category (e.g., Boys PG)"
              value={field.value}
              onChangeText={field.onChange}
              placeholderTextColor={colors.grayDark}
            />
            {errors.subCategory && (
              <Text style={styles.errorText}>{errors.subCategory.message}</Text>
            )}
          </View>
        )}
      />

      {/* Sharing Type */}
      <Controller
        control={control}
        name="roomDetails.sharingType"
        render={({ field }) => (
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Sharing Type</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.inputBackground }]}
              placeholder="Sharing Type (e.g., Double Sharing)"
              value={field.value}
              onChangeText={field.onChange}
              placeholderTextColor={colors.grayDark}
            />
            {errors.roomDetails?.sharingType && (
              <Text style={styles.errorText}>{errors.roomDetails.sharingType.message}</Text>
            )}
          </View>
        )}
      />

      {/* Bed Count */}
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

      {/* Attached Bathroom */}
      <Controller
        control={control}
        name="roomDetails.attachedBathroom"
        render={({ field }) => (
          <View style={styles.switchContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Attached Bathroom</Text>
            <Switch value={field.value} onValueChange={field.onChange} />
          </View>
        )}
      />

      {/* Balcony */}
      <Controller
        control={control}
        name="roomDetails.balcony"
        render={({ field }) => (
          <View style={styles.switchContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Balcony</Text>
            <Switch value={field.value} onValueChange={field.onChange} />
          </View>
        )}
      />

      {/* Room Size */}
      <Controller
        control={control}
        name="roomDetails.roomSize"
        render={({ field }) => (
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, { backgroundColor: colors.inputBackground }]}
              placeholder="Room Size (e.g., 10x12 ft)"
              value={field.value}
              onChangeText={field.onChange}
              placeholderTextColor={colors.grayDark}
            />
          </View>
        )}
      />

      {/* Meal Included */}
      <Controller
        control={control}
        name="mealDetails.mealIncluded"
        render={({ field }) => (
          <View style={styles.switchContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Meals Included</Text>
            <Switch value={field.value} onValueChange={field.onChange} />
          </View>
        )}
      />

      {/* Meal Type */}
      <Controller
        control={control}
        name="mealDetails.mealType"
        render={({ field }) => (
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, { backgroundColor: colors.inputBackground }]}
              placeholder="Meal Type (e.g., Vegetarian)"
              value={field.value}
              onChangeText={field.onChange}
              placeholderTextColor={colors.grayDark}
            />
          </View>
        )}
      />

      {/* Meal Frequency */}
      <Controller
        control={control}
        name="mealDetails.mealFrequency"
        render={({ field }) => (
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, { backgroundColor: colors.inputBackground }]}
              placeholder="Meal Frequency (e.g., Breakfast)"
              value={field.value}
              onChangeText={field.onChange}
              placeholderTextColor={colors.grayDark}
            />
          </View>
        )}
      />

      {/* Meal Customization Allowed */}
      <Controller
        control={control}
        name="mealDetails.customizationAllowed"
        render={({ field }) => (
          <View style={styles.switchContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Customization Allowed</Text>
            <Switch value={field.value} onValueChange={field.onChange} />
          </View>
        )}
      />
    </>

      )}


      {formData.propertyCategory === 'Hotel' && (
        <>
        {/* Sub Category */}
        <Controller
          control={control}
          name="subCategory"
          render={({ field }) => (
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Sub Category</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.inputBackground }]}
                placeholder="Hotel / Dormitory"
                value={field.value}
                onChangeText={field.onChange}
                placeholderTextColor={colors.grayDark}
              />
              {errors.subCategory && (
                <Text style={styles.errorText}>{errors.subCategory.message}</Text>
              )}
            </View>
          )}
        />

        {/* Property Name */}
        <Controller
          control={control}
          name="propertyDetails.propertyName"
          render={({ field }) => (
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, { backgroundColor: colors.inputBackground }]}
                placeholder="Property Name"
                value={field.value}
                onChangeText={field.onChange}
                placeholderTextColor={colors.grayDark}
              />
            </View>
          )}
        />

        {/* Property Type */}
        <Controller
          control={control}
          name="propertyDetails.propertyType"
          render={({ field }) => (
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, { backgroundColor: colors.inputBackground }]}
                placeholder="Property Type (e.g., Budget, Luxury)"
                value={field.value}
                onChangeText={field.onChange}
                placeholderTextColor={colors.grayDark}
              />
            </View>
          )}
        />

        {/* Star Rating */}
        <Controller
          control={control}
          name="propertyDetails.starRating"
          render={({ field }) => (
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, { backgroundColor: colors.inputBackground }]}
                placeholder="Star Rating (1-5)"
                value={field.value?.toString()}
                onChangeText={field.onChange}
                keyboardType="numeric"
                placeholderTextColor={colors.grayDark}
              />
            </View>
          )}
        />

        {/* Total Rooms */}
        <Controller
          control={control}
          name="propertyDetails.totalRooms"
          render={({ field }) => (
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, { backgroundColor: colors.inputBackground }]}
                placeholder="Total Rooms"
                value={field.value?.toString()}
                onChangeText={field.onChange}
                keyboardType="numeric"
                placeholderTextColor={colors.grayDark}
              />
            </View>
          )}
        />

        {/* Room Types */}
        <Controller
          control={control}
          name="propertyDetails.roomTypes"
          render={({ field }) => (
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, { backgroundColor: colors.inputBackground }]}
                placeholder="Room Types (e.g., Single Room, Suite)"
                value={field.value}
                onChangeText={field.onChange}
                placeholderTextColor={colors.grayDark}
              />
            </View>
          )}
        />

        {/* Room Type */}
        <Controller
          control={control}
          name="roomDetails.roomType"
          render={({ field }) => (
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, { backgroundColor: colors.inputBackground }]}
                placeholder="Room Type"
                value={field.value}
                onChangeText={field.onChange}
                placeholderTextColor={colors.grayDark}
              />
            </View>
          )}
        />

        {/* Room Size */}
        <Controller
          control={control}
          name="roomDetails.roomSize"
          render={({ field }) => (
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, { backgroundColor: colors.inputBackground }]}
                placeholder="Room Size (e.g., 12x15)"
                value={field.value}
                onChangeText={field.onChange}
                placeholderTextColor={colors.grayDark}
              />
            </View>
          )}
        />

        {/* Beds */}
        <Controller
          control={control}
          name="roomDetails.beds"
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
            </View>
          )}
        />

        {/* Bathroom Type */}
        <Controller
          control={control}
          name="roomDetails.bathroomType"
          render={({ field }) => (
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, { backgroundColor: colors.inputBackground }]}
                placeholder="Bathroom Type (e.g., Attached, Shared)"
                value={field.value}
                onChangeText={field.onChange}
                placeholderTextColor={colors.grayDark}
              />
            </View>
          )}
        />

        {/* Air Conditioning */}
        <Controller
          control={control}
          name="roomDetails.airConditioning"
          render={({ field }) => (
            <View style={styles.switchContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Air Conditioning</Text>
              <Switch value={field.value} onValueChange={field.onChange} />
            </View>
          )}
        />

        {/* Balcony */}
        <Controller
          control={control}
          name="roomDetails.balcony"
          render={({ field }) => (
            <View style={styles.switchContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Balcony</Text>
              <Switch value={field.value} onValueChange={field.onChange} />
            </View>
          )}
        />

        {/* Smoking Allowed */}
        <Controller
          control={control}
          name="roomDetails.smokingAllowed"
          render={({ field }) => (
            <View style={styles.switchContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Smoking Allowed</Text>
              <Switch value={field.value} onValueChange={field.onChange} />
            </View>
          )}
        />

        {/* Occupancy */}
        <Controller
          control={control}
          name="roomDetails.occupancy"
          render={({ field }) => (
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, { backgroundColor: colors.inputBackground }]}
                placeholder="Occupancy (e.g., 2 Adults)"
                value={field.value}
                onChangeText={field.onChange}
                placeholderTextColor={colors.grayDark}
              />
            </View>
          )}
        />

        {/* Price Per Night */}
        <Controller
          control={control}
          name="roomDetails.pricePerNight"
          render={({ field }) => (
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, { backgroundColor: colors.inputBackground }]}
                placeholder="Price per Night (INR)"
                value={field.value?.toString()}
                onChangeText={field.onChange}
                keyboardType="numeric"
                placeholderTextColor={colors.grayDark}
              />
            </View>
          )}
        />

        {/* Availability */}
        <Controller
          control={control}
          name="roomDetails.availability"
          render={({ field }) => (
            <View style={styles.switchContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Available</Text>
              <Switch value={field.value} onValueChange={field.onChange} />
            </View>
          )}
        />
      </>

      )}


      {formData.propertyCategory === 'Office' && (
        <>
          {/* Sub Category */}
          <Controller
            control={control}
            name="subCategory"
            render={({ field }) => (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Sub Category</Text>
                <TextInput
                  placeholder="Office"
                  style={styles.input}
                  value={field.value}
                  onChangeText={field.onChange}
                  placeholderTextColor={colors.grayDark}
                />
              </View>
            )}
          />

          {/* Transaction Type */}
          <Controller
            control={control}
            name="transactionType"
            render={({ field }) => (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Transaction Type</Text>
                <TextInput
                  placeholder="For Sale / For Rent / Hourly Basis"
                  style={styles.input}
                  value={field.value}
                  onChangeText={field.onChange}
                  placeholderTextColor={colors.grayDark}
                />
              </View>
            )}
          />

          {/* Property Name */}
          <Controller
            control={control}
            name="propertyDetails.propertyName"
            render={({ field }) => (
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Property Name"
                  style={styles.input}
                  value={field.value}
                  onChangeText={field.onChange}
                  placeholderTextColor={colors.grayDark}
                />
              </View>
            )}
          />

          {/* Office Type */}
          <Controller
            control={control}
            name="propertyDetails.officeType"
            render={({ field }) => (
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Office Type"
                  style={styles.input}
                  value={field.value}
                  onChangeText={field.onChange}
                  placeholderTextColor={colors.grayDark}
                />
              </View>
            )}
          />

          {/* Built-Up Area */}
          <Controller
            control={control}
            name="propertyDetails.builtUpArea.size"
            render={({ field }) => (
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Built-Up Area (sq ft)"
                  style={styles.input}
                  keyboardType="numeric"
                  value={field.value?.toString()}
                  onChangeText={field.onChange}
                  placeholderTextColor={colors.grayDark}
                />
              </View>
            )}
          />

          {/* Carpet Area */}
          <Controller
            control={control}
            name="propertyDetails.carpetArea.size"
            render={({ field }) => (
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Carpet Area (sq ft)"
                  style={styles.input}
                  keyboardType="numeric"
                  value={field.value?.toString()}
                  onChangeText={field.onChange}
                  placeholderTextColor={colors.grayDark}
                />
              </View>
            )}
          />

          {/* Furnished Status */}
          <Controller
            control={control}
            name="propertyDetails.furnishedStatus"
            render={({ field }) => (
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Furnished Status"
                  style={styles.input}
                  value={field.value}
                  onChangeText={field.onChange}
                  placeholderTextColor={colors.grayDark}
                />
              </View>
            )}
          />

          {/* Furnishing Details */}
          {[
            { name: 'workstations', label: 'Workstations' },
            { name: 'cabinRooms', label: 'Cabin Rooms' },
            { name: 'meetingRooms', label: 'Meeting Rooms' },
            { name: 'conferenceRooms', label: 'Conference Rooms' },
          ].map(({ name, label }) => (
            <Controller
              key={name}
              control={control}
              name={`propertyDetails.furnishingDetails.${name}`}
              render={({ field }) => (
                <View style={styles.inputContainer}>
                  <TextInput
                    placeholder={label}
                    style={styles.input}
                    keyboardType="numeric"
                    value={field.value?.toString()}
                    onChangeText={field.onChange}
                    placeholderTextColor={colors.grayDark}
                  />
                </View>
              )}
            />
          ))}

          {/* Boolean furnishing details */}
          {[
            { name: 'pantry', label: 'Pantry' },
            { name: 'cafeteria', label: 'Cafeteria' },
            { name: 'serverRoom', label: 'Server Room' },
            { name: 'airConditioning', label: 'Air Conditioning' },
          ].map(({ name, label }) => (
            <Controller
              key={name}
              control={control}
              name={`propertyDetails.furnishingDetails.${name}`}
              render={({ field }) => (
                <View style={styles.switchContainer}>
                  <Text style={styles.label}>{label}</Text>
                  <Switch value={field.value} onValueChange={field.onChange} />
                </View>
              )}
            />
          ))}

          {/* Floor Details */}
          {[
            { name: 'totalFloors', label: 'Total Floors' },
            { name: 'officeOnFloor', label: 'Office On Floor' },
          ].map(({ name, label }) => (
            <Controller
              key={name}
              control={control}
              name={`propertyDetails.floorDetails.${name}`}
              render={({ field }) => (
                <View style={styles.inputContainer}>
                  <TextInput
                    placeholder={label}
                    style={styles.input}
                    keyboardType="numeric"
                    value={field.value?.toString()}
                    onChangeText={field.onChange}
                    placeholderTextColor={colors.grayDark}
                  />
                </View>
              )}
            />
          ))}

          {/* Rental Details */}
          {[
            { name: 'monthlyRent', label: 'Monthly Rent' },
            { name: 'securityDeposit', label: 'Security Deposit' },
            { name: 'hourlyRent', label: 'Hourly Rent' },
          ].map(({ name, label }) => (
            <Controller
              key={name}
              control={control}
              name={`pricing.rentalDetails.${name}`}
              render={({ field }) => (
                <View style={styles.inputContainer}>
                  <TextInput
                    placeholder={label}
                    style={styles.input}
                    keyboardType="numeric"
                    value={field.value?.toString()}
                    onChangeText={field.onChange}
                    placeholderTextColor={colors.grayDark}
                  />
                </View>
              )}
            />
          ))}
        </>

      )}

      {formData.propertyCategory === 'Residential' && (
        <>
          {/* About */}
          <Controller
            control={control}
            name="about.bedrooms"
            render={({ field }) => (
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.inputBackground }]}
                  placeholder="Number of Bedrooms"
                  value={field.value?.toString()}
                  onChangeText={field.onChange}
                  keyboardType="numeric"
                  placeholderTextColor={colors.grayDark}
                />
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
                  placeholder="Number of Bathrooms"
                  value={field.value?.toString()}
                  onChangeText={field.onChange}
                  keyboardType="numeric"
                  placeholderTextColor={colors.grayDark}
                />
              </View>
            )}
          />

          <Controller
            control={control}
            name="about.balconies"
            render={({ field }) => (
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.inputBackground }]}
                  placeholder="Number of Balconies"
                  value={field.value?.toString()}
                  onChangeText={field.onChange}
                  keyboardType="numeric"
                  placeholderTextColor={colors.grayDark}
                />
              </View>
            )}
          />

          {/* Property Area */}
          <Controller
            control={control}
            name="propertyArea.carpetArea"
            render={({ field }) => (
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.inputBackground }]}
                  placeholder="Carpet Area (sq.ft)"
                  value={field.value?.toString()}
                  onChangeText={field.onChange}
                  keyboardType="numeric"
                  placeholderTextColor={colors.grayDark}
                />
              </View>
            )}
          />

          <Controller
            control={control}
            name="propertyArea.builtUpArea"
            render={({ field }) => (
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.inputBackground }]}
                  placeholder="Built-up Area (sq.ft)"
                  value={field.value?.toString()}
                  onChangeText={field.onChange}
                  keyboardType="numeric"
                  placeholderTextColor={colors.grayDark}
                />
              </View>
            )}
          />

          {/* Other Rooms (Switches) */}
          <Controller
            control={control}
            name="otherRooms.poojaRoom"
            render={({ field }) => (
              <View style={styles.switchContainer}>
                <Text style={[styles.label, { color: colors.text }]}>Pooja Room</Text>
                <Switch value={field.value} onValueChange={field.onChange} />
              </View>
            )}
          />

          <Controller
            control={control}
            name="otherRooms.guestRoom"
            render={({ field }) => (
              <View style={styles.switchContainer}>
                <Text style={[styles.label, { color: colors.text }]}>Guest Room</Text>
                <Switch value={field.value} onValueChange={field.onChange} />
              </View>
            )}
          />

          <Controller
            control={control}
            name="otherRooms.servantRoom"
            render={({ field }) => (
              <View style={styles.switchContainer}>
                <Text style={[styles.label, { color: colors.text }]}>Servant Room</Text>
                <Switch value={field.value} onValueChange={field.onChange} />
              </View>
            )}
          />

          <Controller
            control={control}
            name="otherRooms.studyRoom"
            render={({ field }) => (
              <View style={styles.switchContainer}>
                <Text style={[styles.label, { color: colors.text }]}>Study Room</Text>
                <Switch value={field.value} onValueChange={field.onChange} />
              </View>
            )}
          />

          {/* Furnishing Status */}
          <Controller
            control={control}
            name="furnishingStatus"
            render={({ field }) => (
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.inputBackground }]}
                  placeholder="Furnishing Status (Fully, Semi, Unfurnished)"
                  value={field.value}
                  onChangeText={field.onChange}
                  placeholderTextColor={colors.grayDark}
                />
              </View>
            )}
          />

          {/* Furnishing Details (Numbers) */}
          {[
            { label: 'Fans', name: 'furnishingDetails.fans' },
            { label: 'Lights', name: 'furnishingDetails.lights' },
            { label: 'TVs', name: 'furnishingDetails.tv' },
            { label: 'Beds', name: 'furnishingDetails.beds' },
            { label: 'ACs', name: 'furnishingDetails.ac' },
            { label: 'Wardrobes', name: 'furnishingDetails.wardrobes' },
            { label: 'Exhaust Fans', name: 'furnishingDetails.exhaustFans' },
            { label: 'Curtains', name: 'furnishingDetails.curtains' },
            { label: 'Floor Lamps', name: 'furnishingDetails.floorLamps' },
          ].map(({ label, name }) => (
            <Controller
              key={name}
              control={control}
              name={name}
              render={({ field }) => (
                <View style={styles.inputContainer}>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.inputBackground }]}
                    placeholder={`${label} (number)`}
                    value={field.value?.toString()}
                    onChangeText={field.onChange}
                    keyboardType="numeric"
                    placeholderTextColor={colors.grayDark}
                  />
                </View>
              )}
            />
          ))}

          {/* Furnishing Details (Boolean switches) */}
          {[
            { label: 'Dining Table', name: 'furnishingDetails.diningTable' },
            { label: 'Sofa', name: 'furnishingDetails.sofa' },
            { label: 'Stove', name: 'furnishingDetails.stove' },
            { label: 'Kitchen Cabinets', name: 'furnishingDetails.kitchenCabinets' },
            { label: 'Chimney', name: 'furnishingDetails.chimney' },
            { label: 'Coffee Table', name: 'furnishingDetails.coffeeTable' },
            { label: 'Refrigerator', name: 'furnishingDetails.refrigerator' },
            { label: 'Microwave', name: 'furnishingDetails.microwave' },
            { label: 'Dishwasher', name: 'furnishingDetails.dishwasher' },
            { label: 'Water Purifier', name: 'furnishingDetails.waterPurifier' },
            { label: 'Washing Machine', name: 'furnishingDetails.washingMachine' },
          ].map(({ label, name }) => (
            <Controller
              key={name}
              control={control}
              name={name}
              render={({ field }) => (
                <View style={styles.switchContainer}>
                  <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
                  <Switch value={field.value} onValueChange={field.onChange} />
                </View>
              )}
            />
          ))}

          {/* Floors */}
          <Controller
            control={control}
            name="totalFloors"
            render={({ field }) => (
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.inputBackground }]}
                  placeholder="Total Floors"
                  value={field.value?.toString()}
                  onChangeText={field.onChange}
                  keyboardType="numeric"
                  placeholderTextColor={colors.grayDark}
                />
              </View>
            )}
          />

          <Controller
            control={control}
            name="propertyOnFloor"
            render={({ field }) => (
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.inputBackground }]}
                  placeholder="Property on Floor (e.g., 3)"
                  value={field.value?.toString()}
                  onChangeText={field.onChange}
                  keyboardType="numeric"
                  placeholderTextColor={colors.grayDark}
                />
              </View>
            )}
          />

          {/* Flat Number */}
          <Controller
            control={control}
            name="flatNumber"
            render={({ field }) => (
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.inputBackground }]}
                  placeholder="Flat Number"
                  value={field.value}
                  onChangeText={field.onChange}
                  placeholderTextColor={colors.grayDark}
                />
              </View>
            )}
          />

          {/* Parking */}
          <Controller
            control={control}
            name="parking.covered"
            render={({ field }) => (
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.inputBackground }]}
                  placeholder="Covered Parking Slots"
                  value={field.value?.toString()}
                  onChangeText={field.onChange}
                  keyboardType="numeric"
                  placeholderTextColor={colors.grayDark}
                />
              </View>
            )}
          />

          <Controller
            control={control}
            name="parking.open"
            render={({ field }) => (
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.inputBackground }]}
                  placeholder="Open Parking Slots"
                  value={field.value?.toString()}
                  onChangeText={field.onChange}
                  keyboardType="numeric"
                  placeholderTextColor={colors.grayDark}
                />
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
  container: {
    padding: 20,
    paddingBottom: 100,
    backgroundColor: "#ffffff", // Optional: change to light gray for subtle look
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
    marginTop: 30,
    marginBottom: 12,
  },

  subSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginTop: 20,
    marginBottom: 10,
  },

  inputContainer: {
    marginBottom: 16,
  },

  label: {
    fontSize: 14,
    color: "#444",
    marginBottom: 6,
    fontWeight: "500",
  },

  input: {
    height: 45,
    borderWidth: 1,
    borderColor: "#d0d0d0",
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    backgroundColor: "#f8f8f8",
    color: "#000",
  },

  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 4,
    marginBottom: 14,
    borderBottomWidth: 0.5,
    borderColor: "#ddd",
  },
});
