import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { createContext, useState, useContext, useEffect } from 'react';

export type GymType = 'Public' | 'Private' | 'Celebrity';
export type AvailableStatus = 'Available' | 'Not Available';

export type Gym = {
  _id: string;
  userId: string;
  gymType: GymType;
  city: string;
  state: string;
  locality?: string;
  subLocality?: string;
  apartment?: string;
  gymName: string;
  gymDescription: string;
  rating?: number;
  images: Array<{
    name?: string;
    url: string;
  }>;
  video?: string;
  capacity: number;
  equipmentType: string;
  membershipType: string;
  amenitites: string[];
  availableStatus: AvailableStatus;
  availableFrom?: string;
  ageOfGym?: number;
  gymEquipment: string[];
  facilities: string[];
  trainerServices: string[];
  bookingDetails: {
    operationHours?: string;
    membershipOption?: string;
  };
  rules: string[];
  additionalFeatures: string[];
  pricing: {
    baseMembershipPrice?: number;
    discount?: number;
    taxes?: number;
    finalPrice?: number;
  };
  createdAt: string;
  updatedAt: string;
};

type GymContextType = {
  gyms: Gym[];
  addGym: (gym: Omit<Gym, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateGym: (id: string, gym: Partial<Gym>) => Promise<void>;
  deleteGym: (id: string) => Promise<void>;
  getGymById: (id: string) => Gym | undefined;
  getGymsByUserId: (userId: string) => Gym[];
  getGymsByType: (type: GymType) => Gym[];
  getGymsByCity: (city: string) => Gym[];
  getAvailableGyms: () => Gym[];
  toggleFavorite: (gymId: string) => void;
  favorites: string[];
};

// Mock data for gyms based on the new schema
// const MOCK_GYMS: Gym[] = [
//   {
//     id: '1',
//     userId: '123456',
//     gymType: 'Public',
//     city: 'Delhi',
//     state: 'Delhi',
//     locality: 'Karol Bagh',
//     subLocality: 'Central Karol Bagh',
//     apartment: 'Metro Plaza',
//     gymName: 'FitZone Premium Gym',
//     gymDescription:
//       'State-of-the-art fitness center with modern equipment, personal trainers, and group classes. Perfect for all fitness levels.',
//     rating: 4.6,
//     images: [
//       {
//         name: 'Main Gym Area',
//         url: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg',
//       },
//       {
//         name: 'Cardio Section',
//         url: 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg',
//       },
//     ],
//     video: 'https://example.com/gym-tour.mp4',
//     capacity: 150,
//     equipmentType: 'Premium Commercial Grade',
//     membershipType: 'Monthly/Quarterly/Annual',
//     amenitites: [
//       'Air Conditioning',
//       'Locker Rooms',
//       'Shower Facilities',
//       'Parking',
//       'WiFi',
//     ],
//     availableStatus: 'Available',
//     availableFrom: new Date().toISOString(),
//     ageOfGym: 3,
//     gymEquipment: [
//       'Treadmills',
//       'Dumbbells',
//       'Barbells',
//       'Cable Machines',
//       'Smith Machine',
//     ],
//     facilities: [
//       'Swimming Pool',
//       'Sauna',
//       'Steam Room',
//       'Juice Bar',
//       'Massage Room',
//     ],
//     trainerServices: [
//       'Personal Training',
//       'Group Classes',
//       'Nutrition Counseling',
//       'Fitness Assessment',
//     ],
//     bookingDetails: {
//       operationHours: '05:00 AM - 11:00 PM',
//       membershipOption: 'Monthly/Quarterly/Annual',
//     },
//     rules: [
//       'No outside food',
//       'Proper gym attire required',
//       'Clean equipment after use',
//       'No loud music',
//     ],
//     additionalFeatures: [
//       '24/7 Access',
//       'Mobile App',
//       'Diet Plans',
//       'Progress Tracking',
//     ],
//     pricing: {
//       baseMembershipPrice: 3000,
//       discount: 10,
//       taxes: 18,
//       finalPrice: 2500,
//     },
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//   },
//   {
//     id: '2',
//     userId: '234567',
//     gymType: 'Private',
//     city: 'Delhi',
//     state: 'Delhi',
//     locality: 'Lajpat Nagar',
//     subLocality: 'Central Market',
//     gymName: 'PowerHouse CrossFit',
//     gymDescription:
//       'Intense CrossFit training facility with certified coaches and competitive atmosphere. Join our fitness community.',
//     rating: 4.8,
//     images: [
//       {
//         name: 'CrossFit Area',
//         url: 'https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg',
//       },
//       {
//         name: 'Olympic Lifting Zone',
//         url: 'https://images.pexels.com/photos/1552103/pexels-photo-1552103.jpeg',
//       },
//     ],
//     capacity: 50,
//     equipmentType: 'CrossFit Specialized',
//     membershipType: 'Monthly/Drop-in',
//     amenitites: [
//       'Specialized Equipment',
//       'Coaching',
//       'Community Events',
//       'Parking',
//     ],
//     availableStatus: 'Available',
//     availableFrom: new Date().toISOString(),
//     ageOfGym: 2,
//     gymEquipment: [
//       'Olympic Barbells',
//       'Kettlebells',
//       'Pull-up Bars',
//       'Rowing Machines',
//       'Battle Ropes',
//     ],
//     facilities: ['Outdoor Training Area', 'Recovery Zone', 'Nutrition Corner'],
//     trainerServices: [
//       'CrossFit Coaching',
//       'Olympic Lifting',
//       'Mobility Training',
//       'Competition Prep',
//     ],
//     bookingDetails: {
//       operationHours: '06:00 AM - 10:00 PM',
//       membershipOption: 'Monthly/Drop-in Classes',
//     },
//     rules: [
//       'Follow coach instructions',
//       'Respect equipment',
//       'No ego lifting',
//       'Support fellow members',
//     ],
//     additionalFeatures: [
//       'Competition Training',
//       'Community Events',
//       'Nutrition Guidance',
//     ],
//     pricing: {
//       baseMembershipPrice: 4000,
//       discount: 15,
//       taxes: 18,
//       finalPrice: 3500,
//     },
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//   },
//   {
//     id: '3',
//     userId: '345678',
//     gymType: 'Celebrity',
//     city: 'Delhi',
//     state: 'Delhi',
//     locality: 'Vasant Kunj',
//     subLocality: 'DLF Phase 1',
//     apartment: 'Celebrity Fitness Center',
//     gymName: 'Zen Yoga & Wellness Studio',
//     gymDescription:
//       'Premium wellness studio offering yoga, meditation, and holistic health programs. Celebrity trainers and luxury amenities.',
//     rating: 4.9,
//     images: [
//       {
//         name: 'Yoga Studio',
//         url: 'https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg',
//       },
//       {
//         name: 'Meditation Room',
//         url: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg',
//       },
//     ],
//     capacity: 30,
//     equipmentType: 'Yoga & Wellness Specialized',
//     membershipType: 'Premium Packages',
//     amenitites: [
//       'Luxury Amenities',
//       'Spa Services',
//       'Organic Cafe',
//       'Valet Parking',
//       'Concierge',
//     ],
//     availableStatus: 'Available',
//     availableFrom: new Date().toISOString(),
//     ageOfGym: 5,
//     gymEquipment: [
//       'Yoga Mats',
//       'Meditation Cushions',
//       'Blocks',
//       'Straps',
//       'Bolsters',
//     ],
//     facilities: [
//       'Spa',
//       'Organic Cafe',
//       'Meditation Garden',
//       'Therapy Rooms',
//       'Relaxation Lounge',
//     ],
//     trainerServices: [
//       'Celebrity Yoga Instructors',
//       'Meditation Coaching',
//       'Wellness Consultation',
//       'Spa Treatments',
//     ],
//     bookingDetails: {
//       operationHours: '06:00 AM - 09:00 PM',
//       membershipOption: 'Premium Packages/Private Sessions',
//     },
//     rules: [
//       'Maintain silence in meditation areas',
//       'Organic lifestyle encouraged',
//       'Respect personal space',
//     ],
//     additionalFeatures: [
//       'Celebrity Trainers',
//       'Luxury Spa',
//       'Organic Nutrition',
//       'Wellness Retreats',
//     ],
//     pricing: {
//       baseMembershipPrice: 8000,
//       discount: 20,
//       taxes: 18,
//       finalPrice: 6500,
//     },
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//   },
// ];

const GymContext = createContext<GymContextType>({
  gyms: [],
  addGym: async () => {},
  updateGym: async () => {},
  deleteGym: async () => {},
  getGymById: () => undefined,
  getGymsByUserId: () => [],
  getGymsByType: () => [],
  getGymsByCity: () => [],
  getAvailableGyms: () => [],
  toggleFavorite: () => {},
  favorites: [],
});

export const GymProvider = ({ children }: { children: React.ReactNode }) => {
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const fetchAll = async () => {
      const token = await AsyncStorage.getItem('accessToken');

      const res = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/gym`, {
        headers: {
          Authorization: token,
        },
      });
      console.log(res.data.gyms);
      setGyms(res.data.gyms);
    };
    fetchAll();
  }, []);

  const addGym = async (gym: Omit<Gym, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newGym: Omit<Gym, 'id' | 'createdAt' | 'updatedAt'> = {
      ...gym,
    };

    const token = await AsyncStorage.getItem('accessToken');

    const res = await axios.post(
      `${process.env.EXPO_PUBLIC_API_URL}/gym/create`,
      gym,
      {
        headers: {
          Authorization: token,
        },
      }
    );

    setGyms([...gyms]);
  };

  const updateGym = async (id: string, gym: Partial<Gym>) => {
    setGyms(
      gyms.map((g) =>
        g._id === id ? { ...g, ...gym, updatedAt: new Date().toISOString() } : g
      )
    );
    const token = await AsyncStorage.getItem('accessToken');

    const res = await axios.put(
      `${process.env.EXPO_PUBLIC_API_URL}/gym/update/${id}`,
      gym,
      {
        headers: {
          Authorization: token,
        },
      }
    );
  };

  const deleteGym = async (id: string) => {
    setGyms(gyms.filter((g) => g._id !== id));
    const token = await AsyncStorage.getItem('accessToken');

    const res = await axios.delete(
      `${process.env.EXPO_PUBLIC_API_URL}/gym/delete/${id}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
  };

  const getGymById = (id: string) => {
    return gyms.find((g) => g._id === id);
  };

  const getGymsByUserId = (userId: string) => {
    return gyms.filter((g) => g.userId === userId);
  };

  const getGymsByType = (type: GymType) => {
    return gyms.filter((g) => g.gymType === type);
  };

  const getGymsByCity = (city: string) => {
    return gyms.filter((g) => g.city.toLowerCase() === city.toLowerCase());
  };

  const getAvailableGyms = () => {
    return gyms.filter((g) => g.availableStatus === 'Available');
  };

  const toggleFavorite = (gymId: string) => {
    if (favorites.includes(gymId)) {
      setFavorites(favorites.filter((id) => id !== gymId));
    } else {
      setFavorites([...favorites, gymId]);
    }
  };

  return (
    <GymContext.Provider
      value={{
        gyms,
        addGym,
        updateGym,
        deleteGym,
        getGymById,
        getGymsByUserId,
        getGymsByType,
        getGymsByCity,
        getAvailableGyms,
        toggleFavorite,
        favorites,
      }}
    >
      {children}
    </GymContext.Provider>
  );
};

export const useGym = () => useContext(GymContext);
