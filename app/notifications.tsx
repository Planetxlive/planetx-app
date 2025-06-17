import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Platform,
  Animated,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';
import { Heart, ArrowLeft, Bell } from 'lucide-react-native';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { backendUrl } from '@/lib/uri';
type Notification = {
  _id: string;
  heading: string;
  text: string;
  date: string;
  userId?: {
    name: string;
    image?: string;
  };
  unread?: boolean;
};

export default function NotificationsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollY = new Animated.Value(0);

  useEffect(() => {
    fetchNotifications();

    // Set up interval to refresh notifications every 30 seconds
    const refreshInterval = setInterval(() => {
      fetchNotifications();
    }, 30000);

    // Clean up interval on component unmount
    return () => clearInterval(refreshInterval);
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('accessToken');

      if (!token) {
        router.replace('/auth/login');
        return;
      }

      const userResponse = await axios.get(`${backendUrl}/auth/get-user`, {
        headers: { Authorization: token },
      });

      const userId = userResponse.data.user._id;
      const response = await axios.get(
        `${backendUrl}/properties/notification/${userId}`,
        { headers: { Authorization: token } }
      );

      setNotifications(response.data || []);
    } catch (error: any) {
      if (
        error.response?.data?.message ===
        'No notifications found for this user.'
      ) {
        return;
      }
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderNotification = ({
    item,
    index,
  }: {
    item: Notification;
    index: number;
  }) => {
    const translateY = scrollY.interpolate({
      inputRange: [-1, 0, 100 * index, 100 * (index + 2)],
      outputRange: [0, 0, 0, -10],
    });

    return (
      <Animated.View
        style={[
          styles.notificationItem,
          {
            transform: [{ translateY }],
          },
        ]}
      >
        <LinearGradient
          colors={[colors.cardBackground, colors.cardBackground + '80']}
          style={styles.gradientBackground}
        >
          <View style={styles.notificationContent}>
            <View style={styles.notificationHeader}>
              {item.userId?.image ? (
                <Image
                  source={{ uri: item.userId.image }}
                  style={styles.userImage}
                />
              ) : (
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: colors.primaryColor + '20' },
                  ]}
                >
                  <Bell size={20} color={colors.primaryColor} />
                </View>
              )}
              <View style={styles.titleContainer}>
                <Text
                  style={[styles.notificationTitle, { color: colors.text }]}
                >
                  {item.heading}
                </Text>
                <Text style={[styles.timeText, { color: colors.grayDark }]}>
                  {formatDistanceToNow(new Date(item.date), {
                    addSuffix: true,
                  })}
                </Text>
              </View>
            </View>

            <Text
              style={[styles.notificationMessage, { color: colors.grayDark }]}
            >
              {item.userId && (
                <Text style={[styles.userName, { color: colors.primaryColor }]}>
                  {item.userId.name}{' '}
                </Text>
              )}
              {item.text}
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      <SafeAreaView style={styles.safeArea}>
        <BlurView intensity={80} style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Notifications
          </Text>
          <TouchableOpacity style={styles.readAllButton}>
            <Text style={[styles.readAllText, { color: colors.primaryColor }]}>
              Read all
            </Text>
          </TouchableOpacity>
        </BlurView>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primaryColor} />
          </View>
        ) : (
          <Animated.FlatList
            data={notifications}
            renderItem={renderNotification}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              {
                useNativeDriver: true,
                listener: (event) => {
                  // Optional: Add any additional scroll handling here
                },
              }
            )}
            scrollEventThrottle={16}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Bell
                  size={48}
                  color={colors.grayDark}
                  style={styles.emptyIcon}
                />
                <Text style={[styles.emptyText, { color: colors.grayDark }]}>
                  No notifications yet
                </Text>
              </View>
            }
          />
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-SemiBold',
    flex: 1,
    textAlign: 'center',
  },
  readAllButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  readAllText: {
    fontSize: 15,
    fontFamily: 'Inter-Medium',
  },
  listContent: {
    padding: 16,
    paddingTop: 20,
  },
  notificationItem: {
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  gradientBackground: {
    padding: 16,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  userImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  titleContainer: {
    flex: 1,
    marginLeft: 12,
  },
  notificationTitle: {
    fontSize: 17,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  timeText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    opacity: 0.7,
  },
  notificationMessage: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    lineHeight: 22,
    opacity: 0.9,
  },
  userName: {
    fontFamily: 'Inter-SemiBold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIcon: {
    marginBottom: 16,
    opacity: 0.5,
  },
  emptyText: {
    fontSize: 17,
    fontFamily: 'Inter-Medium',
    opacity: 0.7,
  },
});
