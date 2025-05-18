import React from 'react';
import { SafeAreaView, StatusBar, Platform, StyleSheet } from 'react-native';
import EventPlanner from './screens/EventPlanner';

function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="#f3f4f6"
      />
      <EventPlanner />
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