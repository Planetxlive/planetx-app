import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useProperties, Property } from '../context/PropertyContext';
import { useRouter } from 'expo-router';
import { MapPin, Star, Heart } from 'lucide-react-native';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import { useToast } from 'react-native-toast-notifications';

type PropertyCardProps = {
  property: Property;
  horizontal?: boolean;
};

export default function PropertyCard({ property, horizontal = false }: PropertyCardProps) {
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme];
  const router = useRouter();
  const { toggleFavorite, favorites, isLoading } = useProperties();
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const toast = useToast();
  
  const isFavorite = favorites.includes(property._id);

  const handlePress = () => {
    router.push(`/property/${property._id}`);
  };

  const handleWishlistToggle = async () => {
    try {
      setIsWishlistLoading(true);
      await toggleFavorite(property._id);
      // toast.show(
      //   isFavorite ? 'Removed from wishlist' : 'Added to wishlist',
      //   {
      //     type: 'success',
      //     placement: 'bottom',
      //     duration: 2000,
      //   }
      // );
    } catch (error: any) {
      // toast.show(
      //   error?.message || 'Failed to update wishlist',
      //   {
      //     type: 'error',
      //     placement: 'bottom',
      //     duration: 2000,
      //   }
      // );
    } finally {
      setIsWishlistLoading(false);
    }
  };

  const formatPrice = (property: Property) => {
    if (property.pricing?.price?.amount) {
      return `₹${property.pricing.price.amount.toLocaleString('en-IN')}`;
    } else if (property.pricing?.expectedPrice) {
      return `₹${property.pricing.expectedPrice.toLocaleString('en-IN')}`;
    } else if (property.pricing?.monthlyRent) {
      return `₹${property.pricing.monthlyRent.toLocaleString('en-IN')}/mo`;
    } else if (property.pricing?.finalPrice) {
      return `₹${property.pricing.finalPrice.toLocaleString('en-IN')}`;
    } else if (property.pricing?.basePricePerNight) {
      return `₹${property.pricing.basePricePerNight.toLocaleString('en-IN')}/night`;
    } else if (property.pricing?.rentalDetails?.monthlyRent) {
      return `₹${property.pricing.rentalDetails.monthlyRent.toLocaleString('en-IN')}/mo`;
    } else {
      return 'Price N/A';
    }
  };

  const formatPricePerSqft = (property: Property) => {
    if (property.pricing?.PricePerSqft) {
      return `₹${property.pricing.PricePerSqft.toLocaleString('en-IN')} / sqft`;
    }
    return null;
  };

  const getAverageRating = (reviews:Property["reviews"]) =>
    Array.isArray(reviews) && reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + (r.stars || 0), 0) / reviews.length
        ).toFixed(1)
      : null;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: colors.cardBackground }
      ]}
      onPress={handlePress}
      activeOpacity={0.9}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: property.images[0]?.url || '/placeholder.svg?height=400&width=600' }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.typeTag}>
          <Text style={styles.typeText}>{property.category}</Text>
        </View>
        <TouchableOpacity
          style={[styles.wishlistButton, { backgroundColor: colors.cardBackground }]}
          onPress={handleWishlistToggle}
          disabled={isWishlistLoading}
        >
          <Heart
            size={24}
            color={isFavorite ? colors.primaryColor : colors.grayDark}
            fill={isFavorite ? colors.primaryColor : 'none'}
          />
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
            {property.title}
          </Text>
          <View style={styles.ratingContainer}>
            <Star size={14} color="#FFD700" fill="#FFD700" />
            <Text style={styles.ratingText}>{getAverageRating(property.reviews)}</Text>
          </View>
        </View>
        
        <View style={styles.locationRow}>
          <MapPin size={14} color={colors.grayDark} />
          <Text style={[styles.locationText, { color: colors.grayDark }]} numberOfLines={1}>
            {property.title}
          </Text>
        </View>
        
        <View style={styles.priceRow}>
          <Text style={[styles.price, { color: colors.primaryColor }]}>
            {formatPrice(property)}
          </Text>
          {formatPricePerSqft(property) && (
            <Text style={[styles.pricePerSqft, { color: colors.grayDark }]}>
              {formatPricePerSqft(property)}
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
  imageContainer: {
    height: 200,
    width: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFD700',
    marginLeft: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  locationText: {
    fontSize: 16,
    marginLeft: 6,
    flex: 1,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
  },
  pricePerSqft: {
    fontSize: 14,
    fontWeight: '600',
  },
  typeTag: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(124, 58, 237, 0.8)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  typeText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  wishlistButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});