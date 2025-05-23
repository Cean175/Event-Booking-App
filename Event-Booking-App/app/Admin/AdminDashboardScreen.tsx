import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Animated, 
  Dimensions,
  Alert
} from 'react-native';
import CreateEventScreen from '../Admin/CreateEventScreen';
import EventListScreen from '../Admin/EventListScreen';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/StackNavigator';
const AdminDashboardScreen = () => {
  const [activeTab, setActiveTab] = useState<'create' | 'list'>('create');
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const screenWidth = Dimensions.get('window').width;
  const translateX = React.useRef(new Animated.Value(-screenWidth)).current;

  React.useEffect(() => {
    Animated.timing(translateX, {
      toValue: sidebarVisible ? 0 : -screenWidth,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [sidebarVisible, screenWidth]);

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Logout", 
          style: "destructive",
          onPress: () => {
            setSidebarVisible(false);
            navigation.navigate('EventBooking');
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Sidebar Overlay */}
      {sidebarVisible && (
        <TouchableOpacity 
          style={styles.overlay}
          onPress={() => setSidebarVisible(false)}
          activeOpacity={1}
        />
      )}

      {/* Sidebar */}
      <Animated.View style={[styles.sidebar, { transform: [{ translateX }] }]}>
        <View style={styles.sidebarHeader}>
          <Text style={styles.sidebarTitle}>Admin Dashboard</Text>
        </View>

        <TouchableOpacity
          onPress={() => {
            setActiveTab('create');
            setSidebarVisible(false);
          }}
          style={[
            styles.sidebarButton,
            activeTab === 'create' && styles.activeSidebarButton
          ]}
        >
          <Text style={styles.sidebarButtonText}>Create Event</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setActiveTab('list');
            setSidebarVisible(false);
          }}
          style={[
            styles.sidebarButton,
            activeTab === 'list' && styles.activeSidebarButton
          ]}
        >
          <Text style={styles.sidebarButtonText}>View Events</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleLogout}
          style={styles.logoutButton}
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        {/* Menu Button */}
        <TouchableOpacity 
          onPress={() => setSidebarVisible(true)}
          style={styles.menuButton}
        >
          <Text style={styles.menuButtonText}>☰</Text>
        </TouchableOpacity>

        {/* Content */}
        <View style={styles.content}>
          {activeTab === 'create' ? <CreateEventScreen /> : <EventListScreen />}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9E3',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 1,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: '70%',
    backgroundColor: '#fff4cb',
    paddingTop: 50,
    zIndex: 2,
  },
  sidebarHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5C15E',
    marginBottom: 20,
  },
  sidebarTitle: {
    color: '#333333', 
    fontSize: 20,
    fontWeight: 'bold',
  },
  sidebarButton: {
    padding: 15,
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
  },
  activeSidebarButton: {
    backgroundColor: '#E76F51',
  },
  sidebarButtonText: {
    color: '#333333',
    fontSize: 16,
  },
  logoutButton: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: '#E76F51',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  mainContent: {
    flex: 1,
    zIndex: 0,
  },
  menuButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1,
    padding: 10,
  },
  menuButtonText: {
    fontSize: 24,
    color: '#B8860B',
  },
  content: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 16,
  },
});


export default AdminDashboardScreen;