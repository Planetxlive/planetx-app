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
  Linking,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { backendUrl } from '@/lib/uri';
import {
  PropertyCategory,
  useProperties,
  Property as ContextProperty,
} from '@/context/PropertyContext';
import ImageCarousel from '@/components/ImageCarousel';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
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
import { useAuth } from '@/context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

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

interface PropertyPricingData {
  expectedPrice?: number;
  PricePerSqft?: number;
  basePricePerNight?: number;
  finalPrice?: number;
  price?: { amount: number };
  rentalDetails?: { monthlyRent: number };
  monthlyRent?: number;
  maintenanceFrequency?: string;
  maintenancePrice?: number;
}

interface PropertyDetailsData {
  propertyName?: string;
  totalRooms?: number;
  starRating?: number;
  officeType?: string;
  furnishedStatus?: string;
  totalArea?: { size: number };
  carpetArea?: { size: number };
  floorDetails?: {
    officeOnFloor?: number;
    totalFloors?: number;
  };
}

interface PropertyData {
  _id: string;
  category?: string;
  subCategory?: string;
  location?: {
    houseNumber?: string;
    apartment?: string;
    subLocality?: string;
    locality?: string;
    city?: string;
    state?: string;
  };
  pricing?: PropertyPricingData;
  availabilityStatus?: string;
  furnishingStatus?: string;
  about?: {
    bedrooms?: number;
    bathrooms?: number;
    balconies?: number;
  };
  propertyArea?: {
    carpetArea?: number;
  };
  propertyOnFloor?: number;
  totalFloors?: number;
  ageOfProperty?: number;
  availableFrom?: string;
  facing?: string;
  powerBackup?: string;
  waterSource?: string;
  roadWidth?: string;
  flooring?: string;
  description?: string;
  images?: Array<{ url?: string; name?: string }>;
  amenities?: Record<string, boolean> | string[];
  furnishingDetails?: Record<string, boolean | number> | string[];
  societyBuildingFeatures?: Record<string, boolean>;
  otherFeatures?: Record<string, boolean>;
  nearbyPlaces?: Record<string, boolean>;
  reviews?: Array<{ stars?: number }>;
  user?: {
    name?: string;
    mobile?: string;
    whatsappMobile?: string;
  };
  propertyDetails?: PropertyDetailsData;
  carpetArea?: { size: number };
  parking?: {
    covered?: number;
    open?: number;
  };
}

interface Review {
  _id: string;
  user: {
    _id: string;
    name: string;
  };
  stars: number;
  text: string;
  createdAt: string;
}

