import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

function RelaxationScreen() {
  const [timer, setTimer] = useState(null);
  const [time, setTime] = useState(0); // time in seconds
  const [isRelaxing, setIsRelaxing] = useState(false); // new state to manage relaxation mode

  // Function to format the time in seconds to minutes:seconds format
  const formatTime = () => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Function to start the relaxation timer
  const startRelaxation = () => {
    setIsRelaxing(true); // Set the screen to relaxation mode
    const newTimer = setInterval(() => {
      setTime((prevTime) => prevTime + 1);
    }, 1000); // increment time every second
    setTimer(newTimer);
  };

  // Function to end the relaxation session
  const endSession = () => {
    if (timer) {
      clearInterval(timer);
      setIsRelaxing(false); // Exit relaxation mode
      const sessionTime = formatTime(); // Capture the session time before resetting
      Alert.alert(
        "Relaxation Finished",
        `You relaxed for ${sessionTime}! Great job taking time for yourself.`,
        [{ text: "OK", onPress: () => console.log("OK Pressed") }],
        { cancelable: false }
      );
      setTimer(null);
      setTime(0); // reset time
    }
  };

  return (
    <View style={[styles.container, isRelaxing ? styles.relaxationMode : null]}>
      <Text style={styles.title}>Time to Relax!</Text>
      <Text style={styles.subtitle}>
        {isRelaxing ? "Enjoy this moment of calmness." : "Set a timer and let's begin your journey to tranquility."}
      </Text>
      <Text style={styles.timer}>{formatTime()}</Text>
      <TouchableOpacity style={[styles.button, isRelaxing ? styles.buttonActive : null]} onPress={startRelaxation}>
        <Text style={styles.buttonText}>Start Relaxation</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.buttonEnd]} onPress={endSession}>
        <Text style={styles.buttonText}>End Session</Text>
      </TouchableOpacity>
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
    backgroundColor: 'white',
    padding: 20,
  },
  relaxationMode: {
    backgroundColor: '#B2DFDB', // A calming teal color
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: 'grey',
    marginBottom: 30,
    textAlign: 'center',
  },
  timer: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#3F51B5', // A tranquil blue color
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    width: '80%',
    alignItems: 'center',
  },
  buttonActive: {
    backgroundColor: '#81C784', // A lighter, peaceful green color
  },
  buttonEnd: {
    backgroundColor: '#E57373', // A soft red color
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
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

export default RelaxationScreen;
