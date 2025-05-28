// screens/Onboarding.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  // Button, // Button component is not used, TouchableOpacity is.
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';

// Accept onFinish as a prop
export default function Onboarding({ onFinish }) { // <--- MODIFICATION: Accept onFinish
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');

  // Regex for first name: only letters. Consider if spaces or hyphens are needed.
  const isFirstNameValid = /^[A-Za-z]+$/.test(firstName.trim());
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isFormValid = isFirstNameValid && isEmailValid;

  const handleNextPress = () => {
    if (isFormValid && onFinish) { // <--- MODIFICATION: Check if onFinish exists
      onFinish(); // <--- MODIFICATION: Call onFinish
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with text and logo */}
      <View style={styles.header}>
        <Text style={styles.title}>Little Lemon</Text>
        <Image
          source={require('../assets/snack-icon.png')} // Update if needed, ensure path is correct
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* First Name Input */}
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
        autoCapitalize="words"
      />
      {!isFirstNameValid && firstName.length > 0 && (
        <Text style={styles.errorText}>Enter a valid first name (letters only)</Text>
      )}

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="Email Address"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {!isEmailValid && email.length > 0 && (
        <Text style={styles.errorText}>Enter a valid email address</Text>
      )}

      {/* Next Button */}
      <TouchableOpacity
        style={[styles.button, !isFormValid && styles.buttonDisabled]}
        disabled={!isFormValid}
        onPress={handleNextPress} // <--- MODIFICATION: Call the handler
      >
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

// Styles (remain the same)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
    justifyContent: 'center', // This will center content vertically
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
    // If justifyContent: 'center' is on container, header might not need to be at the absolute top
    // Consider removing justifyContent from container or adding specific layout for header if it should be at top
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  logo: {
    width: 50,
    height: 50,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#f9f9f9', // Slightly different background for inputs
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    fontSize: 12,
  },
  button: {
    backgroundColor: '#4CAF50', // A common green for actions
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: '#a5d6a7', // Lighter green when disabled
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});