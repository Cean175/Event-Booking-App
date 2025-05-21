import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';

interface SidebarProps {
  visible: boolean;
  onClose: () => void;
  onLogout: () => void;
  onViewSavedEvents: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ visible, onClose, onLogout, onViewSavedEvents }) => {
  const screenWidth = Dimensions.get('window').width;
  const translateX = React.useRef(new Animated.Value(-screenWidth)).current;

  React.useEffect(() => {
    Animated.timing(translateX, {
      toValue: visible ? 0 : -screenWidth,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible, screenWidth]);

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.overlay} onPress={onClose} />
      <Animated.View style={[styles.sidebar, { transform: [{ translateX }] }]}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Menu</Text>
        </View>
        
        <TouchableOpacity style={styles.menuItem} onPress={onViewSavedEvents}>
          <Text style={styles.menuItemText}>View Saved Events</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem} onPress={onLogout}>
          <Text style={styles.menuItemText}>Logout</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: '70%',
    backgroundColor: 'white',
    paddingTop: 50,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginBottom: 16,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  menuItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemText: {
    fontSize: 16,
  },
});

export default Sidebar;