import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, View, Text } from 'react-native'; // Added StyleSheet, View, Text for clarity if needed elsewhere, though not directly in App.js main return now

// Import your screens
import OnboardingScreen from './screens/Onboarding'; // Ensure this path and name is correct
import ProfileScreen from './screens/Profile';     // Ensure this path and name is correct
import SplashScreen from './screens/SplashScreen'; // Ensure this path is correct
import Home from './screens/Home'

const Stack = createNativeStackNavigator();
const ASYNC_STORAGE_ONBOARDING_KEY = '@app_onboarding_completed';

export default function App() {
  // State to manage loading status from AsyncStorage
  const [isLoading, setIsLoading] = useState(true);
  // State to manage whether onboarding has been completed
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(false);

  useEffect(() => {
    // Function to check the onboarding status from AsyncStorage
    const checkOnboardingStatus = async () => {
      try {
        // Attempt to read the onboarding completion flag from AsyncStorage
        const value = await AsyncStorage.getItem(ASYNC_STORAGE_ONBOARDING_KEY);
        if (value !== null) {
          // If a value exists, parse it and update the state
          // It's good practice to store booleans as strings ('true'/'false') or use JSON.stringify/parse
          setIsOnboardingCompleted(JSON.parse(value));
        }
      } catch (e) {
        // Log an error if reading from AsyncStorage fails
        console.error('Failed to load onboarding status from AsyncStorage.', e);
      } finally {
        // Regardless of success or failure, set loading to false
        // A small delay can be added here if you want the splash screen to be visible for a minimum duration
        // setTimeout(() => setIsLoading(false), 1000); // Example: 1-second minimum splash
        setIsLoading(false); // Hide Splash Screen
      }
    };

    checkOnboardingStatus();
  }, []); // The empty dependency array ensures this effect runs only once on mount

  // Function to handle the completion of the onboarding process
  const handleOnboardingFinish = async () => {
    try {
      // Persist the onboarding completion flag in AsyncStorage
      await AsyncStorage.setItem(ASYNC_STORAGE_ONBOARDING_KEY, JSON.stringify(true));
      // Update the React local state to reflect onboarding completion
      setIsOnboardingCompleted(true);
    } catch (e) {
      // Log an error if saving to AsyncStorage fails
      console.error('Failed to save onboarding status to AsyncStorage.', e);
    }
  };

  // If isLoading is true, display the SplashScreen
  if (isLoading) {
    return <SplashScreen />;
  }

  // Once loading is complete, render the main navigation structure
  return (
    <NavigationContainer>
  <Stack.Navigator>
    {isOnboardingCompleted ? (
      // If onboarding completed, go to Home screen
      <Stack.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />
    ) : (
      // Show onboarding screen if not completed
      <Stack.Screen name="Onboarding" options={{ headerShown: false }}>
        {(props) => (
          <OnboardingScreen
            {...props}
            onFinish={handleOnboardingFinish}
          />
        )}
      </Stack.Screen>
    )}
    
    {/* Still include Profile screen so it can be navigated to from Home */}
    <Stack.Screen
      name="Profile"
      component={ProfileScreen}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
</NavigationContainer>

    // The problematic SafeAreaView and its content that was here has been removed.
    // Each screen (Profile, Onboarding) should manage its own SafeAreaView if needed.
  );
}

// Styles (can be removed if not used in App.js, or kept for potential future use)
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     backgroundColor: '#ecf0f1',
//     padding: 8,
//   },
//   paragraph: {
//     margin: 24,
//     fontSize: 18,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
// });
