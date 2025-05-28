import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
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

  const filteredLocations = COMMON_LOCATIONS.filter(
    (loc) => loc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectLocation = (selectedLocation: string) => {
    onLocationChange(selectedLocation);
    setModalVisible(false);
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
        onRequestClose={() => setModalVisible(false)}
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

            <View style={styles.locationList}>
              {filteredLocations.map((loc) => (
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
              ))}
            </View>

            <Button
              title="Close"
              onPress={() => setModalVisible(false)}
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
  closeButton: {
    marginTop: 8,
  },
});