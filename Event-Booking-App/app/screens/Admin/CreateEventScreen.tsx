import React, { useState } from 'react';
import {
  View,
  TextInput,
  Alert,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView, // Added ScrollView import
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { useEvent } from '../../context/EventContext';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/StackNavigator';
import { v4 as uuidv4 } from 'uuid';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'CreateEvent'>;

export default function CreateEventScreen() {
  const { addEvent } = useEvent();
  const navigation = useNavigation<NavigationProp>();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const getDurationText = () => {
    if (!startTime || !endTime) return '';
    const diffMs = endTime.getTime() - startTime.getTime();
    if (diffMs <= 0) return 'Invalid duration';

    const diffMins = Math.floor(diffMs / 60000);
    const hours = Math.floor(diffMins / 60);
    const minutes = diffMins % 60;
    return `${hours}h ${minutes}m`;
  };

  const handleSubmit = () => {
    if (!title || !description || !date || !startTime || !endTime || !location) {
      Alert.alert('All fields are required');
      return;
    }

    const now = new Date();
    const eventStart = new Date(date);
    eventStart.setHours(startTime.getHours());
    eventStart.setMinutes(startTime.getMinutes());

    const eventEnd = new Date(date);
    eventEnd.setHours(endTime.getHours());
    eventEnd.setMinutes(endTime.getMinutes());

    if (eventStart < now) {
      Alert.alert('Event must start in the future');
      return;
    }

    if (eventEnd <= eventStart) {
      Alert.alert('End time must be after start time');
      return;
    }

    addEvent({
      title,
      description,
      location,
      date: eventStart.toLocaleDateString(),
      startTime: eventStart.toLocaleTimeString(),
      endTime: eventEnd.toLocaleTimeString(),
      duration: getDurationText(),
    });

    Alert.alert('Event Added!');
    setTitle('');
    setDescription('');
    setLocation('');
    setDate(null);
    setStartTime(null);
    setEndTime(null);
    navigation.navigate('EventList');
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={[styles.heading, { marginTop: 0 }]}>Enter Event Title</Text>
      <TextInput
        placeholder="Event Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />

      <Text style={styles.heading}>Enter Event Location</Text>
      <TextInput
        placeholder="Event Location"
        value={location}
        onChangeText={setLocation}
        style={styles.input}
      />

      <Text style={styles.heading}>Select Date</Text>
      <TouchableOpacity style={styles.button} onPress={() => setShowDatePicker(true)}>
        <Text style={styles.buttonText}>Pick Date</Text>
      </TouchableOpacity>
      {date && <Text style={styles.infoText}>Date: {date.toDateString()}</Text>}
      {showDatePicker && (
        <DateTimePicker
          mode="date"
          value={date || new Date()}
          minimumDate={new Date()}
          onChange={(_, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}

      <Text style={styles.heading}>Pick Event Duration</Text>
      {startTime && endTime && (
        <Text style={styles.durationText}>Duration: {getDurationText()}</Text>
      )}

      <View style={styles.row}>
        <TouchableOpacity
          style={styles.smallButton}
          onPress={() => setShowStartTimePicker(true)}
        >
          <Text style={styles.buttonText}>Pick Start</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.smallButton}
          onPress={() => setShowEndTimePicker(true)}
        >
          <Text style={styles.buttonText}>Pick End</Text>
        </TouchableOpacity>
      </View>

      {startTime && <Text style={styles.infoText}>Start: {startTime.toLocaleTimeString()}</Text>}
      {endTime && <Text style={styles.infoText}>End: {endTime.toLocaleTimeString()}</Text>}

      {showStartTimePicker && (
        <DateTimePicker
          mode="time"
          value={startTime || new Date()}
          onChange={(_, selectedTime) => {
            setShowStartTimePicker(false);
            if (selectedTime) setStartTime(selectedTime);
          }}
        />
      )}
      {showEndTimePicker && (
        <DateTimePicker
          mode="time"
          value={endTime || new Date()}
          onChange={(_, selectedTime) => {
            setShowEndTimePicker(false);
            if (selectedTime) setEndTime(selectedTime);
          }}
        />
      )}

      <Text style={styles.heading}>Enter Event Description</Text>
      <TextInput
        placeholder="Event Description"
        value={description}
        onChangeText={setDescription}
        style={styles.textarea}
        multiline
        numberOfLines={3}
      />

      <View style={{ marginTop: 20 }}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Create Event</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 20,
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 20,
    fontSize: 16,
  },
  textarea: {
    borderBottomWidth: 1,
    marginTop: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  smallButton: {
    backgroundColor: '#28a745',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 10,
    flex: 1,
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#343a40',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
  },
  infoText: {
    marginVertical: 6,
    fontSize: 14,
  },
  durationText: {
    fontStyle: 'italic',
    marginBottom: 10,
    fontSize: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
});