interface Property {
  id: string;
  type: PropertyCategory;
  title: string;
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

// Transform property data to match React page structure
const transformPropertyData = (data: PropertyData): Property => {
  const category = data.category || 'Residential';

  const amenitiesMap: Record<string, string> = {
    maintenanceStaff: 'Maintenance Staff',
    vastuCompliant: 'Vastu Compliant',
    securityFireAlarm: 'Security & Fire Alarm',
    visitorParking: 'Visitor Parking',
    gasLine: 'Gas Line',
    wifiCable: 'WiFi & Cable',
    waterSupply: 'Water Supply',
    powerBackup: 'Power Backup',
    parking: 'Parking',
    clubHouse: 'Club House',
    childrensPlayArea: "Children's Play Area",
    sportsFacilities: 'Sports Facilities',
    joggingWalkingTracks: 'Jogging & Walking Tracks',
    swimmingPool: 'Swimming Pool',
    gym: 'Gym',
    cinemaRoom: 'Cinema Room',
    libraryReadingRoom: 'Library & Reading Room',
    projector: 'Projector',
    screen: 'Screen',
    soundSystem: 'Sound System',
    lightingSetup: 'Lighting Setup',
    airConditioning: 'Air Conditioning',
    cateringServices: 'Catering Services',
    decorationServices: 'Decoration Services',
    stageSetup: 'Stage Setup',
    podium: 'Podium',
    securityServices: 'Security Services',
    cleaningServices: 'Cleaning Services',
    hotWater: 'Hot Water',
    laundryService: 'Laundry Service',
    housekeeping: 'Housekeeping',
    roomService: 'Room Service',
    restaurant: 'Restaurant',
    bar: 'Bar',
    conferenceRoom: 'Conference Room',
    lift: 'Lift',
    cctv: 'CCTV',
    security24x7: '24x7 Security',
    firstAidKit: 'First Aid Kit',
    fireExtinguisher: 'Fire Extinguisher',
    wheelChairAccess: 'Wheelchair Access',
    fireSafety: 'Fire Safety',
    pantry: 'Pantry',
    cafeteria: 'Cafeteria',
    receptionService: 'Reception Service',
    gymFitnessCentre: 'Gym & Fitness Centre',
    breakoutArea: 'Breakout Area',
    commonRefrigerator: 'Common Refrigerator',
    roWater: 'RO Water',
    cookingAllowed: 'Cooking Allowed',
    twoWheelerParking: 'Two-Wheeler Parking',
    fourWheelerParking: 'Four-Wheeler Parking',
    geyser: 'Geyser',
    studyTable: 'Study Table',
    wardrobe: 'Wardrobe',
    tv: 'TV',
    microwave: 'Microwave',
    recreationRoom: 'Recreation Room',
    readingRoom: 'Reading Room',
    garden: 'Garden',
    highSpeedWiFi: 'High-Speed WiFi',
    printingServices: 'Printing Services',
    conferenceRooms: 'Conference Rooms',
    phoneBooths: 'Phone Booths',
    teaCoffee: 'Tea/Coffee',
    access24x7: '24x7 Access',
    security: 'Security',
    receptionServices: 'Reception Services',
    elevator: 'Elevator',
    loadingDock: 'Loading Dock',
    coldStorageFacility: 'Cold Storage Facility',
  };

  const otherFeaturesMap: Record<string, string> = {
    separateEntryForServantRoom: 'Separate Entry for Servant Room',
    noOpenDrainageAround: 'No Open Drainage Around',
    petFriendly: 'Pet-Friendly',
    wheelchairFriendly: 'Wheelchair Friendly',
    rainWaterHarvesting: 'Rain Water Harvesting',
    cornerProperty: 'Corner Property',
    poojaRoom: 'Pooja Room',
    guestRoom: 'Guest Room',
    servantRoom: 'Servant Room',
    studyRoom: 'Study Room',
    shopFrontage: 'Shop Frontage',
    height: 'Height',
    parkingAvailability: 'Parking Availability',
    electricityLoad: 'Electricity Load',
    shutterType: 'Shutter Type',
    advertisingSpace: 'Advertising Space',
    entryType: 'Entry Type',
    ventilation: 'Ventilation',
    powerSupply: 'Power Supply',
    flooringType: 'Flooring Type',
    hazardousMaterialStorage: 'Hazardous Material Storage',
    temperatureControlled: 'Temperature Controlled',
    fireSprinklerSystem: 'Fire Sprinkler System',
    fireSafetyCertificate: 'Fire Safety Certificate',
    buildingStabilityCertificate: 'Building Stability Certificate',
    environmentalClearance: 'Environmental Clearance',
    eventPlannerSupport: 'Event Planner Support',
    technicalStaffOnSite: 'Technical Staff On-Site',
    customizableLayouts: 'Customizable Layouts',
    loungeArea: 'Lounge Area',
  };

  const societyFeaturesMap: Record<string, string> = {
    swimmingPool: 'Swimming Pool',
    security24x7: '24/7 Security',
    gymFitnessCentre: 'Gym & Fitness Centre',
    shoppingCenter: 'Shopping Center',
    clubHouse: 'Club House',
    childrensPlayArea: "Children's Play Area",
    sportsFacilities: 'Sports Facilities',
    joggingWalkingTracks: 'Jogging & Walking Tracks',
    gardenParks: 'Garden & Parks',
    communityHalls: 'Community Halls',
    cinemaRoom: 'Cinema Room',
    libraryReadingRoom: 'Library & Reading Room',
  };

  const furnishingMap: Record<string, string> = {
    fans: 'Fans',
    lights: 'Lights',
    tv: 'TV',
    beds: 'Beds',
    ac: 'AC',
    wardrobes: 'Wardrobes',
    exhaustFans: 'Exhaust Fans',
    curtains: 'Curtains',
    floorLamps: 'Floor Lamps',
    diningTable: 'Dining Table',
    sofa: 'Sofa',
    stove: 'Stove',
    kitchenCabinets: 'Kitchen Cabinets',
    chimney: 'Chimney',
    coffeeTable: 'Coffee Table',
    refrigerator: 'Refrigerator',
    microwave: 'Microwave',
    dishwasher: 'Dishwasher',
    waterPurifier: 'Water Purifier',
    washingMachine: 'Washing Machine',
    workstations: 'Workstations',
    meetingRooms: 'Meeting Rooms',
    conferenceRooms: 'Conference Rooms',
  };

  const nearbyPlacesMap: Record<string, string> = {
    hospital: 'Hospital',
    school: 'School',
    metro: 'Metro Station',
    mall: 'Mall',
    market: 'Market',
    railway: 'Railway Station',
    airport: 'Airport',
    highway: 'Highway',
    busStation: 'Bus Station',
  };

  const arrayToObject = (arr: string[], map: Record<string, string>) =>
    arr?.reduce((acc, key) => {
      if (map[key]) acc[key] = true;
      return acc;
    }, {} as Record<string, boolean>) || {};

  const amenitiesObj = Array.isArray(data.amenities)
    ? arrayToObject(data.amenities, amenitiesMap)
    : data.amenities || {};

  const furnishingObj = Array.isArray(data.furnishingDetails)
    ? arrayToObject(data.furnishingDetails, furnishingMap)
    : data.furnishingDetails || {};

  const amenities = Object.entries(amenitiesObj).reduce((acc, [key, value]) => {
    if (value && amenitiesMap[key]) {
      acc.push({ icon: 'user', label: amenitiesMap[key] });
    }
    return acc;
  }, [] as PropertyFeature[]);

  const furnishing = Object.entries(furnishingObj).reduce(
    (acc, [key, value]) => {
      if (
        (typeof value === 'number' && value > 0) ||
        (typeof value === 'boolean' && value)
      ) {
        acc.push({
          icon: 'fan',
          label: `${typeof value === 'number' ? value : 1} ${
            furnishingMap[key] || key
          }`,
        });
      }
      return acc;
    },
    [] as PropertyFeature[]
  );

  const societyFeatures = Object.entries(
    data.societyBuildingFeatures || {}
  ).reduce((acc, [key, value]) => {
    if (value && societyFeaturesMap[key]) {
      acc.push({ icon: 'swimming-pool', label: societyFeaturesMap[key] });
    }
    return acc;
  }, [] as PropertyFeature[]);

  const otherFeatures = Object.entries(data.otherFeatures || {}).reduce(
    (acc, [key, value]) => {
      if (value && otherFeaturesMap[key]) {
        acc.push({ icon: 'door', label: otherFeaturesMap[key] });
      }
      return acc;
    },
    [] as PropertyFeature[]
  );

  const nearbyPlaces = Object.entries(data.nearbyPlaces || {}).reduce(
    (acc, [key, value]) => {
      if (value && nearbyPlacesMap[key]) {
        acc.push({ icon: 'train', label: nearbyPlacesMap[key] });
      }
      return acc;
    },
    [] as PropertyFeature[]
  );

  let pricing: PropertyPricingData = {};
  let features = [];
  let propertyDetails = [];
  let areaDetails = [];

  switch (category) {
    case 'Residential':
      pricing = {
        expectedPrice: data.pricing?.expectedPrice ?? undefined,
        PricePerSqft: data.pricing?.PricePerSqft ?? undefined,
      };
      features = [
        {
          icon: 'layout',
          label: data.about
            ? `${data.about.bedrooms || 0} BHK & ${
                data.about.bathrooms || 0
              } Baths`
            : 'N/A',
        },
        {
          icon: 'square',
          label: data.propertyArea?.carpetArea
            ? `${data.propertyArea.carpetArea} sq.ft.`
            : 'N/A',
        },
        {
          icon: 'layers',
          label:
            data.propertyOnFloor !== undefined && data.totalFloors !== undefined
              ? `${data.propertyOnFloor} / ${data.totalFloors || 'N/A'} floors`
              : 'N/A',
        },
        {
          icon: 'tag',
          label: pricing.PricePerSqft
            ? `₹${pricing.PricePerSqft.toLocaleString('en-IN')} / sq.ft.`
            : ' ',
        },
        {
          icon: 'home',
          label: data.ageOfProperty
            ? `${data.ageOfProperty} Year Old`
            : 'New Property',
        },
      ];
      propertyDetails = [
        { label: 'Bedrooms', value: data.about?.bedrooms || 'N/A' },
        { label: 'Bathrooms', value: data.about?.bathrooms || 'N/A' },
        { label: 'Balconies', value: data.about?.balconies || 'N/A' },
        { label: 'Total no. of Floor', value: data.totalFloors || 'N/A' },
        {
          label: 'Property on Floor',
          value:
            data.propertyOnFloor !== undefined ? data.propertyOnFloor : 'N/A',
        },
        {
          label: 'Availability Status',
          value: data.availabilityStatus || 'N/A',
        },
        {
          label: 'Available From',
          value: data.availableFrom
            ? new Date(data.availableFrom).toLocaleDateString()
            : 'N/A',
        },
        {
          label: 'Age of Property',
          value: data.ageOfProperty ? `${data.ageOfProperty} years` : 'N/A',
        },
        { label: 'Furnishing Status', value: data.furnishingStatus || 'N/A' },
        { label: 'Facing', value: data.facing || 'N/A' },
        { label: 'Power backup', value: data.powerBackup || 'N/A' },
        {
          label: 'Wheelchair Friendly',
          value: data.otherFeatures?.wheelchairFriendly ? 'Yes' : 'No',
        },
        { label: 'Water Source', value: data.waterSource || 'N/A' },
        { label: 'Width of facing road', value: data.roadWidth || 'N/A' },
        { label: 'Type of flooring', value: data.flooring || 'N/A' },
        // { label: 'Property ID', value: data._id },
      ];
      areaDetails = [
        {
          label: 'Carpet Area',
          value: data.propertyArea?.carpetArea
            ? `${data.propertyArea.carpetArea} Sq.ft.`
            : 'N/A',
          subValue: data.propertyArea?.carpetArea
            ? `${(data.propertyArea.carpetArea * 0.092903).toFixed(2)} Sq.m.`
            : 'N/A',
        },
        {
          label: 'Built-up Area',
          value: data.propertyArea?.carpetArea
            ? `${(data.propertyArea.carpetArea * 1.1).toFixed(0)} Sq.ft.`
            : 'N/A',
          subValue: data.propertyArea?.carpetArea
            ? `${(data.propertyArea.carpetArea * 1.1 * 0.092903).toFixed(
                2
              )} Sq.m.`
            : 'N/A',
        },
        {
          label: 'Super Built-up Area',
          value: data.propertyArea?.carpetArea
            ? `${(data.propertyArea.carpetArea * 1.2).toFixed(0)} Sq.ft.`
            : 'N/A',
          subValue: data.propertyArea?.carpetArea
            ? `${(data.propertyArea.carpetArea * 1.2 * 0.092903).toFixed(
                2
              )} Sq.m.`
            : 'N/A',
        },
      ];
      break;

    case 'Hotel':
      pricing = {
        expectedPrice:
          data.pricing?.basePricePerNight ??
          data.pricing?.finalPrice ??
          undefined,
      };
      features = [
        {
          icon: 'layout',
          label: data.propertyDetails?.totalRooms
            ? `${data.propertyDetails.totalRooms} Rooms`
            : 'N/A',
        },
        {
          icon: 'star',
          label: data.propertyDetails?.starRating
            ? `${data.propertyDetails.starRating} Star`
            : 'N/A',
        },
        {
          icon: 'home',
          label: data.ageOfProperty
            ? `${data.ageOfProperty} Year Old`
            : 'New Property',
        },
      ];
      propertyDetails = [
        {
          label: 'Property Name',
          value: data.propertyDetails?.propertyName || 'N/A',
        },
        {
          label: 'Total Rooms',
          value: data.propertyDetails?.totalRooms || 'N/A',
        },
        {
          label: 'Star Rating',
          value: data.propertyDetails?.starRating || 'N/A',
        },
        {
          label: 'Availability Status',
          value: data.availabilityStatus || 'N/A',
        },
        { label: 'Property ID', value: data._id },
      ];
      areaDetails = [
        {
          label: 'Total Area',
          value: data.propertyDetails?.totalArea?.size
            ? `${data.propertyDetails.totalArea.size} Sq.ft.`
            : 'N/A',
          subValue: data.propertyDetails?.totalArea?.size
            ? `${(data.propertyDetails.totalArea.size * 0.092903).toFixed(
                2
              )} Sq.m.`
            : 'N/A',
        },
      ];
      break;

    case 'Office':
    case 'Shop':
    case 'Warehouse':
    case 'EventSpace':
    case 'PG':
      pricing = {
        expectedPrice:
          data.pricing?.price?.amount ||
          data.pricing?.rentalDetails?.monthlyRent ||
          data.pricing?.monthlyRent ||
          0,
      };
      features = [
        {
          icon: 'layout',
          label:
            data.propertyDetails?.propertyName || data.subCategory || category,
        },
        {
          icon: 'square',
          label:
            data.propertyDetails?.carpetArea?.size || data.carpetArea?.size
              ? `${
                  data.propertyDetails?.carpetArea?.size ||
                  data.carpetArea?.size
                } sq.ft.`
              : 'N/A',
        },
        {
          icon: 'layers',
          label: data.propertyDetails?.floorDetails
            ? `${data.propertyDetails.floorDetails.officeOnFloor || 'N/A'} / ${
                data.propertyDetails.floorDetails.totalFloors || 'N/A'
              } floors`
            : 'N/A',
        },
      ];
      propertyDetails = [
        {
          label: 'Type',
          value:
            data.propertyDetails?.officeType || data.subCategory || category,
        },
        {
          label: 'Total Floors',
          value: data.propertyDetails?.floorDetails?.totalFloors || 'N/A',
        },
        {
          label: 'Property on Floor',
          value: data.propertyDetails?.floorDetails?.officeOnFloor || 'N/A',
        },
        {
          label: 'Furnished Status',
          value:
            data.propertyDetails?.furnishedStatus ||
            data.furnishingStatus ||
            'N/A',
        },
        {
          label: 'Availability Status',
          value: data.availabilityStatus || 'N/A',
        },
        { label: 'Property ID', value: data._id },
      ];
      areaDetails = [
        {
          label: 'Carpet Area',
          value: data.pricing && data.pricing.PricePerSqft
            ? `${data.pricing.PricePerSqft} Sq.ft.`
            : 'N/A',
          // ? `${data.propertyDetails?.carpetArea?.size || data.carpetArea?.size} Sq.ft.` : 'N/A',
          subValue:
            ((data.propertyDetails && data.propertyDetails.carpetArea && typeof data.propertyDetails.carpetArea.size === 'number') ||
              (data.carpetArea && typeof data.carpetArea.size === 'number'))
              ? `${(
                  ((data.propertyDetails && data.propertyDetails.carpetArea && typeof data.propertyDetails.carpetArea.size === 'number')
                    ? data.propertyDetails.carpetArea.size
                    : data.carpetArea?.size || 0) * 0.092903
                ).toFixed(2)} Sq.m.`
              : 'N/A',
        },
      ];
      break;

    default:
      pricing = {
        expectedPrice: Array.isArray(data.pricing)
          ? data.pricing[0]
          : data.pricing?.expectedPrice || null,
      };
      features = [
        {
          icon: 'home',
          label: data.ageOfProperty
            ? `${data.ageOfProperty} Year Old`
            : 'New Property',
        },
      ];
      propertyDetails = [
        { label: 'Category', value: category },
        {
          label: 'Availability Status',
          value: data.availabilityStatus || 'N/A',
        },
        { label: 'Property ID', value: data._id },
      ];
      areaDetails = [
        {
          label: 'Total Area',
          value: data.carpetArea?.size
            ? `${data.carpetArea.size} Sq.ft.`
            : 'N/A',
          subValue: data.carpetArea?.size
            ? `${(data.carpetArea.size * 0.092903).toFixed(2)} Sq.m.`
            : 'N/A',
        },
      ];
  }

  const calculateRatingDistribution = (reviews: Array<{ stars?: number }>) => {
    const total = reviews.length;
    if (total === 0)
      return { excellent: 0, good: 0, average: 0, belowAverage: 0, poor: 0 };

    const getCount = (min: number, max: number) =>
      reviews.filter((r) => (r.stars ?? 0) >= min && (r.stars ?? 0) < max)
        .length;

    return {
      excellent: Math.round((getCount(4.5, Infinity) / total) * 100),
      good: Math.round((getCount(3.5, 4.5) / total) * 100),
      average: Math.round((getCount(2.5, 3.5) / total) * 100),
      belowAverage: Math.round((getCount(1.5, 2.5) / total) * 100),
      poor: Math.round((getCount(0, 1.5) / total) * 100),
    };
  };

  const propertyType: PropertyCategory = (() => {
    switch (category) {
      case 'Residential':
        return 'Residential';
      case 'Hotel':
        return 'Hotel';
      case 'Office':
        return 'Office';
      case 'Shop':
        return 'Shop';
      case 'Warehouse':
        return 'Warehouse';
      case 'EventSpace':
        return 'EventSpace';
      case 'PG':
        return 'Pg';
      default:
        return 'Residential';
    }
  })();

  const owner: PropertyOwner = {
    name: data.user?.name || 'Unknown Owner',
    image: '/placeholder.svg?height=80&width=80',
    rating: data.reviews?.length
      ? Math.round(
          (data.reviews.reduce((sum, r) => sum + (r.stars ?? 0), 0) /
            data.reviews.length) * 10
        ) / 10
      : 0,
    reviews: data.reviews?.length || 0,
    phone: data.user?.mobile || '+91 00000 00000',
    WhatsApp: data.user?.whatsappMobile || '+91 00000 00000',
  };

  return {
    id: data._id,
    type: propertyType,
    title: `${category} in ${data.location?.locality || 'Unknown'}`,
    location: [
      data.location?.houseNumber,
      data.location?.apartment,
      data.location?.subLocality,
      data.location?.locality,
      data.location?.city,
      data.location?.state,
    ]
      .filter(Boolean)
      .join(', '),
    price: data.pricing && data.pricing.expectedPrice
      ? `₹${data.pricing.expectedPrice.toLocaleString('en-IN')}`
      : data.pricing && data.pricing.price && data.pricing.price.amount
      ? `₹${data.pricing.price.amount.toLocaleString('en-IN')}`
      : data.pricing && data.pricing.monthlyRent
      ? `₹${data.pricing.monthlyRent.toLocaleString('en-IN')}/mo`
      : 'Price N/A',
    pricePerSqft: data.pricing && data.pricing.PricePerSqft
      ? `₹${data.pricing.PricePerSqft.toLocaleString('en-IN')} / sqft`
      : ' ',
    isNegotiable: false,
    tags: [
      category,
      data.availabilityStatus || 'N/A',
      data.furnishingStatus || '',
    ].filter(Boolean),
    features,
    owner,
    description: data.description || 'No description available.',
    images:
      data.images?.map((img, index) => ({
        src: img.url || '/placeholder.svg?height=400&width=600',
        alt: img.name || `Image ${index + 1}`,
        label: img.name || `Image ${index + 1}`,
      })) || [],
    amenities,
    otherFeatures,
    societyFeatures,
    furnishing,
    propertyDetails,
    areaDetails,
    parking: [
      { label: 'Covered Parking', value: String(data.parking?.covered ?? 0) },
      { label: 'Open Parking', value: String(data.parking?.open ?? 0) },
    ],
    nearbyPlaces,
    ratingDistribution: calculateRatingDistribution(data.reviews || []),
  };
};

interface TabButtonProps {
  title: string;
  isActive: boolean;
  onPress: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ title, isActive, onPress }) => {
  const colorScheme = useColorScheme() || 'light';
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
  const colorScheme = useColorScheme() || 'light';
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
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme];

  if (!image) return null;

  return (
    <Modal visible={true} animationType="fade" transparent>
      <View
        style={[styles.modalContainer, { backgroundColor: colors.overlay }]}
      >
        <TouchableOpacity
          style={[
            styles.modalCloseButton,
            { backgroundColor: colors.cardBackground },
          ]}
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

const ShareModal: React.FC<ShareModalProps> = ({
  visible,
  onClose,
  onShare,
}) => {
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme];

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View
        style={[styles.modalContainer, { backgroundColor: colors.overlay }]}
      >
        <View
          style={[
            styles.shareModalContent,
            { backgroundColor: colors.cardBackground },
          ]}
        >
          <View style={styles.shareModalHeader}>
            <Text style={[styles.shareModalTitle, { color: colors.text }]}>
              Share Property
            </Text>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
              <X size={20} color={colors.text} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={[
              styles.shareButton,
              { backgroundColor: colors.successColor + '20' },
            ]}
            onPress={() => onShare('whatsapp')}
            activeOpacity={0.7}
          >
            <Text
              style={[styles.shareButtonText, { color: colors.successColor }]}
            >
              WhatsApp
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.shareButton,
              { backgroundColor: colors.primaryColor + '20' },
            ]}
            onPress={() => onShare('facebook')}
            activeOpacity={0.7}
          >
            <Text
              style={[styles.shareButtonText, { color: colors.primaryColor }]}
            >
              Facebook
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.shareButton,
              { backgroundColor: colors.accentColor + '20' },
            ]}
            onPress={() => onShare('twitter')}
            activeOpacity={0.7}
          >
            <Text
              style={[styles.shareButtonText, { color: colors.accentColor }]}
            >
              Twitter
            </Text>
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
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme];

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View
        style={[styles.modalContainer, { backgroundColor: colors.overlay }]}
      >
        <View
          style={[
            styles.notifyModalContent,
            { backgroundColor: colors.cardBackground },
          ]}
        >
          <View style={styles.notifyModalHeader}>
            <Text style={[styles.notifyModalTitle, { color: colors.text }]}>
              Notify Owner
            </Text>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
              <X size={20} color={colors.text} />
            </TouchableOpacity>
          </View>
          <TextInput
            style={[
              styles.input,
              { borderColor: colors.divider, color: colors.text },
            ]}
            placeholder="Notification Title"
            value={notificationTitle}
            onChangeText={setNotificationTitle}
            placeholderTextColor={colors.grayDark}
          />
          <TextInput
            style={[
              styles.input,
              { borderColor: colors.divider, color: colors.text, height: 100 },
            ]}
            placeholder="Notification Message"
            value={notificationText}
            onChangeText={setNotificationText}
            multiline
            placeholderTextColor={colors.grayDark}
          />
          <View style={styles.notifyButtonContainer}>
            <TouchableOpacity
              style={[styles.notifyButton, { borderColor: colors.divider }]}
              onPress={() => {
                setNotificationTitle('');
                setNotificationText('');
              }}
              activeOpacity={0.7}
            >
              <Text style={[styles.notifyButtonText, { color: colors.text }]}>
                Clear
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.notifyButton,
                {
                  backgroundColor:
                    notificationTitle && notificationText
                      ? colors.primaryColor
                      : colors.grayLight,
                },
              ]}
              onPress={onSubmit}
              disabled={!notificationTitle || !notificationText}
              activeOpacity={0.7}
            >
              <Text
                style={[styles.notifyButtonText, { color: colors.background }]}
              >
                Send Notification
              </Text>
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

