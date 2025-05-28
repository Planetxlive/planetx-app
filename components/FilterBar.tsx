import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import { PropertyType } from '../context/PropertyContext';

type FilterBarProps = {
  selectedType: string | null;
  onSelectType: (type: string | null) => void;
  types: PropertyType[];
};

export default function FilterBar({ selectedType, onSelectType, types }: FilterBarProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  const handleSelect = (type: string | null) => {
    if (selectedType === type) {
      // If already selected, deselect it
      onSelectType(null);
    } else {
      onSelectType(type);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <TouchableOpacity
          style={[
            styles.filterItem,
            selectedType === null && {
              backgroundColor: colors.primaryColor,
            },
            { borderColor: colors.primaryColor },
          ]}
          onPress={() => handleSelect(null)}
        >
          <Text
            style={[
              styles.filterText,
              selectedType === null
                ? { color: 'white' }
                : { color: colors.primaryColor },
            ]}
          >
            All
          </Text>
        </TouchableOpacity>

        {types.map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.filterItem,
              selectedType === type && {
                backgroundColor: colors.primaryColor,
              },
              { borderColor: colors.primaryColor },
            ]}
            onPress={() => handleSelect(type)}
          >
            <Text
              style={[
                styles.filterText,
                selectedType === type
                  ? { color: 'white' }
                  : { color: colors.primaryColor },
              ]}
            >
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  filterItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
  },
});