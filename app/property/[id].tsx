import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Share,
  Image,
  Modal,
  TextInput,
  FlatList,
  ActivityIndicator,
  Alert,
  Platform,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { PropertyCategory, useProperties } from '@/context/PropertyContext';
import ImageCarousel from '@/components/ImageCarousel';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Heart,
  Share2,
  MapPin,
  Home,
  Layers,
  Square,
  Tag,
  Clock,
  Star,
  X,
  Send,
  Edit,
  Trash,
  User,
} from 'lucide-react-native';

interface PropertyImage {
  src: string;
  alt: string;
  label: string;
}

interface PropertyFeature {
  icon: string;
  label: string;
}

interface PropertyDetail {
  label: string;
  value: string | number;
}

interface PropertyArea {
  label: string;
  value: string;
  subValue: string;
}

interface PropertyOwner {
  name: string;
  image: string;
  rating: number;
  reviews: number;
  phone: string;
  WhatsApp: string;
}

interface Property {
  id: string;
  title: string;
  type: PropertyCategory;
  location: string;
  price: string;
  pricePerSqft: string;
  isNegotiable: boolean;
  tags: string[];
  features: PropertyFeature[];
  owner: PropertyOwner;
  description: string;
  images: PropertyImage[];
  amenities: PropertyFeature[];
  furnishing: PropertyFeature[];
  societyFeatures: PropertyFeature[];
  otherFeatures: PropertyFeature[];
  propertyDetails: PropertyDetail[];
  areaDetails: PropertyArea[];
  parking: PropertyDetail[];
  nearbyPlaces: PropertyFeature[];
  ratingDistribution: {
    excellent: number;
    good: number;
    average: number;
    belowAverage: number;
    poor: number;
  };
}

interface Review {
  _id: string;
  user: {
    name: string;
  };
  stars: number;
  text: string;
  createdAt: string;
}

