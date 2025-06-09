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
import { useGym } from '@/context/GymContext';
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
  Users,
  Award,
  Calendar,
  DollarSign,
  Shield,
  Zap,
} from 'lucide-react-native';

export default function GymDetailScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { getGymById, toggleFavorite, favorites } = useGym();

  const gym = getGymById(id as string);

  if (!gym) {
    router.replace('/gym');
    return null;
  }

  const isFavorite = favorites.includes(gym.id);

  const handleFavoriteToggle = () => {
    toggleFavorite(gym.id);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this gym: ${gym.gymName} - ${gym.gymDescription}`,
      });
    } catch (error) {
      console.error('Error sharing gym:', error);
    }
  };

  const formatPrice = (pricing: typeof gym.pricing) => {
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

  const imageUrls = gym.images.map(img => img.url);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.headerButton, { backgroundColor: colors.background }]}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerRightButtons}>
          <TouchableOpacity
            style={[styles.headerButton, { backgroundColor: colors.background }]}
            onPress={handleFavoriteToggle}
          >
            <Heart
              size={24}
              color={isFavorite ? colors.accentColor : colors.text}
              fill={isFavorite ? colors.accentColor : 'transparent'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.headerButton, { backgroundColor: colors.background }]}
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
        <ImageCarousel images={imageUrls} height={250} />

        <View style={styles.contentContainer}>
          <View style={styles.titleContainer}>
            <View style={styles.typeAndStatus}>
              <View style={[styles.typeTag, { backgroundColor: getGymTypeColor(gym.gymType) }]}>
                <Text style={styles.typeText}>{gym.gymType} Gym</Text>
              </View>
              <View style={[styles.statusTag, { backgroundColor: getAvailabilityColor(gym.availableStatus) }]}>
                <Text style={styles.statusText}>{gym.availableStatus}</Text>
              </View>
            </View>
            <Text style={[styles.title, { color: colors.text }]}>
              {gym.gymName}
            </Text>
            <View style={styles.locationContainer}>
              <MapPin size={16} color={colors.grayDark} />
              <Text style={[styles.location, { color: colors.grayDark }]}>
                {gym.locality && `${gym.locality}, `}{gym.city}, {gym.state}
              </Text>
            </View>
          </View>

          <View style={styles.infoContainer}>
            {gym.rating && (
              <View style={styles.ratingContainer}>
                <Star size={16} color="#FFD700" fill="#FFD700" />
                <Text style={[styles.ratingText, { color: colors.text }]}>{gym.rating}</Text>
              </View>
            )}
            {gym.bookingDetails.operationHours && (
              <View style={styles.timingContainer}>
                <Clock size={16} color={colors.grayDark} />
                <Text style={[styles.timingText, { color: colors.grayDark }]}>
                  {gym.bookingDetails.operationHours}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.quickInfoContainer}>
            <View style={styles.quickInfoItem}>
              <Users size={20} color={colors.primaryColor} />
              <Text style={[styles.quickInfoLabel, { color: colors.grayDark }]}>Capacity</Text>
              <Text style={[styles.quickInfoValue, { color: colors.text }]}>{gym.capacity}</Text>
            </View>
            <View style={styles.quickInfoItem}>
              <Award size={20} color={colors.primaryColor} />
              <Text style={[styles.quickInfoLabel, { color: colors.grayDark }]}>Equipment</Text>
              <Text style={[styles.quickInfoValue, { color: colors.text }]}>{gym.equipmentType}</Text>
            </View>
            {gym.ageOfGym && (
              <View style={styles.quickInfoItem}>
                <Calendar size={20} color={colors.primaryColor} />
                <Text style={[styles.quickInfoLabel, { color: colors.grayDark }]}>Age</Text>
                <Text style={[styles.quickInfoValue, { color: colors.text }]}>{gym.ageOfGym} years</Text>
              </View>
            )}
          </View>

          <View style={styles.priceContainer}>
            <Text style={[styles.price, { color: colors.primaryColor }]}>
              {formatPrice(gym.pricing)}
            </Text>
            {gym.pricing.discount && gym.pricing.discount > 0 && (
              <View style={styles.discountContainer}>
                <Text style={[styles.originalPrice, { color: colors.grayDark }]}>
                  ₹{gym.pricing.baseMembershipPrice}
                </Text>
                <Text style={[styles.discount, { color: colors.successColor }]}>
                  {gym.pricing.discount}% OFF
                </Text>
              </View>
            )}
          </View>

          <Text style={[styles.description, { color: colors.text }]}>
            {gym.gymDescription}
          </Text>

          {gym.amenities.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Amenities
              </Text>
              <View style={styles.featuresGrid}>
                {gym.amenities.map((amenity, index) => (
                  <View key={index} style={[styles.featureItem, { backgroundColor: colors.grayLight }]}>
                    <Check size={16} color={colors.successColor} />
                    <Text style={[styles.featureText, { color: colors.text }]}>{amenity}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {gym.gymEquipment.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Gym Equipment
              </Text>
              <View style={styles.featuresGrid}>
                {gym.gymEquipment.map((equipment, index) => (
                  <View key={index} style={[styles.featureItem, { backgroundColor: colors.primaryColor + '20' }]}>
                    <Zap size={16} color={colors.primaryColor} />
                    <Text style={[styles.featureText, { color: colors.text }]}>{equipment}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {gym.facilities.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Facilities
              </Text>
              <View style={styles.featuresGrid}>
                {gym.facilities.map((facility, index) => (
                  <View key={index} style={[styles.featureItem, { backgroundColor: colors.secondaryColor + '20' }]}>
                    <Check size={16} color={colors.secondaryColor} />
                    <Text style={[styles.featureText, { color: colors.text }]}>{facility}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {gym.trainerServices.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Trainer Services
              </Text>
              <View style={styles.featuresGrid}>
                {gym.trainerServices.map((service, index) => (
                  <View key={index} style={[styles.featureItem, { backgroundColor: colors.accentColor + '20' }]}>
                    <Award size={16} color={colors.accentColor} />
                    <Text style={[styles.featureText, { color: colors.text }]}>{service}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {gym.rules.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Gym Rules
              </Text>
              <View style={styles.rulesContainer}>
                {gym.rules.map((rule, index) => (
                  <View key={index} style={styles.ruleItem}>
                    <Shield size={14} color={colors.warningColor} />
                    <Text style={[styles.ruleText, { color: colors.text }]}>{rule}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {gym.additionalFeatures.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Additional Features
              </Text>
              <View style={styles.featuresGrid}>
                {gym.additionalFeatures.map((feature, index) => (
                  <View key={index} style={[styles.featureItem, { backgroundColor: colors.grayLight }]}>
                    <Check size={16} color={colors.successColor} />
                    <Text style={[styles.featureText, { color: colors.text }]}>{feature}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.cardBackground }]}>
        <TouchableOpacity
          style={[styles.contactButton, { backgroundColor: '#25D366' }]}
          onPress={() => {/* Handle WhatsApp */}}
        >
          <MessageSquare size={20} color="white" />
          <Text style={styles.contactButtonText}>WhatsApp</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.contactButton, { backgroundColor: colors.primaryColor }]}
          onPress={() => {/* Handle Call */}}
        >
          <Phone size={20} color="white" />
          <Text style={styles.contactButtonText}>Join Now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
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
  },
  location: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginLeft: 4,
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
  timingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timingText: {
    marginLeft: 4,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  quickInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(124, 58, 237, 0.05)',
  },
  quickInfoItem: {
    alignItems: 'center',
  },
  quickInfoLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginTop: 4,
  },
  quickInfoValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginTop: 2,
  },
  priceContainer: {
    marginBottom: 16,
  },
  price: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
  },
  discountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  originalPrice: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  discount: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  description: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    lineHeight: 24,
    marginBottom: 24,
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
  },
  featureText: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  rulesContainer: {
    marginHorizontal: -4,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  ruleText: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    flex: 1,
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