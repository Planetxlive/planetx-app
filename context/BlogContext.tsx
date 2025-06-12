import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { backendUrl } from '@/lib/uri';

export type BlogCategory = 'Roommate Wanted' | 'Property For Sale' | 'Property For Rent' | 'Community Updates' | 'Market Insights';

export type BlogPost = {
  _id: string;
  category: BlogCategory;
  title: string;
  description: string;
  location: {
    houseNumber?: string;
    apartment?: string;
    subLocality?: string;
    locality?: string;
    city?: string;
    state?: string;
  };
  image?: string;
  contactInfo: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  isApproved: boolean;
  __v: number;
};

type BlogContextType = {
  posts: BlogPost[];
  addPost: (post: Omit<BlogPost, '_id' | 'createdAt' | 'updatedAt' | 'isApproved' | '__v'>) => Promise<void>;
  updatePost: (id: string, post: Partial<BlogPost>) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  getPostById: (id: string) => BlogPost | undefined;
  getPostsByCategory: (category: BlogCategory) => BlogPost[];
  loadMorePosts: () => Promise<void>;
  hasMorePosts: boolean;
  isLoading: boolean;
};

const BlogContext = createContext<BlogContextType>({
  posts: [],
  addPost: async () => {},
  updatePost: async () => {},
  deletePost: async () => {},
  getPostById: () => undefined,
  getPostsByCategory: () => [],
  loadMorePosts: async () => {},
  hasMorePosts: false,
  isLoading: false,
});

const POSTS_PER_PAGE = 10;

export const BlogProvider = ({ children }: { children: React.ReactNode }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const getToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('accessToken');
        if (storedToken) {
          setToken(storedToken.replace(/^"|"$/g, ''));
        }
      } catch (error) {
        console.error('Error getting token:', error);
      }
    };
    getToken();
  }, []);

  const addPost = async (post: Omit<BlogPost, '_id' | 'createdAt' | 'updatedAt' | 'isApproved' | '__v'>) => {
    if (!token) throw new Error('No authentication token found');
    
    try {
      const response = await axios.post(
        `${backendUrl}/blogs/create`,
        post,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setPosts([response.data.blog, ...posts]);
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  };

  const updatePost = async (id: string, post: Partial<BlogPost>) => {
    if (!token) throw new Error('No authentication token found');
    
    try {
      const response = await axios.put(
        `${backendUrl}/blogs/update/${id}`,
        post,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setPosts(posts.map((p) => (p._id === id ? response.data.blog : p)));
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  };

  const deletePost = async (id: string) => {
    if (!token) throw new Error('No authentication token found');
    
    try {
      await axios.delete(`${backendUrl}/blogs/delete/${id}`, {
        headers: {
          Authorization: token,
        },
      });
      setPosts(posts.filter((p) => p._id !== id));
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  };

  const getPostById = (id: string) => {
    return posts.find((p) => p._id === id);
  };

  const getPostsByCategory = (category: BlogCategory) => {
    return posts.filter((p) => p.category === category);
  };

  const loadMorePosts = async () => {
    if (isLoading || !hasMore || !token) return;
    
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${backendUrl}/blogs/get`,
        {
          params: {
            page,
            limit: POSTS_PER_PAGE,
          },
          headers: {
            Authorization: token,
          },
        }
      );
      console.log(response.data.blogs);
      const newPosts = response.data.blogs;
      setPosts([...posts, ...newPosts]);
      setHasMore(response.data.hasNextPage);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error('Error loading more posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load of posts
  useEffect(() => {
    if (token) {
      loadMorePosts();
    }
  }, [token]);

  return (
    <BlogContext.Provider
      value={{
        posts,
        addPost,
        updatePost,
        deletePost,
        getPostById,
        getPostsByCategory,
        loadMorePosts,
        hasMorePosts: hasMore,
        isLoading,
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};

export const useBlog = () => useContext(BlogContext);