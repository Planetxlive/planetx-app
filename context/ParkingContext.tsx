import { backendUrl } from '@/lib/uri';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useFocusEffect } from 'expo-router';
import React, { createContext, useState, useContext, useEffect } from 'react';

export type ParkingType =
  | 'standard'
  | 'disabled'
  | 'electric'
  | 'compact'
  | 'premium';
export type ParkingSize = 'small' | 'medium' | 'large';

export type ParkingSpot = {
  id: string;
  userId: string;
  spotNumber: string;
  city: string;
  state: string;
  locality: string;
  sublocality?: string;
  areaNumber?: string;
  type: ParkingType;
  isAvailable: boolean;
  hourlyRate: number;
  size: ParkingSize;
  amenitiesDetails: {
    securityGuard: boolean;
    securityCameras: boolean;
    evCharging: boolean;
    valetService: boolean;
    coveredParking: boolean;
  };
  video: string;
  images: string[];
  accessibility: {
    wheelchairAccessible: boolean;
    nearEntrance: boolean;
  };
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  createdAt: string;
  updatedAt: string;
  rating?: number;
};

type ParkingContextType = {
  parkingSpots: ParkingSpot[];
  addParkingSpot: (
    spot: Omit<ParkingSpot, 'id' | 'createdAt' | 'updatedAt'>
  ) => Promise<void>;
  updateParkingSpot: (id: string, spot: Partial<ParkingSpot>) => Promise<void>;
  deleteParkingSpot: (id: string) => Promise<void>;
  getParkingSpotById: (id: string) => ParkingSpot | undefined;
  getParkingSpotsByUserId: (userId: string) => ParkingSpot[];
  getParkingSpotsByType: (type: ParkingType) => ParkingSpot[];
  getParkingSpotsByCity: (city: string) => ParkingSpot[];
  getAvailableParkingSpots: () => ParkingSpot[];
  toggleFavorite: (spotId: string) => void;
  favorites: string[];
};