const OwnerModal: React.FC<OwnerModalProps> = ({
  visible,
  onClose,
  owner,
  onNotify,
}) => {
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme];

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View
        style={[styles.modalContainer, { backgroundColor: colors.overlay }]}
      >
        <View
          style={[
            styles.ownerModalContent,
            { backgroundColor: colors.cardBackground },
          ]}
        >
          <View style={styles.ownerModalHeader}>
            <Text style={[styles.ownerModalTitle, { color: colors.text }]}>Property Owner</Text>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
              <X size={20} color={colors.text} />
            </TouchableOpacity>
          </View>
          <View style={styles.ownerModalBody}>
            <View
              style={[
                styles.avatar,
                { backgroundColor: colors.primaryColor + '20' },
              ]}
            >
              <Text style={[styles.avatarText, { color: colors.text }]}> 
                {owner?.name?.slice(0, 2).toUpperCase()}
              </Text>
            </View>
            <Text style={[styles.ownerName, { color: colors.text }]}> 
              {owner?.name}
            </Text>
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
                style={[
                  styles.ownerActionButton,
                  { backgroundColor: colors.successColor },
                ]}
                onPress={() => {
                  Linking.openURL(`https://wa.me/${owner.WhatsApp.replace(/\s+/g, '')}`);
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.ownerActionButtonText}>Message on WhatsApp</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.ownerActionButton,
                  { backgroundColor: colors.primaryColor },
                ]}
                onPress={() => {
                  Linking.openURL(`tel:${owner.phone.replace(/\s+/g, '')}`);
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.ownerActionButtonText}>Call Owner</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.ownerActionButton,
                  { borderColor: colors.divider },
                ]}
                onPress={onNotify}
                activeOpacity={0.7}
              >
                <Text style={[styles.ownerActionButtonText, { color: colors.text }]}>Notify</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

