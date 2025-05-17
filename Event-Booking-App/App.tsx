import React from 'react';
import { SafeAreaView, StatusBar, Platform, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import EventBookingScreen from './screens/EventBookingScreen';
import AdminLogin from './screens/AdminLogin';
import  UserLogin  from './screens/UserLogin';
import EventPlanner from './screens/EventPlanner'; // keep this

const Stack = createStackNavigator();

function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="#f3f4f6"
      />
      <NavigationContainer>
        <Stack.Navigator initialRouteName="EventBooking" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="EventBooking" component={EventBookingScreen} />
          <Stack.Screen name="AdminLogin" component={AdminLogin} />
          <Stack.Screen name="UserLogin" component={UserLogin} />
          <Stack.Screen name="EventPlanner" component={EventPlanner} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
});

export default App;