// Transform property data to match React page structure
const transformPropertyData = (data: any): Property => {
  const category = data.type || 'Residential';

  const amenitiesMap: Record<string, string> = {
    Parking: 'Parking',
    Gym: 'Gym',
    'Swimming Pool': 'Swimming Pool',
    '24/7 Security': '24/7 Security',
    'Modular Kitchen': 'Modular Kitchen',
    Terrace: 'Terrace',
    Garden: 'Garden',
    'Air Conditioning': 'Air Conditioning',
    'Power Backup': 'Power Backup',
    Lift: 'Lift',
    'Conference Room': 'Conference Room',
    'Corner Plot': 'Corner Plot',
    'Road Facing': 'Road Facing',
    'Gated Community': 'Gated Community',
    'Loading Dock': 'Loading Dock',
    'High Ceiling': 'High Ceiling',
    Security: 'Security',
  };

  const furnishingMap: Record<string, string> = {
    fans: 'Fans',
    lights: 'Lights',
    ac: 'AC',
    wardrobes: 'Wardrobes',
  };

  const nearbyPlacesMap: Record<string, string> = {
    hospital: 'Hospital',
    school: 'School',
    market: 'Market',
  };

  const amenities = data.features?.map((feature: string) => ({
    icon: 'map-pin',
    label: amenitiesMap[feature] || feature,
  })) || [];

  const furnishing: PropertyFeature[] = []; // Add furnishing logic if available in data
  const nearbyPlaces = Object.keys(nearbyPlacesMap).map((key) => ({
    icon: 'map-pin',
    label: nearbyPlacesMap[key],
  }));

  const pricing = {
    expectedPrice: data.price || null,
    PricePerSqft: data.priceUnit === 'perSqFt' ? data.price : null,
  };

  const features = [
    {
      icon: 'layout',
      label: data.bedrooms ? `${data.bedrooms} BHK & ${data.bathrooms || 0} Baths` : 'N/A',
    },
    {
      icon: 'square',
      label: data.area ? `${data.area} ${data.areaUnit}` : 'N/A',
    },
    {
      icon: 'tag',
      label: pricing.PricePerSqft ? `₹${pricing.PricePerSqft.toLocaleString('en-IN')} / ${data.areaUnit}` : 'N/A',
    },
    {
      icon: 'home',
      label: 'New Property', // Age not provided in mock data
    },
  ];

  const propertyDetails = [
    { label: 'Bedrooms', value: data.bedrooms || 'N/A' },
    { label: 'Bathrooms', value: data.bathrooms || 'N/A' },
    { label: 'Area', value: data.area ? `${data.area} ${data.areaUnit}` : 'N/A' },
    { label: 'Availability Status', value: data.listingType || 'N/A' },
    { label: 'Property ID', value: data.id },
  ];

  const areaDetails = [
    {
      label: 'Total Area',
      value: data.area ? `${data.area} ${data.areaUnit}` : 'N/A',
      subValue: data.area && data.areaUnit === 'sqft' ? `${(data.area * 0.092903).toFixed(2)} Sq.m.` : 'N/A',
    },
  ];

  return {
    id: data.id,
    title: data.title,
    type: category as PropertyCategory,
    location: `${data.location.address}, ${data.location.city}, ${data.location.state}, ${data.location.country}`,
    price: data.price
      ? `₹${data.price.toLocaleString('en-IN')}${data.priceUnit === 'perMonth' ? '/mo' : ''}`
      : 'Price N/A',
    pricePerSqft: pricing.PricePerSqft ? `₹${pricing.PricePerSqft.toLocaleString('en-IN')} / ${data.areaUnit}` : 'N/A',
    isNegotiable: true,
    tags: [category, data.listingType, 'Unfurnished'].filter(Boolean),
    features,
    owner: {
      name: data.owner?.name || 'Unknown Owner',
      image: data.owner?.image || 'https://via.placeholder.com/80',
      rating: data.owner?.rating || 0,
      reviews: data.owner?.reviews || 0,
      phone: data.owner?.phone || '+91 00000 00000',
      WhatsApp: data.owner?.phone || '+91 00000 00000',
    },
    description: data.description || 'No description available.',
    images: data.images.map((img: string, index: number) => ({
      src: img,
      alt: `Image ${index + 1}`,
      label: `Image ${index + 1}`,
    })),
    amenities,
    furnishing,
    societyFeatures: [], // Not provided in mock data
    otherFeatures: [], // Not provided in mock data
    propertyDetails,
    areaDetails,
    parking: [
      { label: 'Covered Parking', value: data.parking?.covered || '0' },
      { label: 'Open Parking', value: data.parking?.open || '0' },
    ],
    nearbyPlaces,
    ratingDistribution: {
      excellent: 0,
      good: 0,
      average: 0,
      belowAverage: 0,
      poor: 0,
    },
  };
};

interface TabButtonProps {
  title: string;
  isActive: boolean;
  onPress: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ title, isActive, onPress }) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  return (
    <TouchableOpacity
      style={[
        styles.tabButton,
        isActive && { backgroundColor: colors.primaryColor, borderRadius: 12 },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.tabButtonText,
          { color: isActive ? colors.background : colors.grayDark },
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

interface FeatureIconProps {
  type: string;
}

const FeatureIcon: React.FC<FeatureIconProps> = ({ type }) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  switch (type) {
    case 'layout':
      return <Home size={20} color={colors.background} />;
    case 'square':
      return <Square size={20} color={colors.background} />;
    case 'tag':
      return <Tag size={20} color={colors.background} />;
    case 'home':
      return <Clock size={20} color={colors.background} />;
    default:
      return <Home size={20} color={colors.background} />;
  }
};

interface ImageModalProps {
  image: PropertyImage | null;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ image, onClose }) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  if (!image) return null;

  return (
    <Modal visible={true} animationType="fade" transparent>
      <View style={[styles.modalContainer, { backgroundColor: colors.backgroundOverlay }]}>
        <TouchableOpacity
          style={[styles.modalCloseButton, { backgroundColor: colors.cardBackground }]}
          onPress={onClose}
          activeOpacity={0.7}
        >
          <X size={24} color={colors.text} />
        </TouchableOpacity>
        <Image
          source={{ uri: image.src }}
          style={styles.modalImage}
          resizeMode="contain"
        />
      </View>
    </Modal>
  );
};

