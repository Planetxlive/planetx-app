import React, { useState } from 'react';
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
import { Search, Bell } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const router = useRouter();
  const { properties } = useProperties();
  const [location, setLocation] = useState('Karol Bagh, Delhi');
  const [selectedListingType, setSelectedListingType] = useState<string | null>(null);
  const insets = useSafeAreaInsets();

  const listingTypes = ['Buy', 'Rent', 'Paying Guest', 'Rent Hourly'];
  const propertyTypes = [
    'House/Villa',
    'Flat/Apartment',
    'Plot/Land',
    'Commercial',
    'Warehouse',
  ];

  const featuredProperties = properties.slice(0, 2);
  const residentialProperties = properties.filter((p: Property) => 
    p.type === 'House/Villa' || p.type === 'Flat/Apartment'
  ).slice(0, 2);
  const nearbyProperties = properties.slice(0, 2);

  const handleSearch = () => {
    router.push('/search');
  };

  const handleNotifications = () => {
    router.push('/notifications');
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
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.horizontalList}
      />
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
        <View style={styles.headerIcons}>
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: colors.grayLight }]}
            onPress={handleSearch}
          >
            <Search size={18} color={colors.text} />
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

        <View style={styles.listingTypesContainer}>
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
        </View>

        {/* {renderPropertySection({
          title: 'Featured Properties',
          data: featuredProperties,
          onViewAll: () => router.push('/featured'),
        })} */}

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
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  locationContainer: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 12,
    marginBottom: 4,
    fontFamily: 'Inter-Regular',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
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
});