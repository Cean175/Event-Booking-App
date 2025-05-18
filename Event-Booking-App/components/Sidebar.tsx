import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';

interface SidebarProps {
  visible: boolean;
  onClose: () => void;
  onLogout: () => void;
  onViewSavedEvents: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ visible, onClose, onLogout, onViewSavedEvents }) => {
  if (!visible) return null;

  return (
    <SafeAreaView style={styles.overlay}>
      <TouchableOpacity style={styles.closeArea} onPress={onClose} />
      <View style={styles.sidebar}>
        <View style={styles.menuHeader}>
          <Text style={styles.menuTitle}>Event Planner</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.menuItems}>
          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={onViewSavedEvents}
          >
        
            <Text style={styles.menuItemText}>View Saved Events</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.menuItem, styles.logoutItem]} 
            onPress={onLogout}
          >
           
            <Text style={styles.menuItemText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const screenWidth = Dimensions.get('window').width;
const sidebarWidth = screenWidth * 0.75;

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    flexDirection: 'row',
  },
  closeArea: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sidebar: {
    width: sidebarWidth,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 16,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#555',
  },
  menuItems: {
    flex: 1,
    paddingTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemIcon: {
    fontSize: 20,
    marginRight: 16,
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
  },
  logoutItem: {
    marginTop: 'auto',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#f9f9f9',
  },
});

export default Sidebar;