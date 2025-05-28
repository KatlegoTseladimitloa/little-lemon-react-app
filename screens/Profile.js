import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, Button, TouchableOpacity, StyleSheet, Switch, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { MaskedTextInput } from 'react-native-mask-text';

const defaultAvatar = null; // Use null initially to fallback to initials

const ProfileScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState(defaultAvatar);

  const [notifications, setNotifications] = useState({
    orderStatus: false,
    passwordChanges: false,
    specialOffers: false,
    newsletter: false,
  });

  const storageKey = '@user_profile_data';

  useEffect(() => {
    const loadProfile = async () => {
      const saved = await AsyncStorage.getItem(storageKey);
      if (saved) {
        const data = JSON.parse(saved);
        setFirstName(data.firstName || '');
        setLastName(data.lastName || '');
        setEmail(data.email || '');
        setPhone(data.phone || '');
        setAvatar(data.avatar || defaultAvatar);
        setNotifications(data.notifications || {});
      }
    };

    loadProfile();
  }, []);

  const saveProfile = async () => {
    const data = {
      firstName,
      lastName,
      email,
      phone,
      avatar,
      notifications,
    };
    await AsyncStorage.setItem(storageKey, JSON.stringify(data));
    Alert.alert('Success', 'Profile saved!');
  };

  const logout = async () => {
    await AsyncStorage.clear();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Onboarding' }],
    });
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setAvatar(result.assets[0].uri);
    }
  };

  const renderInitials = () => {
    const initials = `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
    return (
      <View style={styles.initialsContainer}>
        <Text style={styles.initialsText}>{initials}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Personal information</Text>

      <View style={styles.avatarContainer}>
        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.avatar} />
        ) : (
          renderInitials()
        )}
        <Button title="Change" onPress={pickImage} />
        <Button title="Remove" onPress={() => setAvatar(null)} />
      </View>

      <TextInput
        style={styles.input}
        placeholder="First name"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Last name"
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <MaskedTextInput
        mask="(999) 999-9999"
        style={styles.input}
        placeholder="Phone number"
        value={phone}
        onChangeText={(text, rawText) => setPhone(rawText)}
        keyboardType="numeric"
      />

      <Text style={styles.subheading}>Email notifications</Text>
      {Object.entries(notifications).map(([key, value]) => (
        <View style={styles.switchContainer} key={key}>
          <Text style={styles.switchLabel}>
            {key
              .replace(/([A-Z])/g, ' $1')
              .replace(/^./, (str) => str.toUpperCase())}
          </Text>
          <Switch
            value={value}
            onValueChange={(newValue) =>
              setNotifications((prev) => ({ ...prev, [key]: newValue }))
            }
          />
        </View>
      ))}

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Log out</Text>
      </TouchableOpacity>

      <View style={styles.actions}>
        <Button title="Save changes" onPress={saveProfile} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  heading: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  avatarContainer: { alignItems: 'center', marginBottom: 20 },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
  initialsContainer: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: '#ccc', justifyContent: 'center', alignItems: 'center',
    marginBottom: 10
  },
  initialsText: { fontSize: 36, fontWeight: 'bold', color: '#333' },
  input: {
    borderWidth: 1, borderColor: '#ccc', padding: 10,
    marginBottom: 10, borderRadius: 5
  },
  subheading: { fontSize: 16, fontWeight: 'bold', marginVertical: 10 },
  switchContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  switchLabel: { fontSize: 14 },
  actions: { marginTop: 20 },
  logoutButton: {
    backgroundColor: '#f4ce14', padding: 12,
    borderRadius: 5, alignItems: 'center', marginTop: 20
  },
  logoutText: { color: '#333', fontWeight: 'bold' },
});

export default ProfileScreen;
