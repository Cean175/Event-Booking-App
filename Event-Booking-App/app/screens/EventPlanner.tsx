import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  StyleSheet, Alert, TextInput, Modal
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Sidebar from './Sidebar';

interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string; // Format: YYYY-MM-DD
  startTime: string;
  endTime: string;
  duration?: string;
  createdAt?: string;
  updatedAt?: string;
  organizerId?: string;
  isBooked?: boolean;
  isFavorite?: boolean;
  attendees?: number;
  registered?: boolean;
}

const EventPlanner: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [viewMode, setViewMode] = useState<'all' | 'saved' | 'registered'>('all');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [sortMode, setSortMode] = useState<'date' | 'duration'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [sortDropdownVisible, setSortDropdownVisible] = useState(false);
  const [registeringEvent, setRegisteringEvent] = useState<Event | null>(null);
  const [emailInput, setEmailInput] = useState('');

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const storedEvents = await AsyncStorage.getItem('events');
        if (storedEvents) {
          const parsed: Event[] = JSON.parse(storedEvents);
          const withAttendees = parsed.map(ev => ({
            ...ev,
            attendees: ev.attendees || 0,
            registered: ev.registered || false
          }));
          setEvents(sortEvents(withAttendees, sortMode, sortDirection));
        }
      } catch (error) {
        console.error('Failed to load events:', error);
      }
    };

    loadEvents();
  }, [sortMode, sortDirection]);

  const sortEvents = (events: Event[], mode: 'date' | 'duration', direction: 'asc' | 'desc') => {
  return [...events].sort((a, b) => {
    let comparison = 0;
    
    if (mode === 'date') {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      // Handle invalid dates by putting them at the end
      if (isNaN(dateA)) return direction === 'asc' ? 1 : -1;
      if (isNaN(dateB)) return direction === 'asc' ? -1 : 1;
      comparison = dateA - dateB;
    } else {
      const getMinutes = (t: string) => {
        const [h, m] = t.split(':').map(Number);
        return h * 60 + m;
      };
      const durationA = getMinutes(a.endTime) - getMinutes(a.startTime);
      const durationB = getMinutes(b.endTime) - getMinutes(b.startTime);
      comparison = durationA - durationB;
    }
    
    return direction === 'asc' ? comparison : -comparison;
  });
};

  const toggleSidebar = () => setSidebarVisible(!sidebarVisible);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout", style: "destructive", onPress: () => {
          setSidebarVisible(false);
          Alert.alert("Logged out successfully");
        }
      }
    ]);
  };

  const toggleFavorite = async (id: string) => {
    const updated = events.map(ev =>
      ev.id === id ? { ...ev, isFavorite: !ev.isFavorite } : ev
    );
    setEvents(updated);
    await AsyncStorage.setItem('events', JSON.stringify(updated));
    if (selectedEvent && selectedEvent.id === id) {
    setSelectedEvent({
      ...selectedEvent,
      isFavorite: !selectedEvent.isFavorite
    });
  }
  };

  const handleSortOptionSelect = (mode: 'date' | 'duration') => {
    const newDirection = sortMode === mode ? 
      (sortDirection === 'asc' ? 'desc' : 'asc') : 'asc';
    
    setSortMode(mode);
    setSortDirection(newDirection);
    
    const sortedEvents = sortEvents([...events], mode, newDirection);
    setEvents(sortedEvents);
  
   setSortDropdownVisible(false);
   
  };

  const openEventDetails = (event: Event) => {
    setSelectedEvent(event);
  };

  const closeEventDetails = () => {
    setSelectedEvent(null);
  };

  const openRegister = (event: Event) => {
    setRegisteringEvent(event);
    setEmailInput('');
  };

  const handleRegister = async () => {
    if (!emailInput) return Alert.alert("Error", "Please enter your email.");
    const updated = events.map(ev =>
      ev.id === registeringEvent?.id
        ? { 
            ...ev, 
            attendees: (ev.attendees || 0) + 1,
            registered: true
          }
        : ev
    );
    setEvents(updated);
    await AsyncStorage.setItem('events', JSON.stringify(updated));
    Alert.alert("Success", "You are registered!");
    setRegisteringEvent(null);
    if (selectedEvent) {
      setSelectedEvent({
        ...selectedEvent,
        attendees: (selectedEvent.attendees || 0) + 1,
        registered: true
      });
    }
  };

  const handleCancelRegistration = async (eventId: string) => {
    const updated = events.map(ev =>
      ev.id === eventId
        ? { 
            ...ev, 
            attendees: Math.max((ev.attendees || 0) - 1, 0),
            registered: false
          }
        : ev
    );
    setEvents(updated);
    await AsyncStorage.setItem('events', JSON.stringify(updated));
    Alert.alert("Success", "Registration canceled!");
    if (selectedEvent?.id === eventId) {
      setSelectedEvent({
        ...selectedEvent,
        attendees: Math.max((selectedEvent.attendees || 0) - 1, 0),
        registered: false
      });
    }
  };

  const filteredEvents = viewMode === 'saved'
    ? events.filter(e => e.isFavorite)
    : viewMode === 'registered'
    ? events.filter(e => e.registered)
    : events;

  const getSortButtonText = () => {
    const modeText = sortMode === 'date' ? 'Date' : 'Duration';
    const directionText = sortDirection === 'asc' ? '↑' : '↓';
    return `Sort: ${modeText} ${directionText}`;
  };

  return (
    <View style={styles.container}>
      <Sidebar
  visible={sidebarVisible}
  onClose={() => setSidebarVisible(false)}
  onViewSavedEvents={() => { 
    setViewMode('saved'); 
    setSidebarVisible(false); 
  }}
  onViewRegisteredEvents={() => { 
    setViewMode('registered'); 
    setSidebarVisible(false); 
  }}
  onViewAllEvents={() => { 
    setViewMode('all'); 
    setSidebarVisible(false); 
  }}
/>

      <View style={styles.header}>
        <TouchableOpacity onPress={toggleSidebar} style={styles.menuButton}>
          <Text style={styles.menuButtonText}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.appTitle}>Event Management Planner</Text>
        <View style={styles.sortContainer}>
          <TouchableOpacity 
            onPress={() => setSortDropdownVisible(!sortDropdownVisible)}
            style={styles.sortButton}
          >
            <Text style={styles.sortButtonText}>{getSortButtonText()}</Text>
          </TouchableOpacity>
          {sortDropdownVisible && (
            <View style={styles.sortDropdown}>
              <TouchableOpacity 
                style={styles.sortOption}
                onPress={() => handleSortOptionSelect('date')}
              >
                <Text>Date {sortMode === 'date' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.sortOption}
                onPress={() => handleSortOptionSelect('duration')}
              >
                <Text>Duration {sortMode === 'duration' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {viewMode !== 'all' && (
        <View style={styles.viewModeHeader}>
          <TouchableOpacity onPress={() => setViewMode('all')}>
            <Text>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.viewModeTitle}>
            {viewMode === 'saved' ? 'Saved Events' : 'Registered Events'}
          </Text>
        </View>
      )}

      {selectedEvent ? (
        <View style={styles.eventDetailContainer}>
          <TouchableOpacity onPress={closeEventDetails} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          
          <ScrollView style={styles.eventDetailContent}>
            <Text style={styles.eventDetailTitle}>{selectedEvent.title}</Text>
            <Text style={styles.eventDetailText}>Date: {selectedEvent.date}</Text>
            <Text style={styles.eventDetailText}>Time: {selectedEvent.startTime} - {selectedEvent.endTime}</Text>
            {selectedEvent.attendees !== undefined && (
              <Text style={styles.eventDetailText}>Attendees: {selectedEvent.attendees}</Text>
            )}
            <Text style={styles.eventDetailText}>Description: {selectedEvent.description}</Text>
            <Text style={styles.eventDetailText}>Location: {selectedEvent.location}</Text>
            {selectedEvent.duration && (
              <Text style={styles.eventDetailText}>Duration: {selectedEvent.duration}</Text>
            )}
            {selectedEvent.isBooked !== undefined && (
              <Text style={styles.eventDetailText}>
                Status: {selectedEvent.isBooked ? 'Booked' : 'Available'}
              </Text>
            )}
            {selectedEvent.createdAt && (
              <Text style={styles.eventDetailText}>
                Created: {new Date(selectedEvent.createdAt).toLocaleString()}
              </Text>
            )}

            {selectedEvent.registered ? (
              <TouchableOpacity
                style={[styles.actionButton, styles.cancelButton]}
                onPress={() => handleCancelRegistration(selectedEvent.id)}
              >
                <Text style={styles.actionButtonText}>Cancel Registration</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.actionButton, styles.registerButton]}
                onPress={() => openRegister(selectedEvent)}
              >
                <Text style={styles.actionButtonText}>Register</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={() => toggleFavorite(selectedEvent.id)}
              style={styles.heartButton}
            >
              <Text style={{ fontSize: 24 }}>
                {selectedEvent.isFavorite ? '❤️' : '🤍'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.eventsList}>
          {filteredEvents.length === 0 ? (
            <Text style={styles.noEventsText}>
              {viewMode === 'saved' 
                ? 'No saved events found.' 
                : viewMode === 'registered'
                ? 'No registered events found.'
                : 'No events available.'}
            </Text>
          ) : (
            filteredEvents.map(event => (
              <TouchableOpacity
                key={event.id}
                style={styles.eventCard}
                onPress={() => openEventDetails(event)}
              >
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text>Date: {event.date}</Text>
                <Text>Time: {event.startTime} - {event.endTime}</Text>
                {event.attendees !== undefined && (
                  <Text>Attendees: {event.attendees}</Text>
                )}
                {event.registered && (
                  <Text style={styles.registeredBadge}>Registered</Text>
                )}
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    toggleFavorite(event.id);
                  }}
                  style={styles.heartButton}
                >
                  <Text style={{ fontSize: 18 }}>
                    {event.isFavorite ? '❤️' : '🤍'}
                  </Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      )}

      <Modal visible={!!registeringEvent} transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={{ marginBottom: 10 }}>Enter your email:</Text>
            <TextInput
              placeholder="Email"
              value={emailInput}
              onChangeText={setEmailInput}
              style={styles.input}
              keyboardType="email-address"
            />
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity style={styles.modalBtn} onPress={handleRegister}>
                <Text style={{ color: 'white' }}>Register</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalBtn, { backgroundColor: 'gray' }]} 
                onPress={() => setRegisteringEvent(null)}
              >
                <Text style={{ color: 'white' }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: 'white',
    alignItems: 'center',
    position: 'relative',
    zIndex: 10,
  },
  menuButton: { padding: 10 },
  menuButtonText: { fontSize: 24 },
  appTitle: { fontSize: 18, fontWeight: 'bold', flex: 1, textAlign: 'center' },
  viewModeHeader: { 
    padding: 10, 
    backgroundColor: '#e5e7eb',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  viewModeTitle: { fontSize: 16, fontWeight: 'bold' },
  eventsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,
  },
  eventCard: {
    backgroundColor: 'white',
    width: '48%',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
    position: 'relative',
  },
  eventTitle: { fontSize: 16, fontWeight: 'bold' },
  heartButton: { 
    alignItems: 'center', 
    marginTop: 10,
    position: 'absolute',
    right: 10,
    top: 10
  },
  noEventsText: { 
    textAlign: 'center', 
    marginTop: 20, 
    color: '#6b7280',
    width: '100%'
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 30,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    gap: 10
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    marginBottom: 10,
  },
  modalBtn: {
    flex: 1,
    backgroundColor: '#2563eb',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  sortContainer: {
    position: 'relative',
  },
  sortButton: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
  },
  sortButtonText: {
    fontWeight: 'bold',
  },
  sortDropdown: {
    position: 'absolute',
    top: 40,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 6,
    elevation: 3,
    width: 150,
  },
  sortOption: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  eventDetailContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: 'white',
  },
  eventDetailContent: {
    padding: 10,
  },
  eventDetailTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  eventDetailText: {
    fontSize: 16,
    marginBottom: 8,
  },
  backButton: {
    padding: 10,
    marginBottom: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: '#2563eb',
  },
  actionButton: {
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 15,
  },
  registerButton: {
    backgroundColor: '#2563eb',
  },
  cancelButton: {
    backgroundColor: '#dc2626',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  registeredBadge: {
    color: 'green',
    fontWeight: 'bold',
    marginTop: 5,
  },
});

export default EventPlanner;