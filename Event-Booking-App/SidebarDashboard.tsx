import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SidebarDashboardProps {
  activeScreen: string;
  onNavigate: (screen: string) => void;
  onLogout: () => void;
}

const SidebarDashboard: React.FC<SidebarDashboardProps> = ({ 
  activeScreen, 
  onNavigate,
  onLogout
}) => {
  const menuItems = [
    { id: 'events', title: 'My Events', icon: 'calendar' },
    { id: 'allEvents', title: 'All Events', icon: 'list' },
    { id: 'createEvent', title: 'Create Event', icon: 'add-circle' },
    { id: 'settings', title: 'Settings', icon: 'settings' },
  ];

  return (
    <View style={styles.sidebar}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>Event Planner</Text>
      </View>
      
      <ScrollView style={styles.menuContainer}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.menuItem,
              activeScreen === item.id && styles.activeMenuItem
            ]}
            onPress={() => onNavigate(item.id)}
          >
            <Ionicons 
              name={item.icon as any} 
              size={24} 
              color={activeScreen === item.id ? '#3b82f6' : '#6b7280'} 
            />
            <Text 
              style={[
                styles.menuText,
                activeScreen === item.id && styles.activeMenuText
              ]}
            >
              {item.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
        <Ionicons name="log-out" size={24} color="#f43f5e" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    width: 250,
    backgroundColor: 'white',
    borderRightWidth: 1,
    borderRightColor: '#e5e7eb',
    height: '100%',
    paddingTop: 20,
    paddingHorizontal: 10,
    flexDirection: 'column',
    justifyContent: 'space-between',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  logoContainer: {
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    marginBottom: 15,
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  menuContainer: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginVertical: 4,
    borderRadius: 8,
  },
  activeMenuItem: {
    backgroundColor: '#ebf5ff',
  },
  menuText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#6b7280',
  },
  activeMenuText: {
    fontWeight: '600',
    color: '#3b82f6',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 20,
  },
  logoutText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#f43f5e',
    fontWeight: '500',
  },
});

export default SidebarDashboard;