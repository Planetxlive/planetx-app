import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Platform,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';
import { ArrowLeft, Star } from 'lucide-react-native';
import Button from '@/components/ui/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Constants from 'expo-constants';
import { backendUrl } from '@/lib/uri';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function FeedbackScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const [feedbackType, setFeedbackType] = useState('');
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        Alert.alert(
          'Authentication Required',
          'Please log in to submit feedback.',
          [{ text: 'OK', onPress: () => router.back() }]
        );
      }
    } catch (error) {
      console.error('Auth check error:', error);
    }
  };

  const handleSubmit = async () => {
    if (!feedbackType || !rating || !feedback.trim()) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }

    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        Alert.alert('Error', 'Please log in to submit feedback.');
        return;
      }

      const response = await axios.post(
        `${backendUrl}/centralfeedback`,
        {
          feedbackType,
          stars: rating,
          content: feedback,
        },
        {
          headers: { Authorization: token },
        }
      );

      if (response.status === 201) {
        setIsSubmitted(true);
        Alert.alert('Success', 'Feedback submitted successfully!');
        setTimeout(() => {
          setFeedbackType('');
          setRating(0);
          setFeedback('');
          setIsSubmitted(false);
          router.back();
        }, 2000);
      }
    } catch (error: any) {
      console.error('Feedback submission error:', error);
      Alert.alert(
        'Error',
        error.response?.data?.error || 'Failed to submit feedback.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: colors.background },
          Platform.OS === 'android' && styles.androidSafeArea,
        ]}
      >
        <StatusBar
          barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
          backgroundColor={colors.background}
        />
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Share Feedback
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.title, { color: colors.text }]}>
            How would you rate your experience?
          </Text>

          <View style={styles.feedbackTypeContainer}>
            <Text style={[styles.label, { color: colors.text }]}>
              Feedback Type
            </Text>
            <View style={styles.feedbackTypeButtons}>
              {['Website Experience', 'Service Quality', 'Other'].map(
                (type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.feedbackTypeButton,
                      feedbackType === type && styles.feedbackTypeButtonActive,
                      { borderColor: colors.tabIconDefault },
                    ]}
                    onPress={() => setFeedbackType(type)}
                  >
                    <Text
                      style={[
                        styles.feedbackTypeText,
                        {
                          color:
                            feedbackType === type
                              ? colors.primaryColor
                              : colors.text,
                        },
                      ]}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Text>
                  </TouchableOpacity>
                )
              )}
            </View>
          </View>

          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((value) => (
              <TouchableOpacity
                key={value}
                onPress={() => setRating(value)}
                style={styles.starButton}
              >
                <Star
                  size={32}
                  color="#FFD700"
                  fill={value <= rating ? '#FFD700' : 'transparent'}
                />
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.label, { color: colors.text }]}>
            Tell us about your experience
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.inputBackground,
                color: colors.text,
              },
            ]}
            placeholder="Write your feedback here..."
            placeholderTextColor={colors.grayDark}
            multiline
            numberOfLines={6}
            value={feedback}
            onChangeText={setFeedback}
          />
        </ScrollView>

        <View style={[styles.footer, { backgroundColor: colors.background }]}>
          <Button
            title="Submit Feedback"
            onPress={handleSubmit}
            loading={isLoading}
            disabled={rating === 0 || !feedback.trim() || !feedbackType}
            fullWidth
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  androidSafeArea: {
    paddingTop: StatusBar.currentHeight,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    backgroundColor: 'transparent',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 24,
    textAlign: 'center',
  },
  feedbackTypeContainer: {
    marginBottom: 24,
  },
  feedbackTypeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  feedbackTypeButton: {
    flex: 1,
    marginHorizontal: 4,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  feedbackTypeButtonActive: {
    borderWidth: 2,
  },
  feedbackTypeText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
  },
  starButton: {
    padding: 8,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginBottom: 8,
  },
  input: {
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlignVertical: 'top',
    minHeight: 120,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingBottom: Platform.OS === 'ios' ? 16 : 24,
  },
});
