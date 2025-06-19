import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native';
import { useColorScheme } from 'react-native';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const PrivacyPolicy = () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#181A20' : '#f5f7fa',
    },
    gradient: {
      ...StyleSheet.absoluteFillObject,
      zIndex: -1,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingTop: insets.top + (Platform.OS === 'android' ? 8 : 0),
      paddingBottom: 16,
      backgroundColor: isDarkMode ? 'rgba(30,30,30,0.98)' : 'rgba(255,255,255,0.98)',
      borderBottomWidth: 0.5,
      borderBottomColor: isDarkMode ? '#333' : '#e0e0e0',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 8,
      zIndex: 10,
    },
    backButton: {
      padding: 10,
      borderRadius: 100,
      backgroundColor: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
      marginRight: 12,
    },
    headerTitle: {
      fontSize: 22,
      fontWeight: '700',
      color: isDarkMode ? '#fff' : '#181A20',
      flex: 1,
      textAlign: 'center',
      letterSpacing: 0.2,
    },
    contentContainer: {
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: insets.bottom + 32,
    },
    title: {
      fontSize: 28,
      fontWeight: '700',
      marginBottom: 6,
      color: isDarkMode ? '#fff' : '#181A20',
      letterSpacing: 0.1,
      textAlign: 'center',
    },
    lastUpdated: {
      fontSize: 14,
      color: isDarkMode ? '#aaaaaa' : '#6C696A',
      marginBottom: 18,
      textAlign: 'center',
    },
    cardContainer: {
      marginTop: 8,
      marginBottom: 16,
      gap: 18,
    },
    card: {
      backgroundColor: isDarkMode ? '#23242a' : '#fff',
      borderRadius: 16,
      borderWidth: 1,
      borderColor: isDarkMode ? '#2c2c2c' : '#e0e0e0',
      padding: 18,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDarkMode ? 0.18 : 0.08,
      shadowRadius: 10,
      elevation: 6,
      marginBottom: 0,
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: '700',
      marginBottom: 6,
      color: isDarkMode ? '#fff' : '#181A20',
    },
    cardSubtitle: {
      fontSize: 14,
      color: isDarkMode ? '#aaaaaa' : '#6C696A',
      marginBottom: 10,
    },
    cardContent: {
      flexDirection: 'column',
      gap: 8,
    },
    item: {
      flexDirection: 'column',
    },
    itemTitle: {
      fontSize: 15,
      fontWeight: '600',
      color: isDarkMode ? '#fff' : '#181A20',
    },
    itemText: {
      fontSize: 14,
      color: isDarkMode ? '#cccccc' : '#6C696A',
    },
    divider: {
      height: 1,
      backgroundColor: isDarkMode ? '#333333' : '#e0e0e0',
      marginVertical: 8,
      borderRadius: 1,
    },
    footerText: {
      fontSize: 14,
      color: isDarkMode ? '#aaaaaa' : '#6C696A',
      marginTop: 12,
      marginBottom: 24,
      textAlign: 'center',
    },
  });

  return (
    <SafeAreaProvider>
      <View style={dynamicStyles.container}>
        <LinearGradient
          colors={isDarkMode ? ['#181A20', '#23242a'] : ['#f5f7fa', '#e9e9f0']}
          style={dynamicStyles.gradient}
        />
        <View style={dynamicStyles.header}>
          <TouchableOpacity
            style={dynamicStyles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color={isDarkMode ? '#fff' : '#181A20'}
            />
          </TouchableOpacity>
          <Text style={dynamicStyles.headerTitle}>Privacy Policy</Text>
          <View style={{ width: 36 }} />
        </View>
        <ScrollView
          contentContainerStyle={dynamicStyles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <Text style={dynamicStyles.title}>Privacy Policy</Text>
          <Text style={dynamicStyles.lastUpdated}>
            Last Updated: January 1, 2025
          </Text>

          <View style={dynamicStyles.cardContainer}>
            {/* 1. Information We Collect */}
            <View style={dynamicStyles.card}>
              <Text style={dynamicStyles.cardTitle}>
                01. Information We Collect
              </Text>
              <Text style={dynamicStyles.cardSubtitle}>
                We may collect the following types of information:
              </Text>
              <View style={dynamicStyles.cardContent}>
                <View style={dynamicStyles.item}>
                  <Text style={dynamicStyles.itemTitle}>
                    Personal Information:
                  </Text>
                  <Text style={dynamicStyles.itemText}>
                    Name, email, phone number, payment details.
                  </Text>
                </View>
                <View style={dynamicStyles.divider} />
                <View style={dynamicStyles.item}>
                  <Text style={dynamicStyles.itemTitle}>Usage Data:</Text>
                  <Text style={dynamicStyles.itemText}>
                    Interaction with the app, device information, IP address.
                  </Text>
                </View>
                <View style={dynamicStyles.divider} />
                <View style={dynamicStyles.item}>
                  <Text style={dynamicStyles.itemTitle}>
                    User-Generated Content:
                  </Text>
                  <Text style={dynamicStyles.itemText}>
                    Images, videos, and other uploaded content.
                  </Text>
                </View>
              </View>
            </View>

            {/* 2. How We Use Your Information */}
            <View style={dynamicStyles.card}>
              <Text style={dynamicStyles.cardTitle}>
                02. How We Use Your Information
              </Text>
              <Text style={dynamicStyles.cardSubtitle}>
                We use your information to:
              </Text>
              <View style={dynamicStyles.cardContent}>
                <Text style={dynamicStyles.itemText}>
                  Provide and improve our services.
                </Text>
                <View style={dynamicStyles.divider} />
                <Text style={dynamicStyles.itemText}>
                  Personalize user experience and offer targeted promotions.
                </Text>
                <View style={dynamicStyles.divider} />
                <Text style={dynamicStyles.itemText}>
                  Communicate with users regarding updates, offers, and
                  important notices.
                </Text>
              </View>
            </View>

            {/* 3. Marketing and Promotions */}
            <View style={dynamicStyles.card}>
              <Text style={dynamicStyles.cardTitle}>
                03. Marketing and Promotions
              </Text>
              <Text style={dynamicStyles.cardSubtitle}>
                We may use your data for marketing purposes, including:
              </Text>
              <View style={dynamicStyles.cardContent}>
                <Text style={dynamicStyles.itemText}>
                  Promotional videos and images.
                </Text>
                <View style={dynamicStyles.divider} />
                <Text style={dynamicStyles.itemText}>
                  Sending promotional emails and messages, which you can opt out
                  of at any time.
                </Text>
              </View>
            </View>

            {/* 4. Data Sharing and Disclosure */}
            <View style={dynamicStyles.card}>
              <Text style={dynamicStyles.cardTitle}>
                04. Data Sharing and Disclosure
              </Text>
              <Text style={dynamicStyles.cardSubtitle}>
                Your data is handled as follows:
              </Text>
              <View style={dynamicStyles.cardContent}>
                <Text style={dynamicStyles.itemText}>
                  We do not sell user data to third parties.
                </Text>
                <View style={dynamicStyles.divider} />
                <Text style={dynamicStyles.itemText}>
                  Data may be shared with trusted partners for service
                  improvements, compliance, and marketing.
                </Text>
                <View style={dynamicStyles.divider} />
                <Text style={dynamicStyles.itemText}>
                  Legal disclosures may be made in compliance with government or
                  law enforcement requests.
                </Text>
              </View>
            </View>

            {/* 5. Data Security */}
            <View style={dynamicStyles.card}>
              <Text style={dynamicStyles.cardTitle}>05. Data Security</Text>
              <Text style={dynamicStyles.cardSubtitle}>
                We prioritize the security of your data:
              </Text>
              <View style={dynamicStyles.cardContent}>
                <Text style={dynamicStyles.itemText}>
                  We implement security measures to protect user data from
                  unauthorized access and breaches.
                </Text>
                <View style={dynamicStyles.divider} />
                <Text style={dynamicStyles.itemText}>
                  Users are responsible for safeguarding their account
                  credentials.
                </Text>
              </View>
            </View>

            {/* 6. User Rights */}
            <View style={dynamicStyles.card}>
              <Text style={dynamicStyles.cardTitle}>06. User Rights</Text>
              <Text style={dynamicStyles.cardSubtitle}>
                You have the following rights regarding your data:
              </Text>
              <View style={dynamicStyles.cardContent}>
                <Text style={dynamicStyles.itemText}>
                  Access, update, or delete your personal information.
                </Text>
                <View style={dynamicStyles.divider} />
                <Text style={dynamicStyles.itemText}>
                  Request data deletion by contacting our support team.
                </Text>
              </View>
            </View>

            {/* 7. Children's Privacy */}
            <View style={dynamicStyles.card}>
              <Text style={dynamicStyles.cardTitle}>
                07. Children's Privacy
              </Text>
              <Text style={dynamicStyles.cardSubtitle}>
                Our policy regarding children:
              </Text>
              <View style={dynamicStyles.cardContent}>
                <Text style={dynamicStyles.itemText}>
                  PlanetX is available for users of all age groups.
                </Text>
                <View style={dynamicStyles.divider} />
                <Text style={dynamicStyles.itemText}>
                  Parents or guardians should supervise minors when using our
                  services.
                </Text>
              </View>
            </View>

            {/* 8. Changes to the Privacy Policy */}
            <View style={dynamicStyles.card}>
              <Text style={dynamicStyles.cardTitle}>
                08. Changes to the Privacy Policy
              </Text>
              <Text style={dynamicStyles.cardSubtitle}>
                We may update our Privacy Policy periodically. Users will be
                notified of major changes.
              </Text>
            </View>

            {/* 9. Contact Us */}
            <View style={dynamicStyles.card}>
              <Text style={dynamicStyles.cardTitle}>09. Contact Us</Text>
              <Text style={dynamicStyles.cardSubtitle}>
                For any questions regarding this Privacy Policy or our privacy
                practices, please contact us at:
              </Text>
              <View style={dynamicStyles.cardContent}>
                <View style={dynamicStyles.item}>
                  <Text style={dynamicStyles.itemTitle}>Email:</Text>
                  <Text style={dynamicStyles.itemText}>
                    contact@planetx-live.com
                  </Text>
                </View>
                <View style={dynamicStyles.divider} />
                <View style={dynamicStyles.item}>
                  <Text style={dynamicStyles.itemTitle}>Customer Support:</Text>
                  <Text style={dynamicStyles.itemText}>+91 98735 81566</Text>
                </View>
              </View>
            </View>
          </View>

          <Text style={dynamicStyles.footerText}>
            By using PlanetX, you acknowledge that you have read and agree to
            these Terms and Conditions and Privacy Policy.
          </Text>
        </ScrollView>
      </View>
    </SafeAreaProvider>
  );
};

export default PrivacyPolicy;
