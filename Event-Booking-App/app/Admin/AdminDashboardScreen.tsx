import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import CreateEventScreen from '../Admin/CreateEventScreen';
import EventListScreen from '../Admin/EventListScreen';

const AdminDashboardScreen = () => {
  const [activeTab, setActiveTab] = useState<'create' | 'list'>('create');

  return (
    <View style={styles.container}>
      {/* Tab Buttons */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          onPress={() => setActiveTab('create')}
          style={[
            styles.tabButton,
            activeTab === 'create' ? styles.activeTab : styles.inactiveTab,
          ]}
        >
          <Text style={styles.tabButtonText}>Create Event</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('list')}
          style={[
            styles.tabButton,
            activeTab === 'list' ? styles.activeTab : styles.inactiveTab,
          ]}
        >
          <Text style={styles.tabButtonText}>View Events</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {activeTab === 'create' ? <CreateEventScreen /> : <EventListScreen />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 9999, 
  },
  activeTab: {
    backgroundColor: '#3b82f6', 
  },
  inactiveTab: {
    backgroundColor: '#d1d5db',
  },
  tabButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
});

export default AdminDashboardScreen;