import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Platform,
  ViewToken,
  Animated,
  Alert,
} from 'react-native';
import { Video, AVPlaybackStatus, ResizeMode, Audio } from 'expo-av';
import { useProperties } from '@/context/PropertyContext';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';
import { useRouter } from 'expo-router';
import {
  Play,
  MapPin,
  Heart,
  ArrowRight,
  User,
  MoreVertical,
  Home,
  Building2,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 83 : 60; // Approximate tab bar height
const CONTENT_HEIGHT = SCREEN_HEIGHT - TAB_BAR_HEIGHT;

interface VideoItem {
  id: string;
  videoUrl: string;
  title: string;
  description: string;
  location: string;
  price: number;
  priceUnit: string;
  user: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  stats: {
    likes: number;
    comments: number;
    shares: number;
  };
  timestamp: string;
}

export default function HighlightScreen() {
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme];
  const router = useRouter();
  const { getAllVideos, toggleFavorite, favorites } = useProperties();
  const flatListRef = useRef<FlatList>(null);
  const videoRefs = useRef<Record<string, Video>>({});

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);

  useEffect(() => {
    // Configure audio session for iOS
    const configureAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
      } catch (error) {
        console.error('Error configuring audio:', error);
      }
    };

    configureAudio();
  }, []);

  React.useEffect(() => {
    const loadVideos = async () => {
      const videoData = await getAllVideos();
      setVideos(
        (videoData ?? []).map((property, index) => ({
          id: property.id,
          videoUrl: property.video,
          title: property.title,
          description: `Amazing ${property.propertyType.toLowerCase()} in ${
            property.location.city
          }`,
          location: `${property.location.locality}, ${property.location.city}`,
          price: property.pricing.expectedPrice,
          priceUnit:
            property.propertyType === 'For Rent' ? 'perMonth' : 'total',
          user: {
            name: `User ${index + 1}`,
            avatar: `https://i.pravatar.cc/150?img=${index + 1}`,
            verified: Math.random() > 0.5,
          },
          stats: {
            likes: Math.floor(Math.random() * 1000) + 50,
            comments: Math.floor(Math.random() * 100) + 10,
            shares: Math.floor(Math.random() * 50) + 5,
          },
          timestamp: `${Math.floor(Math.random() * 24) + 1}h ago`,
        }))
      );
    };
    loadVideos();
  }, []);

  const handleWishlist = async (videoId: string) => {
    try {
      await toggleFavorite(videoId);
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  };

  const handleViewProperty = (videoId: string) => {
    router.push(`/property/${videoId}`);
  };

  const handlePlayPause = async (videoId: string) => {
    try {
      const videoRef = videoRefs.current[videoId];
      if (videoRef) {
        if (isPlaying) {
          await videoRef.pauseAsync();
        } else {
          await videoRef.playAsync();
        }
        setIsPlaying(!isPlaying);
      }
    } catch (error) {
      console.error('Error toggling play/pause:', error);
      Alert.alert('Error', 'Failed to play/pause video. Please try again.');
    }
  };

  const onViewableItemsChanged = useRef(
    async ({
      viewableItems,
    }: {
      viewableItems: ViewToken[];
      changed: ViewToken[];
    }) => {
      if (viewableItems.length > 0) {
        const newIndex = viewableItems[0].index ?? 0;
        setCurrentVideoIndex(newIndex);

        // Pause all videos
        Object.values(videoRefs.current).forEach(async (ref) => {
          if (ref) {
            try {
              await ref.pauseAsync();
            } catch (error) {
              console.error('Error pausing video:', error);
            }
          }
        });

        // Play the current video
        const currentVideoRef = videoRefs.current[videos[newIndex]?.id];
        if (currentVideoRef) {
          try {
            await currentVideoRef.playAsync();
            setIsPlaying(true);
          } catch (error) {
            console.error('Error playing video:', error);
            Alert.alert('Error', 'Failed to play video. Please try again.');
          }
        }
      }
    }
  ).current;

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  const renderVideoItem = ({
    item,
    index,
  }: {
    item: VideoItem;
    index: number;
  }) => {
    const isInWishlist = favorites.includes(item.id);

    return (
      <View style={styles.videoContainer}>
        <TouchableOpacity
          style={styles.videoPlayer}
          onPress={() => handlePlayPause(item.id)}
          activeOpacity={1}
        >
          <Video
            ref={(ref) => {
              if (ref) {
                videoRefs.current[item.id] = ref;
              }
            }}
            source={{ uri: item.videoUrl }}
            style={styles.video}
            resizeMode={ResizeMode.COVER}
            isLooping
            shouldPlay={index === currentVideoIndex}
            useNativeControls={false}
            isMuted={!isAudioEnabled}
            onError={(error) => {
              console.error('Video playback error:', error);
              Alert.alert('Error', 'Failed to load video. Please try again.');
            }}
          />

          {!isPlaying && (
            <View style={styles.playOverlay}>
              <BlurView intensity={20} style={styles.playButtonBlur}>
                <View style={styles.playButton}>
                  <Play size={30} color="white" fill="white" />
                </View>
              </BlurView>
            </View>
          )}

          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.2)', 'rgba(0,0,0,0.8)']}
            locations={[0, 0.6, 1]}
            style={styles.gradientOverlay}
          />
        </TouchableOpacity>

        <View style={styles.contentOverlay}>
          <View style={styles.userInfo}>
            <TouchableOpacity style={styles.userProfile}>
              <BlurView intensity={20} style={styles.userAvatarBlur}>
                <Image
                  source={{ uri: item.user.avatar }}
                  style={styles.userAvatar}
                />
              </BlurView>
              <View style={styles.userDetails}>
                <View style={styles.userNameContainer}>
                  <Text style={styles.userName}>{item.user.name}</Text>
                  {item.user.verified && (
                    <View style={styles.verifiedBadge}>
                      <Text style={styles.verifiedText}>✓</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.timestamp}>{item.timestamp}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.moreButton}>
              <BlurView intensity={20} style={styles.moreButtonBlur}>
                <MoreVertical size={20} color="white" />
              </BlurView>
            </TouchableOpacity>
          </View>

          <View style={styles.propertyInfo}>
            <View style={styles.propertyTypeContainer}>
              <BlurView intensity={20} style={styles.propertyTypeBlur}>
                <Building2 size={16} color="#7C3AED" />
                <Text style={styles.propertyType}>
                  {item.priceUnit === 'perMonth' ? 'For Rent' : 'For Sale'}
                </Text>
              </BlurView>
            </View>

            <Text style={styles.propertyTitle}>{item.title}</Text>
            <Text style={styles.propertyDescription}>{item.description}</Text>

            <View style={styles.locationContainer}>
              <MapPin size={14} color="white" />
              <Text style={styles.locationText}>{item.location}</Text>
            </View>

            <Text style={styles.priceText}>
              {item?.priceUnit === 'perMonth'
                ? `₹${item?.price?.toLocaleString()}/ Month`
                : `₹${item?.price?.toLocaleString()}`}
            </Text>
          </View>
        </View>

        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              isInWishlist && styles.actionButtonActive,
            ]}
            onPress={() => handleWishlist(item.id)}
          >
            <BlurView intensity={20} style={styles.actionButtonBlur}>
              <Heart
                size={28}
                color={isInWishlist ? '#FF3040' : 'white'}
                fill={isInWishlist ? '#FF3040' : 'transparent'}
              />
              <Text
                style={[
                  styles.actionText,
                  isInWishlist && styles.actionTextActive,
                ]}
              >
                {isInWishlist ? 'Saved' : 'Save'}
              </Text>
            </BlurView>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.viewPropertyButton}
            onPress={() => handleViewProperty(item.id)}
          >
            <BlurView intensity={20} style={styles.viewPropertyBlur}>
              <Text style={styles.viewPropertyText}>View Details</Text>
              <ArrowRight size={20} color="white" />
            </BlurView>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="black" />

        <FlatList
          ref={flatListRef}
          data={videos}
          keyExtractor={(item) => item.id}
          renderItem={renderVideoItem}
          pagingEnabled
          showsVerticalScrollIndicator={false}
          snapToInterval={CONTENT_HEIGHT}
          snapToAlignment="start"
          decelerationRate="fast"
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          getItemLayout={(data, index) => ({
            length: CONTENT_HEIGHT,
            offset: CONTENT_HEIGHT * index,
            index,
          })}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  videoContainer: {
    width: SCREEN_WIDTH,
    height: CONTENT_HEIGHT,
    position: 'relative',
  },
  videoPlayer: {
    flex: 1,
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonBlur: {
    width: 70,
    height: 70,
    borderRadius: 35,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 300,
  },
  contentOverlay: {
    position: 'absolute',
    bottom: 100,
    left: 16,
    right: 80,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  userProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userAvatarBlur: {
    width: 46,
    height: 46,
    borderRadius: 23,
    overflow: 'hidden',
    marginRight: 12,
  },
  userAvatar: {
    width: '100%',
    height: '100%',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  userDetails: {
    flex: 1,
  },
  userNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    color: 'white',
    fontSize: 17,
    fontFamily: 'Inter-SemiBold',
  },
  verifiedBadge: {
    backgroundColor: '#1DA1F2',
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  verifiedText: {
    color: 'white',
    fontSize: 10,
    fontFamily: 'Inter-Bold',
  },
  timestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  moreButton: {
    padding: 8,
  },
  moreButtonBlur: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  propertyInfo: {
    marginBottom: 8,
  },
  propertyTypeContainer: {
    marginBottom: 12,
  },
  propertyTypeBlur: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    overflow: 'hidden',
  },
  propertyType: {
    color: '#7C3AED',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 6,
  },
  propertyTitle: {
    color: 'white',
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
    lineHeight: 30,
  },
  propertyDescription: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    marginBottom: 12,
    lineHeight: 20,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginLeft: 6,
  },
  priceText: {
    color: '#7C3AED',
    fontSize: 26,
    fontFamily: 'Inter-Bold',
  },
  actionButtonsContainer: {
    position: 'absolute',
    right: 16,
    bottom: 100,
    alignItems: 'center',
  },
  actionButton: {
    marginBottom: 16,
    overflow: 'hidden',
    borderRadius: 30,
  },
  actionButtonBlur: {
    padding: 12,
    alignItems: 'center',
  },
  actionButtonActive: {
    backgroundColor: 'rgba(255, 48, 64, 0.2)',
  },
  actionText: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    marginTop: 4,
  },
  actionTextActive: {
    color: '#FF3040',
  },
  viewPropertyButton: {
    overflow: 'hidden',
    borderRadius: 30,
  },
  viewPropertyBlur: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  viewPropertyText: {
    color: 'white',
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    marginRight: 8,
  },
});
