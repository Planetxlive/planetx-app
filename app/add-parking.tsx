import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';


type Step = 'basic' | 'details' | 'media' | 'amenities' | 'price';

export default function AddParking() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >

      <View style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%"
      }}>
        <Text style={{
          color: colors.text,
          fontWeight: "700",
          fontSize: 30
        }}>This feature is comming soon</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
});
