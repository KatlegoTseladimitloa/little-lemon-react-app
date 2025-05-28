// screens/Profile.js
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, TouchableOpacity, Switch, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

export default function Profile({ navigation, route }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [image, setImage] = useState(null);

  const [notifications, setNotifications] = useState({
    orderStatus: true,
    passwordChange: true,
    specialOffers: true,
    newsletter: true,
  });

  useEffect(() => {
    // Load stored profile data on mount
    const loadData = async () => {
      const storedProfile = await AsyncStorage.getItem('profile');
      if (storedProfile) {
        const data = JSON.parse(storedProfile);
        setFirstName(data.firstName || '');
        setLastName(data.lastName || '');
        setEmail(data.email || '');
        setPhoneNumber(data.phoneNumber || '');
        setImage(data.image || null);
        setNotifications(data.notifications || notifications);
      } else if (route.params) {
        setFirstName(route.params.firstName || '');
        setEmail(route.params.email || '');
      }
    };
    loadData();
  }, []);

  const saveProfile = async () => {
    const profileData = {
      firstName,
      lastName,
      email,
      phoneNumber,
      image,
      notifications,
    };
    await AsyncStorage.setItem('profile', JSON.stringify(profileData));
    alert('Changes saved!');
  };

  const logout = async () => {
    await AsyncStorage.clear();
    navigation.reset({ index: 0, routes: [{ name: 'Onboarding' }] });
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [1, 1], quality: 1 });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const renderInitials = () => {
    const initials = `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase();
    return <Text style={styles.initials}>{initials}</Text>;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Personal Information</Text>
      </View>

      {/* Avatar */}
      <View style={styles.avatarContainer}>
        {image ? <Image source={{ uri: image }} style={styles.avatar} /> : <View style={styles.avatarPlaceholder}>{renderInitials()}</View>}
        <View style={styles.avatarButtons}>
          <Button title="Change" onPress={pickImage} />
          <Button title="Remove" onPress={() => setImage(null)} color="gray" />
        </View>
      </View>

      {/* Inputs */}
      <TextInput style={styles.input} placeholder="First name" value={firstName} onChangeText={setFirstName} />
      <TextInput style={styles.input} placeholder="Last name" value={lastName} onChangeText={setLastName} />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <TextInput
        style={styles.input}
        placeholder="Phone number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />

      {/* Checkboxes (cosmetic only) */}
      <Text style={styles.subTitle}>Email notifications</Text>
      {Object.keys(notifications).map((key) => (
        <View key={key} style={styles.switchRow}>
          <Text style={styles.switchLabel}>{key.replace(/([A-Z])/g, ' $1')}</Text>
          <Switch
            value={notifications[key]}
            onValueChange={(value) => setNotifications({ ...notifications, [key]: value })}
          />
        </View>
      ))}

      {/* Actions */}
      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Log out</Text>
      </TouchableOpacity>
      <View style={styles.footer}>
        <Button title="Discard changes" onPress={() => navigation.goBack()} color="gray" />
        <Button title="Save changes" onPress={saveProfile} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontSize: 36,
    color: '#fff',
    fontWeight: 'bold',
  },
  avatarButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 6,
  },
  subTitle: {
    fontSize: 18,
    marginVertical: 10,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  switchLabel: {
    fontSize: 16,
    textTransform: 'capitalize',
  },
  logoutButton: {
    backgroundColor: '#FFD700',
    padding: 15,
    borderRadius: 6,
    marginTop: 20,
    alignItems: 'center',
  },
  logoutText: {
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});