interface ShareModalProps {
  visible: boolean;
  onClose: () => void;
  onShare: (platform: string) => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ visible, onClose, onShare }) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={[styles.modalContainer, { backgroundColor: colors.backgroundOverlay }]}>
        <View style={[styles.shareModalContent, { backgroundColor: colors.cardBackground }]}>
          <View style={styles.shareModalHeader}>
            <Text style={[styles.shareModalTitle, { color: colors.text }]}>Share Property</Text>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
              <X size={20} color={colors.text} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={[styles.shareButton, { backgroundColor: colors.successLight }]}
            onPress={() => onShare('whatsapp')}
            activeOpacity={0.7}
          >
            <Text style={[styles.shareButtonText, { color: colors.successColor }]}>WhatsApp</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.shareButton, { backgroundColor: colors.primaryLight }]}
            onPress={() => onShare('facebook')}
            activeOpacity={0.7}
          >
            <Text style={[styles.shareButtonText, { color: colors.primaryColor }]}>Facebook</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.shareButton, { backgroundColor: colors.infoLight }]}
            onPress={() => onShare('twitter')}
            activeOpacity={0.7}
          >
            <Text style={[styles.shareButtonText, { color: colors.infoColor }]}>Twitter</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

interface NotifyModalProps {
  visible: boolean;
  onClose: () => void;
  notificationTitle: string;
  setNotificationTitle: (title: string) => void;
  notificationText: string;
  setNotificationText: (text: string) => void;
  onSubmit: () => void;
}

const NotifyModal: React.FC<NotifyModalProps> = ({
  visible,
  onClose,
  notificationTitle,
  setNotificationTitle,
  notificationText,
  setNotificationText,
  onSubmit,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={[styles.modalContainer, { backgroundColor: colors.backgroundOverlay }]}>
        <View style={[styles.notifyModalContent, { backgroundColor: colors.cardBackground }]}>
          <View style={styles.notifyModalHeader}>
            <Text style={[styles.notifyModalTitle, { color: colors.text }]}>Notify Owner</Text>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
              <X size={20} color={colors.text} />
            </TouchableOpacity>
          </View>
          <TextInput
            style={[styles.input, { borderColor: colors.border, color: colors.text }]}
            placeholder="Notification Title"
            value={notificationTitle}
            onChangeText={setNotificationTitle}
            placeholderTextColor={colors.grayDark}
          />
          <TextInput
            style={[styles.input, { borderColor: colors.border, color: colors.text, height: 100 }]}
            placeholder="Notification Message"
            value={notificationText}
            onChangeText={setNotificationText}
            multiline
            placeholderTextColor={colors.grayDark}
          />
          <View style={styles.notifyButtonContainer}>
            <TouchableOpacity
              style={[styles.notifyButton, { borderColor: colors.border }]}
              onPress={() => {
                setNotificationTitle('');
                setNotificationText('');
              }}
              activeOpacity={0.7}
            >
              <Text style={[styles.notifyButtonText, { color: colors.text }]}>Clear</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.notifyButton,
                {
                  backgroundColor: notificationTitle && notificationText ? colors.primaryColor : colors.grayLight,
                },
              ]}
              onPress={onSubmit}
              disabled={!notificationTitle || !notificationText}
              activeOpacity={0.7}
            >
              <Text style={[styles.notifyButtonText, { color: colors.background }]}>Send Notification</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

interface OwnerModalProps {
  visible: boolean;
  onClose: () => void;
  owner: PropertyOwner;
  onNotify: () => void;
}

