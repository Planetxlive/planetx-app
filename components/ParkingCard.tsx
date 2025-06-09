import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useParking, ParkingSpot } from '../context/ParkingContext';
import { useRouter } from 'expo-router';
import { MapPin, Star, Clock, Car, Zap, Shield, Users } from 'lucide-react-native';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';

type ParkingCardProps = {
  parkingSpot: ParkingSpot;
  horizontal?: boolean;
  style?: any;
};

export default function ParkingCard({ parkingSpot, horizontal = false, style }: ParkingCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const router = useRouter();
  const { toggleFavorite, favorites } = useParking();
  
  const isFavorite = favorites.includes(parkingSpot.id);

  const handlePress = () => {
    router.push(`/parking/${parkingSpot.id}`);
  };

  const formatPrice = (hourlyRate: number) => {
    return `₹${hourlyRate}/hr`;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'premium':
        return '#FFD700';
      case 'electric':
        return '#10B981';
      case 'disabled':
        return '#3B82F6';
      case 'compact':
        return '#F59E0B';
      case 'standard':
        return '#6B7280';
      default:
        return colors.primaryColor;
    }
  };

  const getAvailabilityColor = (isAvailable: boolean) => {
    return isAvailable ? colors.successColor : colors.errorColor;
  };

  const getSizeIcon = (size: string) => {
    switch (size) {
      case 'large':
        return '🚗';
      case 'medium':
        return '🚙';
      case 'small':
        return '🚘';
      default:
        return '🚗';
    }
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
          source={{ uri: parkingSpot.images[0] }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={[styles.typeTag, { backgroundColor: getTypeColor(parkingSpot.type) }]}>
          <Text style={styles.typeText}>{parkingSpot.type}</Text>
        </View>
        <View style={[styles.availabilityTag, { backgroundColor: getAvailabilityColor(parkingSpot.isAvailable) }]}>
          <Text style={styles.availabilityText}>
            {parkingSpot.isAvailable ? 'Available' : 'Occupied'}
          </Text>
        </View>
      </View>
      
      <View style={horizontal ? styles.horizontalContent : styles.content}>
        <View style={styles.headerRow}>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
            Spot {parkingSpot.spotNumber}
          </Text>
          {parkingSpot.rating && (
            <View style={styles.ratingContainer}>
              <Star size={14} color="#FFD700" fill="#FFD700" />
              <Text style={styles.ratingText}>{parkingSpot.rating}</Text>
            </View>
          )}
        </View>
        
        <View style={styles.locationRow}>
          <MapPin size={14} color={colors.grayDark} />
          <Text style={[styles.locationText, { color: colors.grayDark }]} numberOfLines={1}>
            {parkingSpot.locality}, {parkingSpot.city}
          </Text>
        </View>

        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Text style={styles.sizeIcon}>{getSizeIcon(parkingSpot.size)}</Text>
            <Text style={[styles.detailText, { color: colors.grayDark }]}>
              {parkingSpot.size}
            </Text>
          </View>
          {parkingSpot.amenitiesDetails.evCharging && (
            <View style={styles.detailItem}>
              <Zap size={12} color={colors.successColor} />
              <Text style={[styles.detailText, { color: colors.grayDark }]}>
                EV Charging
              </Text>
            </View>
          )}
        </View>

        <View style={styles.amenitiesRow}>
          {parkingSpot.amenitiesDetails.securityGuard && (
            <View style={[styles.amenityTag, { backgroundColor: colors.successColor + '20' }]}>
              <Shield size={10} color={colors.successColor} />
              <Text style={[styles.amenityText, { color: colors.successColor }]}>Security</Text>
            </View>
          )}
          {parkingSpot.amenitiesDetails.coveredParking && (
            <View style={[styles.amenityTag, { backgroundColor: colors.primaryColor + '20' }]}>
              <Text style={[styles.amenityText, { color: colors.primaryColor }]}>Covered</Text>
            </View>
          )}
          {parkingSpot.amenitiesDetails.valetService && (
            <View style={[styles.amenityTag, { backgroundColor: colors.accentColor + '20' }]}>
              <Users size={10} color={colors.accentColor} />
              <Text style={[styles.amenityText, { color: colors.accentColor }]}>Valet</Text>
            </View>
          )}
        </View>
        
        <View style={styles.priceRow}>
          <Text style={[styles.price, { color: colors.primaryColor }]}>
            {formatPrice(parkingSpot.hourlyRate)}
          </Text>
          {parkingSpot.accessibility.wheelchairAccessible && (
            <View style={styles.accessibilityTag}>
              <Text style={[styles.accessibilityText, { color: colors.primaryColor }]}>♿ Accessible</Text>
            </View>
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
    height: 120,
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
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  sizeIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  detailText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginLeft: 2,
  },
  amenitiesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  amenityTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 10,
    marginRight: 6,
    marginBottom: 4,
  },
  amenityText: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    marginLeft: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
  accessibilityTag: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accessibilityText: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
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