import React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import USSDFormScreen from '../src/screens/USSDFormScreen';

export default function App() {
  return (
    <View style={styles.container}>
      <ScrollView>
        <USSDFormScreen />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});