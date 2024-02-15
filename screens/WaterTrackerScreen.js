import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});


function WaterTrackerScreen({ navigation }) {
  const [intake, setIntake] = useState(0);
  const [target, setTarget] = useState(8); // Default target
  const [nextReminder, setNextReminder] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (nextReminder) {
        setNextReminder(prev => prev > 0 ? prev - 1 : 0);
      }
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [nextReminder]);

  async function scheduleNotification() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Stay Hydrated!",
        body: 'Time to drink water! :D',
      },
      trigger: { seconds: 1 },
    });

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Stay Hydrated!",
        body: "Don't forget to drink water!",
      },
      trigger: {
        seconds: 3600,
        repeats: true,
      },
    });

    setNextReminder(60); // Set next reminder for 60 minutes
    Alert.alert("Great!", "You will be notified to drink water and stay hydrated every hour!");
  }

  const increaseIntake = () => {
    const newIntake = intake + 1;
    if (newIntake <= target) {
      setIntake(newIntake);
      if (newIntake === target) {
        Alert.alert("Congratulations!", "You have reached your daily water intake goal!");
      }
    }
  };

  const renderNextReminder = () => {
    if (nextReminder) {
      return `You will be reminded in ${nextReminder} minutes`;
    }
    return "We will remind you to stay hydrated!";
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Water Intake</Text>
      <Text style={styles.subtitle}>Stay hydrated for a healthier you!</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={scheduleNotification}
      >
        <Text style={styles.buttonText}>Remind Me</Text>
      </TouchableOpacity>

      <View style={styles.intakeContainer}>
        <TouchableOpacity
          style={styles.changeIntakeButton}
          onPress={() => setIntake(Math.max(0, intake - 1))}
        >
          <Text style={styles.changeIntakeButtonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.intakeText}>
          {intake}/{target} glasses
        </Text>
        <TouchableOpacity
          style={styles.changeIntakeButton}
          onPress={increaseIntake}
        >
          <Text style={styles.changeIntakeButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.reminderText}>
      {renderNextReminder()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 18,
    color: "#6B7280",
    marginBottom: 32,
  },
  button: {
    backgroundColor: "#0A4FA0",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 24,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  intakeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 32,
  },
  changeIntakeButton: {
    width: 64,
    height: 64,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E5E7EB",
    borderRadius: 16,
  },
  changeIntakeButtonText: {
    fontSize: 24,
    color: "#000",
    fontWeight: "bold",
  },
  intakeText: {
    fontSize: 24,
    color: "#000",
    marginHorizontal: 16,
  },
  reminderText: {
    fontSize: 16,
    color: "#4B5563",
    marginTop: 20,
  },
});

export default WaterTrackerScreen;
