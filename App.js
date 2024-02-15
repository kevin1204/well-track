// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SignupScreen from './screens/SignupScreen'; // Path to your SignupScreen file
import LoginScreen from './screens/LoginScreen'; // Path to your LoginScreen file
import MenuScreen from './screens/MenuScreen'; // Path to your MenuScreen file
import WaterTrackerScreen from './screens/WaterTrackerScreen'; // Path to your WaterTrackerScreen file
import ActivityTrackerScreen from './screens/ActivityTrackerScreen';
import RelaxationScreen from './screens/RelaxationScreen';
import FoodLogScreen from './screens/FoodLogScreen';
import { initializeApp } from 'firebase/app';
import { db, firestore, auth } from './firebaseConfig';
import {User, onAuthStateChanged} from 'firebase/auth';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginScreen">
        <Stack.Screen 
          name="SignupScreen" 
          component={SignupScreen} 
          options={{ title: 'Sign Up' }} 
        />
        <Stack.Screen 
          name="LoginScreen" 
          component={LoginScreen} 
          options={{ title: 'Log In' }} 
        />
        <Stack.Screen 
          name="MenuScreen" 
          component={MenuScreen} 
          options={{ title: 'Menu' }} 
        />
        <Stack.Screen 
          name="WaterTrackerScreen" 
          component={WaterTrackerScreen} 
          options={{ title: 'Water Tracker' }} 
        />
        <Stack.Screen 
          name="ActivityTrackerScreen" 
          component={ActivityTrackerScreen} 
          options={{ title: 'Activity Tracker' }} 
        />
        <Stack.Screen 
          name="RelaxationScreen" 
          component={RelaxationScreen} 
          options={{ title: 'Relaxation Screen' }} 
        />
        <Stack.Screen
          name="FoodLogScreen"
          component={FoodLogScreen}
          options={{ title: 'Food Log' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
