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
  date: string;
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
  const [loading, setLoading] = useState(false);

  // Email validation function
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

  // Date validation function
  const isValidDate = (dateString: string): boolean => {
    try {
      const date = new Date(dateString);
      return date instanceof Date && !isNaN(date.getTime());
    } catch {
      return false;
    }
  };

  // Time validation function
  const isValidTime = (timeString: string): boolean => {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(timeString);
  };

  // Validate event data
  const validateEvent = (event: any): event is Event => {
    if (!event || typeof event !== 'object') return false;
    
    return (
      typeof event.id === 'string' &&
      typeof event.title === 'string' &&
      typeof event.description === 'string' &&
      typeof event.location === 'string' &&
      typeof event.date === 'string' &&
      isValidDate(event.date) &&
      typeof event.startTime === 'string' &&
      isValidTime(event.startTime) &&
      typeof event.endTime === 'string' &&
      isValidTime(event.endTime)
    );
  };

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        const storedEvents = await AsyncStorage.getItem('events');
        if (storedEvents) {
          const parsed = JSON.parse(storedEvents);
          
          
          if (!Array.isArray(parsed)) {
            console.error('Invalid events data format');
            setEvents([]);
            return;
          }

          
          const validEvents: Event[] = parsed
            .filter(validateEvent)
            .map(ev => ({
              ...ev,
              attendees: typeof ev.attendees === 'number' ? Math.max(0, ev.attendees) : 0,
              registered: typeof ev.registered === 'boolean' ? ev.registered : false,
              isFavorite: typeof ev.isFavorite === 'boolean' ? ev.isFavorite : false
            }));

          setEvents(sortEvents(validEvents, sortMode, sortDirection));
        }
      } catch (error) {
        console.error('Failed to load events:', error);
        Alert.alert('Error', 'Failed to load events. Please try again.');
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  const sortEvents = (events: Event[], mode: 'date' | 'duration', direction: 'asc' | 'desc') => {
    try {
      return [...events].sort((a, b) => {
        let comparison = 0;
        
        if (mode === 'date') {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          
          
          if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
            return 0;
          }
          
          comparison = dateA.getTime() - dateB.getTime();
        } else {
          const getMinutes = (timeStr: string): number => {
            try {
              const [h, m] = timeStr.split(':').map(Number);
              if (isNaN(h) || isNaN(m)) return 0;
              return h * 60 + m;
            } catch {
              return 0;
            }
          };
          
          const durationA = getMinutes(a.endTime) - getMinutes(a.startTime);
          const durationB = getMinutes(b.endTime) - getMinutes(b.startTime);
          comparison = durationA - durationB;
        }
        
        return direction === 'asc' ? comparison : -comparison;
      });
    } catch (error) {
      console.error('Error sorting events:', error);
      return events;
    }
  };

  const saveEventsToStorage = async (updatedEvents: Event[]) => {
    try {
      await AsyncStorage.setItem('events', JSON.stringify(updatedEvents));
    } catch (error) {
      console.error('Failed to save events:', error);
      Alert.alert('Error', 'Failed to save changes. Please try again.');
    }
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
    if (!id || typeof id !== 'string') {
      Alert.alert('Error', 'Invalid event ID');
      return;
    }

    try {
      const updated = events.map(ev =>
        ev.id === id ? { ...ev, isFavorite: !ev.isFavorite } : ev
      );
      setEvents(updated);
      await saveEventsToStorage(updated);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      Alert.alert('Error', 'Failed to update favorite status');
    }
  };

  const handleSortOptionSelect = (mode: 'date' | 'duration') => {
    try {
      const newDirection = sortMode === mode ? 
        (sortDirection === 'asc' ? 'desc' : 'asc') : 'asc';
      
      setSortMode(mode);
      setSortDirection(newDirection);
      setEvents(sortEvents(events, mode, newDirection));
      setSortDropdownVisible(false);
    } catch (error) {
      console.error('Error sorting events:', error);
      Alert.alert('Error', 'Failed to sort events');
    }
  };

  const openEventDetails = (event: Event) => {
    if (!event || !validateEvent(event)) {
      Alert.alert('Error', 'Invalid event data');
      return;
    }
    setSelectedEvent(event);
  };

  const closeEventDetails = () => {
    setSelectedEvent(null);
  };

  const openRegister = (event: Event) => {
    if (!event || !validateEvent(event)) {
      Alert.alert('Error', 'Invalid event data');
      return;
    }
    setRegisteringEvent(event);
    setEmailInput('');
  };

  const handleRegister = async () => {
    
    const trimmedEmail = emailInput.trim();
    if (!trimmedEmail) {
      Alert.alert("Error", "Please enter your email address.");
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      Alert.alert("Error", "Please enter a valid email address.");
      return;
    }

    if (!registeringEvent) {
      Alert.alert("Error", "No event selected for registration.");
      return;
    }

    try {
      setLoading(true);
      const updated = events.map(ev =>
        ev.id === registeringEvent.id
          ? { 
              ...ev, 
              attendees: Math.max(0, (ev.attendees || 0) + 1),
              registered: true
            }
          : ev
      );
      
      setEvents(updated);
      await saveEventsToStorage(updated);
      
      
      if (selectedEvent?.id === registeringEvent.id) {
        setSelectedEvent({
          ...selectedEvent,
          attendees: Math.max(0, (selectedEvent.attendees || 0) + 1),
          registered: true
        });
      }
      
      Alert.alert("Success", "You have been successfully registered!");
      setRegisteringEvent(null);
      setEmailInput('');
    } catch (error) {
      console.error('Error registering for event:', error);
      Alert.alert("Error", "Failed to register for event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRegistration = async (eventId: string) => {
    if (!eventId || typeof eventId !== 'string') {
      Alert.alert('Error', 'Invalid event ID');
      return;
    }

    try {
      setLoading(true);
      const updated = events.map(ev =>
        ev.id === eventId
          ? { 
              ...ev, 
              attendees: Math.max(0, (ev.attendees || 0) - 1),
              registered: false
            }
          : ev
      );
      
      setEvents(updated);
      await saveEventsToStorage(updated);
      
      if (selectedEvent?.id === eventId) {
        setSelectedEvent({
          ...selectedEvent,
          attendees: Math.max(0, (selectedEvent.attendees || 0) - 1),
          registered: false
        });
      }
      
      Alert.alert("Success", "Registration has been canceled!");
    } catch (error) {
      console.error('Error canceling registration:', error);
      Alert.alert("Error", "Failed to cancel registration. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = React.useMemo(() => {
    try {
      return viewMode === 'saved'
        ? events.filter(e => e.isFavorite === true)
        : viewMode === 'registered'
        ? events.filter(e => e.registered === true)
        : events;
    } catch (error) {
      console.error('Error filtering events:', error);
      return events;
    }
  }, [events, viewMode]);

  const getSortButtonText = () => {
    const modeText = sortMode === 'date' ? 'Date' : 'Duration';
    const directionText = sortDirection === 'asc' ? '↑' : '↓';
    return `Sort: ${modeText} ${directionText}`;
  };

  const formatDate = (dateString: string): string => {
    try {
      if (!isValidDate(dateString)) return dateString;
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const formatDateTime = (dateTimeString: string): string => {
    try {
      if (!dateTimeString) return 'N/A';
      return new Date(dateTimeString).toLocaleString();
    } catch {
      return dateTimeString;
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text>Loading...</Text>
      </View>
    );
  }

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
            <Text style={styles.eventDetailTitle}>{selectedEvent.title || 'Untitled Event'}</Text>
            <Text style={styles.eventDetailText}>Date: {formatDate(selectedEvent.date)}</Text>
            <Text style={styles.eventDetailText}>
              Time: {selectedEvent.startTime || 'N/A'} - {selectedEvent.endTime || 'N/A'}
            </Text>
            <Text style={styles.eventDetailText}>
              Attendees: {typeof selectedEvent.attendees === 'number' ? selectedEvent.attendees : 0}
            </Text>
            <Text style={styles.eventDetailText}>
              Description: {selectedEvent.description || 'No description available'}
            </Text>
            <Text style={styles.eventDetailText}>
              Location: {selectedEvent.location || 'Location not specified'}
            </Text>
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
                Created: {formatDateTime(selectedEvent.createdAt)}
              </Text>
            )}

            {selectedEvent.registered ? (
              <TouchableOpacity
                style={[styles.actionButton, styles.cancelButton]}
                onPress={() => handleCancelRegistration(selectedEvent.id)}
                disabled={loading}
              >
                <Text style={styles.actionButtonText}>
                  {loading ? 'Canceling...' : 'Cancel Registration'}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.actionButton, styles.registerButton]}
                onPress={() => openRegister(selectedEvent)}
                disabled={loading}
              >
                <Text style={styles.actionButtonText}>Register</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={() => toggleFavorite(selectedEvent.id)}
              style={styles.heartButton}
              disabled={loading}
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
                <Text style={styles.eventTitle}>{event.title || 'Untitled Event'}</Text>
                <Text>Date: {formatDate(event.date)}</Text>
                <Text>Time: {event.startTime || 'N/A'} - {event.endTime || 'N/A'}</Text>
                <Text>
                  Attendees: {typeof event.attendees === 'number' ? event.attendees : 0}
                </Text>
                {event.registered && (
                  <Text style={styles.registeredBadge}>Registered</Text>
                )}
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    toggleFavorite(event.id);
                  }}
                  style={styles.heartButton}
                  disabled={loading}
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

      <Modal visible={!!registeringEvent} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Register for Event</Text>
            <Text style={styles.modalSubtitle}>
              {registeringEvent?.title || 'Event Registration'}
            </Text>
            <Text style={{ marginBottom: 10 }}>Enter your email address:</Text>
            <TextInput
              placeholder="example@email.com"
              value={emailInput}
              onChangeText={setEmailInput}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity 
                style={[styles.modalBtn, loading && styles.disabledButton]} 
                onPress={handleRegister}
                disabled={loading}
              >
                <Text style={styles.modalBtnText}>
                  {loading ? 'Registering...' : 'Register'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalBtn, styles.cancelModalBtn]} 
                onPress={() => {
                  setRegisteringEvent(null);
                  setEmailInput('');
                }}
                disabled={loading}
              >
                <Text style={styles.modalBtnText}>Cancel</Text>
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
  centerContent: { justifyContent: 'center', alignItems: 'center' },
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
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  modalSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    marginBottom: 10,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  modalBtn: {
    flex: 1,
    backgroundColor: '#2563eb',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  cancelModalBtn: {
    backgroundColor: '#6b7280',
  },
  modalBtnText: {
    color: 'white',
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#9ca3af',
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

  export EventPlanner;