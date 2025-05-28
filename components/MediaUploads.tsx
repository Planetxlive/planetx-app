import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import * as ImagePicker from 'expo-image-picker';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';
import { Camera } from 'lucide-react-native';
import Button from './ui/Button';

const mediaSchema = z.object({
  images: z.array(z.string()).min(5, 'At least 5 images are required'),
  video: z.string().optional(),
});

interface MediaUploadProps {
  formData: any;
  setFormData: (data: any) => void;
}

export default function MediaUpload({ formData, setFormData }: MediaUploadProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(mediaSchema),
    defaultValues: {
      images: formData.images,
      video: formData.video,
    },
  });

  const handleImageUpload = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      setFormData({
        ...formData,
        images: [...formData.images, ...result.assets.map((asset) => asset.uri)],
      });
    }
  };

  const handleVideoUpload = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsMultipleSelection: false,
      quality: 1,
    });

    if (!result.canceled) {
      setFormData({
        ...formData,
        video: result.assets[0].uri,
      });
    }
  };

  const onSubmit = (data: any) => {
    setFormData({ ...formData, ...data });
  };

  return (
    <View style={styles.formSection}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Photos & Video</Text>
      <View style={styles.mediaUploadContainer}>
        <TouchableOpacity
          style={[styles.uploadButton, { backgroundColor: colors.grayLight }]}
          onPress={handleImageUpload}
        >
          <Camera size={24} color={colors.text} />
          <Text style={[styles.uploadText, { color: colors.text }]}>
            Add at least 5 photos
          </Text>
        </TouchableOpacity>
        {errors.images && (
          <Text style={styles.errorText}>{errors.images.message}</Text>
        )}
        <TouchableOpacity
          style={[styles.uploadButton, { backgroundColor: colors.grayLight }]}
          onPress={handleVideoUpload}
        >
          <Camera size={24} color={colors.text} />
          <Text style={[styles.uploadText, { color: colors.text }]}>
            Add a video (optional)
          </Text>
        </TouchableOpacity>
        {errors.video && (
          <Text style={styles.errorText}>{errors.video.message}</Text>
        )}
      </View>
      <Button title="Submit Media" onPress={handleSubmit(onSubmit)} fullWidth />
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
  mediaUploadContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  uploadButton: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  uploadText: {
    marginTop: 8,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
});