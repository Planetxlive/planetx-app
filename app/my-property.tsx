import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { Property, useProperties } from '@/context/PropertyContext';
import PropertyCard from '@/components/PropertyCard';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';
import { ArrowLeft, Plus } from 'lucide-react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function MyPropertyScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const { user } = useAuth();
  const { getUserProperties } = useProperties();
  const [userProperties, setUserProperties] = useState<Property[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const propertiesRes = await getUserProperties();
      setUserProperties(propertiesRes);
    };
    fetchData();
  }, []); // Added dependency array to prevent infinite loop

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
        edges={['top', 'right', 'left']}
      >
        <StatusBar
          barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
          backgroundColor={colors.background}
        />
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            My Properties
          </Text>
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.primaryColor }]}
            onPress={() => router.push('/add-property')}
          >
            <Plus size={24} color="white" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={userProperties}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <PropertyCard property={item} />}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={[styles.emptyStateText, { color: colors.text }]}>
                You haven't listed any properties yet
              </Text>
              <TouchableOpacity
                style={[
                  styles.addPropertyButton,
                  { backgroundColor: colors.primaryColor },
                ]}
                onPress={() => router.push('/add-property')}
              >
                <Text style={styles.addPropertyButtonText}>Add Property</Text>
              </TouchableOpacity>
            </View>
          }
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight ? StatusBar.currentHeight - 16 : 0 : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    marginTop: 0,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    flex: 1,
    textAlign: 'center',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: -8,
  },
  listContent: {
    padding: 16,
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginBottom: 16,
    textAlign: 'center',
  },
  addPropertyButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  addPropertyButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});
