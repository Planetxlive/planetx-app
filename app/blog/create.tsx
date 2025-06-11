import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { useBlog, BlogCategory } from '@/context/BlogContext';
import { useAuth } from '@/context/AuthContext';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';
import { ArrowLeft, Image as ImageIcon, Loader2 } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import Button from '@/components/ui/Button';
import { uploadPropertyImages } from '@/lib/s3';
const BACKEND_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';

const CATEGORIES: BlogCategory[] = [
  'Roommate Wanted',
  'Property For Sale',
  'Property For Rent',
  'Community Updates',
  'Market Insights',
];

const validateForm = (formData: any) => {
  const errors: Record<string, string> = {};

  if (!formData.title || formData.title.length < 5) {
    errors.title = 'Title must be at least 5 characters';
  } else if (formData.title.length > 100) {
    errors.title = 'Title must be less than 100 characters';
  }

  if (!formData.description || formData.description.length < 20) {
    errors.description = 'Description must be at least 20 characters';
  }

  if (!formData.category || !CATEGORIES.includes(formData.category)) {
    errors.category = 'Please select a valid category';
  }

  if (!formData.location.locality) {
    errors.locality = 'Locality is required';
  }

  if (!formData.location.city) {
    errors.city = 'City is required';
  }

  if (!formData.location.state) {
    errors.state = 'State is required';
  }

  if (!formData.contactInfo || formData.contactInfo.length < 5) {
    errors.contactInfo = 'Contact information must be at least 5 characters';
  }

  return errors;
};

export default function CreateBlogPost() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const { addPost } = useBlog();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [assets, setAsset] = useState<ImagePicker.ImagePickerAsset[]>([]);

  const [formData, setFormData] = useState({
    category: '' as BlogCategory,
    title: '',
    description: '',
    location: {
      houseNumber: '',
      apartment: '',
      subLocality: '',
      locality: '',
      city: '',
      state: '',
    },
    image: '',
    contactInfo: '',
  });

  const handleImagePick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        setFormData((prev) => ({ ...prev, image: result.assets[0].uri }));
        setAsset(result.assets);
      }
    } catch (err) {
      console.error('Error uploading image:', err);
      Alert.alert('Error', 'Failed to upload image. Please try again.');
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      const urls = (await uploadPropertyImages(assets))[0];
      console.log(`image url is ${urls}`);
      await addPost({
        ...formData,
        image: urls,
        userId: user.id,
      });
      router.push('/blog');
    } catch (err) {
      console.error('Error creating post:', err);
      Alert.alert('Error', 'Failed to create post. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderLocationField = (
    field: keyof typeof formData.location,
    label: string,
    required: boolean = false,
    isMultiline = false,
    numberOfLines = 1
  ) => (
    <View style={styles.section}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          isMultiline && styles.textArea,
          errors[field] && styles.inputError,
          { backgroundColor: colors.inputBackground, color: colors.text },
        ]}
        value={formData.location[field]}
        placeholderTextColor={colors.grayDark}
        onChangeText={(text) =>
          setFormData({
            ...formData,
            location: { ...formData.location, [field]: text },
          })
        }
        multiline={isMultiline}
        numberOfLines={isMultiline ? numberOfLines : 1}
      />
      {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
    </View>
  );

  const renderFormField = (
    field: keyof Omit<typeof formData, 'location'>,
    label: string,
    placeholder: string,
    multiline: boolean = false,
    numberOfLines: number = 1,
    isRequired = false
  ) => (
    <View style={styles.section}>
      <Text style={[styles.label, { color: colors.text }]}>
        {label} {isRequired && '*'}
      </Text>
      <TextInput
        style={[
          styles.input,
          multiline && styles.textArea,
          errors[field] && styles.inputError,
          { backgroundColor: colors.inputBackground, color: colors.text },
        ]}
        placeholder={placeholder}
        placeholderTextColor={colors.grayDark}
        value={formData[field]}
        onChangeText={(text) => setFormData({ ...formData, [field]: text })}
        multiline={multiline}
        numberOfLines={multiline ? numberOfLines : 1}
      />
      {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
    </View>
  );
  if (isLoading)
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
          }}
        >
          <Text
            style={{ color: colors.text, fontWeight: '700', fontSize: 30 }}
          >Loading...</Text>
        </View>
      </SafeAreaView>
    );
  return (
    <SafeAreaView 
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Create New Post
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Category
            </Text>
            <View style={styles.categoryContainer}>
              {CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryButton,
                    formData.category === category && {
                      backgroundColor: colors.primaryColor,
                    },
                  ]}
                  onPress={() => setFormData({ ...formData, category })}
                >
                  <Text
                    style={[
                      styles.categoryButtonText,
                      formData.category === category && { color: 'white' },
                    ]}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.category && (
              <Text style={styles.errorText}>{errors.category}</Text>
            )}
          </View>

          {renderFormField('title', 'Title', 'Enter post title')}
          {renderFormField(
            'description',
            'Description',
            'Provide detailed information',
            true,
            6
          )}

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Location
            </Text>
            {renderLocationField(
              'houseNumber',
              'House Number (Optional)',
              false
            )}
            {renderLocationField('apartment', 'Apartment (Optional)', false)}
            {renderLocationField(
              'subLocality',
              'Sub Locality (Optional)',
              false
            )}
            {renderLocationField('locality', 'Locality', true)}
            {renderLocationField('city', 'City', true)}
            {renderLocationField('state', 'State', true)}
          </View>

          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.text }]}>
              Add Image
            </Text>
            <TouchableOpacity
              style={[
                styles.imageUpload,
                { backgroundColor: colors.inputBackground },
              ]}
              onPress={handleImagePick}
            >
              {formData.image ? (
                <Image
                  source={{ uri: formData.image }}
                  style={styles.uploadedImage}
                />
              ) : (
                <>
                  <ImageIcon size={24} color={colors.grayDark} />
                  <Text
                    style={[styles.imageUploadText, { color: colors.grayDark }]}
                  >
                    Choose image
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {renderFormField(
            'contactInfo',
            'Contact Information',
            'Email, phone number, or other contact info'
          )}
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title={isLoading ? 'Creating Post...' : 'Create Post'}
            onPress={handleSubmit}
            loading={isLoading}
            fullWidth
          />
        </View>
      </KeyboardAvoidingView>
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
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginBottom: 8,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#7C3AED',
    margin: 4,
  },
  categoryButtonText: {
    color: '#7C3AED',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  input: {
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  textArea: {
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlignVertical: 'top',
  },
  inputError: {
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginTop: 4,
  },
  imageUpload: {
    height: 120,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageUploadText: {
    marginTop: 8,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
});
