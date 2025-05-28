import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';
import Button from './ui/Button';

// Define the base schema with common fields
const basePriceSchema = z.object({
  expectedPrice: z.string().min(1, 'Expected price is required'),
});

// Extend the base schema for residential properties
const residentialPriceSchema = basePriceSchema.extend({
  pricePerSqft: z.string().optional(),
  isAllInclusive: z.boolean(),
  isNegotiable: z.boolean(),
});

// Extend the base schema for PG properties
const pgPriceSchema = basePriceSchema.extend({
  pricePerPerson: z.string().optional(),
});

// Define the form data types
type ResidentialPriceForm = z.infer<typeof residentialPriceSchema>;
type PgPriceForm = z.infer<typeof pgPriceSchema>;

interface PriceDetailsProps {
  formData: any;
  setFormData: (data: any) => void;
}

export default function PriceDetails({ formData, setFormData }: PriceDetailsProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const isResidential = formData.propertyCategory === 'Residential';

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(isResidential ? residentialPriceSchema : pgPriceSchema),
    defaultValues: isResidential
      ? {
          expectedPrice: formData.expectedPrice,
          pricePerSqft: formData.pricePerSqft,
          isAllInclusive: formData.isAllInclusive,
          isNegotiable: formData.isNegotiable,
        }
      : {
          expectedPrice: formData.expectedPrice,
          pricePerPerson: formData.pricePerPerson,
        },
  });

  const onSubmit = (data: any) => {
    setFormData({ ...formData, ...data });
  };

  const renderError = (error: any) => {
    if (error?.message && typeof error.message === 'string') {
      return <Text style={styles.errorText}>{error.message}</Text>;
    }
    return null;
  };

  return (
    <View style={styles.formSection}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Price Details</Text>
      <Controller
        control={control}
        name="expectedPrice"
        render={({ field }) => (
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, { backgroundColor: colors.inputBackground }]}
              placeholder="Expected Price"
              value={field.value}
              onChangeText={field.onChange}
              keyboardType="numeric"
              placeholderTextColor={colors.grayDark}
            />
            {renderError(errors.expectedPrice)}
          </View>
        )}
      />
      {isResidential ? (
        <>
          <Controller
            control={control}
            name="pricePerSqft"
            render={({ field }) => (
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.inputBackground }]}
                  placeholder="Price per Sqft (Optional)"
                  value={field.value}
                  onChangeText={field.onChange}
                  keyboardType="numeric"
                  placeholderTextColor={colors.grayDark}
                />
                {renderError(errors.pricePerSqft)}
              </View>
            )}
          />
          {/* Optionally render isAllInclusive and isNegotiable as switches/checkboxes here if you want */}
        </>
      ) : (
        <Controller
          control={control}
          name="pricePerPerson"
          render={({ field }) => (
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, { backgroundColor: colors.inputBackground }]}
                placeholder="Price per Person (Optional)"
                value={field.value}
                onChangeText={field.onChange}
                keyboardType="numeric"
                placeholderTextColor={colors.grayDark}
              />
              {renderError(errors.pricePerPerson)}
            </View>
          )}
        />
      )}
      <Button title="Submit Price" onPress={handleSubmit(onSubmit)} fullWidth />
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
  },
});