import React from 'react';
import { View, Text, ScrollView, StyleSheet, Appearance, SafeAreaView } from 'react-native';
import { useColorScheme } from 'react-native';

const PrivacyPolicy = () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#121212' : '#f5f5f5',
    },
    title: {
      fontSize: 24,
      fontWeight: '600',
      marginLeft: 8,
      marginBottom: 8,
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
    <SafeAreaView style={dynamicStyles.container}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={dynamicStyles.title}>Privacy Policy</Text>
        <Text style={dynamicStyles.lastUpdated}>Last Updated: January 1, 2025</Text>
        
        <View style={dynamicStyles.cardContainer}>
          {/* 1. Information We Collect */}
          <View style={dynamicStyles.card}>
            <Text style={dynamicStyles.cardTitle}>01. Information We Collect</Text>
            <Text style={dynamicStyles.cardSubtitle}>We may collect the following types of information:</Text>
            <View style={dynamicStyles.cardContent}>
              <View style={dynamicStyles.item}>
                <Text style={dynamicStyles.itemTitle}>Personal Information:</Text>
                <Text style={dynamicStyles.itemText}>Name, email, phone number, payment details.</Text>
              </View>
              <View style={dynamicStyles.divider} />
              <View style={dynamicStyles.item}>
                <Text style={dynamicStyles.itemTitle}>Usage Data:</Text>
                <Text style={dynamicStyles.itemText}>Interaction with the app, device information, IP address.</Text>
              </View>
              <View style={dynamicStyles.divider} />
              <View style={dynamicStyles.item}>
                <Text style={dynamicStyles.itemTitle}>User-Generated Content:</Text>
                <Text style={dynamicStyles.itemText}>Images, videos, and other uploaded content.</Text>
              </View>
            </View>
          </View>

          {/* 2. How We Use Your Information */}
          <View style={dynamicStyles.card}>
            <Text style={dynamicStyles.cardTitle}>02. How We Use Your Information</Text>
            <Text style={dynamicStyles.cardSubtitle}>We use your information to:</Text>
            <View style={dynamicStyles.cardContent}>
              <Text style={dynamicStyles.itemText}>Provide and improve our services.</Text>
              <View style={dynamicStyles.divider} />
              <Text style={dynamicStyles.itemText}>Personalize user experience and offer targeted promotions.</Text>
              <View style={dynamicStyles.divider} />
              <Text style={dynamicStyles.itemText}>Communicate with users regarding updates, offers, and important notices.</Text>
            </View>
          </View>

          {/* 3. Marketing and Promotions */}
          <View style={dynamicStyles.card}>
            <Text style={dynamicStyles.cardTitle}>03. Marketing and Promotions</Text>
            <Text style={dynamicStyles.cardSubtitle}>We may use your data for marketing purposes, including:</Text>
            <View style={dynamicStyles.cardContent}>
              <Text style={dynamicStyles.itemText}>Promotional videos and images.</Text>
              <View style={dynamicStyles.divider} />
              <Text style={dynamicStyles.itemText}>Sending promotional emails and messages, which you can opt out of at any time.</Text>
            </View>
          </View>

          {/* 4. Data Sharing and Disclosure */}
          <View style={dynamicStyles.card}>
            <Text style={dynamicStyles.cardTitle}>04. Data Sharing and Disclosure</Text>
            <Text style={dynamicStyles.cardSubtitle}>Your data is handled as follows:</Text>
            <View style={dynamicStyles.cardContent}>
              <Text style={dynamicStyles.itemText}>We do not sell user data to third parties.</Text>
              <View style={dynamicStyles.divider} />
              <Text style={dynamicStyles.itemText}>Data may be shared with trusted partners for service improvements, compliance, and marketing.</Text>
              <View style={dynamicStyles.divider} />
              <Text style={dynamicStyles.itemText}>Legal disclosures may be made in compliance with government or law enforcement requests.</Text>
            </View>
          </View>

          {/* 5. Data Security */}
          <View style={dynamicStyles.card}>
            <Text style={dynamicStyles.cardTitle}>05. Data Security</Text>
            <Text style={dynamicStyles.cardSubtitle}>We prioritize the security of your data:</Text>
            <View style={dynamicStyles.cardContent}>
              <Text style={dynamicStyles.itemText}>We implement security measures to protect user data from unauthorized access and breaches.</Text>
              <View style={dynamicStyles.divider} />
              <Text style={dynamicStyles.itemText}>Users are responsible for safeguarding their account credentials.</Text>
            </View>
          </View>

          {/* 6. User Rights */}
          <View style={dynamicStyles.card}>
            <Text style={dynamicStyles.cardTitle}>06. User Rights</Text>
            <Text style={dynamicStyles.cardSubtitle}>You have the following rights regarding your data:</Text>
            <View style={dynamicStyles.cardContent}>
              <Text style={dynamicStyles.itemText}>Access, update, or delete your personal information.</Text>
              <View style={dynamicStyles.divider} />
              <Text style={dynamicStyles.itemText}>Request data deletion by contacting our support team.</Text>
            </View>
          </View>

          {/* 7. Children's Privacy */}
          <View style={dynamicStyles.card}>
            <Text style={dynamicStyles.cardTitle}>07. Children’s Privacy</Text>
            <Text style={dynamicStyles.cardSubtitle}>Our policy regarding children:</Text>
            <View style={dynamicStyles.cardContent}>
              <Text style={dynamicStyles.itemText}>PlanetX is available for users of all age groups.</Text>
              <View style={dynamicStyles.divider} />
              <Text style={dynamicStyles.itemText}>Parents or guardians should supervise minors when using our services.</Text>
            </View>
          </View>

          {/* 8. Changes to the Privacy Policy */}
          <View style={dynamicStyles.card}>
            <Text style={dynamicStyles.cardTitle}>08. Changes to the Privacy Policy</Text>
            <Text style={dynamicStyles.cardSubtitle}>We may update our Privacy Policy periodically. Users will be notified of major changes.</Text>
          </View>

          {/* 9. Contact Us */}
          <View style={dynamicStyles.card}>
            <Text style={dynamicStyles.cardTitle}>09. Contact Us</Text>
            <Text style={dynamicStyles.cardSubtitle}>For any questions regarding this Privacy Policy or our privacy practices, please contact us at:</Text>
            <View style={dynamicStyles.cardContent}>
              <View style={dynamicStyles.item}>
                <Text style={dynamicStyles.itemTitle}>Email:</Text>
                <Text style={dynamicStyles.itemText}>contact@planetx-live.com</Text>
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
          By using PlanetX, you acknowledge that you have read and agree to these Terms and Conditions and Privacy Policy.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PrivacyPolicy;