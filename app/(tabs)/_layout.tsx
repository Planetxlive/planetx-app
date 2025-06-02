import React, { useState } from 'react';
import { Tabs, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';
import { Chrome as Home, Heart, Video, User, Plus, FileText, Home as HomeIcon, Car, Dumbbell } from 'lucide-react-native';
import { View, StyleSheet, TouchableOpacity, Modal, Text, Animated, Dimensions } from 'react-native';

function AddButton() {
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme];
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [scaleValue] = useState(new Animated.Value(0));
  
  const handleOptionPress = (route: '/blog/create' | '/add-property' | '/add-parking' | '/add-gym') => {
    setModalVisible(false);
    router.push(route);
  };

  const showModal = () => {
    setModalVisible(true);
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();
  };

  const hideModal = () => {
    Animated.timing(scaleValue, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  return (
    <View style={styles.addButtonContainer}>
      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: colors.primaryColor }]}
        activeOpacity={0.8}
        onPress={showModal}
      >
        <Plus size={24} color="white" />
      </TouchableOpacity>

      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={hideModal}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={hideModal}
        >
          <Animated.View 
            style={[
              styles.modalContent,
              { 
                backgroundColor: colors.background,
                transform: [{ scale: scaleValue }]
              }
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Create New</Text>
            </View>
            
            <View style={styles.optionsContainer}>
              <TouchableOpacity
                style={[styles.optionButton, { backgroundColor: colors.background }]}
                onPress={() => handleOptionPress('/blog/create')}
              >
                <View style={styles.optionContent}>
                  <FileText size={24} color={colors.primaryColor} />
                  <View style={styles.optionTextContainer}>
                    <Text style={[styles.optionTitle, { color: colors.text }]}>Add Blog</Text>
                    <Text style={[styles.optionDescription, { color: colors.grayDark }]}>
                      Share your thoughts and experiences
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.optionButton, { backgroundColor: colors.background }]}
                onPress={() => handleOptionPress('/add-property')}
              >
                <View style={styles.optionContent}>
                  <HomeIcon size={24} color={colors.primaryColor} />
                  <View style={styles.optionTextContainer}>
                    <Text style={[styles.optionTitle, { color: colors.text }]}>Add Property</Text>
                    <Text style={[styles.optionDescription, { color: colors.grayDark }]}>
                      List your property for sale or rent
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.optionButton, { backgroundColor: colors.background }]}
                onPress={() => handleOptionPress('/add-parking')}
              >
                <View style={styles.optionContent}>
                  <Car size={24} color={colors.primaryColor} />
                  <View style={styles.optionTextContainer}>
                    <Text style={[styles.optionTitle, { color: colors.text }]}>Add Parking</Text>
                    <Text style={[styles.optionDescription, { color: colors.grayDark }]}>
                      List available parking spaces
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.optionButton, { backgroundColor: colors.background }]}
                onPress={() => handleOptionPress('/add-gym')}
              >
                <View style={styles.optionContent}>
                  <Dumbbell size={24} color={colors.primaryColor} />
                  <View style={styles.optionTextContainer}>
                    <Text style={[styles.optionTitle, { color: colors.text }]}>Add Gym</Text>
                    <Text style={[styles.optionDescription, { color: colors.grayDark }]}>
                      List your fitness facility
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['bottom']}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primaryColor,
          tabBarInactiveTintColor: colors.grayDark,
          tabBarStyle: {
            borderTopWidth: 1,
            borderTopColor: colors.divider,
            height: 60,
            paddingBottom: 2,
            paddingTop: 2,
            backgroundColor: colors.background,
          },
          tabBarLabelStyle: {
            fontFamily: 'Inter-Medium',
            fontSize: 12,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="wishlist"
          options={{
            title: 'Wishlist',
            tabBarIcon: ({ color, size }) => <Heart size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="add"
          options={{
            title: '',
            tabBarButton: () => <AddButton />,
          }}
        />
        <Tabs.Screen
          name="highlight"
          options={{
            title: 'Highlight',
            tabBarIcon: ({ color, size }) => <Video size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  addButtonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: Dimensions.get('window').width * 0.85,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    marginBottom: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Inter-Bold',
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  optionTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
});