import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';
import { Heart, ArrowLeft } from 'lucide-react-native';

type Notification = {
  id: string;
  type: 'new_listing' | 'saved_property' | 'property_added' | 'review';
  title: string;
  message: string;
  time: string;
  user?: {
    name: string;
    image: string;
  };
  isLiked?: boolean;
};

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'new_listing',
    title: 'New Listing Alert!',
    message: 'has added a Flat/Apartment in your area.',
    time: '2min ago',
    user: {
      name: 'John',
      image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    },
    isLiked: true,
  },
  {
    id: '2',
    type: 'saved_property',
    title: 'Saved Property Update!',
    message: 'saved 3HK Villa',
    time: '46min ago',
    user: {
      name: 'Oscar',
      image: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg',
    },
  },
  {
    id: '3',
    type: 'property_added',
    title: 'Property Added Successfully!',
    message: 'Your property has been listed successfully and is now live on our platform.',
    time: '2h ago',
  },
  {
    id: '4',
    type: 'review',
    title: 'Review Update!',
    message: 'has added a review on your Retail Property.',
    time: '20d ago',
    user: {
      name: 'John',
      image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    },
    isLiked: true,
  },
];

export default function NotificationsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const router = useRouter();

  const renderNotification = ({ item }: { item: Notification }) => (
    <View style={[styles.notificationItem, { backgroundColor: colors.cardBackground }]}>
      {item.user ? (
        <Image source={{ uri: item.user.image }} style={styles.userImage} />
      ) : (
        <View style={[styles.iconContainer, { backgroundColor: colors.primaryColor + '20' }]}>
          <Text style={[styles.checkmark, { color: colors.primaryColor }]}>✓</Text>
        </View>
      )}
      
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text style={[styles.notificationTitle, { color: colors.text }]}>
            {item.title}
          </Text>
          <Text style={[styles.timeText, { color: colors.grayDark }]}>
            {item.time}
          </Text>
        </View>
        
        <Text style={[styles.notificationMessage, { color: colors.grayDark }]}>
          {item.user && (
            <Text style={[styles.userName, { color: colors.primaryColor }]}>
              {item.user.name}{' '}
            </Text>
          )}
          {item.message}
        </Text>
      </View>

      <TouchableOpacity style={styles.likeButton}>
        <Heart
          size={20}
          color={item.isLiked ? colors.accentColor : colors.grayMedium}
          fill={item.isLiked ? colors.accentColor : 'transparent'}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Notifications
        </Text>
        <TouchableOpacity>
          <Text style={[styles.readAllText, { color: colors.primaryColor }]}>
            Read all
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={MOCK_NOTIFICATIONS}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    flex: 1,
  },
  readAllText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  listContent: {
    padding: 16,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  notificationContent: {
    flex: 1,
    marginLeft: 12,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  timeText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  notificationMessage: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  userName: {
    fontFamily: 'Inter-SemiBold',
  },
  likeButton: {
    padding: 8,
  },
});