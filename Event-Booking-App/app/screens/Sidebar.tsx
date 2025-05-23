import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Animated, 
  Dimensions,
  Alert 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  EventBooking: undefined;
  // Add other screen types if needed
};

interface SidebarProps {
  visible: boolean;
  onClose: () => void;
  onViewSavedEvents: () => void;
  onViewRegisteredEvents: () => void;
  onViewAllEvents: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  visible, 
  onClose, 
  onViewSavedEvents,
  onViewRegisteredEvents,
  onViewAllEvents
}) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const screenWidth = Dimensions.get('window').width;
  const translateX = React.useRef(new Animated.Value(-screenWidth)).current;

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => console.log("Logout canceled")
        },
        { 
          text: "Logout", 
          style: "destructive",
          onPress: () => {
            onClose();
            navigation.navigate('EventBooking');
          }
        }
      ]
    );
  };

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
      <TouchableOpacity 
        style={styles.overlay} 
        onPress={onClose} 
        activeOpacity={1}
      />
      <Animated.View style={[styles.sidebar, { transform: [{ translateX }] }]}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Menu</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.menuItem} 
          onPress={() => {
            onViewAllEvents();
            onClose();
          }}
        >
          <Text style={styles.menuItemText}>All Events</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.menuItem} 
          onPress={() => {
            onViewSavedEvents();
            onClose();
          }}
        >
          <Text style={styles.menuItemText}>Saved Events</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.menuItem} 
          onPress={() => {  
            onViewRegisteredEvents();
            onClose();
          }}
        >
          <Text style={styles.menuItemText}>Registered Events</Text>
        </TouchableOpacity>
        
        <View style={styles.spacer} />
        
        <TouchableOpacity 
          style={styles.logoutItem} 
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>Logout</Text>
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
    paddingTop: 20,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginBottom: 8,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  menuItem: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f0f0f0',
  },
  menuItemText: {
    fontSize: 16,
    color: '#444',
  },
  spacer: {
    flex: 1,
  },
  logoutItem: {
    padding: 16,
    margin: 16,
    borderRadius: 8,
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d32f2f',
  },
  logoutText: {
    fontSize: 16,
    color: '#d32f2f',
    fontWeight: '600',
  },
});

export default Sidebar;