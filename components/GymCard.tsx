import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useGym, Gym } from '../context/GymContext';
import { useRouter } from 'expo-router';
import { MapPin, Star, Clock, Users, Award } from 'lucide-react-native';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';

type GymCardProps = {
  gym: Gym;
  horizontal?: boolean;
  style?: any;
};

export default function GymCard({ gym, horizontal = false, style }: GymCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const router = useRouter();
  const { toggleFavorite, favorites } = useGym();
  
  const isFavorite = favorites.includes(gym.id);

  const handlePress = () => {
    router.push(`/gym/${gym.id}`);
  };

  const formatPrice = (pricing: Gym['pricing']) => {
    if (pricing.finalPrice) {
      return `₹${pricing.finalPrice}/month`;
    } else if (pricing.baseMembershipPrice) {
      return `₹${pricing.baseMembershipPrice}/month`;
    }
    return 'Contact for pricing';
  };

  const getGymTypeColor = (type: string) => {
    switch (type) {
      case 'Celebrity':
        return '#FFD700';
      case 'Private':
        return '#7C3AED';
      case 'Public':
        return '#10B981';
      default:
        return colors.primaryColor;
    }
  };

  const getAvailabilityColor = (status: string) => {
    return status === 'Available' ? colors.successColor : colors.errorColor;
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        horizontal ? styles.horizontalContainer : styles.verticalContainer,
        { backgroundColor: colors.cardBackground },
        style
      ]}
      onPress={handlePress}
      activeOpacity={0.9}
    >
      <View style={horizontal ? styles.horizontalImageContainer : styles.imageContainer}>
        <Image
          source={{ uri: gym.images[0]?.url }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={[styles.typeTag, { backgroundColor: getGymTypeColor(gym.gymType) }]}>
          <Text style={styles.typeText}>{gym.gymType}</Text>
        </View>
        <View style={[styles.availabilityTag, { backgroundColor: getAvailabilityColor(gym.availableStatus) }]}>
          <Text style={styles.availabilityText}>{gym.availableStatus}</Text>
        </View>
      </View>
      
      <View style={horizontal ? styles.horizontalContent : styles.content}>
        <View style={styles.headerRow}>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
            {gym.gymName}
          </Text>
          {gym.rating && (
            <View style={styles.ratingContainer}>
              <Star size={14} color="#FFD700" fill="#FFD700" />
              <Text style={styles.ratingText}>{gym.rating}</Text>
            </View>
          )}
        </View>
        
        <View style={styles.locationRow}>
          <MapPin size={14} color={colors.grayDark} />
          <Text style={[styles.locationText, { color: colors.grayDark }]} numberOfLines={1}>
            {gym.locality}, {gym.city}
          </Text>
        </View>

        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Users size={12} color={colors.grayDark} />
            <Text style={[styles.detailText, { color: colors.grayDark }]}>
              {gym.capacity} capacity
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Award size={12} color={colors.grayDark} />
            <Text style={[styles.detailText, { color: colors.grayDark }]}>
              {gym.equipmentType}
            </Text>
          </View>
        </View>

        {gym.bookingDetails.operationHours && (
          <View style={styles.timingRow}>
            <Clock size={14} color={colors.grayDark} />
            <Text style={[styles.timingText, { color: colors.grayDark }]}>
              {gym.bookingDetails.operationHours}
            </Text>
          </View>
        )}
        
        <View style={styles.priceRow}>
          <Text style={[styles.price, { color: colors.primaryColor }]}>
            {formatPrice(gym.pricing)}
          </Text>
          <Text style={[styles.membershipType, { color: colors.grayDark }]}>
            {gym.membershipType}
          </Text>
        </View>

        <View style={styles.amenitiesRow}>
          {gym.amenities.slice(0, 2).map((amenity, index) => (
            <View key={index} style={[styles.amenityTag, { backgroundColor: colors.grayLight }]}>
              <Text style={[styles.amenityText, { color: colors.text }]}>{amenity}</Text>
            </View>
          ))}
          {gym.amenities.length > 2 && (
            <Text style={[styles.moreAmenities, { color: colors.grayDark }]}>
              +{gym.amenities.length - 2} more
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  verticalContainer: {
    width: '100%',
  },
  horizontalContainer: {
    flexDirection: 'row',
    width: '100%',
    height: 140,
  },
  imageContainer: {
    height: 180,
    width: '100%',
  },
  horizontalImageContainer: {
    width: 120,
    height: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    padding: 12,
  },
  horizontalContent: {
    flex: 1,
    padding: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  ratingText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFD700',
    marginLeft: 2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  locationText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginLeft: 4,
    flex: 1,
  },
  detailsRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  detailText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginLeft: 4,
  },
  timingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  timingText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginLeft: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
  membershipType: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  amenitiesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  amenityTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  amenityText: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
  },
  moreAmenities: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
  },
  typeTag: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  typeText: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  availabilityTag: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  availabilityText: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
});