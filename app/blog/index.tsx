import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Image,
  RefreshControl,
  ScrollView,
  ActivityIndicator,
  Platform,
  StatusBar,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { useBlog, BlogCategory, BlogPost } from '@/context/BlogContext';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';
import { Plus, MapPin, Calendar, ArrowLeft } from 'lucide-react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

function BlogScreenContent() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const { posts, loadMorePosts, hasMorePosts, isLoading } = useBlog();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory | null>(
    null
  );
  const insets = useSafeAreaInsets();

  const categories: BlogCategory[] = [
    'Roommate Wanted',
    'Property For Sale',
    'Property For Rent',
    'Community Updates',
    'Market Insights',
  ];

  const filteredPosts = selectedCategory
    ? posts.filter((post) => post.category === selectedCategory)
    : posts;

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // Implement refresh logic here
    setRefreshing(false);
  }, []);

  const renderPost = ({ item }: { item: BlogPost }) => (
    <TouchableOpacity
      style={[
        styles.postCard,
        { backgroundColor: colors.cardBackground },
      ]}
      onPress={() => router.push(`/blog/${item._id}`)}
      activeOpacity={0.92}
    >
      {item.image && (
        <Image source={{ uri: item.image }} style={styles.postImage} resizeMode="cover" />
      )}

      <View style={styles.categoryTag}>
        <Text style={styles.categoryText}>{item.category}</Text>
      </View>

      <View style={styles.postContent}>
        <Text
          style={[styles.postTitle, { color: colors.text }]}
          numberOfLines={2}
        >
          {item.title}
        </Text>

        <View style={styles.locationContainer}>
          <MapPin size={16} color={colors.grayDark} />
          <Text
            style={[styles.locationText, { color: colors.grayDark }]}
            numberOfLines={1}
          >
            {item.location?.locality}, {item.location?.city}
          </Text>
        </View>

        <Text
          style={[styles.postDescription, { color: colors.grayDark }]}
          numberOfLines={3}
        >
          {item.description}
        </Text>

        <View style={styles.postFooter}>
          <View style={styles.dateContainer}>
            <Calendar size={14} color={colors.grayDark} />
            <Text style={[styles.dateText, { color: colors.grayDark }]}> 
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingBottom: insets.bottom + 12 }]}> 
      {/* StatusBar for Android */}
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
      {/* Header */}
      <View style={[styles.header, Platform.OS === 'android' && { marginTop: insets.top || 12 }]}> 
        <View style={styles.headerLeft}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Blog</Text>
        </View>
      </View>

      {/* Category Selector */}
      <View style={styles.categoriesWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContent}
        >
          <TouchableOpacity
            style={[
              styles.categoryButton,
              !selectedCategory && { backgroundColor: colors.primaryColor, borderColor: colors.primaryColor },
            ]}
            onPress={() => setSelectedCategory(null)}
          >
            <Text
              style={[
                styles.categoryButtonText,
                !selectedCategory && { color: 'white' },
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && {
                  backgroundColor: colors.primaryColor,
                  borderColor: colors.primaryColor,
                },
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.categoryButtonText,
                  selectedCategory === category && { color: 'white' },
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Blog List */}
      <FlatList
        data={filteredPosts}
        renderItem={renderPost}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        onEndReached={() => {
          if (hasMorePosts && !isLoading) {
            loadMorePosts();
          }
        }}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListFooterComponent={() =>
          isLoading ? (
            <View style={styles.loader}>
              <ActivityIndicator color={colors.primaryColor} />
            </View>
          ) : null
        }
        showsVerticalScrollIndicator={false}
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={[
          styles.fab,
          {
            backgroundColor: colors.primaryColor,
            bottom: insets.bottom + 24,
            shadowColor: colors.primaryColor,
          },
        ]}
        onPress={() => router.push('/blog/create')}
        activeOpacity={0.85}
      >
        <Plus size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
}

export default function BlogScreen() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <BlogScreenContent />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    backgroundColor: 'transparent',
    zIndex: 2,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 12,
    padding: 4,
    borderRadius: 20,
    backgroundColor: 'rgba(124,58,237,0.08)',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    letterSpacing: 0.2,
  },
  fab: {
    position: 'absolute',
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    zIndex: 10,
  },
  categoriesWrapper: {
    paddingVertical: 10,
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F3F3',
    zIndex: 1,
  },
  categoriesContent: {
    paddingHorizontal: 16,
    paddingBottom: 4,
    alignItems: 'center',
  },
  categoryButton: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#7C3AED',
    marginRight: 10,
    backgroundColor: 'white',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  categoryButtonText: {
    color: '#7C3AED',
    fontSize: 15,
    fontFamily: 'Inter-Medium',
    letterSpacing: 0.1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 60,
  },
  postCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.13,
    shadowRadius: 8,
    elevation: 3,
    backgroundColor: 'white',
  },
  postImage: {
    width: '100%',
    height: width * 0.48,
    backgroundColor: '#F3F3F3',
  },
  categoryTag: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(124, 58, 237, 0.93)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    zIndex: 2,
  },
  categoryText: {
    color: 'white',
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    letterSpacing: 0.1,
  },
  postContent: {
    padding: 18,
    paddingTop: 14,
  },
  postTitle: {
    fontSize: 19,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
    letterSpacing: 0.1,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    marginLeft: 4,
    fontSize: 15,
    fontFamily: 'Inter-Regular',
  },
  postDescription: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    lineHeight: 21,
    marginBottom: 12,
  },
  postFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    marginLeft: 4,
    fontSize: 13,
    fontFamily: 'Inter-Regular',
  },
  loader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});
