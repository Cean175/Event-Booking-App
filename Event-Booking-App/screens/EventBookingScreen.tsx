import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const EventBookingScreen = ({ navigation }) => {
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
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontFamily: 'Arial',
    fontSize: 45,
    fontWeight: 'bold',
    height : 400,
    textAlign: 'center',
    marginBottom: 40,
    color: '#333',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginVertical: 10,
    width: '80%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
});
