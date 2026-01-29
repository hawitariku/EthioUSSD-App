import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import USSDFormScreen from '../../src/screens/USSDFormScreen';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <USSDFormScreen />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});
