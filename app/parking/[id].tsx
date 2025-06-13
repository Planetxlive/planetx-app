import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Share,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useParking } from '@/context/ParkingContext';
import ImageCarousel from '@/components/ImageCarousel';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';
import {
  ArrowLeft,
  Heart,
  Share2,
  MapPin,
  Clock,
  Star,
  Check,
  Phone,
  MessageSquare,
  Car,
  Zap,
  Shield,
  Users,
  Camera,
  DollarSign,
  Navigation,
} from 'lucide-react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function ParkingDetailScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { getParkingSpotById, toggleFavorite, favorites } = useParking();

  const parkingSpot = getParkingSpotById(id as string);

  if (!parkingSpot) {
    router.replace('/parking');
    return null;
  }

  const isFavorite = favorites.includes(parkingSpot.id);

  const handleFavoriteToggle = () => {
    toggleFavorite(parkingSpot.id);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this parking spot: ${parkingSpot.spotNumber} in ${parkingSpot.locality}`,
      });
    } catch (error) {
      console.error('Error sharing parking spot:', error);
    }
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

  const amenitiesList = [
    {
      key: 'securityGuard',
      label: 'Security Guard',
      icon: Shield,
      enabled: parkingSpot.amenitiesDetails.securityGuard,
    },
    {
      key: 'securityCameras',
      label: 'Security Cameras',
      icon: Camera,
      enabled: parkingSpot.amenitiesDetails.securityCameras,
    },
    {
      key: 'evCharging',
      label: 'EV Charging',
      icon: Zap,
      enabled: parkingSpot.amenitiesDetails.evCharging,
    },
    {
      key: 'valetService',
      label: 'Valet Service',
      icon: Users,
      enabled: parkingSpot.amenitiesDetails.valetService,
    },
    {
      key: 'coveredParking',
      label: 'Covered Parking',
      icon: Car,
      enabled: parkingSpot.amenitiesDetails.coveredParking,
    },
  ];

  const accessibilityFeatures = [
    {
      key: 'wheelchairAccessible',
      label: 'Wheelchair Accessible',
      enabled: parkingSpot.accessibility.wheelchairAccessible,
    },
    {
      key: 'nearEntrance',
      label: 'Near Entrance',
      enabled: parkingSpot.accessibility.nearEntrance,
    },
  ];

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={[
              styles.headerButton,
              { backgroundColor: colors.background },
            ]}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.headerRightButtons}>
            <TouchableOpacity
              style={[
                styles.headerButton,
                { backgroundColor: colors.background },
              ]}
              onPress={handleFavoriteToggle}
            >
              <Heart
                size={24}
                color={isFavorite ? colors.accentColor : colors.text}
                fill={isFavorite ? colors.accentColor : 'transparent'}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.headerButton,
                { backgroundColor: colors.background },
              ]}
              onPress={handleShare}
            >
              <Share2 size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <ImageCarousel images={parkingSpot.images} height={250} />

          <View style={styles.contentContainer}>
            <View style={styles.titleContainer}>
              <View style={styles.typeAndStatus}>
                <View
                  style={[
                    styles.typeTag,
                    { backgroundColor: getTypeColor(parkingSpot.type) },
                  ]}
                >
                  <Text style={styles.typeText}>
                    {parkingSpot.type} • {parkingSpot.size}
                  </Text>
                </View>
                <View
                  style={[
                    styles.statusTag,
                    {
                      backgroundColor: getAvailabilityColor(
                        parkingSpot.isAvailable
                      ),
                    },
                  ]}
                >
                  <Text style={styles.statusText}>
                    {parkingSpot.isAvailable ? 'Available' : 'Occupied'}
                  </Text>
                </View>
              </View>
              <Text style={[styles.title, { color: colors.text }]}>
                Parking Spot {parkingSpot.spotNumber}
              </Text>
              <View style={styles.locationContainer}>
                <MapPin size={16} color={colors.grayDark} />
                <Text style={[styles.location, { color: colors.grayDark }]}>
                  {parkingSpot.locality}, {parkingSpot.city},{' '}
                  {parkingSpot.state}
                </Text>
              </View>
              {parkingSpot.sublocality && (
                <Text style={[styles.subLocation, { color: colors.grayDark }]}>
                  {parkingSpot.sublocality}
                  {parkingSpot.areaNumber && ` • ${parkingSpot.areaNumber}`}
                </Text>
              )}
            </View>

            <View style={styles.infoContainer}>
              {parkingSpot.rating && (
                <View style={styles.ratingContainer}>
                  <Star size={16} color="#FFD700" fill="#FFD700" />
                  <Text style={[styles.ratingText, { color: colors.text }]}>
                    {parkingSpot.rating}
                  </Text>
                </View>
              )}
              <View style={styles.sizeContainer}>
                <Text style={styles.sizeIcon}>
                  {getSizeIcon(parkingSpot.size)}
                </Text>
                <Text style={[styles.sizeText, { color: colors.text }]}>
                  {parkingSpot.size} size
                </Text>
              </View>
            </View>

            <View style={styles.priceContainer}>
              <Text style={[styles.price, { color: colors.primaryColor }]}>
                {formatPrice(parkingSpot.hourlyRate)}
              </Text>
              <Text style={[styles.priceNote, { color: colors.grayDark }]}>
                Hourly rate
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Amenities & Features
              </Text>
              <View style={styles.featuresGrid}>
                {amenitiesList.map((amenity) => (
                  <View
                    key={amenity.key}
                    style={[
                      styles.featureItem,
                      {
                        backgroundColor: amenity.enabled
                          ? colors.successColor + '20'
                          : colors.grayLight,
                        opacity: amenity.enabled ? 1 : 0.5,
                      },
                    ]}
                  >
                    <amenity.icon
                      size={16}
                      color={
                        amenity.enabled ? colors.successColor : colors.grayDark
                      }
                    />
                    <Text
                      style={[
                        styles.featureText,
                        {
                          color: amenity.enabled
                            ? colors.text
                            : colors.grayDark,
                        },
                      ]}
                    >
                      {amenity.label}
                    </Text>
                    {amenity.enabled && (
                      <Check
                        size={14}
                        color={colors.successColor}
                        style={styles.checkIcon}
                      />
                    )}
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Accessibility
              </Text>
              <View style={styles.accessibilityContainer}>
                {accessibilityFeatures.map((feature) => (
                  <View key={feature.key} style={styles.accessibilityItem}>
                    <View
                      style={[
                        styles.accessibilityIcon,
                        {
                          backgroundColor: feature.enabled
                            ? colors.primaryColor + '20'
                            : colors.grayLight,
                        },
                      ]}
                    >
                      <Text style={styles.accessibilityEmoji}>
                        {feature.key === 'wheelchairAccessible' ? '♿' : '🚪'}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.accessibilityText,
                        {
                          color: feature.enabled
                            ? colors.text
                            : colors.grayDark,
                        },
                      ]}
                    >
                      {feature.label}
                    </Text>
                    {feature.enabled && (
                      <Check size={16} color={colors.successColor} />
                    )}
                  </View>
                ))}
              </View>
            </View>

            {parkingSpot.coordinates && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Location Details
                </Text>
                <View style={styles.coordinatesContainer}>
                  <Navigation size={16} color={colors.primaryColor} />
                  <Text
                    style={[styles.coordinatesText, { color: colors.text }]}
                  >
                    {parkingSpot.coordinates.latitude.toFixed(6)},{' '}
                    {parkingSpot.coordinates.longitude.toFixed(6)}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </ScrollView>

        <View
          style={[styles.footer, { backgroundColor: colors.cardBackground }]}
        >
          <TouchableOpacity
            style={[styles.contactButton, { backgroundColor: '#25D366' }]}
            onPress={() => {
              /* Handle WhatsApp */
            }}
          >
            <MessageSquare size={20} color="white" />
            <Text style={styles.contactButtonText}>WhatsApp</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.contactButton,
              { backgroundColor: colors.primaryColor },
            ]}
            onPress={() => {
              /* Handle Call */
            }}
          >
            <Phone size={20} color="white" />
            <Text style={styles.contactButtonText}>Book Now</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 16,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerRightButtons: {
    flexDirection: 'row',
  },
  scrollContent: {
    paddingBottom: 80,
  },
  contentContainer: {
    padding: 16,
  },
  titleContainer: {
    marginBottom: 16,
  },
  typeAndStatus: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  typeTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  typeText: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  statusTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginLeft: 4,
  },
  subLocation: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginLeft: 20,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  sizeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sizeIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  sizeText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  priceContainer: {
    marginBottom: 24,
  },
  price: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
  },
  priceNote: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 16,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    margin: 4,
    minWidth: '45%',
  },
  featureText: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    flex: 1,
  },
  checkIcon: {
    marginLeft: 4,
  },
  accessibilityContainer: {
    marginHorizontal: -4,
  },
  accessibilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  accessibilityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  accessibilityEmoji: {
    fontSize: 20,
  },
  accessibilityText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    flex: 1,
  },
  coordinatesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(124, 58, 237, 0.05)',
    borderRadius: 8,
  },
  coordinatesText: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  contactButton: {
    flex: 1,
    flexDirection: 'row',
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  contactButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 8,
  },
});
