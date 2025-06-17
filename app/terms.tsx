import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Appearance,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native';
import { useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
// Import Privacy component if available
// import Privacy from './Privacy';

const TermsAndConditions = () => {
  const colorScheme = useColorScheme() || 'light';
  const isDarkMode = colorScheme === 'dark';
  const router = useRouter();

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#121212' : '#f5f5f5',
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? '#333333' : '#e0e0e0',
      backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff',
    },
    backButton: {
      padding: 8,
      marginRight: 8,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: isDarkMode ? '#ffffff' : '#000000',
    },
    contentContainer: {
      padding: 16,
    },
    title: {
      fontSize: 24,
      fontWeight: '600',
      marginBottom: 8,
      color: isDarkMode ? '#ffffff' : '#000000',
    },
    lastUpdated: {
      fontSize: 14,
      color: isDarkMode ? '#aaaaaa' : '#6C696A',
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
    cardContent: {
      flexDirection: 'column',
      gap: 8,
    },
    item: {
      flexDirection: 'column',
    },
    itemTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: isDarkMode ? '#ffffff' : '#000000',
    },
    itemText: {
      fontSize: 14,
      color: isDarkMode ? '#aaaaaa' : '#6C696A',
    },
    divider: {
      height: 1,
      backgroundColor: isDarkMode ? '#333333' : '#e0e0e0',
      marginVertical: 8,
    },
    footerText: {
      fontSize: 14,
      color: isDarkMode ? '#aaaaaa' : '#6C696A',
      marginLeft: 8,
      marginBottom: 16,
    },
  });

  return (
    <SafeAreaProvider>
      <SafeAreaView style={dynamicStyles.container}>
        <View style={dynamicStyles.header}>
          <TouchableOpacity
            style={dynamicStyles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color={isDarkMode ? '#ffffff' : '#000000'}
            />
          </TouchableOpacity>
          <Text style={dynamicStyles.headerTitle}>Terms & Conditions</Text>
        </View>
        <ScrollView contentContainerStyle={dynamicStyles.contentContainer}>
          <Text style={dynamicStyles.title}>Terms & Conditions</Text>
          <Text style={dynamicStyles.lastUpdated}>
            Last Updated: January 1, 2025
          </Text>

          <View style={dynamicStyles.cardContainer}>
            {/* 01. Use of Services */}
            <View style={dynamicStyles.card}>
              <Text style={dynamicStyles.cardTitle}>01. Use of Services</Text>
              <Text style={dynamicStyles.cardSubtitle}>
                By using our services, you agree to the following:
              </Text>
              <View style={dynamicStyles.cardContent}>
                <Text style={dynamicStyles.itemText}>
                  You can use our app regardless of your age.
                </Text>
                <View style={dynamicStyles.divider} />
                <Text style={dynamicStyles.itemText}>
                  You agree to provide accurate and complete information when
                  creating an account.
                </Text>
                <View style={dynamicStyles.divider} />
                <Text style={dynamicStyles.itemText}>
                  You are responsible for maintaining the confidentiality of
                  your account credentials.
                </Text>
              </View>
            </View>

            {/* 02. User-Generated Content */}
            <View style={dynamicStyles.card}>
              <Text style={dynamicStyles.cardTitle}>
                02. User-Generated Content
              </Text>
              <Text style={dynamicStyles.cardSubtitle}>
                Your content contributions are subject to:
              </Text>
              <View style={dynamicStyles.cardContent}>
                <Text style={dynamicStyles.itemText}>
                  By uploading images, videos, or other content, you grant
                  PlanetX a non-exclusive, worldwide, royalty-free license to
                  use, modify, and distribute such content for marketing,
                  promotional, and business purposes.
                </Text>
                <View style={dynamicStyles.divider} />
                <Text style={dynamicStyles.itemText}>
                  You must have the necessary rights to upload content and
                  ensure it does not violate any laws or third-party rights.
                </Text>
              </View>
            </View>

            {/* 03. Marketing and Promotions */}
            <View style={dynamicStyles.card}>
              <Text style={dynamicStyles.cardTitle}>
                03. Marketing and Promotions
              </Text>
              <Text style={dynamicStyles.cardSubtitle}>
                We may use your information for marketing purposes as follows:
              </Text>
              <View style={dynamicStyles.cardContent}>
                <Text style={dynamicStyles.itemText}>
                  By using our services, you consent to receive promotional
                  emails, messages, and advertisements related to our services
                  and offerings.
                </Text>
                <View style={dynamicStyles.divider} />
                <Text style={dynamicStyles.itemText}>
                  You may opt out of marketing communications at any time
                  through account settings or by contacting us.
                </Text>
              </View>
            </View>

            {/* 04. Prohibited Activities */}
            <View style={dynamicStyles.card}>
              <Text style={dynamicStyles.cardTitle}>
                04. Prohibited Activities
              </Text>
              <Text style={dynamicStyles.cardSubtitle}>
                The following activities are not permitted:
              </Text>
              <View style={dynamicStyles.cardContent}>
                <Text style={dynamicStyles.itemText}>
                  Misuse of our platform, including fraudulent activities,
                  spamming, and violating intellectual property rights, is
                  strictly prohibited.
                </Text>
                <View style={dynamicStyles.divider} />
                <Text style={dynamicStyles.itemText}>
                  Any unlawful use of our platform may result in termination of
                  your account.
                </Text>
              </View>
            </View>

            {/* 05. Payments and Transactions */}
            <View style={dynamicStyles.card}>
              <Text style={dynamicStyles.cardTitle}>
                05. Payments and Transactions
              </Text>
              <Text style={dynamicStyles.cardSubtitle}>
                Financial transactions on our platform are governed by:
              </Text>
              <View style={dynamicStyles.cardContent}>
                <Text style={dynamicStyles.itemText}>
                  Transactions on PlanetX must comply with applicable financial
                  and legal regulations.
                </Text>
                <View style={dynamicStyles.divider} />
                <Text style={dynamicStyles.itemText}>
                  Refund policies, if applicable, will be detailed separately in
                  our Refund Policy.
                </Text>
              </View>
            </View>

            {/* 06. Compliance with Laws */}
            <View style={dynamicStyles.card}>
              <Text style={dynamicStyles.cardTitle}>
                06. Compliance with Laws
              </Text>
              <Text style={dynamicStyles.cardSubtitle}>
                Our platform and users must adhere to:
              </Text>
              <View style={dynamicStyles.cardContent}>
                <Text style={dynamicStyles.itemText}>
                  PlanetX adheres to applicable laws, including data protection
                  regulations (GDPR, CCPA, etc.), App Store, and Play Store
                  policies.
                </Text>
                <View style={dynamicStyles.divider} />
                <Text style={dynamicStyles.itemText}>
                  Users must comply with all relevant laws while using the
                  platform.
                </Text>
              </View>
            </View>

            {/* 07. Termination of Services */}
            <View style={dynamicStyles.card}>
              <Text style={dynamicStyles.cardTitle}>
                07. Termination of Services
              </Text>
              <Text style={dynamicStyles.cardSubtitle}>
                We may terminate services under the following conditions:
              </Text>
              <Text style={dynamicStyles.itemText}>
                We reserve the right to suspend or terminate accounts that
                violate our terms or engage in prohibited activities.
              </Text>
            </View>

            {/* 08. Liability and Disclaimers */}
            <View style={dynamicStyles.card}>
              <Text style={dynamicStyles.cardTitle}>
                08. Liability and Disclaimers
              </Text>
              <Text style={dynamicStyles.cardSubtitle}>
                Our liability is limited as follows:
              </Text>
              <Text style={dynamicStyles.itemText}>
                We do not guarantee uninterrupted service and are not
                responsible for any losses due to service interruptions or
                security breaches.
              </Text>
            </View>

            {/* 09. Changes to Terms */}
            <View style={dynamicStyles.card}>
              <Text style={dynamicStyles.cardTitle}>09. Changes to Terms</Text>
              <Text style={dynamicStyles.cardSubtitle}>
                Updates to our terms are handled as follows:
              </Text>
              <Text style={dynamicStyles.itemText}>
                We may update these terms periodically, and continued use of
                PlanetX constitutes acceptance of the revised terms.
              </Text>
            </View>

            {/* 10. Contact Us */}
            <View style={dynamicStyles.card}>
              <Text style={dynamicStyles.cardTitle}>10. Contact Us</Text>
              <Text style={dynamicStyles.cardSubtitle}>
                For any questions or concerns, contact us at:
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

            {/* 11. Privacy */}
            {/* Uncomment and import Privacy component if available */}
            {/* <Privacy /> */}
            <View style={dynamicStyles.card}>
              <Text style={dynamicStyles.cardTitle}>11. Privacy</Text>
              <Text style={dynamicStyles.cardSubtitle}>
                Our data handling practices are detailed in:
              </Text>
              <Text style={dynamicStyles.itemText}>
                Please refer to our Privacy Policy for details on how we handle
                your data.
              </Text>
            </View>
          </View>

          <Text style={dynamicStyles.footerText}>
            By accessing or using PlanetX, you agree to be bound by these Terms
            and Conditions.
          </Text>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default TermsAndConditions;
