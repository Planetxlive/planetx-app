import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Image,
} from 'react-native';
import { useProperties, Property } from '@/context/PropertyContext';
import PropertyCard from '@/components/PropertyCard';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';

export default function WishlistScreen() {
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme];
  const { properties, favorites } = useProperties();

  // Get favorite properties
  const favoriteProperties = properties.filter((property) =>
    favorites.includes(property.id)
  );

  const renderItem = ({ item }: { item: Property }) => (
    <PropertyCard property={item} />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Image
        source={{ uri: 'https://images.pexels.com/photos/7176026/pexels-photo-7176026.jpeg' }}
        style={styles.emptyStateImage}
      />
      <Text style={[styles.emptyStateTitle, { color: colors.text }]}>
        No favorites yet
      </Text>
      <Text style={[styles.emptyStateText, { color: colors.grayDark }]}>
        You haven't added any properties to your wishlist. Browse properties and tap the heart icon to add them here.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Wishlist</Text>
      </View>

      <FlatList
        data={favoriteProperties}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
    flexGrow: 1,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    marginTop: 80,
  },
  emptyStateImage: {
    width: 200,
    height: 200,
    marginBottom: 24,
    borderRadius: 100,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    lineHeight: 24,
  },
});