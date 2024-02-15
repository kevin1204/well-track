import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Image,
  Alert,
  TouchableOpacity,
  Text,
  ScrollView,
  TextInput,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import * as SQLite from "expo-sqlite";
import { StatusBar } from "expo-status-bar";

const db = SQLite.openDatabase("myFoodLog.db");

export default function App() {
  const [quote, setQuote] = useState("");
  const [image, setImage] = useState(null);
  const [foodLogs, setFoodLogs] = useState([]);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS food (id INTEGER PRIMARY KEY AUTOINCREMENT, quote TEXT, imageUri TEXT);",
        [],
        () => console.log("Table created successfully"),
        (t, error) => console.log("Error while creating table", error)
      );
    });
    loadData();
  }, []);

  useEffect(() => {
    (async () => {
      const mediaLibraryStatus =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
      if (
        mediaLibraryStatus.status !== "granted" ||
        cameraStatus.status !== "granted"
      ) {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    })();
  }, []);

  const loadData = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM food ORDER BY id DESC;",
        [],
        (_, { rows }) => {
          setFoodLogs(rows._array);
        },
        (t, error) => console.log("Error while fetching food logs", error)
      );
    });
  };

  const handleSave = async () => {
    if (image && quote) {
      const fileName = image.split("/").pop();
      const newPath = FileSystem.documentDirectory + fileName;

      try {
        await FileSystem.moveAsync({
          from: image,
          to: newPath,
        });

        db.transaction((tx) => {
          tx.executeSql(
            "INSERT INTO food (quote, imageUri) values (?, ?);",
            [quote, newPath],
            () => {
              console.log("Entry saved successfully");
              loadData(); // Reload the data
              setImage(null); // Clear the image
              setQuote(""); // Clear the quote
            },
            (t, error) => console.log("Error while inserting Entry", error)
          );
        });
      } catch (e) {
        console.error(e);
        Alert.alert("Error", "Failed to save the Entry.");
      }
    } else {
      Alert.alert("Error", "Please select an image and enter a quote.");
    }
  };

  //clear foodlog function
  const clearFoodLogs = () => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "DELETE FROM food;",
          [],
          (_, result) =>
            console.log("All entries deleted successfully", result),
          (_, error) => console.log("Error while deleting entries", error)
        );
      },
      (error) => console.log("Transaction error while deleting entries", error),
      () => console.log("Transaction successful, all entries deleted")
    );
  };

  const showImagePickerOptions = () => {
    Alert.alert(
      "Upload Photo",
      "Choose an option",
      [
        { text: "Take a Picture", onPress: takePhotoFromCamera },
        { text: "Choose from Gallery", onPress: pickImageFromGallery },
        { text: "Cancel", style: "cancel" },
      ],
      { cancelable: true }
    );
  };

  const takePhotoFromCamera = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setImage(asset.uri);
      setQuote("");
    }
  };

  const pickImageFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.cancelled) {
      const asset = result.assets[0];
      setImage(asset.uri);
      setQuote("");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Text style={styles.title}>Keep Track of Your Health!</Text>
      <ScrollView style={styles.scrollView}>
      {foodLogs.map((log, index) => (
        <View key={log.id}>
          <View style={styles.foodLogEntry}>
            <Image source={{ uri: log.imageUri }} style={styles.foodImage} />
            <Text style={styles.foodQuote}>{log.quote}</Text>
          </View>
          {index < foodLogs.length - 1 && <View style={styles.separator}></View>}
        </View>
      ))}
    </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={setQuote}
          value={quote}
          placeholder="Add your quote/caption here..."
          placeholderTextColor="#666"
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.addButton} onPress={showImagePickerOptions}>
          <Text style={styles.addButtonText}>
            {image ? "Change Image" : "+ Add Image"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.clearButton} onPress={clearFoodLogs}>
        <Text style={styles.clearButtonText}>Clear Food Log</Text>
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
    backgroundColor: "#fff",
    justifyContent: 'flex-end', // Aligns children to the bottom
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 30,
    color: "#000",
  },
  scrollView: {
    marginBottom: 10,
  },
  foodLogEntry: {
    flexDirection: 'column', // Stack items vertically
    marginBottom: 10,
    alignItems: 'center', // Center items horizontally
  },
  foodImage: {
    width: "90%",
    height: 200,
    borderRadius: 10,
  },
  foodQuote: {
    textAlign: 'center',
    color: '#333',
    fontSize: 14,
    marginTop: 5, // Adjust the spacing as needed
  },
  input: {
    borderColor: "#333",
    borderWidth: 1,
    padding: 10,
    marginHorizontal: 20,
    marginVertical: 20,
    fontSize: 16,
    color: "#333",
    alignSelf: 'center',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row', // Positions button next to each other
    justifyContent: 'space-evenly', // Evenly distributes buttons horizontally
    alignItems: 'center', // Centers buttons vertically
    paddingBottom: 20, // Spacing from the bottom
  },
  addButton: {
    backgroundColor: "#0A4FA0",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginVertical: 10,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: "#0A4FA0",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginVertical: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: 'center',
  },
  clearButton: {
    backgroundColor: "#f44336", // Example style
    // paddingVertical: 10,
    // paddingHorizontal: 5,
    // borderRadius: 10,
    // marginVertical: 10,
    // alignSelf: 'center', // Center button horizontally
  },
  // clearButtonText: {
  //   color: "#fff",
  //   fontSize: 16,
  //   fontWeight: "bold",
  //   textAlign: 'center',
  // },
  brandText: {
    alignSelf: 'center',
    position: 'absolute',
    bottom: 10, // Adjust bottom spacing to ensure it is not overlapped by other elements
  },
  well: {
    fontSize: 28,
    fontFamily: 'IndieFlower',
    fontWeight: '400',
    color: '#0F6102',
  },
  track: {
    fontSize: 28,
    fontFamily: 'IrishGrover',
    fontWeight: '400',
    color: '#1C6CB6',
  },
  separator: {
    height: 1,
    backgroundColor: '#ddd', // Or any color of your choice
    width: '100%',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2, // for Android
    marginTop: 10,
    marginBottom: 10,
  },
});