// Mock data for parking spots based on the new schema
const MOCK_PARKING_SPOTS: ParkingSpot[] = [
  {
    id: '1',
    userId: '123456',
    spotNumber: 'CP-001',
    city: 'Delhi',
    state: 'Delhi',
    locality: 'Connaught Place',
    sublocality: 'Central CP',
    areaNumber: 'Block A',
    type: 'premium',
    isAvailable: true,
    hourlyRate: 50,
    size: 'large',
    amenitiesDetails: {
      securityGuard: true,
      securityCameras: true,
      evCharging: false,
      valetService: true,
      coveredParking: true,
    },
    video: 'https://example.com/parking-tour.mp4',
    images: [
      'https://images.pexels.com/photos/753876/pexels-photo-753876.jpeg',
      'https://images.pexels.com/photos/164634/pexels-photo-164634.jpeg',
    ],
    accessibility: {
      wheelchairAccessible: true,
      nearEntrance: true,
    },
    coordinates: {
      latitude: 28.6292,
      longitude: 77.2183,
    },
    rating: 4.5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    userId: '234567',
    spotNumber: 'RJ-002',
    city: 'Delhi',
    state: 'Delhi',
    locality: 'Rajiv Chowk',
    sublocality: 'Metro Station Area',
    type: 'standard',
    isAvailable: true,
    hourlyRate: 30,
    size: 'medium',
    amenitiesDetails: {
      securityGuard: true,
      securityCameras: true,
      evCharging: false,
      valetService: false,
      coveredParking: false,
    },
    video: 'https://example.com/parking-tour2.mp4',
    images: [
      'https://images.pexels.com/photos/1004409/pexels-photo-1004409.jpeg',
      'https://images.pexels.com/photos/2199293/pexels-photo-2199293.jpeg',
    ],
    accessibility: {
      wheelchairAccessible: false,
      nearEntrance: true,
    },
    coordinates: {
      latitude: 28.6328,
      longitude: 77.2197,
    },
    rating: 4.2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    userId: '345678',
    spotNumber: 'KM-003',
    city: 'Delhi',
    state: 'Delhi',
    locality: 'Khan Market',
    sublocality: 'Main Market',
    areaNumber: 'Zone 1',
    type: 'electric',
    isAvailable: true,
    hourlyRate: 80,
    size: 'large',
    amenitiesDetails: {
      securityGuard: true,
      securityCameras: true,
      evCharging: true,
      valetService: true,
      coveredParking: true,
    },
    video: 'https://example.com/parking-tour3.mp4',
    images: [
      'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg',
      'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg',
    ],
    accessibility: {
      wheelchairAccessible: true,
      nearEntrance: true,
    },
    coordinates: {
      latitude: 28.5984,
      longitude: 77.2319,
    },
    rating: 4.8,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const ParkingContext = createContext<ParkingContextType>({
  parkingSpots: [],
  addParkingSpot: async () => {},
  updateParkingSpot: async () => {},
  deleteParkingSpot: async () => {},
  getParkingSpotById: () => undefined,
  getParkingSpotsByUserId: () => [],
  getParkingSpotsByType: () => [],
  getParkingSpotsByCity: () => [],
  getAvailableParkingSpots: () => [],
  toggleFavorite: () => {},
  favorites: [],
});

export const ParkingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [parkingSpots, setParkingSpots] =
    useState<ParkingSpot[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  useFocusEffect(() => {
    const fetchAll = async () => {
      const token = await AsyncStorage.getItem('accessToken');
      const res = await axios.get(
        `${backendUrl}/Parking/`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setParkingSpots(res.data.parkings);
    };
    fetchAll();
  });

  const addParkingSpot = async (
    spot: Omit<ParkingSpot, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    const newSpot: ParkingSpot = {
      ...spot,
      id: Math.random().toString(36).substring(2, 11),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setParkingSpots([...parkingSpots, newSpot]);
  };

  const updateParkingSpot = async (id: string, spot: Partial<ParkingSpot>) => {
    setParkingSpots(
      parkingSpots.map((s) =>
        s.id === id ? { ...s, ...spot, updatedAt: new Date().toISOString() } : s
      )
    );
    const token = await AsyncStorage.getItem('accessToken');
    const res = await axios.put(
      `${backendUrl}/Parking/update/${id}`,
      spot,
      {
        headers: {
          Authorization: token,
        },
      }
    );
  };

  const deleteParkingSpot = async (id: string) => {
    setParkingSpots(parkingSpots.filter((s) => s.id !== id));
    const token = await AsyncStorage.getItem('accessToken');

    const res = await axios.get(
      `${backendUrl}/Parking/delete/${id}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
  };

  const getParkingSpotById = (id: string) => {
    return parkingSpots.find((s) => s.id === id);
  };

  const getParkingSpotsByUserId = (userId: string) => {
    return parkingSpots.filter((s) => s.userId === userId);
  };

  const getParkingSpotsByType = (type: ParkingType) => {
    return parkingSpots.filter((s) => s.type === type);
  };

  const getParkingSpotsByCity = (city: string) => {
    return parkingSpots.filter(
      (s) => s.city.toLowerCase() === city.toLowerCase()
    );
  };

  const getAvailableParkingSpots = () => {
    return parkingSpots.filter((s) => s.isAvailable);
  };

  const toggleFavorite = (spotId: string) => {
    if (favorites.includes(spotId)) {
      setFavorites(favorites.filter((id) => id !== spotId));
    } else {
      setFavorites([...favorites, spotId]);
    }
  };

  return (
    <ParkingContext.Provider
      value={{
        parkingSpots,
        addParkingSpot,
        updateParkingSpot,
        deleteParkingSpot,
        getParkingSpotById,
        getParkingSpotsByUserId,
        getParkingSpotsByType,
        getParkingSpotsByCity,
        getAvailableParkingSpots,
        toggleFavorite,
        favorites,
      }}
    >
      {children}
    </ParkingContext.Provider>
  );
};

export const useParking = () => useContext(ParkingContext);
