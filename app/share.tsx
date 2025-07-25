import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Appearance,
  SafeAreaView,
  TouchableOpacity,
  Share,
  Platform,
} from 'react-native';
import { useColorScheme } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const ShareApp = () => {
  const colorScheme = useColorScheme() || 'light';
  const isDarkMode = colorScheme === 'dark';
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#121212' : '#f5f5f5',
      paddingTop: Platform.OS === 'android' ? insets.top : 0,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? '#333333' : '#e0e0e0',
    },
    backButton: {
      padding: 8,
      marginRight: 8,
    },
    backButtonText: {
      fontSize: 16,
      color: isDarkMode ? '#ffffff' : '#000000',
    },
    title: {
      fontSize: 24,
      fontWeight: '600',
      color: isDarkMode ? '#ffffff' : '#000000',
    },
    lastUpdated: {
      fontSize: 14,
      color: isDarkMode ? '#aaaaaa' : '#6C696A',
      marginLeft: 8,
      marginBottom: 16,
    },
    cardContainer: {
      backgroundColor: isDarkMode ? '#1e1e1e' : '#fff',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: isDarkMode ? '#333333' : '#e0e0e0',
      padding: 16,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDarkMode ? 0.3 : 0.1,
      shadowRadius: 8,
      elevation: 5,
    },
    card: {
      marginBottom: 16,
    },
    cardTitle: {
      fontSize: 20,
      fontWeight: '600',
      marginBottom: 8,
      color: isDarkMode ? '#ffffff' : '#000000',
    },
    cardSubtitle: {
      fontSize: 14,
      color: isDarkMode ? '#aaaaaa' : '#6C696A',
      marginBottom: 12,
    },
    itemText: {
      fontSize: 14,
      color: isDarkMode ? '#aaaaaa' : '#6C696A',
    },
    shareButton: {
      backgroundColor: isDarkMode ? '#0288d1' : '#0288d1',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 12,
    },
    shareButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#ffffff',
    },
    footerText: {
      fontSize: 14,
      color: isDarkMode ? '#aaaaaa' : '#6C696A',
      marginLeft: 8,
      marginBottom: 16,
    },
    cardContent: {
      marginTop: 8,
    },
    divider: {
      height: 1,
      backgroundColor: isDarkMode ? '#333333' : '#e0e0e0',
      marginVertical: 12,
    },
  });

  const onShare = async () => {
    try {
      const result = await Share.share({
        message:
          'Check out PlanetX! Download the app to explore amazing features and join our community: https://planetx-live.com',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log(`Shared via ${result.activityType}`);
        } else {
          console.log('Shared successfully');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed');
      }
    } catch (error: any) {
      console.error('Error sharing:', error.message);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={dynamicStyles.container}>
        <View style={dynamicStyles.header}>
          <TouchableOpacity
            style={dynamicStyles.backButton}
            onPress={() => router.back()}
          >
            <Text style={dynamicStyles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={dynamicStyles.title}>Share PlanetX</Text>
        </View>
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <Text style={dynamicStyles.lastUpdated}>
            Last Updated: January 1, 2025
          </Text>

          <View style={dynamicStyles.cardContainer}>
            {/* Share the App */}
            <View style={dynamicStyles.card}>
              <Text style={dynamicStyles.cardTitle}>Spread the Word</Text>
              <Text style={dynamicStyles.cardSubtitle}>
                Invite your friends and family to join PlanetX and explore its
                exciting features!
              </Text>
              <Text style={dynamicStyles.itemText}>
                Share the PlanetX app with others to help grow our community.
                Use the button below to send a link to the app via your favorite
                messaging or social media platforms.
              </Text>
              <TouchableOpacity
                style={dynamicStyles.shareButton}
                onPress={onShare}
              >
                <Text style={dynamicStyles.shareButtonText}>Share Now</Text>
              </TouchableOpacity>
            </View>

            {/* How Sharing Works */}
            <View style={dynamicStyles.card}>
              <Text style={dynamicStyles.cardTitle}>How Sharing Works</Text>
              <Text style={dynamicStyles.cardSubtitle}>
                Learn about the sharing process:
              </Text>
              <View style={dynamicStyles.cardContent}>
                <Text style={dynamicStyles.itemText}>
                  Tap the "Share Now" button to open your device's native
                  sharing options.
                </Text>
                <View style={dynamicStyles.divider} />
                <Text style={dynamicStyles.itemText}>
                  Choose your preferred platform (e.g., WhatsApp, Email, SMS) to
                  share the app link.
                </Text>
                <View style={dynamicStyles.divider} />
                <Text style={dynamicStyles.itemText}>
                  The shared link directs to the official PlanetX website or app
                  store for easy download.
                </Text>
              </View>
            </View>
          </View>

          <Text style={dynamicStyles.footerText}>
            By sharing PlanetX, you help us bring more users to our community.
            Thank you for your support!
          </Text>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default ShareApp;
