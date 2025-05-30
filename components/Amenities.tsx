import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';
import Button from './ui/Button';
import { CheckBox } from 'react-native-elements';

const residentialAmenitiesSchema = z.object({
  amenities: z.array(z.string()).min(1, 'Select at least one amenity'),
});

const pgAmenitiesSchema = z.object({
  amenities: z.array(z.string()).min(1, 'Select at least one amenity'),
});

interface AmenitiesProps {
  formData: any;
  setFormData: (data: any) => void;
}

export default function Amenities({ formData, setFormData }: AmenitiesProps) {
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme];
  const schema = formData.propertyCategory === 'Residential' ? residentialAmenitiesSchema : pgAmenitiesSchema;

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      amenities: formData.amenities,
    },
  });

  const residentialAmenities = ['Lift', 'Gym', 'Swimming Pool', 'Security'];
  const pgAmenities = ['Wi-Fi', 'AC', 'Food', 'Laundry'];

  const onSubmit = (data: any) => {
    setFormData({ ...formData, ...data });
  };

  return (
    <View style={styles.formSection}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Amenities</Text>
      <Controller
        control={control}
        name="amenities"
        render={({ field }) => (
          <View>
            {(formData.propertyCategory === 'Residential' ? residentialAmenities : pgAmenities).map((amenity) => (
              <CheckBox
                key={amenity}
                title={amenity}
                checked={field.value.includes(amenity)}
                onPress={() => {
                  const updatedAmenities = field.value.includes(amenity)
                    ? field.value.filter((item: string) => item !== amenity)
                    : [...field.value, amenity];
                  field.onChange(updatedAmenities);
                }}
                containerStyle={styles.checkbox}
                textStyle={{ color: colors.text }}
              />
            ))}
            {typeof errors.amenities?.message === 'string' && (
              <Text style={styles.errorText}>{errors.amenities.message}</Text>
            )}
          </View>
        )}
      />
      <Button title="Submit Amenities" onPress={handleSubmit(onSubmit)} fullWidth />
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
  checkbox: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    padding: 0,
    margin: 0,
    marginBottom: 8,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
});