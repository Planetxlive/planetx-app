import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';
import { useProperties } from '@/context/PropertyContext';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';
import { ArrowLeft, Search, SlidersHorizontal, Heart, MapPin, Star } from 'lucide-react-native';

export default function NearbyScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const { properties } = useProperties();
  const [searchQuery, setSearchQuery] = useState('');

  const renderProperty = ({ item }:any) => (
    <TouchableOpacity
      style={[styles.propertyCard, { backgroundColor: colors.cardBackground }]}
      onPress={() => router.push(`/property/${item.id}`)}
    >
      <Image source={{ uri: item.images[0] }} style={styles.propertyImage} />
      <TouchableOpacity style={styles.favoriteButton}>
        <Heart
          size={24}
          color="white"
          fill="transparent"
          style={styles.favoriteIcon}
        />
      </TouchableOpacity>
      
      <View style={styles.propertyInfo}>
        <View style={styles.propertyHeader}>
          <Text style={[styles.societyName, { color: colors.text }]}>
            {item.title}
          </Text>
          <View style={styles.ratingContainer}>
            <Star size={16} color="#FFD700" fill="#FFD700" />
            <Text style={styles.rating}>{item.rating}</Text>
          </View>
        </View>

        <View style={styles.locationContainer}>
          <MapPin size={16} color={colors.grayDark} />
          <Text style={[styles.location, { color: colors.grayDark }]}>
            {item.location.address}, {item.location.city}
          </Text>
        </View>

        <View style={styles.propertyDetails}>
          <Text style={[styles.price, { color: colors.primaryColor }]}>
            ₹{item.price.toLocaleString('en-IN')}
          </Text>
          <Text style={[styles.pricePerSqft, { color: colors.grayDark }]}>
            ₹{Math.round(item.price / item.area).toLocaleString('en-IN')} / sqft
          </Text>
        </View>

        <Text style={[styles.readyToMove, { color: colors.grayDark }]}>
          Ready to Move
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Nearby Property
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: colors.grayLight }]}>
          <Search size={20} color={colors.grayDark} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search"
            placeholderTextColor={colors.grayDark}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity
          style={[styles.filterButton, { backgroundColor: colors.grayLight }]}
        >
          <SlidersHorizontal size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={properties}
        renderItem={renderProperty}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 8,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
  },
  propertyCard: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  propertyImage: {
    width: '100%',
    height: 200,
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  propertyInfo: {
    padding: 16,
  },
  propertyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  societyName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  rating: {
    marginLeft: 4,
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFD700',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  location: {
    marginLeft: 4,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  propertyDetails: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    marginRight: 8,
  },
  pricePerSqft: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  readyToMove: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  favoriteIcon: {
    width: 24,
    height: 24,
  },
});