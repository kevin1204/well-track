// ActivityTrackerScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Accelerometer } from 'expo-sensors';

const stepThreshold = 1; // Define a threshold for step detection
const stepLength = 0.762; // Average step length in meters

function ActivityTrackerScreen() {
  const [steps, setSteps] = useState(0);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    Accelerometer.setUpdateInterval(1000); // Update every second

    const subscription = Accelerometer.addListener(accelerometerData => {
      const { x, y, z } = accelerometerData;
      // Simple step detection based on the y value
      // This is a naive implementation and should be replaced with a proper algorithm
      if (Math.abs(y) > stepThreshold) {
        setSteps(prevSteps => prevSteps + 1);
        setDistance(prevDistance => prevDistance + stepLength);
      }
    });

    // Cleanup on unmount
    return () => subscription.remove();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Activity 🏃‍♂️</Text>
      <Text style={styles.phrase}>Every Step Counts: Track your progress towards a healthier day!</Text>
      <Text style={styles.stats}>{steps} steps</Text>
      <Text style={styles.stats}>{(distance / 1000).toFixed(2)} km</Text>
      <View style={styles.brandText}>
        <Text style={styles.well}>Well<Text style={styles.track}>Track!</Text></Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 24,
  },
  phrase: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 48,
    textAlign: 'center',
  },
  stats: {
    fontSize: 40,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  brandText: {
    position: 'absolute', // to position it at the bottom
    bottom: 20, // bottom spacing
  },
  well: {
    fontSize: 28, // as specified
    fontFamily: 'IndieFlower', // this should be the name used when linking the font
    fontWeight: '400', // normal weight as specified
    color: '#0F6102', // color as specified
  },
  track: {
    fontSize: 28, // as specified
    fontFamily: 'IrishGrover', // this should be the name used when linking the font
    fontWeight: '400', // normal weight as specified
    color: '#1C6CB6', // color as specified
  },
});

export default ActivityTrackerScreen;
