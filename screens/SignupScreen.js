// importing necessary modules and components
import React, {useState, useEffect } from 'react';
import { View, TextInput, Button, Alert, Text, StyleSheet, TouchableOpacity, Keyboard} from 'react-native';
import { getAuth, createUserWithEmailAndPassword, updateProfile} from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { db, firestore, auth } from '../firebaseConfig';

import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';


export default function SignupScreen({ navigation }) {

  //state variable to track the keyboard's visibility
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  //use useEffect to add event listeners for keyboard show and hide events
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardVisible(false)
    );
  
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  
  // State variables for user input
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  
  const loadFonts = async () => {
    await useFonts({
      'IndieFlower': require('../assets/fonts/IndieFlower-Regular.ttf'),
      'IrishGrover': require('../assets/fonts/IrishGrover-Regular.ttf')
    });
  };

  let [fontsLoaded] = useFonts({
    'IndieFlower': require('../assets/fonts/IndieFlower-Regular.ttf'),
    'IrishGrover': require('../assets/fonts/IrishGrover-Regular.ttf')
  });

  if (!fontsLoaded) {
    return null; // Return null or a loading indicator while fonts are loading
  }

  const register = async () => {
    // registration logic
    const auth = getAuth();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Set the display name for the user
      await updateProfile(user, { displayName: username });

      const firestore = getFirestore();
      await setDoc(doc(firestore, 'users', user.uid), {
        username,
        phoneNumber,
        email
      });

      Alert.alert('Registration successful!');
    } catch (error) {
      Alert.alert('Error:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Signup</Text>
      <TextInput style={styles.input} placeholder="Enter Your Username" onChangeText={setUsername}/>
      <TextInput style={styles.input} placeholder="Enter Your Email" keyboardType="email-address" onChangeText={setEmail}/>
      <TextInput style={styles.input} placeholder="Enter Your Phone Number" keyboardType="phone-pad" onChangeText={setPhoneNumber}/>
      <TextInput style={styles.input} placeholder="Enter Your Password" secureTextEntry={true} onChangeText={setPassword}/>
  
      <TouchableOpacity style={styles.signupButton} onPress={register}>
        <Text style={styles.signupButtonText}>Signup</Text>
      </TouchableOpacity>

      <View style={styles.loginContainer}>
        <Text style={styles.accountText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>
      </View>

      {!isKeyboardVisible && (
      <View style={styles.brandText}>
        <Text style={styles.well}>Well<Text style={styles.track}>Track!</Text></Text>
      </View>
    )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
    backgroundColor: '#FFFFFF', // assuming a white background as seen in the image
    // marginTop: -20,
  },
  header: {
    fontSize: 24,
    fontWeight: '700', // bold text for the header
    marginBottom: 40,
    color: '#000000', // assuming a black color for the text
  },
  input: {
    width: '100%',
    padding: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    fontSize: 16, // assuming a standard font size for input text
  },
  // Add styles for the buttons
  button: {
    marginTop: 10,
    backgroundColor: '#0A4FA0', // button color as specified
    color: '#FFFFFF', // text color for the button, assuming white
    padding: 15,
    borderRadius: 5,
  },
  // Style for the bottom brand text
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
  signupButton: {
    width: '100%',
    backgroundColor: '#0A4FA0', // Use the color from your screenshot
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  signupButtonText: {
    color: '#FFFFFF', // White color for the text
    fontSize: 18, // Adjust the size as per your screenshot
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  accountText: {
    color: '#000', // Assuming black color for normal text
    fontSize: 16, // Adjust the size as per your screenshot
  },
  loginText: {
    color: '#0A4FA0', // Use the color that indicates it is clickable, usually your brand color
    fontSize: 16,
    fontWeight: 'bold',
  },
});

