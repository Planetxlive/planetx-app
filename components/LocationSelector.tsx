import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import { ChevronDown } from 'lucide-react-native';
import Input from './ui/Input';
import Button from './ui/Button';

// Common locations for demo
const COMMON_LOCATIONS = [
  'Delhi',
  'Mumbai',
  'Bangalore',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'Pune',
  'Ahmedabad',
  'Jaipur',
  'Lucknow',
  'Surat',
  'Kanpur',
  'Nagpur',
  'Indore',
  'Thane',
  'Bhopal',
  'Visakhapatnam',
  'Pimpri-Chinchwad',
  'Patna',
  'Vadodara',
  'Ghaziabad',
  'Ludhiana',
  'Agra',
  'Nashik',
  'Faridabad',
  'Meerut',
  'Rajkot',
  'Varanasi',
  'Srinagar',
  'Aurangabad',
  'Dhanbad',
  'Amritsar',
  'Navi Mumbai',
  'Allahabad',
  'Ranchi',
  'Howrah',
  'Coimbatore',
  'Jabalpur',
  'Gwalior',
  'Vijayawada',
  'Jodhpur',
  'Madurai',
  'Raipur',
  'Kota',
  'Guwahati',
  'Chandigarh',
  'Solapur',
  'Hubli-Dharwad',
  'Mysore',
  'Tiruchirappalli',
  'Bareilly',
  'Aligarh',
  'Tiruppur',
  'Gurgaon',
  'Moradabad',
  'Jalandhar',
  'Bhubaneswar',
  'Salem',
  'Warangal',
  'Guntur',
  'Bhiwandi',
  'Saharanpur',
  'Gorakhpur',
  'Bikaner',
  'Amravati',
  'Noida',
  'Jamshedpur',
  'Bhilai',
  'Cuttack',
  'Firozabad',
  'Kochi',
  'Nellore',
  'Bhavnagar',
  'Dehradun',
  'Durgapur',
  'Asansol',
  'Rourkela',
  'Nanded',
  'Kolhapur',
  'Ajmer',
  'Akola',
  'Gulbarga',
  'Jamnagar',
  'Ujjain',
  'Loni',
  'Siliguri',
  'Jhansi',
  'Ulhasnagar',
  'Jammu',
  'Sangli-Miraj',
  'Mangalore',
  'Erode',
  'Belgaum',
  'Kurnool',
  'Ambattur',
  'Rajahmundry',
  'Tirunelveli',
  'Malegaon',
  'Gaya',
  'Udaipur',
  'Davanagere',
  'Kozhikode',
  'Akbarpur',
  'Durg'
];

type LocationSelectorProps = {
  location: string;
  onLocationChange: (location: string) => void;
};

export default function LocationSelector({ location, onLocationChange }: LocationSelectorProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Use useMemo to optimize filtering for large lists
  const filteredLocations = useMemo(() => {
    return COMMON_LOCATIONS.filter((loc) =>
      loc.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleSelectLocation = (selectedLocation: string) => {
    onLocationChange(selectedLocation);
    setModalVisible(false);
    setSearchQuery(''); // Reset search query on selection
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.selector, { borderColor: colors.grayMedium }]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={[styles.locationText, { color: colors.primaryColor }]}>{location}</Text>
        <ChevronDown size={20} color={colors.primaryColor} />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setModalVisible(false);
          setSearchQuery(''); // Reset search query on modal close
        }}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: colors.cardBackground },
            ]}
          >
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Select Location
            </Text>

            <Input
              placeholder="Search location..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.searchInput}
            />

            <ScrollView
              style={styles.locationList}
              showsVerticalScrollIndicator={true}
              keyboardShouldPersistTaps="handled"
            >
              {filteredLocations.length > 0 ? (
                filteredLocations.map((loc) => (
                  <TouchableOpacity
                    key={loc}
                    style={[
                      styles.locationItem,
                      {
                        backgroundColor:
                          loc === location
                            ? colors.primaryColor + '20'
                            : 'transparent',
                      },
                    ]}
                    onPress={() => handleSelectLocation(loc)}
                  >
                    <Text
                      style={[
                        styles.locationItemText,
                        {
                          color:
                            loc === location
                              ? colors.primaryColor
                              : colors.text,
                        },
                      ]}
                    >
                      {loc}
                    </Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={[styles.noResultsText, { color: colors.text }]}>
                  No locations found
                </Text>
              )}
            </ScrollView>

            <Button
              title="Close"
              onPress={() => {
                setModalVisible(false);
                setSearchQuery(''); // Reset search query on close
              }}
              variant="outline"
              style={styles.closeButton}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    paddingVertical: 4,
  },
  locationText: {
    fontSize: 18,
    fontWeight: '600',
    marginRight: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  searchInput: {
    marginBottom: 16,
  },
  locationList: {
    maxHeight: '60%', // Limit the height of the scrollable area
    marginBottom: 16,
  },
  locationItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  locationItemText: {
    fontSize: 16,
  },
  noResultsText: {
    fontSize: 16,
    textAlign: 'center',
    paddingVertical: 12,
  },
  closeButton: {
    marginTop: 8,
  },
});