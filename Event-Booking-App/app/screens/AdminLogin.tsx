import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  AdminDashboard: undefined;
};

type AdminLoginProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'AdminDashboard'>;
};

const AdminLogin = ({ navigation }: AdminLoginProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (username === 'admin' && password === 'admin123') {
      navigation.navigate('AdminDashboard');
    } else {
      Alert.alert('Login Failed', 'Invalid admin credentials.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        placeholderTextColor="#999"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#999"
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AdminLogin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9E3', // Sunny background
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 32,
    color: '#B8860B', // Warm gold
    marginBottom: 40,
  },
  input: {
    fontFamily: 'Nunito_400Regular',
    width: '100%',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    fontSize: 16,
    borderColor: '#E5C15E', // Subtle yellow border
    borderWidth: 1,
  },
  button: {
    backgroundColor: '#F7DC6F', // Main sunny yellow
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 30,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    fontFamily: 'Nunito_600SemiBold',
    color: '#333',
    fontSize: 18,
    textAlign: 'center',
  },
});
