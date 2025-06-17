import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Image,
  ActivityIndicator,
  StatusBar,
  Platform,
} from 'react-native';
import { useProperties, Property } from '@/context/PropertyContext';
import PropertyCard from '@/components/PropertyCard';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function WishlistScreen() {
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme];
  const { properties, favorites, isLoading } = useProperties();
  const insets = useSafeAreaInsets();

  // Get favorite properties
  const favoriteProperties = properties.filter((property) =>
    favorites.includes(property._id)
  );

  const renderItem = ({ item }: { item: Property }) => (
    <PropertyCard property={item} />
  );

  const renderEmptyState = () => (
    <View style={[styles.emptyStateContainer, { paddingTop: insets.top + 20 }]}>
      <Image
        source={{
          uri: 'https://images.pexels.com/photos/7176026/pexels-photo-7176026.jpeg',
        }}
        style={styles.emptyStateImage}
      />
      <Text style={[styles.emptyStateTitle, { color: colors.text }]}>
        No favorites yet
      </Text>
      <Text style={[styles.emptyStateText, { color: colors.grayDark }]}>
        You haven't added any properties to your wishlist. Browse properties and
        tap the heart icon to add them here.
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaProvider>
        <StatusBar
          barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
          backgroundColor={colors.background}
        />
        <SafeAreaView
          style={[
            styles.container,
            { backgroundColor: colors.background, paddingTop: insets.top }
          ]}
        >
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primaryColor} />
            <Text style={[styles.loadingText, { color: colors.text }]}>
              Loading your wishlist...
            </Text>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: colors.background, paddingTop: insets.top }
        ]}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Wishlist</Text>
        </View>

        <FlatList
          data={favoriteProperties}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={[
            styles.listContent,
            favoriteProperties.length === 0 && { flex: 1 }
          ]}
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
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
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-SemiBold',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 20,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyStateImage: {
    width: 200,
    height: 200,
    marginBottom: 24,
    borderRadius: 100,
  },
  emptyStateTitle: {
    fontSize: 22,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    lineHeight: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
});