interface EditReviewModalProps {
  visible: boolean;
  onClose: () => void;
  currentStars: number;
  currentText: string;
  onSubmit: (stars: number, text: string) => void;
}

const EditReviewModal: React.FC<EditReviewModalProps> = ({
  visible,
  onClose,
  currentStars,
  currentText,
  onSubmit,
}) => {
  const [stars, setStars] = useState(currentStars);
  const [text, setText] = useState(currentText);
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme];

  useEffect(() => {
    setStars(currentStars);
    setText(currentText);
  }, [currentStars, currentText]);

  const handleSubmit = () => {
    if (!text.trim() || stars < 1 || stars > 5) {
      Alert.alert('Error', 'Please provide a valid review and rating (1-5).');
      return;
    }
    onSubmit(stars, text);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={[styles.modalContainer, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
        <View style={[styles.modalContent, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.modalTitle, { color: colors.text }]}>Edit Review</Text>
          
          <View style={styles.starContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setStars(star)}
                activeOpacity={0.7}
              >
                <Star
                  size={24}
                  color={star <= stars ? colors.warningColor : colors.grayLight}
                  fill={star <= stars ? colors.warningColor : 'transparent'}
                />
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            style={[
              styles.reviewInput,
              { borderColor: colors.divider, color: colors.text },
            ]}
            placeholder="Edit your review..."
            value={text}
            onChangeText={setText}
            multiline
            placeholderTextColor={colors.grayDark}
          />

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: colors.grayLight }]}
              onPress={onClose}
            >
              <Text style={[styles.modalButtonText, { color: colors.text }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: colors.primaryColor }]}
              onPress={handleSubmit}
            >
              <Text style={[styles.modalButtonText, { color: colors.background }]}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default function PropertyDetailScreen() {
  const colorScheme = useColorScheme() || 'light';
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
  const [user, setUser] = useState<{ _id: string; name: string } | null>(null);
  const insets = useSafeAreaInsets();
  const { width: windowWidth } = useWindowDimensions();
  const [editingReview, setEditingReview] = useState<{
    id: string;
    stars: number;
    text: string;
  } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (token) {
          const response = await axios.get(`${backendUrl}/auth/get-user`, {
            headers: { Authorization: token },
          });
          setUser({
            _id: response.data.user._id,
            name: response.data.user.name
          });
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const rawProperty = getPropertyById(id as string);
        if (!rawProperty) {
          throw new Error('Property not found');
        }
        // Fix: cast to PropertyData for transformPropertyData
        const transformedProperty = transformPropertyData(rawProperty as any);
        setProperty(transformedProperty);
        
        // Fetch reviews for the property
        const token = await AsyncStorage.getItem('accessToken');
        const response = await axios.get(
          `${backendUrl}/properties/reviews/${id}`,
          {
            headers: { Authorization: token },
          }
        );
        setReviews(response.data.reviews);
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
        url = `https://wa.me/?text=${encodeURIComponent(
          shareText + ' ' + shareUrl
        )}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          shareUrl
        )}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          shareText
        )}&url=${encodeURIComponent(shareUrl)}`;
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

  const handleSubmitNotification = async () => {
    if (!notificationTitle.trim() || !notificationText.trim()) {
      Alert.alert(
        'Error',
        'Please provide both a title and notification text.'
      );
      return;
    }

    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        Alert.alert('Error', 'Please log in to send notifications.');
        return;
      }

      const response = await axios.post(
        `${backendUrl}/properties/post-notifications`,
        {
          propertyId: id,
          title: notificationTitle,
          text: notificationText,
        },
        {
          headers: { Authorization: token },
        }
      );

      if (response.status === 201) {
        Alert.alert('Success', 'Notification sent successfully!');
        setShowNotify(false);
        setNotificationTitle('');
        setNotificationText('');
      }
    } catch (error: any) {
      console.error('Error sending notification:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to send notification.'
      );
    }
  };

  const handleSubmitReview = async () => {
    if (!userRating || !reviewText.trim()) {
      Alert.alert('Error', 'Please provide a rating and review text.');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        Alert.alert('Error', 'Please log in to submit a review.');
        return;
      }

      const response = await axios.post(
        `${backendUrl}/properties/add-review`,
        {
          propertyId: id,
          stars: userRating,
          text: reviewText,
        },
        {
          headers: { Authorization: token },
        }
      );

      if (response.status === 201) {
        // Add the user information to the review before adding it to the state
        const newReview = {
          ...response.data.review,
          user: {
            _id: user?._id || '',
            name: user?.name || 'Anonymous'
          }
        };
        setReviews([newReview, ...reviews]);
        setUserRating(0);
        setReviewText('');
        Alert.alert('Success', 'Review submitted successfully!');
      }
    } catch (error: any) {
      console.error('Error submitting review:', error);
      Alert.alert(
        'Error',
        error.response?.data?.error || 'Failed to submit review.'
      );
    }
  };

  const handleEditReview = async (
    reviewId: string,
    currentStars: number,
    currentText: string
  ) => {
    setEditingReview({
      id: reviewId,
      stars: currentStars,
      text: currentText,
    });
  };

  const handleEditSubmit = async (stars: number, text: string) => {
    if (!editingReview) return;

    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        Alert.alert('Error', 'Please log in to edit your review.');
        return;
      }

      const response = await axios.patch(
        `${backendUrl}/properties/edit-review/${editingReview.id}`,
        {
          stars,
          text,
        },
        {
          headers: { Authorization: token },
        }
      );

      if (response.status === 200) {
        setReviews(
          reviews.map((review) =>
            review._id === editingReview.id
              ? { ...review, stars, text }
              : review
          )
        );
        setEditingReview(null);
        Alert.alert('Success', 'Review updated successfully!');
      }
    } catch (error: any) {
      console.error('Error updating review:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to update review.'
      );
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this review?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('accessToken');
              if (!token) {
                Alert.alert('Error', 'Please log in to delete your review.');
                return;
              }

              const response = await axios.delete(
                `${backendUrl}/properties/delete-review/${reviewId}`,
                {
                  headers: { Authorization: token },
                }
              );

              if (response.status === 200) {
                setReviews(reviews.filter((review) => review._id !== reviewId));
                Alert.alert('Success', 'Review deleted successfully!');
              }
            } catch (error: any) {
              console.error('Error deleting review:', error);
              Alert.alert(
                'Error',
                error.response?.data?.message || 'Failed to delete review.'
              );
            }
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
          color={
            i < Math.floor(rating) ? colors.warningColor : colors.grayLight
          }
          fill={i < Math.floor(rating) ? colors.warningColor : 'transparent'}
        />
      ));
  };

  const renderTabContent = () => {
    if (!property) return null;

    switch (activeTab) {
      case 'about':
        return (
          <View
            style={[
              styles.tabContent,
              { backgroundColor: colors.cardBackground },
            ]}
          >
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Description
            </Text>
            <Text style={[styles.description, { color: colors.grayDark }]}>
              {property.description}
            </Text>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Places Nearby
            </Text>
            <View style={styles.tagContainer}>
              {property.nearbyPlaces.map((place, index) => (
                <View
                  key={index}
                  style={[
                    styles.tag,
                    { backgroundColor: colors.primaryColor + '20' },
                  ]}
                >
                  <MapPin size={14} color={colors.primaryColor} />
                  <Text
                    style={[styles.tagText, { color: colors.primaryColor }]}
                  >
                    {place.label}
                  </Text>
                </View>
              ))}
            </View>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Property Details
            </Text>
            <View style={styles.detailGrid}>
              {property.propertyDetails.map((detail, index) => (
                <View key={index} style={styles.detailItem}>
                  <Text
                    style={[styles.detailLabel, { color: colors.grayDark }]}
                  >
                    {detail.label}
                  </Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>
                    {detail.value}
                  </Text>
                </View>
              ))}
            </View>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Area of Property
            </Text>
            <View style={styles.areaContainer}>
              {property.areaDetails.map((area, index) => (
                <View
                  key={index}
                  style={[
                    styles.areaItem,
                    { backgroundColor: colors.primaryColor + '20' },
                  ]}
                >
                  <Text style={[styles.areaLabel, { color: colors.grayDark }]}>
                    {area.label}
                  </Text>
                  <View>
                    <Text style={[styles.areaValue, { color: colors.text }]}>
                      {area.value}
                    </Text>
                    <Text
                      style={[styles.areaSubValue, { color: colors.grayDark }]}
                    >
                      {area.subValue}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Parking
            </Text>
            <View style={styles.detailGrid}>
              {property.parking.map((item, index) => (
                <View key={index} style={styles.detailItem}>
                  <Text
                    style={[styles.detailLabel, { color: colors.grayDark }]}
                  >
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
          <View
            style={[
              styles.tabContent,
              { backgroundColor: colors.cardBackground },
            ]}
          >
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Amenities
            </Text>
            <View style={styles.grid}>
              {property.amenities.map((amenity, index) => (
                <View
                  key={index}
                  style={[
                    styles.gridItem,
                    { backgroundColor: colors.primaryColor + '20' },
                  ]}
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
          <View
            style={[
              styles.tabContent,
              { backgroundColor: colors.cardBackground },
            ]}
          >
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Furnishing Details
            </Text>
            <View style={styles.grid}>
              {property.furnishing.length === 0 ? (
                <Text style={[styles.description, { color: colors.grayDark }]}>
                  No furnishing details available.
                </Text>
              ) : (
                property.furnishing.map((item, index) => (
                  <View
                    key={index}
                    style={[
                      styles.gridItem,
                      { backgroundColor: colors.primaryColor + '20' },
                    ]}
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
          <View
            style={[
              styles.tabContent,
              { backgroundColor: colors.cardBackground },
            ]}
          >
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
                  <View
                    style={[
                      styles.galleryLabelContainer,
                      { backgroundColor: colors.overlay },
                    ]}
                  >
                    {/* <Text style={[styles.galleryLabel, { color: colors.text }]}>
                      {item.label}
                    </Text> */}
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
          <View
            style={[
              styles.tabContent,
              { backgroundColor: colors.cardBackground },
            ]}
          >
            <View
              style={[
                styles.reviewCard,
                { backgroundColor: colors.cardBackground },
              ]}
            >
              <Text
                style={[styles.reviewRating, { color: colors.primaryColor }]}
              >
                {property.owner.rating}
              </Text>
              <View style={styles.starContainer}>
                {renderStars(property.owner.rating)}
              </View>
              <Text style={[styles.reviewCount, { color: colors.grayDark }]}>
                Based on {property.owner.reviews} reviews
              </Text>
            </View>
            <View
              style={[
                styles.reviewCard,
                { backgroundColor: colors.cardBackground },
              ]}
            >
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Write a Review
              </Text>
              <View style={styles.starContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => setUserRating(star)}
                    activeOpacity={0.7}
                  >
                    <Star
                      size={24}
                      color={
                        star <= userRating
                          ? colors.warningColor
                          : colors.grayLight
                      }
                      fill={
                        star <= userRating ? colors.warningColor : 'transparent'
                      }
                    />
                  </TouchableOpacity>
                ))}
              </View>
              <TextInput
                style={[
                  styles.reviewInput,
                  { borderColor: colors.divider, color: colors.text },
                ]}
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
                    backgroundColor:
                      userRating && reviewText
                        ? colors.primaryColor
                        : colors.grayLight,
                  },
                ]}
                onPress={handleSubmitReview}
                disabled={!userRating || !reviewText}
                activeOpacity={0.7}
              >
                <Send size={16} color={colors.background} />
                <Text
                  style={[
                    styles.submitButtonText,
                    { color: colors.background },
                  ]}
                >
                  Submit Review
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Recent Reviews
            </Text>
            {reviews.length === 0 ? (
              <Text style={[styles.description, { color: colors.grayDark }]}>
                No reviews yet.
              </Text>
            ) : (
              <FlatList
                data={reviews}
                renderItem={({ item }) => (
                  <View
                    style={[
                      styles.reviewItem,
                      { backgroundColor: colors.cardBackground },
                    ]}
                  >
                    <View style={styles.reviewHeader}>
                      <View
                        style={[
                          styles.avatar,
                          { backgroundColor: colors.primaryColor + '20' },
                        ]}
                      >
                        <Text
                          style={[styles.avatarText, { color: colors.text }]}
                        >
                          {(item.user?.name || 'Anonymous')
                            .slice(0, 2)
                            .toUpperCase()}
                        </Text>
                      </View>
                      <View>
                        <Text
                          style={[styles.reviewerName, { color: colors.text }]}
                        >
                          {item.user?.name || 'Anonymous'}
                        </Text>
                        <View style={styles.starContainer}>
                          {renderStars(item.stars)}
                          <Text
                            style={[styles.reviewStars, { color: colors.text }]}
                          >
                            {item.stars}
                          </Text>
                        </View>
                      </View>
                      <Text
                        style={[
                          styles.reviewDate,
                          {
                            backgroundColor: colors.primaryColor + '20',
                            color: colors.grayDark,
                          },
                        ]}
                      >
                        {new Date(item.createdAt).toLocaleDateString()}
                      </Text>
                    </View>
                    <Text
                      style={[styles.reviewText, { color: colors.grayDark }]}
                    >
                      {item.text}
                    </Text>
                    {user && item.user?._id === user._id && (
                      <View style={styles.reviewActions}>
                        <TouchableOpacity
                          style={styles.actionButton}
                          onPress={() =>
                            handleEditReview(item._id, item.stars, item.text)
                          }
                          activeOpacity={0.7}
                        >
                          <Edit size={16} color={colors.primaryColor} />
                          <Text
                            style={[
                              styles.actionText,
                              { color: colors.primaryColor },
                            ]}
                          >
                            Edit
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.actionButton}
                          onPress={() => handleDeleteReview(item._id)}
                          activeOpacity={0.7}
                        >
                          <Trash size={16} color={colors.errorColor} />
                          <Text
                            style={[
                              styles.actionText,
                              { color: colors.errorColor },
                            ]}
                          >
                            Delete
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
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
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <StatusBar
          barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primaryColor} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !property) {
    return (
      <SafeAreaProvider>
        <SafeAreaView
          style={[styles.container, { backgroundColor: colors.background }]}
        >
          <StatusBar
            barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
          />
          <View style={styles.errorContainer}>
            <Text style={[styles.errorText, { color: colors.errorColor }]}>
              {error || 'Property not found.'}
            </Text>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <StatusBar
          barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
        />

        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <TouchableOpacity
            style={[
              styles.headerButton,
              { backgroundColor: colors.cardBackground },
            ]}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.headerRightButtons}>
            <TouchableOpacity
              style={[
                styles.headerButton,
                { backgroundColor: colors.cardBackground },
              ]}
              onPress={handleFavoriteToggle}
              activeOpacity={0.7}
            >
              <Heart
                size={24}
                color={
                  favorites.includes(id as string)
                    ? colors.errorColor
                    : colors.text
                }
                fill={
                  favorites.includes(id as string)
                    ? colors.errorColor
                    : 'transparent'
                }
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.headerButton,
                { backgroundColor: colors.cardBackground },
              ]}
              onPress={() => setShowShareOptions(true)}
              activeOpacity={0.7}
            >
              <Share2 size={24} color={colors.primaryColor} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 120 },
          ]}
        >
          <View
            style={[
              styles.carouselContainer,
              { backgroundColor: colors.cardBackground },
            ]}
          >
            <ImageCarousel
              images={property.images.map((img) => img.src)}
              height={400}
            />
            {/* <TouchableOpacity
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
          </TouchableOpacity> */}
            {/* <View style={[styles.imageLabel, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.imageLabelText, { color: colors.text }]}>
              {property.images[currentImageIndex].label}
            </Text>
          </View> */}
          </View>
          {/* <View style={[styles.thumbnailContainer, { backgroundColor: colors.cardBackground }]}>
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
        </View> */}

          <View style={styles.contentContainer}>
            <View style={styles.titleContainer}>
              <Text style={[styles.title, { color: colors.text }]}>
                {property.title}
              </Text>
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
                <View
                  style={[
                    styles.negotiableTag,
                    { backgroundColor: property.isNegotiable ? colors.successColor + '20' : colors.errorColor + '20' },
                  ]}
                >
                  <Text
                    style={[
                      styles.negotiableText,
                      { color: property.isNegotiable ? colors.successColor : colors.errorColor },
                    ]}
                  >
                    {property.isNegotiable ? 'Negotiable' : 'Non-Negotiable'}
                  </Text>
                </View>
                )}
              </View>
              <View style={styles.tagContainer}>
                {property.tags.map((tag, index) => (
                  <View
                    key={index}
                    style={[
                      styles.tag,
                      { backgroundColor: colors.primaryColor + '20' },
                    ]}
                  >
                    <Text
                      style={[styles.tagText, { color: colors.primaryColor }]}
                    >
                      {tag}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.featuresContainer}>
              {property.features.map((feature, index) => (
                <View
                  key={index}
                  style={[
                    styles.featureItem,
                    { backgroundColor: colors.cardBackground },
                  ]}
                >
                  <View
                    style={[
                      styles.featureIcon,
                      { backgroundColor: colors.primaryColor },
                    ]}
                  >
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
                {['about', 'amenities', 'furnishing', 'gallery', 'reviews'].map(
                  (tab) => (
                    <TabButton
                      key={tab}
                      title={tab.charAt(0).toUpperCase() + tab.slice(1)}
                      isActive={activeTab === tab}
                      onPress={() => setActiveTab(tab)}
                    />
                  )
                )}
              </ScrollView>
            </View>

            {renderTabContent()}
          </View>
        </ScrollView>

        <TouchableOpacity
          style={[
            styles.ownerButton,
            {
              backgroundColor: colors.primaryColor,
              bottom: insets.bottom + 24,
            },
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
        <EditReviewModal
          visible={editingReview !== null}
          onClose={() => setEditingReview(null)}
          currentStars={editingReview?.stars || 0}
          currentText={editingReview?.text || ''}
          onSubmit={handleEditSubmit}
        />
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
    padding: 20,
  },
  modalContent: {
    width: '100%',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 10,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
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
