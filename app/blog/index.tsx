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
} from 'react-native';
import { router } from 'expo-router';
import { useBlog, BlogCategory, BlogPost } from '@/context/BlogContext';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';
import { Plus, MapPin, Calendar, ArrowLeft } from 'lucide-react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function BlogScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const { posts, loadMorePosts, hasMorePosts, isLoading } = useBlog();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory | null>(
    null
  );

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
      style={[styles.postCard, { backgroundColor: colors.cardBackground }]}
      onPress={() => router.push(`/blog/${item._id}`)}
    >
      {item.image && (
        <Image source={{ uri: item.image }} style={styles.postImage} />
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
    <SafeAreaProvider>
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              Blog
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.createButton,
              { backgroundColor: colors.primaryColor },
            ]}
            onPress={() => router.push('/blog/create')}
          >
            <Plus size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.categories}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContent}
          >
            <TouchableOpacity
              style={[
                styles.categoryButton,
                !selectedCategory && { backgroundColor: colors.primaryColor },
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    marginTop: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
  },
  createButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categories: {
    paddingVertical: 12,
    marginTop: 4,
  },
  categoriesContent: {
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#7C3AED',
    marginRight: 8,
  },
  categoryButtonText: {
    color: '#7C3AED',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  listContent: {
    padding: 16,
  },
  postCard: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  postImage: {
    width: '100%',
    height: 200,
  },
  categoryTag: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(124, 58, 237, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryText: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  postContent: {
    padding: 16,
  },
  postTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    marginLeft: 4,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  postDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
    marginBottom: 12,
  },
  postFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    marginLeft: 4,
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  loader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});
