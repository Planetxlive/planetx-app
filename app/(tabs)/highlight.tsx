import React, { useState, useRef } from 'react';
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
} from 'react-native';
import { useProperties } from '@/context/PropertyContext';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';
import { useRouter } from 'expo-router';
import { 
  Play, 
  Pause, 
  MapPin, 
  Heart, 
  MessageCircle, 
  Share, 
  Bookmark,
  User,
  MoreVertical
} from 'lucide-react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 83 : 60; // Approximate tab bar height
const CONTENT_HEIGHT = SCREEN_HEIGHT - TAB_BAR_HEIGHT;

export default function HighlightScreen() {
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme];
  const router = useRouter();
  const { properties } = useProperties();
  const flatListRef = useRef(null);

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [likedVideos, setLikedVideos] = useState(new Set());
  const [savedVideos, setSavedVideos] = useState(new Set());

  // Mock video data - in real app, this would come from API
  const videoHighlights = properties.map((property, index) => ({
    id: property.id,
    videoUrl: property.images[0], // Using image as placeholder for video thumbnail
    title: property.title,
    description: `Amazing ${property.type.toLowerCase()} in ${property.location.city}`,
    location: `${property.location.address}, ${property.location.city}`,
    price: property.price,
    priceUnit: property.priceUnit,
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
  }));

  const handleLike = (videoId:any) => {
    const newLikedVideos = new Set(likedVideos);
    if (likedVideos.has(videoId)) {
      newLikedVideos.delete(videoId);
    } else {
      newLikedVideos.add(videoId);
    }
    setLikedVideos(newLikedVideos);
  };

  const handleSave = (videoId:any) => {
    const newSavedVideos = new Set(savedVideos);
    if (savedVideos.has(videoId)) {
      newSavedVideos.delete(videoId);
    } else {
      newSavedVideos.add(videoId);
    }
    setSavedVideos(newSavedVideos);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const onViewableItemsChanged = useRef(({ viewableItems }:any) => {
    if (viewableItems.length > 0) {
      setCurrentVideoIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  const renderVideoItem = ({ item, index }:any) => {
    const isLiked = likedVideos.has(item.id);
    const isSaved = savedVideos.has(item.id);

    return (
      <View style={styles.videoContainer}>
        {/* Video/Image Container */}
        <TouchableOpacity 
          style={styles.videoPlayer}
          onPress={handlePlayPause}
          activeOpacity={1}
        >
          <Image
            source={{ uri: item.videoUrl }}
            style={styles.videoImage}
            resizeMode="cover"
          />
          
          {/* Play/Pause Overlay */}
          {!isPlaying && (
            <View style={styles.playOverlay}>
              <View style={styles.playButton}>
                <Play size={30} color="white" fill="white" />
              </View>
            </View>
          )}

          {/* Gradient Overlay */}
          <View style={styles.gradientOverlay} />
        </TouchableOpacity>

        {/* Content Overlay */}
        <View style={styles.contentOverlay}>
          {/* User Info */}
          <View style={styles.userInfo}>
            <TouchableOpacity style={styles.userProfile}>
              <Image
                source={{ uri: item.user.avatar }}
                style={styles.userAvatar}
              />
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
              <MoreVertical size={20} color="white" />
            </TouchableOpacity>
          </View>

          {/* Property Info */}
          <View style={styles.propertyInfo}>
            <Text style={styles.propertyTitle}>{item.title}</Text>
            <Text style={styles.propertyDescription}>{item.description}</Text>
            
            <View style={styles.locationContainer}>
              <MapPin size={14} color="white" />
              <Text style={styles.locationText}>{item.location}</Text>
            </View>

            <Text style={styles.priceText}>
              {item.priceUnit === 'perMonth' 
                ? `₹${item.price}/ Month` 
                : `₹${item.price}`}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleLike(item.id)}
          >
            <Heart 
              size={28} 
              color={isLiked ? "#FF3040" : "white"} 
              fill={isLiked ? "#FF3040" : "transparent"}
            />
            <Text style={styles.actionText}>{item.stats.likes}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <MessageCircle size={28} color="white" />
            <Text style={styles.actionText}>{item.stats.comments}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Share size={28} color="white" />
            <Text style={styles.actionText}>{item.stats.shares}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleSave(item.id)}
          >
            <Bookmark 
              size={28} 
              color={isSaved ? "#FFD700" : "white"} 
              fill={isSaved ? "#FFD700" : "transparent"}
            />
          </TouchableOpacity>

          {/* Profile Picture with Follow Button */}
          <TouchableOpacity style={styles.profileFollowContainer}>
            <Image
              source={{ uri: item.user.avatar }}
              style={styles.profileImage}
            />
            <View style={styles.followButton}>
              <Text style={styles.followText}>+</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="black" />
      
      <FlatList
        ref={flatListRef}
        data={videoHighlights}
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
  videoImage: {
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
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  playButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  contentOverlay: {
    position: 'absolute',
    bottom: 120, // Increased bottom padding to account for tab bar
    left: 16,
    right: 80,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  userProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
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
    fontSize: 16,
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
  propertyInfo: {
    marginBottom: 8,
  },
  propertyTitle: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  propertyDescription: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    marginLeft: 4,
  },
  priceText: {
    color: '#7C3AED',
    fontSize: 20,
    fontFamily: 'Inter-Bold',
  },
  actionButtonsContainer: {
    position: 'absolute',
    right: 16,
    bottom: 120, // Increased bottom padding to account for tab bar
    alignItems: 'center',
  },
  actionButton: {
    alignItems: 'center',
    marginBottom: 20,
  },
  actionText: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    marginTop: 4,
  },
  profileFollowContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'white',
  },
  followButton: {
    position: 'absolute',
    bottom: -6,
    backgroundColor: '#7C3AED',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  followText: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
});