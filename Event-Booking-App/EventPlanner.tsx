import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Platform, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Sidebar from './Sidebar';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
}

const EventPlanner: React.FC = () => {
  
  const [events, setEvents] = useState<Event[]>([]);
  const [formData, setFormData] = useState<Omit<Event, 'id'>>({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    attendees: 0,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [viewMode, setViewMode] = useState<'all' | 'saved'>('all');

  // Load events from AsyncStorage instead of localStorage
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const storedEvents = await AsyncStorage.getItem('events');
        if (storedEvents) {
          setEvents(JSON.parse(storedEvents));
        }
      } catch (error) {
        console.error('Failed to load events:', error);
      }
    };
    
    loadEvents();
  }, []);

  // Save events to AsyncStorage instead of localStorage
  useEffect(() => {
    const saveEvents = async () => {
      try {
        await AsyncStorage.setItem('events', JSON.stringify(events));
      } catch (error) {
        console.error('Failed to save events:', error);
      }
    };
    
    saveEvents();
  }, [events]);

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: name === 'attendees' ? parseInt(value) || 0 : value,
    }));
  };
  
  const handleSubmit = () => {
    if (editingId) {
      // Update existing event
      setEvents(prev => 
        prev.map(event => 
          event.id === editingId ? { ...formData, id: editingId } : event
        )
      );
      setEditingId(null);
    } else {
      // Create new event
      const newEvent = {
        ...formData,
        id: Date.now().toString(),
      };
      setEvents(prev => [...prev, newEvent]);
    }
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      attendees: 0,
    });
  };
  
  const handleDelete = (id: string) => {
    setEvents(prev => prev.filter(event => event.id !== id));
  };

  const handleEdit = (event: Event) => {
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location,
      attendees: event.attendees,
    });
    setEditingId(event.id);
  };
  
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
          onPress: () => {
            // Implement actual logout functionality here
            Alert.alert("Logged out successfully");
            setSidebarVisible(false);
          },
          style: "destructive"
        }
      ]
    );
  };

  const handleViewSavedEvents = () => {
    setViewMode('saved');
    setSidebarVisible(false);
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const returnToAllEvents = () => {
    setViewMode('all');
  };
  
  const filteredEvents = events.filter(event => {
    // First filter by search term
    const matchesSearch = 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    // If in saved mode, assume for this example that all events are "saved"
    // In a real app, you would have some property like "isSaved" to filter by
    if (viewMode === 'saved') {
      return matchesSearch; // For now, just show all search results in saved mode too
    }
    
    return matchesSearch;
  });

  return (
    <View style={styles.container}>
      <Sidebar 
        visible={sidebarVisible} 
        onClose={() => setSidebarVisible(false)}
        onLogout={handleLogout}
        onViewSavedEvents={handleViewSavedEvents}
      />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleSidebar} style={styles.menuButton}>
          <Text style={styles.menuButtonText}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.appTitle}>Event Management Planner</Text>
        <View style={styles.headerRight} />
      </View>
      
      {viewMode === 'saved' ? (
        <View style={styles.viewModeHeader}>
          <TouchableOpacity onPress={returnToAllEvents} style={styles.backButton}>
            <Text>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.viewModeTitle}>Saved Events</Text>
        </View>
      ) : null}
      
      <ScrollView style={styles.content}>
        {viewMode === 'all' && (
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>
              {editingId ? 'Edit Event' : 'Add New Event'}
            </Text>
            
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Title</Text>
              <TextInput
                style={styles.input}
                value={formData.title}
                onChangeText={(text) => handleChange('title', text)}
                placeholder="Event title"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Location</Text>
              <TextInput
                style={styles.input}
                value={formData.location}
                onChangeText={(text) => handleChange('location', text)}
                placeholder="Event location"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Date</Text>
              <TextInput
                style={styles.input}
                value={formData.date}
                onChangeText={(text) => {
                  // Remove all non-digit characters
                  let digits = text.replace(/\D/g, '');
            
                  // Limit max length to 8 digits (YYYYMMDD)
                  if (digits.length > 8) {
                    digits = digits.slice(0, 8);
                  }
            
                  // Build formatted date with dashes as user types
                  let formatted = '';
                  if (digits.length <= 4) {
                    formatted = digits;
                  } else if (digits.length <= 6) {
                    formatted = digits.slice(0, 4) + '-' + digits.slice(4);
                  } else {
                    formatted = digits.slice(0, 4) + '-' + digits.slice(4, 6) + '-' + digits.slice(6);
                  }
            
                  handleChange('date', formatted);
                }}
                placeholder="YYYY-MM-DD"
                keyboardType="number-pad"
                maxLength={10}
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Time</Text>
              <TextInput
                style={styles.input}
                value={formData.time}
                onChangeText={(text) => handleChange('time', text)}
                placeholder="HH:MM"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Expected Attendees</Text>
              <TextInput
                style={styles.input}
                value={formData.attendees.toString()}
                onChangeText={(text) => handleChange('attendees', text)}
                placeholder="0"
                keyboardType="numeric"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.description}
                onChangeText={(text) => handleChange('description', text)}
                placeholder="Event description"
                multiline
              />
            </View>
            
            <View style={styles.buttonRow}>
              {editingId && (
                <TouchableOpacity
                  style={[styles.button, styles.secondaryButton]}
                  onPress={() => {
                    setEditingId(null);
                    setFormData({
                      title: '',
                      description: '',
                      date: '',
                      time: '',
                      location: '',
                      attendees: 0,
                    });
                  }}
                >
                  <Text style={styles.secondaryButtonText}>Cancel</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[styles.button, styles.primaryButton]}
                onPress={handleSubmit}
              >
                <Text style={styles.primaryButtonText}>{editingId ? 'Update Event' : 'Add Event'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search events..."
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>
        
        {/* Events List */}
        <View style={styles.eventsList}>
          {filteredEvents.length === 0 ? (
            <View style={styles.noEvents}>
              <Text style={styles.noEventsText}>
                {viewMode === 'saved' 
                  ? 'No saved events found.' 
                  : 'No events found. Add your first event above!'}
              </Text>
            </View>
          ) : (
            filteredEvents.map(event => (
              <View key={event.id} style={styles.eventCard}>
                <View style={styles.eventHeader}>
                  <View>
                    <Text style={styles.eventTitle}>{event.title}</Text>
                    <Text style={styles.eventDescription}>{event.description}</Text>
                  </View>
                  <View style={styles.eventActions}>
                    <TouchableOpacity 
                      onPress={() => handleEdit(event)}
                      style={styles.iconButton}
                    >
                      <Text>✏️</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      onPress={() => handleDelete(event.id)}
                      style={styles.iconButton}
                    >
                      <Text>🗑️</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                
                <View style={styles.eventDetails}>
                  <View style={styles.eventDetail}>
                    <Text style={styles.eventIcon}>📅</Text>
                    <Text>{event.date}</Text>
                  </View>
                  <View style={styles.eventDetail}>
                    <Text style={styles.eventIcon}>🕒</Text>
                    <Text>{event.time}</Text>
                  </View>
                  <View style={styles.eventDetail}>
                    <Text style={styles.eventIcon}>📍</Text>
                    <Text>{event.location}</Text>
                  </View>
                </View>
                
                <View style={styles.eventAttendees}>
                  <Text style={styles.eventIcon}>👥</Text>
                  <Text>{event.attendees} expected attendees</Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: 'white',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  menuButton: {
    padding: 5,
    width: 40,
  },
  menuButtonText: {
    fontSize: 24,
  },
  headerRight: {
    width: 40,
  },
  appTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  viewModeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f0f4f8',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    marginRight: 10,
    padding: 5,
  },
  viewModeTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 12,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 10,
    fontSize: 16,
  },
  textArea: {
    minHeight: 80,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  primaryButton: {
    backgroundColor: '#3b82f6',
  },
  primaryButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#e5e7eb',
    marginRight: 10,
  },
  secondaryButtonText: {
    color: '#374151',
    fontWeight: '600',
  },
  iconButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 20,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    padding: 10,
    fontSize: 16,
  },
  eventsList: {
    gap: 12,
  },
  eventCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  eventDescription: {
    fontSize: 14,
    color: '#666',
  },
  eventActions: {
    flexDirection: 'row',
    gap: 8,
  },
  eventDetails: {
    marginTop: 12,
    marginBottom: 8,
  },
  eventDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  eventIcon: {
    marginRight: 8,
  },
  eventAttendees: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  noEvents: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
  },
  noEventsText: {
    color: '#6b7280',
    textAlign: 'center',
  },
});

export default EventPlanner;