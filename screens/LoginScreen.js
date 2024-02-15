// importing necessary modules and components
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity, Keyboard } from 'react-native';
import { getAuth, signInWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { db, firestore, auth } from '../firebaseConfig';

import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';

export default function LoginScreen({ navigation }) {

  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // Set state to true when keyboard is shown
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // Set state to false when keyboard is hidden
      }
    );

    return () => {
      // Clean up listeners on component unmount
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  
  // State variables for user input
  const [email, setEmail] = useState('');
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

  // Function to handle user login
  const handleLogin = () => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        const user = userCredential.user;
        if (user.emailVerified) {
          navigation.navigate('MenuScreen');
        } else {
          // Show an alert with the option to send verification email
          Alert.alert(
            'Verification Required',
            'Please verify your email.',
            [
              {text: 'Cancel', onPress: () => {}, style: 'cancel'},
              {text: 'Send Verification Email', onPress: () => sendVerificationEmail(user)},
            ],
            {cancelable: false}
          );
        }
      })
      .catch(error => {
        Alert.alert('Error', 'Email or password incorrect');
      });
  };

   // Function to send a verification email
   const sendVerificationEmail = (user) => {
    sendEmailVerification(user)
      .then(() => {
        Alert.alert('Verification Email Sent', 'Please check your inbox and verify your email.');
      })
      .catch(error => {
        Alert.alert('Error', error.message);
      });
  };

  
  return (
    <View style={[
      styles.container,
      { paddingTop: keyboardVisible ? 10 : 60 } // Adjust paddingTop based on keyboard state
    ]}>
      <View style={styles.brandText}>
        <Text style={styles.well}>Well<Text style={styles.track}>Track!</Text></Text>
      </View>
      <Text style={styles.header}>Login</Text>
      <TextInput style={styles.input} placeholder="Enter Your Email" keyboardType="email-address" onChangeText={text => setEmail(text)}/>
      <TextInput style={styles.input} placeholder="Enter Your Password" secureTextEntry={true} onChangeText={text => setPassword(text)}/>   
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleLogin}
      >
        <Text style={styles.buttonText}>Enter</Text>
      </TouchableOpacity>
      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignupScreen')}>
          <Text style={styles.signupButton}>Signup</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start', // Changed to 'flex-start' to move content up
    paddingTop: 60, // Adjust the padding top to move all content a bit higher
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  brand: {
    fontSize: 28, // Adjust the size to match your design
    fontWeight: 'bold',
    color: '#0A4FA0', // Adjust the color to match your design
    marginTop: 16, // Adjust the margin as per your design
  },
  tagline: {
    fontSize: 16, // Adjust the size to match your design
    color: '#333', // Adjust the color to match your design
    marginBottom: 48, // Adjust the margin as per your design
  },
  header: {
    fontSize: 32, // Adjust the size to match your design
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 36, // Adjust the margin as per your design
  },
  input: {
    width: '100%',
    padding: 16,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    fontSize: 18,
  },
  button: {
    marginTop: 20,
    width: '100%',
    backgroundColor: '#0A4FA0', // Adjust the color to match your design
    padding: 15,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signupContainer: {
    flexDirection: 'row',
    marginTop: 16,
  },
  signupText: {
    fontSize: 16,
    color: '#000',
  },
  signupButton: {
    fontSize: 16,
    color: '#0A4FA0', // Adjust the color to match your design
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

