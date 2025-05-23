import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  AdminLogin: undefined;
  UserLogin: undefined;
};

type EventBookingScreenProps = {
  navigation: StackNavigationProp<RootStackParamList>;
};

const EventBookingScreen = ({ navigation }: EventBookingScreenProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Event Booking</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('AdminLogin')}
      >
        <Text style={styles.buttonText}>Admin Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('UserLogin')}
      >
        <Text style={styles.buttonText}>User Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EventBookingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF9E3', // Soft background to complement sunny yellow
    padding: 20,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 42,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 60,
    color: '#B8860B', // Deep yellow-gold for contrast
  },
  button: {
    backgroundColor: '#F7DC6F', // Sunny Yellow
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginVertical: 12,
    width: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  buttonText: {
    color: '#333',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});
