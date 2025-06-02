import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Linking,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useBlog } from '@/context/BlogContext';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';
import { ArrowLeft, MapPin, Calendar, Phone, Mail } from 'lucide-react-native';

export default function BlogPostDetail() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const { id } = useLocalSearchParams();
  const { getPostById } = useBlog();

  const post = getPostById(id as string);

  if (!post) {
    return null;
  }

  const handleContact = (type: 'phone' | 'email') => {
    const contact = post.contactInfo.split(',')[type === 'phone' ? 1 : 0].trim();
    if (type === 'phone') {
      Linking.openURL(`tel:${contact}`);
    } else {
      Linking.openURL(`mailto:${contact}`);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Post Details
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        {post.image && (
          <Image source={{ uri: post.image }} style={styles.image} />
        )}

        <View style={styles.categoryTag}>
          <Text style={styles.categoryText}>{post.category}</Text>
        </View>

        <View style={styles.postContent}>
          <Text style={[styles.title, { color: colors.text }]}>{post.title}</Text>

          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <Calendar size={16} color={colors.grayDark} />
              <Text style={[styles.metaText, { color: colors.grayDark }]}>
                {new Date(post.createdAt).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.metaItem}>
              <MapPin size={16} color={colors.grayDark} />
              <Text style={[styles.metaText, { color: colors.grayDark }]}>
                {post.location?.locality}, {post.location?.city}
              </Text>
            </View>
          </View>

          <Text style={[styles.description, { color: colors.text }]}>
            {post.description}
          </Text>

          <View style={styles.locationDetails}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Location Details
            </Text>
            {post.location?.houseNumber && (
              <Text style={[styles.locationText, { color: colors.text }]}>
                House Number: {post.location?.houseNumber}
              </Text>
            )}
            {post.location?.apartment && (
              <Text style={[styles.locationText, { color: colors.text }]}>
                Apartment: {post.location?.apartment}
              </Text>
            )}
            <Text style={[styles.locationText, { color: colors.text }]}>
              Locality: {post.location?.locality}
            </Text>
            <Text style={[styles.locationText, { color: colors.text }]}>
              City: {post.location?.city}
            </Text>
            <Text style={[styles.locationText, { color: colors.text }]}>
              State: {post.location?.state}
            </Text>
          </View>

          <View style={[styles.contactSection, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Contact Information
            </Text>
            <View style={[styles.contactInfoContent, { backgroundColor: colors.background }]}>
              <Text style={[styles.contactInfoText, { color: colors.text }]}>
                {post.contactInfo}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
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
  },
  image: {
    width: '100%',
    height: 250,
  },
  categoryTag: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(124, 58, 237, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryText: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  postContent: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 12,
  },
  metaContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaText: {
    marginLeft: 4,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  description: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    lineHeight: 24,
    marginBottom: 24,
  },
  locationDetails: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 12,
  },
  locationText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginBottom: 8,
  },
  contactSection: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  contactInfoContent: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  contactInfoText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    lineHeight: 24,
  },
});