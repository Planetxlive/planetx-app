import React, { createContext, useState, useContext } from "react";

export type PropertyType = 'House/Villa' | 'Flat/Apartment' | 'Plot/Land' | 'Commercial' | 'Warehouse';

export interface Property {
  id: string;
  title: string;
  type: PropertyType;
  description: string;
  price: number;
  priceUnit: 'total' | 'perSqFt' | 'perMonth';
  area: number;
  areaUnit: 'sqft' | 'sqm' | 'acres' | 'hectares';
  bedrooms?: number;
  bathrooms?: number;
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  features: string[];
  furnishing: string[];
  nearbyPlaces: Array<{ name: string }>;
  images: string[];
  owner: {
    id: string;
    name: string;
    image: string;
    phone: string;
    rating: number;
    reviews: number;
  };
  parking: {
    covered: number;
    open: number;
  };
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  rating?: number;
  listingType: 'Buy' | 'Rent' | 'Paying Guest' | 'Rent Hourly';
}

interface PropertyContextType {
  properties: Property[];
  addProperty: (property: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProperty: (id: string, property: Partial<Property>) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
  getPropertyById: (id: string) => Property | undefined;
  getPropertiesByOwnerId: (ownerId: string) => Property[];
  getPropertiesByType: (type: PropertyType) => Property[];
  getPropertiesByListingType: (listingType: Property['listingType']) => Property[];
  getPropertiesByCity: (city: string) => Property[];
  toggleFavorite: (id: string) => void;
  favorites: string[];
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export const PropertyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [properties, setProperties] = useState<Property[]>(MOCK_PROPERTIES);
  const [favorites, setFavorites] = useState<string[]>([]);

  const addProperty = async (property: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProperty: Property = {
      ...property,
      id: Math.random().toString(36).substring(2, 11),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setProperties([...properties, newProperty]);
  };

  const updateProperty = async (id: string, property: Partial<Property>) => {
    setProperties(
      properties.map((p) =>
        p.id === id
          ? { ...p, ...property, updatedAt: new Date().toISOString() }
          : p
      )
    );
  };

  const deleteProperty = async (id: string) => {
    setProperties(properties.filter((p) => p.id !== id));
  };

  const getPropertyById = (id: string) => {
    return properties.find((p) => p.id === id);
  };

  const getPropertiesByOwnerId = (ownerId: string) => {
    return properties.filter((p) => p.ownerId === ownerId);
  };

  const getPropertiesByType = (type: PropertyType) => {
    return properties.filter((p) => p.type === type);
  };

  const getPropertiesByListingType = (listingType: Property['listingType']) => {
    return properties.filter((p) => p.listingType === listingType);
  };

  const getPropertiesByCity = (city: string) => {
    return properties.filter((p) => p.location.city.toLowerCase() === city.toLowerCase());
  };

  const toggleFavorite = (propertyId: string) => {
    if (favorites.includes(propertyId)) {
      setFavorites(favorites.filter((id) => id !== propertyId));
    } else {
      setFavorites([...favorites, propertyId]);
    }
  };

  return (
    <PropertyContext.Provider
      value={{
        properties,
        addProperty,
        updateProperty,
        deleteProperty,
        getPropertyById,
        getPropertiesByOwnerId,
        getPropertiesByType,
        getPropertiesByListingType,
        getPropertiesByCity,
        toggleFavorite,
        favorites,
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
};

export const useProperties = () => {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error('useProperties must be used within a PropertyProvider');
  }
  return context;
};

// Mock data for properties
const MOCK_PROPERTIES: Property[] = [
  {
    id: '1',
    title: 'Luxury 4 BHK Flat in Paharganj',
    description: 'A spacious 4 BHK flat with modern amenities in the heart of Delhi. Features large balconies, ample natural light, and premium fittings, ideal for family living.',
    type: 'Flat/Apartment',
    price: 16000,
    priceUnit: 'perMonth',
    area: 1850,
    areaUnit: 'sqft',
    bedrooms: 4,
    bathrooms: 3,
    location: {
      address: 'Main Bazaar, Paharganj',
      city: 'Delhi',
      state: 'Delhi',
      country: 'India',
      coordinates: {
        latitude: 28.6467,
        longitude: 77.2167
      }
    },
    features: ['Parking', 'Gym', 'Swimming Pool', '24/7 Security', 'Modular Kitchen', 'Lift'],
    furnishing: ['Fans', 'Lights', 'Wardrobes'],
    nearbyPlaces: [
      { name: 'Apollo Hospital' },
      { name: 'Delhi Public School' },
      { name: 'Paharganj Market' }
    ],
    images: [
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
      'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg',
      'https://images.pexels.com/photos/1571459/pexels-photo-1571459.jpeg',
      'https://images.pexels.com/photos/1571458/pexels-photo-1571458.jpeg'
    ],
    owner: {
      id: '123456',
      name: 'Rahul Sharma',
      image: 'https://randomuser.me/api/portraits/men/1.jpg',
      phone: '+91 9876543210',
      rating: 3.5,
      reviews: 12
    },
    parking: {
      covered: 2,
      open: 1
    },
    ownerId: '123456',
    createdAt: new Date('2025-01-01').toISOString(),
    updatedAt: new Date('2025-05-01').toISOString(),
    rating: 3.5,
    listingType: 'Rent'
  },
  {
    id: '2',
    title: 'Modern 3 BHK Villa in Vasant Kunj',
    description: 'A beautiful 3 BHK villa with a private garden and terrace. Located in a serene neighborhood with easy access to markets, schools, and malls.',
    type: 'House/Villa',
    price: 8500000,
    priceUnit: 'total',
    area: 2400,
    areaUnit: 'sqft',
    bedrooms: 3,
    bathrooms: 3,
    location: {
      address: 'Sector D, Vasant Kunj',
      city: 'Delhi',
      state: 'Delhi',
      country: 'India',
      coordinates: {
        latitude: 28.5274,
        longitude: 77.1588
      }
    },
    features: ['Garden', 'Terrace', 'Modular Kitchen', 'Car Parking', 'Air Conditioning'],
    furnishing: ['AC', 'Wardrobes', 'Lights'],
    nearbyPlaces: [
      { name: 'Fortis Hospital' },
      { name: 'Vasant Valley School' },
      { name: 'DLF Promenade Mall' }
    ],
    images: [
      'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg',
      'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg',
      'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg',
      'https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg'
    ],
    owner: {
      id: '234567',
      name: 'Anita Verma',
      image: 'https://randomuser.me/api/portraits/women/2.jpg',
      phone: '+91 8765432109',
      rating: 4.2,
      reviews: 18
    },
    parking: {
      covered: 1,
      open: 2
    },
    ownerId: '234567',
    createdAt: new Date('2025-02-01').toISOString(),
    updatedAt: new Date('2025-04-15').toISOString(),
    rating: 4.2,
    listingType: 'Buy'
  },
  {
    id: '3',
    title: 'Prime Commercial Office in Connaught Place',
    description: "A well-equipped commercial office space in the heart of Delhi's business district. Ideal for startups, consultancies, and small businesses.",
    type: 'Commercial',
    price: 45000,
    priceUnit: 'perMonth',
    area: 1200,
    areaUnit: 'sqft',
    location: {
      address: 'Barakhamba Road, Connaught Place',
      city: 'Delhi',
      state: 'Delhi',
      country: 'India',
      coordinates: {
        latitude: 28.6292,
        longitude: 77.2183
      }
    },
    features: ['Air Conditioning', 'Power Backup', 'Lift', 'Conference Room', '24/7 Security'],
    furnishing: ['Lights', 'Fans'],
    nearbyPlaces: [
      { name: 'Max Hospital' },
      { name: 'Modern School' },
      { name: 'Janpath Market' }
    ],
    images: [
      'https://images.pexels.com/photos/269077/pexels-photo-269077.jpeg',
      'https://images.pexels.com/photos/260931/pexels-photo-260931.jpeg',
      'https://images.pexels.com/photos/374023/pexels-photo-374023.jpeg',
      'https://images.pexels.com/photos/373076/pexels-photo-373076.jpeg'
    ],
    owner: {
      id: '345678',
      name: 'Vikram Singh',
      image: 'https://randomuser.me/api/portraits/men/3.jpg',
      phone: '+91 7654321098',
      rating: 4.0,
      reviews: 25
    },
    parking: {
      covered: 0,
      open: 1
    },
    ownerId: '345678',
    createdAt: new Date('2025-03-01').toISOString(),
    updatedAt: new Date('2025-05-10').toISOString(),
    rating: 4.0,
    listingType: 'Rent'
  },
  {
    id: '4',
    title: 'Residential Plot in Dwarka',
    description: 'A strategically located residential plot in a developing area of Dwarka. Perfect for investment or building your dream home.',
    type: 'Plot/Land',
    price: 3500000,
    priceUnit: 'total',
    area: 1800,
    areaUnit: 'sqft',
    location: {
      address: 'Sector 23, Dwarka',
      city: 'Delhi',
      state: 'Delhi',
      country: 'India',
      coordinates: {
        latitude: 28.5823,
        longitude: 77.0500
      }
    },
    features: ['Corner Plot', 'Road Facing', 'Gated Community'],
    furnishing: [],
    nearbyPlaces: [
      { name: 'Venkateshwar Hospital' },
      { name: 'Dwarka International School' },
      { name: 'Vegas Mall' }
    ],
    images: [
      'https://images.pexels.com/photos/280221/pexels-photo-280221.jpeg',
      'https://images.pexels.com/photos/358636/pexels-photo-358636.jpeg',
      'https://images.pexels.com/photos/534220/pexels-photo-534220.jpeg',
      'https://images.pexels.com/photos/162539/pexels-photo-162539.jpeg'
    ],
    owner: {
      id: '456789',
      name: 'Priya Malhotra',
      image: 'https://randomuser.me/api/portraits/women/4.jpg',
      phone: '+91 6543210987',
      rating: 3.8,
      reviews: 10
    },
    parking: {
      covered: 0,
      open: 0
    },
    ownerId: '456789',
    createdAt: new Date('2025-01-15').toISOString(),
    updatedAt: new Date('2025-04-20').toISOString(),
    rating: 3.8,
    listingType: 'Buy'
  },
  {
    id: '5',
    title: 'Spacious Warehouse in Okhla',
    description: 'A large warehouse space ideal for storage, distribution, or light manufacturing. Offers excellent connectivity to highways and industrial hubs.',
    type: 'Warehouse',
    price: 85000,
    priceUnit: 'perMonth',
    area: 5000,
    areaUnit: 'sqft',
    location: {
      address: 'Phase III, Okhla Industrial Area',
      city: 'Delhi',
      state: 'Delhi',
      country: 'India',
      coordinates: {
        latitude: 28.5485,
        longitude: 77.2513
      }
    },
    features: ['Loading Dock', 'High Ceiling', 'Security', 'Parking', 'Power Backup'],
    furnishing: [],
    nearbyPlaces: [
      { name: 'Batra Hospital' },
      { name: 'Nehru Place Market' },
      { name: 'Don Bosco School' }
    ],
    images: [
      'https://images.pexels.com/photos/236705/pexels-photo-236705.jpeg',
      'https://images.pexels.com/photos/2252/wall-shelf-books-architecture.jpg',
      'https://images.pexels.com/photos/417344/pexels-photo-417344.jpeg',
      'https://images.pexels.com/photos/448290/pexels-photo-448290.jpeg'
    ],
    owner: {
      id: '567890',
      name: 'Amit Gupta',
      image: 'https://randomuser.me/api/portraits/men/5.jpg',
      phone: '+91 5432109876',
      rating: 3.6,
      reviews: 15
    },
    parking: {
      covered: 2,
      open: 3
    },
    ownerId: '567890',
    createdAt: new Date('2025-02-15').toISOString(),
    updatedAt: new Date('2025-05-05').toISOString(),
    rating: 3.6,
    listingType: 'Rent'
  }
];