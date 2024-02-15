// MenuScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { getAuth, sendEmailVerification } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { db, firestore, auth } from "../firebaseConfig";

function MenuScreen({ navigation }) {
  // State variables for user data
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState("User");

  // UseEffect to fetch user details when component mounts
  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);
      if (currentUser.displayName) {
        setUserName(currentUser.displayName);
      } else {
        // If displayName is not set, fetch the name from Firestore
        const fetchNameFromFirestore = async () => {
          const firestore = getFirestore();
          const userDoc = await getDoc(
            doc(firestore, "users", currentUser.uid)
          );
          if (userDoc.exists()) {
            setUserName(userDoc.data().firstName);
          }
        };
        fetchNameFromFirestore();
      }
    }
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.welcomeBox}>
        <Text style={styles.welcomeText}>Welcome,</Text>
        <Text style={styles.userName}>{userName}!</Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("WaterTrackerScreen")}
      >
        <Text style={styles.buttonText}>Water Tracker!</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("ActivityTrackerScreen")}
      >
        <Text style={styles.buttonText}>Activity Tracker!</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("FoodLogScreen")}
      >
        <Text style={styles.buttonText}>Food Log!</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("RelaxationScreen")}
      >
        <Text style={styles.buttonText}>Relaxation Timer!</Text>
      </TouchableOpacity>

      <View style={styles.brandText}>
        <Text style={styles.well}>Well<Text style={styles.track}>Track!</Text></Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  welcomeBox: {
    backgroundColor: '#fff',
    borderRadius: 100,
    padding: 30,
    marginBottom: 60,
    alignItems: 'center',

    // Shadow properties for iOS
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    // Shadow properties for Android
    elevation: 10,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1C6CB6',
  },
  userName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#0F6102',
    marginTop: 10,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff", // Adjusted to match the prototype's background color
    marginTop: -50,
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#000", // Adjusted to match the prototype
    marginBottom: 48, // Adjusted spacing to match the prototype
    alignSelf: "flex-start", // Align to the left
  },
  button: {
    backgroundColor: "#0A4FA0", // Button background color
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 10, // Rounded corners
    marginBottom: 16, // Space between buttons
    width: "100%", // Full width
    elevation: 2, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  footer: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2e97de", // Color adjusted to match the prototype
    position: "absolute", // Positioned at the bottom
    bottom: 20,
    alignSelf: "center", // Center horizontally
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

export default MenuScreen;
