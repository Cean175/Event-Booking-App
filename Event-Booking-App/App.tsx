import React from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import StackNavigator from './app/navigation/StackNavigator';
import { EventProvider } from './app/context/EventContext';
import 'react-native-get-random-values';

function App() {
  return (
    <EventProvider> 
      <SafeAreaProvider>
        <NavigationContainer>
          
          <StatusBar 
            translucent 
            backgroundColor="transparent" 
            barStyle="dark-content" 
          />
         
          <StackNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </EventProvider>
  );
}

export default App;
