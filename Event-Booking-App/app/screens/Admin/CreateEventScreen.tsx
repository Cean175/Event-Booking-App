import React, { useState } from 'react';
import { View, TextInput, Button, Alert, Text } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { useEvent } from '../../context/EventContext';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/StackNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'CreateEvent'>;

export default function CreateEventScreen() {
  const { addEvent } = useEvent();
  const navigation = useNavigation<NavigationProp>();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
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
    if (!title || !description || !date || !startTime || !endTime) {
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
      date: eventStart.toLocaleDateString(),
      startTime: eventStart.toLocaleTimeString(),
      endTime: eventEnd.toLocaleTimeString(),
      duration: getDurationText(),
    });

    Alert.alert('Event Added!');
    setTitle('');
    setDescription('');
    setDate(null);
    setStartTime(null);
    setEndTime(null);
    navigation.navigate('EventList');
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Event Title"
        value={title}
        onChangeText={setTitle}
        style={{ borderBottomWidth: 1, marginBottom: 20, fontSize: 16 }}
      />

      <Button title="Pick Date" onPress={() => setShowDatePicker(true)} />
      {date && <Text style={{ marginVertical: 8 }}>Date: {date.toDateString()}</Text>}
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

      {/* Start Time Picker */}
      <Button title="Pick Start Time" onPress={() => setShowStartTimePicker(true)} />
      {startTime && <Text style={{ marginVertical: 8 }}>Start: {startTime.toLocaleTimeString()}</Text>}
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

      {/* End Time Picker */}
      <Button title="Pick End Time" onPress={() => setShowEndTimePicker(true)} />
      {endTime && <Text style={{ marginVertical: 8 }}>End: {endTime.toLocaleTimeString()}</Text>}
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

      {/* Show Duration */}
      {startTime && endTime && (
        <Text style={{ marginTop: 8, fontStyle: 'italic' }}>Duration: {getDurationText()}</Text>
      )}

      {/* Description */}
      <TextInput
        placeholder="Event Description"
        value={description}
        onChangeText={setDescription}
        style={{
          borderBottomWidth: 1,
          marginTop: 20,
          marginBottom: 20,
          fontSize: 16,
        }}
        multiline
        numberOfLines={3}
      />

      <View style={{ marginTop: 20 }}>
        <Button title="Create Event" onPress={handleSubmit} />
      </View>
    </View>
  );
}
