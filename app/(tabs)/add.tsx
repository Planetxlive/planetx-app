import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useProperties, PropertyType } from '@/context/PropertyContext';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';
import { ArrowLeft, Camera, Upload, X } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function AddPropertyScreen() {
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme];
  const { user } = useAuth();
  const { addProperty } = useProperties();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [area, setArea] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [features, setFeatures] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState('');
  const [selectedType, setSelectedType] = useState<PropertyType | null>(null);
  const [selectedListingType, setSelectedListingType] = useState<string | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  const propertyTypes: PropertyType[] = [
    'Residential',
    'Pg',
    'Hotel',
    'Office',
    'Shop',
    'Warehouse',
    'Shared Warehouse',
    'EventSpace',
  ];

  const listingTypes = ['Buy', 'Rent', 'Paying Guest', 'Rent Hourly'];

  const handleAddImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        'Permission needed',
        'Please allow access to your photo library to add images.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setFeatures([...features, featureInput.trim()]);
      setFeatureInput('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    const newFeatures = [...features];
    newFeatures.splice(index, 1);
    setFeatures(newFeatures);
  };

  const handleSubmit = async () => {
    if (
      !title ||
      !price ||
      !selectedType ||
      !selectedListingType ||
      !address ||
      !city
    ) {
      Alert.alert('Missing information', 'Please fill all required fields.');
      return;
    }

    if (!user) {
      Alert.alert(
        'Authentication required',
        'Please login to create a property listing.'
      );
      return;
    }

    setIsLoading(true);

    try {
      // Using placeholder images if none are selected
      const propertyImages =
        images.length > 0
          ? images
          : [
              'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
            ];

      await addProperty({
        title,
        description,
        type: selectedType,
        price: parseFloat(price),
        priceUnit:
          selectedListingType === 'Rent' ||
          selectedListingType === 'Rent Hourly' ||
          selectedListingType === 'Paying Guest'
            ? 'perMonth'
            : 'total',
        area: parseFloat(area),
        areaUnit: 'sqft',
        bedrooms: bedrooms ? parseInt(bedrooms, 10) : undefined,
        bathrooms: bathrooms ? parseInt(bathrooms, 10) : undefined,
        location: {
          address,
          city,
          state: state || city,
          country: 'India',
        },
        features,
        images: propertyImages,
        ownerId: user.id,
        listingType: selectedListingType as any,
        furnishing: [],
        nearbyPlaces: [],
        owner: {
          id: user.id,
          name: user.name || 'Owner',
          image:
            user.profileImage ||
            'https://randomuser.me/api/portraits/men/1.jpg',
          phone: user.phoneNumber,
          rating: 0,
          reviews: 0,
        },
        parking: {
          covered: 0,
          open: 0,
        },
      });

      Alert.alert('Success', 'Your property has been listed successfully!', [
        {
          text: 'View Listings',
          onPress: () => router.replace('/(tabs)'),
        },
      ]);

      // Reset form
      setTitle('');
      setDescription('');
      setPrice('');
      setArea('');
      setBedrooms('');
      setBathrooms('');
      setAddress('');
      setCity('');
      setState('');
      setImages([]);
      setFeatures([]);
      setSelectedType(null);
      setSelectedListingType(null);
    } catch (error) {
      console.error('Error adding property:', error);
      Alert.alert('Error', 'Failed to add property. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              Add Property
            </Text>
            <View style={styles.placeholder} />
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.formSection}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Property Details
              </Text>

              <Input
                label="Title"
                placeholder="e.g., Spacious 3BHK Apartment"
                value={title}
                onChangeText={setTitle}
              />

              <Text style={[styles.label, { color: colors.text }]}>
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
                    onPress={() => setSelectedType(type)}
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

              <Text style={[styles.label, { color: colors.text }]}>
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
                    onPress={() => setSelectedListingType(type)}
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

              <Input
                label="Description"
                placeholder="Describe your property..."
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
              />

              <View style={styles.rowInputs}>
                <Input
                  label="Price (₹)"
                  placeholder="e.g., 25000"
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="numeric"
                  style={{ flex: 1, marginRight: 8 }}
                />
                <Input
                  label="Area (sq ft)"
                  placeholder="e.g., 1200"
                  value={area}
                  onChangeText={setArea}
                  keyboardType="numeric"
                  style={{ flex: 1 }}
                />
              </View>

              <View style={styles.rowInputs}>
                <Input
                  label="Bedrooms"
                  placeholder="e.g., 3"
                  value={bedrooms}
                  onChangeText={setBedrooms}
                  keyboardType="numeric"
                  style={{ flex: 1, marginRight: 8 }}
                />
                <Input
                  label="Bathrooms"
                  placeholder="e.g., 2"
                  value={bathrooms}
                  onChangeText={setBathrooms}
                  keyboardType="numeric"
                  style={{ flex: 1 }}
                />
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Location
              </Text>

              <Input
                label="Address"
                placeholder="Street address"
                value={address}
                onChangeText={setAddress}
              />

              <View style={styles.rowInputs}>
                <Input
                  label="City"
                  placeholder="e.g., Delhi"
                  value={city}
                  onChangeText={setCity}
                  style={{ flex: 1, marginRight: 8 }}
                />
                <Input
                  label="State"
                  placeholder="e.g., Delhi"
                  value={state}
                  onChangeText={setState}
                  style={{ flex: 1 }}
                />
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Features
              </Text>

              <View style={styles.featureInputContainer}>
                <Input
                  placeholder="Add feature (e.g., Swimming Pool)"
                  value={featureInput}
                  onChangeText={setFeatureInput}
                  style={{ flex: 1 }}
                />
                <TouchableOpacity
                  style={[
                    styles.addFeatureButton,
                    { backgroundColor: colors.primaryColor },
                  ]}
                  onPress={handleAddFeature}
                >
                  <Text style={styles.addFeatureButtonText}>Add</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.featuresContainer}>
                {features.map((feature, index) => (
                  <View
                    key={index}
                    style={[
                      styles.featureTag,
                      { backgroundColor: colors.grayLight },
                    ]}
                  >
                    <Text style={[styles.featureText, { color: colors.text }]}>
                      {feature}
                    </Text>
                    <TouchableOpacity
                      onPress={() => handleRemoveFeature(index)}
                      style={styles.removeFeatureButton}
                    >
                      <X size={12} color={colors.text} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Images
              </Text>

              <TouchableOpacity
                style={[
                  styles.uploadButton,
                  { borderColor: colors.primaryColor },
                ]}
                onPress={handleAddImage}
              >
                <Upload size={24} color={colors.primaryColor} />
                <Text
                  style={[
                    styles.uploadButtonText,
                    { color: colors.primaryColor },
                  ]}
                >
                  Upload Images
                </Text>
              </TouchableOpacity>

              <View style={styles.imagesContainer}>
                {images.map((image, index) => (
                  <View key={index} style={styles.imagePreviewContainer}>
                    <View style={styles.imagePreview}>
                      <TouchableOpacity
                        style={styles.removeImageButton}
                        onPress={() => handleRemoveImage(index)}
                      >
                        <X size={16} color="white" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            <Button
              title="List Property"
              onPress={handleSubmit}
              loading={isLoading}
              fullWidth
              size="large"
              style={styles.submitButton}
            />
          </ScrollView>
        </KeyboardAvoidingView>
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
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
  placeholder: {
    width: 40,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  formSection: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginBottom: 8,
  },
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
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
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  featureInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  addFeatureButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 8,
  },
  addFeatureButtonText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  featureTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  removeFeatureButton: {
    marginLeft: 6,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 8,
    paddingVertical: 20,
    marginBottom: 16,
  },
  uploadButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginLeft: 8,
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  imagePreviewContainer: {
    width: '30%',
    aspectRatio: 1,
    marginRight: '5%',
    marginBottom: 16,
  },
  imagePreview: {
    flex: 1,
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  removeImageButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
    padding: 4,
  },
  submitButton: {
    marginTop: 32,
  },
});
