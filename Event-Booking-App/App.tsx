import React from 'react';
import { SafeAreaView, StatusBar, Platform, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import StackNavigator from './app/navigation/StackNavigator';
import { EventProvider } from './app/context/EventContext';  // <-- import EventProvider
import 'react-native-get-random-values';

function App() {
  return (
    <EventProvider> {/* Wrap entire app in EventProvider */}
      <SafeAreaProvider>
        <NavigationContainer>
          <SafeAreaView style={styles.container}>
            <StatusBar 
              barStyle="dark-content" 
              backgroundColor="#f3f4f6"
            />
            <StackNavigator />
          </SafeAreaView>
        </NavigationContainer>
      </SafeAreaProvider>
    </EventProvider>
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