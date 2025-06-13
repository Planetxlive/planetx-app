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
import { useProperties } from '@/context/PropertyContext';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';
import { ArrowLeft } from 'lucide-react-native';
import Button from '@/components/ui/Button';
import BasicInformation from '@/components/BasicInformation';
import PropertyDetails from '@/components/PropertyDetails';
import MediaUpload from '@/components/MediaUploads';
import Amenities from '@/components/Amenities';
import PriceDetails from '@/components/PriceDetails';
import { SafeAreaProvider } from 'react-native-safe-area-context';

type Step = 'basic' | 'details' | 'media' | 'amenities' | 'price';

export default function AddPropertyScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const { user } = useAuth();
  const { addProperty } = useProperties();
  const [currentStep, setCurrentStep] = useState<Step>('basic');
  const [propertyType, setPropertyType] = useState<string>('For Sale');
  const [propertyCategory, setPropertyCategory] =
    useState<string>('Residential');

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

  const handleSubmit = async () => {};

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {['basic', 'details', 'media', 'amenities', 'price'].map(
        (step, index) => (
          <View key={step} style={styles.stepContainer}>
            <View
              style={[
                styles.stepDot,
                {
                  backgroundColor:
                    currentStep === step
                      ? colors.primaryColor
                      : [
                          'basic',
                          'details',
                          'media',
                          'amenities',
                          'price',
                        ].indexOf(currentStep) > index
                      ? colors.successColor
                      : colors.grayLight,
                },
              ]}
            >
              {['basic', 'details', 'media', 'amenities', 'price'].indexOf(
                currentStep
              ) > index && <Text style={styles.checkmark}>✓</Text>}
            </View>
            {index < 4 && <View style={styles.stepLine} />}
          </View>
        )
      )}
    </View>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        {/* <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Add Property</Text>
        <View style={{ width: 24 }} />
      </View>

      {renderStepIndicator()}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {currentStep === 'basic' && (
          <BasicInformation propertyType={propertyType} setPropertyType={setPropertyType} propertyCategory={propertyCategory} setPropertyCategory={setPropertyCategory} />
          // <Text style={{
          //   color: "white"
          // }}>basic</Text>
        )}
        {currentStep === 'details' && (
          // <PropertyDetails formData={formData} setFormData={setFormData} />
          <Text style={{
            color: "white"
          }}>details</Text>
        )}
        {currentStep === 'media' && (
          // <MediaUpload formData={formData} setFormData={setFormData} />
          <Text style={{
            color: "white"
          }}>media</Text>
        )}
        {currentStep === 'amenities' && (
          // <Amenities formData={formData} setFormData={setFormData} />
          <Text style={{
            color: "white"
          }}>amenities</Text>
        )}
        {currentStep === 'price' && (
          // <PriceDetails formData={formData} setFormData={setFormData} />
          <Text style={{
            color: "white"
          }}>price</Text>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={currentStep === 'price' ? 'Submit Property' : 'Next'}
          onPress={handleNext}
          fullWidth
        />
      </View> */}
        <View
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
          }}
        >
          <Text
            style={{
              color: colors.text,
              fontWeight: '700',
              fontSize: 30,
            }}
          >
            This feature is comming soon
          </Text>
        </View>
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
