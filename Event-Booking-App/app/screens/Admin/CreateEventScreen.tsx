import React, { useState } from 'react';
import { View, TextInput, Button, Alert, Text } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { useEvent } from '../../context/EventContext';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/StackNavigator'; // adjust path to your navigator types

// Define the navigation prop type for type safety
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'CreateEvent'>;

export default function CreateEventScreen() {
  const { addEvent } = useEvent();
  const navigation = useNavigation<NavigationProp>();

  const [title, setTitle] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleSubmit = () => {
    if (!title || !date || !time) {
      Alert.alert('All fields are required');
      return;
    }

    const now = new Date();
    const selectedDateTime = new Date(date);
    selectedDateTime.setHours(time.getHours());
    selectedDateTime.setMinutes(time.getMinutes());
    selectedDateTime.setSeconds(0);
    selectedDateTime.setMilliseconds(0);

    if (selectedDateTime < now) {
      Alert.alert('Event must be in the future');
      return;
    }

    addEvent({
      title,
      date: selectedDateTime.toLocaleDateString(),
      time: selectedDateTime.toLocaleTimeString(),
    });

    Alert.alert('Event Added!');
    setTitle('');
    setDate(null);
    setTime(null);
    navigation.navigate('EventList'); // Make sure this screen is in your navigator
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

      <Button title="Pick Time" onPress={() => setShowTimePicker(true)} />
      {time && <Text style={{ marginVertical: 8 }}>Time: {time.toLocaleTimeString()}</Text>}
      {showTimePicker && (
        <DateTimePicker
          mode="time"
          value={time || new Date()}
          onChange={(_, selectedTime) => {
            setShowTimePicker(false);
            if (selectedTime) setTime(selectedTime);
          }}
        />
      )}

      <View style={{ marginTop: 20 }}>
        <Button title="Create Event" onPress={handleSubmit} />
      </View>
    </View>
  );
}
