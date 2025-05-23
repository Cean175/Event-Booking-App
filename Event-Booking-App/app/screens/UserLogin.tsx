import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  EventPlanner: undefined;
};

type UserLoginProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'EventPlanner'>;
};

const UserLogin = ({ navigation }: UserLoginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (email === 'user' && password === 'user123') {
      navigation.navigate('EventPlanner');
    } else {
      Alert.alert('Login Failed', 'Invalid user credentials.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
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

export default UserLogin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9E3', // Light sunny background
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 32,
    color: '#B8860B',
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
    borderColor: '#E5C15E',
    borderWidth: 1,
  },
  button: {
    backgroundColor: '#F7DC6F',
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
