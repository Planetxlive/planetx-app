import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useProperties, Property } from '@/context/PropertyContext';
import PropertyCard from '@/components/PropertyCard';
import LocationSelector from '@/components/LocationSelector';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';
import { Search, Bell, FileText } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const router = useRouter();
  const { properties } = useProperties();
  const [location, setLocation] = useState('Noida');
  const [selectedListingType, setSelectedListingType] = useState<string | null>(null);
  const [selectedPropertyType, setSelectedPropertyType] = useState<string | null>('All');
  const insets = useSafeAreaInsets();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        const url = `${process.env.EXPO_PUBLIC_API_URL}/auth/get-user/`;
        const res = await axios.get(url, {
          headers: {
            Authorization: token,
          },
        });
        const city = await res.data.user.city;
        await setLocation(city);
        console.log(location);
        

        
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);


  

  const listingTypes = ['Buy', 'Rent', 'Paying Guest', 'Rent Hourly'];
  const propertyTypes = [
        "Residential",
        "Pg",
        "Hotel",
        "Office",
        "Shop",
        "Warehouse",
        "Shared Warehouse",
        "EventSpace",
  ];

  const featuredProperties = properties.slice(0, 2);
  const residentialProperties = properties.filter((p: Property) => 
    p.category === "Residential"
  ).slice(0, 3);
  const nearbyProperties = properties.filter((p: Property) => 
    p.location.city === location
  ).slice(0, 3);  
  

  const handleSearch = () => {
    router.push('/search');
  };

  const handleNotifications = () => {
    router.push('/notifications');
  };

  const handleViewAllProperties = () => {
    router.push('/all-properties');
  };

  const handleBlog = () => {
    router.push('/blog');
  };

  const renderPropertySection = ({ 
    title, 
    data, 
    onViewAll 
  }: { 
    title: string; 
    data: Property[]; 
    onViewAll: () => void 
  }) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
        <TouchableOpacity onPress={onViewAll}>
          <Text style={[styles.viewAllText, { color: colors.primaryColor }]}>
            View all
          </Text>
        </TouchableOpacity>
      </View>
      {data.length > 0 ? (
        <FlatList
          data={data}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={280 + 8} // Card width + marginRight
          decelerationRate="fast"
          renderItem={({ item }) => (
            <View style={styles.horizontalCard}>
              <PropertyCard property={item} horizontal />
            </View>
          )}
          keyExtractor={item => item._id.toString()}
          contentContainerStyle={styles.horizontalList}
        />
      ) : (
        <View style={styles.noPropertiesContainer}>
          <Text style={[styles.noPropertiesText, { color: colors.text }]}>
            No properties found
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['left', 'right']}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.locationContainer}>
          <Text style={[styles.locationLabel, { color: colors.grayDark }]}>Location</Text>
          <LocationSelector
            location={location}
            onLocationChange={setLocation}
          />
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: colors.grayLight }]}
            onPress={handleViewAllProperties}
          >
            <Text style={[styles.iconButtonText, { color: colors.text }]}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: colors.grayLight }]}
            onPress={handleSearch}
          >
            <Search size={18} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: colors.grayLight }]}
            onPress={handleBlog}
          >
            <FileText size={18} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: colors.grayLight }]}
            onPress={handleNotifications}
          >
            <Bell size={18} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 48 }]}
      >
            <View style={styles.banner}>
              <View style={styles.bannerContent}>
                <Text style={styles.bannerTitle}>Find your</Text>
                <Text style={styles.bannerTitle}>Project</Text>
                <Text style={styles.bannerTitle}>with PLANET X</Text>
              </View>
            </View>

            {/* <View style={styles.listingTypesContainer}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listingTypesContent}
              >
                {listingTypes.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.listingTypeButton,
                      selectedListingType === type
                        ? { backgroundColor: colors.grayLight }
                        : { backgroundColor: 'transparent', borderColor: colors.grayLight, borderWidth: 1 },
                    ]}
                    onPress={() => 
                      setSelectedListingType(
                        selectedListingType === type ? null : type
                      )
                    }
                  >
                    <Text
                      style={[
                        styles.listingTypeText,
                        { color: colors.text },
                      ]}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View> */}

        {/* {renderPropertySection({
          title: 'Featured Properties',
          data: featuredProperties,
          onViewAll: () => router.push('/featured'),
        })} */}

            {/* Recommended Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Recommended</Text>
                <TouchableOpacity onPress={handleViewAllProperties}>
                  <Text style={[styles.viewAllText, { color: colors.primaryColor }]}>
                    View all
                  </Text>
                </TouchableOpacity>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listingTypesContent} // Reuse existing style
              >
                {['All', ...propertyTypes].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.listingTypeButton, // Reuse existing style
                      selectedPropertyType === type
                        ? { backgroundColor: colors.grayLight }
                        : { backgroundColor: 'transparent', borderColor: colors.grayLight, borderWidth: 1 },
                    ]}
                    onPress={() => setSelectedPropertyType(type)}
                  >
                    <Text
                      style={[
                        styles.listingTypeText, // Reuse existing style
                        { color: colors.text },
                      ]}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              {properties.filter((p: Property) => 
                 selectedPropertyType === 'All' || p.category === selectedPropertyType
              ).slice(0, 3).length > 0 ? (
                <FlatList
                  data={properties.filter((p: Property) => 
                    selectedPropertyType === 'All' || p.category === selectedPropertyType
                  ).slice(0, 3)}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  snapToInterval={280 + 8} // Card width + marginRight
                  decelerationRate="fast"
                  renderItem={({ item }) => (
                    <View style={styles.horizontalCard}> // Reuse existing style
                      <PropertyCard property={item} horizontal />
                    </View>
                  )}
                  keyExtractor={item => item._id.toString()}
                  contentContainerStyle={styles.horizontalList} // Reuse existing style
                />
              ) : (
                <View style={styles.noPropertiesContainer}>
                  <Text style={[styles.noPropertiesText, { color: colors.text }]}>
                    No {selectedPropertyType} Properties found
                  </Text>
                </View>
              )}
            </View>

            {renderPropertySection({
              title: 'Residential Properties',
              data: residentialProperties,
              onViewAll: () => router.push('/residential'),
            })}

            {renderPropertySection({
              title: 'Nearby Properties',
              data: nearbyProperties,
              onViewAll: () => router.push('/nearby'),
            })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  locationContainer: {
    flex: 1,
    marginRight: 12,
  },
  locationLabel: {
    fontSize: 12,
    marginBottom: 4,
    fontFamily: 'Inter-Regular',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  scrollContent: {
    paddingBottom: 48,
  },
  banner: {
    height: 140,
    marginHorizontal: 8,
    marginTop: 12,
    backgroundColor: '#7C3AED',
    borderRadius: 12,
    overflow: 'hidden',
  },
  bannerContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  bannerTitle: {
    fontSize: 22,
    color: 'white',
    fontFamily: 'Inter-Bold',
    lineHeight: 28,
  },
  listingTypesContainer: {
    marginTop: 16,
  },
  listingTypesContent: {
    paddingHorizontal: 8,
  },
  listingTypeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    marginRight: 6,
  },
  listingTypeText: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
  },
  section: {
    marginTop: 16,
    paddingHorizontal: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontFamily: 'Inter-SemiBold',
  },
  viewAllText: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
  },
  horizontalList: {
    paddingHorizontal: 8,
  },
  horizontalCard: {
    width: 300,
    marginRight: 12,
  },
  noPropertiesContainer: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noPropertiesText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
});