const OwnerModal: React.FC<OwnerModalProps> = ({ visible, onClose, owner, onNotify }) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={[styles.modalContainer, { backgroundColor: colors.backgroundOverlay }]}>
        <View style={[styles.ownerModalContent, { backgroundColor: colors.cardBackground }]}>
          <View style={styles.ownerModalHeader}>
            <Text style={[styles.ownerModalTitle, { color: colors.text }]}>Property Owner</Text>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
              <X size={20} color={colors.text} />
            </TouchableOpacity>
          </View>
          <View style={styles.ownerModalBody}>
            <View style={[styles.avatar, { backgroundColor: colors.primaryLight }]}>
              <Text style={[styles.avatarText, { color: colors.text }]}>
                {owner.name.slice(0, 2).toUpperCase()}
              </Text>
            </View>
            <Text style={[styles.ownerName, { color: colors.text }]}>{owner.name}</Text>
            <View style={styles.starContainer}>
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    color={i < Math.floor(owner.rating) ? colors.warningColor : colors.grayLight}
                    fill={i < Math.floor(owner.rating) ? colors.warningColor : 'transparent'}
                  />
                ))}
              <Text style={[styles.ownerRating, { color: colors.text }]}>
                {owner.rating} ({owner.reviews})
              </Text>
            </View>
            <View style={styles.ownerActions}>
              <TouchableOpacity
                style={[styles.ownerActionButton, { backgroundColor: colors.successColor }]}
                onPress={() => {/* Handle WhatsApp */}}
                activeOpacity={0.7}
              >
                <Text style={styles.ownerActionButtonText}>Message on WhatsApp</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.ownerActionButton, { backgroundColor: colors.primaryColor }]}
                onPress={() => {/* Handle Call */}}
                activeOpacity={0.7}
              >
                <Text style={styles.ownerActionButtonText}>Call Owner</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.ownerActionButton, { borderColor: colors.border }]}
                onPress={onNotify}
                activeOpacity={0.7}
              >
                <Text style={[styles.ownerActionButtonText, { color: colors.text }]}>
                  Notify
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default function PropertyDetailScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { getPropertyById, toggleFavorite, favorites } = useProperties();
  const [activeTab, setActiveTab] = useState('about');
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [showNotify, setShowNotify] = useState(false);
  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationText, setNotificationText] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState<PropertyImage | null>(null);
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showOwnerModal, setShowOwnerModal] = useState(false);
  const insets = useSafeAreaInsets();
  const { width: windowWidth } = useWindowDimensions();

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const rawProperty = getPropertyById(id as string);
        if (!rawProperty) {
          throw new Error('Property not found');
        }
        const transformedProperty = transformPropertyData(rawProperty);
        setProperty(transformedProperty);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const handleFavoriteToggle = () => {
    toggleFavorite(id as string);
  };

  const handleShare = async (platform: string) => {
    if (!property) return;

    const shareUrl = `https://example.com/property/${id}`;
    const shareText = `Check out this property: ${property.title} at ${property.location} for ${property.price}`;

    let url;
    switch (platform) {
      case 'whatsapp':
        url = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      default:
        return;
    }

    try {
      await Share.share({
        message: shareText + ' ' + shareUrl,
        url: url,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
    setShowShareOptions(false);
  };

  const handleSubmitNotification = () => {
    if (!notificationTitle.trim() || !notificationText.trim()) {
      Alert.alert('Error', 'Please provide both a title and notification text.');
      return;
    }

    Alert.alert('Success', 'Notification sent successfully!');
    setShowNotify(false);
    setNotificationTitle('');
    setNotificationText('');
  };

  const handleSubmitReview = () => {
    if (!userRating || !reviewText.trim()) {
      Alert.alert('Error', 'Please provide a rating and review text.');
      return;
    }

    const newReview: Review = {
      _id: Math.random().toString(36).substring(2, 11),
      user: { name: 'Anonymous' },
      stars: userRating,
      text: reviewText,
      createdAt: new Date().toISOString(),
    };

    setReviews([...reviews, newReview]);
    setUserRating(0);
    setReviewText('');
    Alert.alert('Success', 'Review submitted successfully!');
  };

  const handleEditReview = (reviewId: string, currentStars: number, currentText: string) => {
    Alert.prompt(
      'Edit Review',
      'Edit your review:',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: (newText) => {
            if (!newText) return;
            const newStars = parseInt(
              prompt('Edit your rating (1-5):', currentStars.toString()) || '0'
            );
            if (!newText || isNaN(newStars) || newStars < 1 || newStars > 5) {
              Alert.alert('Error', 'Invalid input. Please provide a valid review and rating (1-5).');
              return;
            }
            setReviews(
              reviews.map((review) =>
                review._id === reviewId
                  ? { ...review, stars: newStars, text: newText }
                  : review
              )
            );
            Alert.alert('Success', 'Review updated successfully!');
          },
        },
      ],
      'plain-text',
      currentText
    );
  };

  const handleDeleteReview = (reviewId: string) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this review?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setReviews(reviews.filter((review) => review._id !== reviewId));
            Alert.alert('Success', 'Review deleted successfully!');
          },
        },
      ]
    );
  };

  const nextImage = () => {
    if (!property) return;
    setCurrentImageIndex((prev) =>
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    if (!property) return;
    setCurrentImageIndex((prev) =>
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          size={16}
          color={i < Math.floor(rating) ? colors.warningColor : colors.grayLight}
          fill={i < Math.floor(rating) ? colors.warningColor : 'transparent'}
        />
      ));
  };

  const renderTabContent = () => {
    if (!property) return null;

    switch (activeTab) {
      case 'about':
        return (
          <View style={[styles.tabContent, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Description</Text>
            <Text style={[styles.description, { color: colors.grayDark }]}>
              {property.description}
            </Text>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Places Nearby</Text>
            <View style={styles.tagContainer}>
              {property.nearbyPlaces.map((place, index) => (
                <View
                  key={index}
                  style={[styles.tag, { backgroundColor: colors.primaryLight }]}
                >
                  <MapPin size= {14} color={colors.primaryColor} />
                  <Text style={[styles.tagText, { color: colors.primaryColor }]}>
                    {place.label}
                  </Text>
                </View>
              ))}
            </View>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Property Details</Text>
            <View style={styles.detailGrid}>
              {property.propertyDetails.map((detail, index) => (
                <View key={index} style={styles.detailItem}>
                  <Text style={[styles.detailLabel, { color: colors.grayDark }]}>
                    {detail.label}
                  </Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>
                    {detail.value}
                  </Text>
                </View>
              ))}
            </View>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Area of Property</Text>
            <View style={styles.areaContainer}>
              {property.areaDetails.map((area, index) => (
                <View
                  key={index}
                  style={[styles.areaItem, { backgroundColor: colors.primaryLight }]}
                >
                  <Text style={[styles.areaLabel, { color: colors.grayDark }]}>
                    {area.label}
                  </Text>
                  <View>
                    <Text style={[styles.areaValue, { color: colors.text }]}>
                      {area.value}
                    </Text>
                    <Text style={[styles.areaSubValue, { color: colors.grayDark }]}>
                      {area.subValue}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Parking</Text>
            <View style={styles.detailGrid}>
              {property.parking.map((item, index) => (
                <View key={index} style={styles.detailItem}>
                  <Text style={[styles.detailLabel, { color: colors.grayDark }]}>
                    {item.label}
                  </Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>
                    {item.value}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        );
      case 'amenities':
        return (
          <View style={[styles.tabContent, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Amenities</Text>
            <View style={styles.grid}>
              {property.amenities.map((amenity, index) => (
                <View
                  key={index}
                  style={[styles.gridItem, { backgroundColor: colors.primaryLight }]}
                >
                  <MapPin size={20} color={colors.primaryColor} />
                  <Text style={[styles.gridItemText, { color: colors.text }]}>
                    {amenity.label}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        );
      case 'furnishing':
        return (
          <View style={[styles.tabContent, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Furnishing Details</Text>
            <View style={styles.grid}>
              {property.furnishing.length === 0 ? (
                <Text style={[styles.description, { color: colors.grayDark }]}>
                  No furnishing details available.
                </Text>
              ) : (
                property.furnishing.map((item, index) => (
                  <View
                    key={index}
                    style={[styles.gridItem, { backgroundColor: colors.primaryLight }]}
                  >
                    <MapPin size={20} color={colors.warningColor} />
                    <Text style={[styles.gridItemText, { color: colors.text }]}>
                      {item.label}
                    </Text>
                  </View>
                ))
              )}
            </View>
          </View>
        );
      case 'gallery':
        return (
          <View style={[styles.tabContent, { backgroundColor: colors.cardBackground }]}>
            <FlatList
              data={property.images}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  style={styles.galleryItem}
                  onPress={() => setSelectedImage(item)}
                  activeOpacity={0.7}
                >
                  <Image
                    source={{ uri: item.src }}
                    style={styles.galleryImage}
                    resizeMode="cover"
                  />
                  <View style={[styles.galleryLabelContainer, { backgroundColor: colors.backgroundOverlay }]}>
                    <Text style={[styles.galleryLabel, { color: colors.text }]}>
                      {item.label}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={(item, index) => index.toString()}
              numColumns={2}
              columnWrapperStyle={styles.galleryRow}
            />
          </View>
        );
      case 'reviews':
        return (
          <View style={[styles.tabContent, { backgroundColor: colors.cardBackground }]}>
            <View style={[styles.reviewCard, { backgroundColor: colors.cardBackground }]}>
              <Text style={[styles.reviewRating, { color: colors.primaryColor }]}>
                {property.owner.rating}
              </Text>
              <View style={styles.starContainer}>
                {renderStars(property.owner.rating)}
              </View>
              <Text style={[styles.reviewCount, { color: colors.grayDark }]}>
                Based on {property.owner.reviews} reviews
              </Text>
            </View>
            <View style={[styles.reviewCard, { backgroundColor: colors.cardBackground }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Write a Review</Text>
              <View style={styles.starContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => setUserRating(star)}
                    activeOpacity={0.7}
                  >
                    <Star
                      size={24}
                      color={star <= userRating ? colors.warningColor : colors.grayLight}
                      fill={star <= userRating ? colors.warningColor : 'transparent'}
                    />
                  </TouchableOpacity>
                ))}
              </View>
              <TextInput
                style={[styles.reviewInput, { borderColor: colors.border, color: colors.text }]}
                placeholder="Share your experience with this property..."
                value={reviewText}
                onChangeText={setReviewText}
                multiline
                placeholderTextColor={colors.grayDark}
              />
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  {
                    backgroundColor: userRating && reviewText ? colors.primaryColor : colors.grayLight,
                  },
                ]}
                onPress={handleSubmitReview}
                disabled={!userRating || !reviewText}
                activeOpacity={0.7}
              >
                <Send size={16} color={colors.background} />
                <Text style={[styles.submitButtonText, { color: colors.background }]}>
                  Submit Review
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Reviews</Text>
            {reviews.length === 0 ? (
              <Text style={[styles.description, { color: colors.grayDark }]}>
                No reviews yet.
              </Text>
            ) : (
              <FlatList
                data={reviews}
                renderItem={({ item }) => (
                  <View style={[styles.reviewItem, { backgroundColor: colors.cardBackground }]}>
                    <View style={styles.reviewHeader}>
                      <View style={[styles.avatar, { backgroundColor: colors.primaryLight }]}>
                        <Text style={[styles.avatarText, { color: colors.text }]}>
                          {(item.user?.name || 'Anonymous').slice(0, 2).toUpperCase()}
                        </Text>
                      </View>
                      <View>
                        <Text style={[styles.reviewerName, { color: colors.text }]}>
                          {item.user?.name || 'Anonymous'}
                        </Text>
                        <View style={styles.starContainer}>
                          {renderStars(item.stars)}
                          <Text style={[styles.reviewStars, { color: colors.text }]}>
                            {item.stars}
                          </Text>
                        </View>
                      </View>
                      <Text style={[styles.reviewDate, { backgroundColor: colors.primaryLight, color: colors.grayDark }]}>
                        {new Date(item.createdAt).toLocaleDateString()}
                      </Text>
                    </View>
                    <Text style={[styles.reviewText, { color: colors.grayDark }]}>
                      {item.text}
                    </Text>
                    <View style={styles.reviewActions}>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleEditReview(item._id, item.stars, item.text)}
                        activeOpacity={0.7}
                      >
                        <Edit size={16} color={colors.primaryColor} />
                        <Text style={[styles.actionText, { color: colors.primaryColor }]}>Edit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleDeleteReview(item._id)}
                        activeOpacity={0.7}
                      >
                        <Trash size={16} color={colors.errorColor} />
                        <Text style={[styles.actionText, { color: colors.errorColor }]}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
                keyExtractor={(item) => item._id}
              />
            )}
          </View>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primaryColor} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !property) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.errorColor }]}>
            {error || 'Property not found.'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
      
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          style={[styles.headerButton, { backgroundColor: colors.cardBackground }]}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerRightButtons}>
          <TouchableOpacity
            style={[styles.headerButton, { backgroundColor: colors.cardBackground }]}
            onPress={handleFavoriteToggle}
            activeOpacity={0.7}
          >
            <Heart
              size={24}
              color={favorites.includes(id as string) ? colors.errorColor : colors.text}
              fill={favorites.includes(id as string) ? colors.errorColor : 'transparent'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.headerButton, { backgroundColor: colors.cardBackground }]}
            onPress={() => setShowShareOptions(true)}
            activeOpacity={0.7}
          >
            <Share2 size={24} color={colors.primaryColor} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 120 }]}
      >
        <View style={[styles.carouselContainer, { backgroundColor: colors.cardBackground }]}>
          <ImageCarousel
            images={property.images.map((img) => img.src)}
            height={400}
          />
          <TouchableOpacity
            style={[styles.carouselButton, styles.leftButton, { backgroundColor: colors.cardBackground }]}
            onPress={prevImage}
            activeOpacity={0.7}
          >
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.carouselButton, styles.rightButton, { backgroundColor: colors.cardBackground }]}
            onPress={nextImage}
            activeOpacity={0.7}
          >
            <ArrowLeft size={24} color={colors.text} style={{ transform: [{ rotate: '180deg' }] }} />
          </TouchableOpacity>
          <View style={[styles.imageLabel, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.imageLabelText, { color: colors.text }]}>
              {property.images[currentImageIndex].label}
            </Text>
          </View>
        </View>
        <View style={[styles.thumbnailContainer, { backgroundColor: colors.cardBackground }]}>
          <FlatList
            data={property.images}
            renderItem={({ item, index }) => (
              <TouchableOpacity onPress={() => setCurrentImageIndex(index)} activeOpacity={0.7}>
                <Image
                  source={{ uri: item.src }}
                  style={[
                    styles.thumbnail,
                    currentImageIndex === index && { borderColor: colors.primaryColor },
                  ]}
                />
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.thumbnailContent}
          />
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: colors.text }]}>{property.title}</Text>
            <View style={styles.locationContainer}>
              <MapPin size={16} color={colors.primaryColor} />
              <Text style={[styles.location, { color: colors.grayDark }]}>
                {property.location}
              </Text>
            </View>
            <View style={styles.priceContainer}>
              <Text style={[styles.price, { color: colors.primaryColor }]}>
                {property.price}
              </Text>
              <Text style={[styles.pricePerSqft, { color: colors.grayDark }]}>
                {property.pricePerSqft}
              </Text>
              {property.isNegotiable && (
                <View style={[styles.negotiableTag, { backgroundColor: colors.successLight }]}>
                  <Text style={[styles.negotiableText, { color: colors.successColor }]}>
                    Negotiable
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.tagContainer}>
              {property.tags.map((tag, index) => (
                <View
                  key={index}
                  style={[styles.tag, { backgroundColor: colors.primaryLight }]}
                >
                  <Text style={[styles.tagText, { color: colors.primaryColor }]}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.featuresContainer}>
            {property.features.map((feature, index) => (
              <View
                key={index}
                style={[styles.featureItem, { backgroundColor: colors.cardBackground }]}
              >
                <View style={[styles.featureIcon, { backgroundColor: colors.primaryColor }]}>
                  <FeatureIcon type={feature.icon} />
                </View>
                <Text style={[styles.featureText, { color: colors.text }]}>
                  {feature.label}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.tabsContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tabsScrollContent}
            >
              {['about', 'amenities', 'furnishing', 'gallery', 'reviews'].map((tab) => (
                <TabButton
                  key={tab}
                  title={tab.charAt(0).toUpperCase() + tab.slice(1)}
                  isActive={activeTab === tab}
                  onPress={() => setActiveTab(tab)}
                />
              ))}
            </ScrollView>
          </View>

          {renderTabContent()}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={[
          styles.ownerButton,
          { backgroundColor: colors.primaryColor, bottom: insets.bottom + 24 }
        ]}
        onPress={() => setShowOwnerModal(true)}
        activeOpacity={0.7}
      >
        <User size={24} color={colors.background} />
      </TouchableOpacity>

      <ImageModal
        image={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
      <ShareModal
        visible={showShareOptions}
        onClose={() => setShowShareOptions(false)}
        onShare={handleShare}
      />
      <NotifyModal
        visible={showNotify}
        onClose={() => setShowNotify(false)}
        notificationTitle={notificationTitle}
        setNotificationTitle={setNotificationTitle}
        notificationText={notificationText}
        setNotificationText={setNotificationText}
        onSubmit={handleSubmitNotification}
      />
      <OwnerModal
        visible={showOwnerModal}
        onClose={() => setShowOwnerModal(false)}
        owner={property?.owner}
        onNotify={() => {
          setShowOwnerModal(false);
          setShowNotify(true);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  headerRightButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  scrollContent: {
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
  },
  carouselContainer: {
    position: 'relative',
    height: 400,
  },
  carouselButton: {
    position: 'absolute',
    top: '50%',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    transform: [{ translateY: -20 }],
  },
  leftButton: {
    left: 16,
  },
  rightButton: {
    right: 16,
  },
  imageLabel: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  imageLabelText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  thumbnailContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  thumbnailContent: {
    paddingHorizontal: 8,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    marginRight: 12,
  },
  contentContainer: {
    padding: 16,
  },
  titleContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    marginBottom: 12,
    lineHeight: 34,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  location: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginLeft: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  price: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginRight: 12,
  },
  pricePerSqft: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginRight: 12,
  },
  negotiableTag: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  negotiableText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 6,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
    gap: 12,
  },
  featureItem: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  featureIcon: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
  },
  tabsContainer: {
    marginBottom: 24,
    borderBottomWidth: 0,
  },
  tabsScrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  tabButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  tabButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  tabContent: {
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    lineHeight: 24,
    marginBottom: 24,
  },
  detailGrid: {
    marginBottom: 24,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  detailLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  detailValue: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  areaContainer: {
    marginBottom: 24,
  },
  areaItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  areaLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  areaValue: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  areaSubValue: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridItem: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  gridItemText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 12,
  },
  galleryItem: {
    flex: 1,
    minWidth: '45%',
    aspectRatio: 1,
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  galleryImage: {
    flex: 1,
  },
  galleryLabelContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
  },
  galleryLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  galleryRow: {
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  reviewCard: {
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 24,
  },
  reviewRating: {
    fontSize: 36,
    fontFamily: 'Inter-Bold',
    marginBottom: 12,
  },
  starContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewCount: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  reviewInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    height: 120,
    marginBottom: 16,
    textAlignVertical: 'top',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
  },
  submitButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 8,
  },
  reviewItem: {
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
  },
  reviewerName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  reviewStars: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginLeft: 8,
  },
  reviewDate: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginLeft: 'auto',
  },
  reviewText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    lineHeight: 24,
  },
  reviewActions: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 8,
  },
  ownerButton: {
    position: 'absolute',
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 40,
    right: 16,
    padding: 12,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  modalImage: {
    width: '100%',
    height: '80%',
  },
  shareModalContent: {
    width: '90%',
    maxWidth: 400,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  shareModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  shareModalTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
  },
  shareButton: {
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
  },
  shareButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
  },
  notifyModalContent: {
    width: '90%',
    maxWidth: 400,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  notifyModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  notifyModalTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  notifyButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  notifyButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  notifyButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  ownerModalContent: {
    width: '90%',
    maxWidth: 400,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  ownerModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  ownerModalTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
  },
  ownerModalBody: {
    alignItems: 'center',
  },
  ownerActions: {
    width: '100%',
    marginTop: 20,
  },
  ownerActionButton: {
    width: '100%',
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
    borderWidth: 1,
  },
  ownerActionButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  ownerName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  ownerRating: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginLeft: 4,
  },
});