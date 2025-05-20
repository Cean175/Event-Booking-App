import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useEvent } from '../context/EventContext';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/StackNavigator';
import { MaterialIcons } from '@expo/vector-icons'; // 

type EventDetailsRouteProp = RouteProp<RootStackParamList, 'EventDetails'>;

export default function EventDetailsScreen() {
  const { params } = useRoute<EventDetailsRouteProp>();
  const navigation = useNavigation();
  const { events, updateEvent, deleteEvent } = useEvent();

  const event = events.find((e) => e.id === params.eventId);

  if (!event) {
    return <Text style={{ padding: 20 }}>Event not found.</Text>;
  }

  const [isEditing, setIsEditing] = useState(false);

  const [title, setTitle] = useState(event.title);
  const [description, setDescription] = useState(event.description);
  const [location, setLocation] = useState(event.location);
  const [date, setDate] = useState(event.date);
  const [startTime, setStartTime] = useState(event.startTime);
  const [endTime, setEndTime] = useState(event.endTime);

  const handleSave = () => {
    const emptyFields = [];
    if (!title.trim()) emptyFields.push('Title');
    if (!description.trim()) emptyFields.push('Description');
    if (!location.trim()) emptyFields.push('Location');
    if (!date.trim()) emptyFields.push('Date');
    if (!startTime.trim()) emptyFields.push('Start Time');
    if (!endTime.trim()) emptyFields.push('End Time');

    if (emptyFields.length > 0) {
      Alert.alert(
        'Validation Error',
        `Please fill in the following fields:\n${emptyFields.join('\n')}`
      );
      return;
    }

    updateEvent({
      ...event,
      title,
      description,
      location,
      date,
      startTime,
      endTime,
    });

    setIsEditing(false);
    Alert.alert('Success', 'Event updated!');
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Event',
      'Are you sure you want to delete the event?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: () => {
            deleteEvent(event.id);
            navigation.goBack();
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: 'space-between' }}>
      <View>
        {isEditing ? (
          <>
            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Title:</Text>
            <TextInput
              style={{ borderBottomWidth: 1, marginBottom: 10 }}
              value={title}
              onChangeText={setTitle}
              placeholder="Event Title"
            />

            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Description:</Text>
            <TextInput
              style={{ borderBottomWidth: 1, marginBottom: 10 }}
              value={description}
              onChangeText={setDescription}
              placeholder="Event Description"
              multiline
            />

            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Location:</Text>
            <TextInput
              style={{ borderBottomWidth: 1, marginBottom: 10 }}
              value={location}
              onChangeText={setLocation}
              placeholder="Event Location"
            />

            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Date:</Text>
            <TextInput
              style={{ borderBottomWidth: 1, marginBottom: 10 }}
              value={date}
              onChangeText={setDate}
              placeholder="YYYY-MM-DD"
            />

            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Start Time:</Text>
            <TextInput
              style={{ borderBottomWidth: 1, marginBottom: 10 }}
              value={startTime}
              onChangeText={setStartTime}
              placeholder="HH:MM"
            />

            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>End Time:</Text>
            <TextInput
              style={{ borderBottomWidth: 1, marginBottom: 20 }}
              value={endTime}
              onChangeText={setEndTime}
              placeholder="HH:MM"
            />

            <Button title="Save" onPress={handleSave} />
            <Button
              title="Cancel"
              color="gray"
              onPress={() => {
                setTitle(event.title);
                setDescription(event.description);
                setLocation(event.location);
                setDate(event.date);
                setStartTime(event.startTime);
                setEndTime(event.endTime);
                setIsEditing(false);
              }}
            />
          </>
        ) : (
          <>
            <Text style={{ fontSize: 22, fontWeight: 'bold' }}>{event.title}</Text>
            <Text style={{ fontSize: 16, marginVertical: 10 }}>{event.description}</Text>
            <Text style={{ fontSize: 16 }}>📍 Location: {event.location}</Text>
            <Text style={{ fontSize: 16, marginTop: 10 }}>📅 Date: {event.date}</Text>
            <Text style={{ fontSize: 16 }}>🕒 Start: {event.startTime}</Text>
            <Text style={{ fontSize: 16 }}>🕔 End: {event.endTime}</Text>

            <Button title="Update" onPress={() => setIsEditing(true)} />
          </>
        )}
      </View>

      {/* Delete button at the bottom center only when editing */}
      {isEditing && (
        <View style={styles.deleteContainer}>
          <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
            <MaterialIcons name="delete" size={30} color="red" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  deleteContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  deleteButton: {
    backgroundColor: '#ffe6e6',
    padding: 10,
    borderRadius: 50,
  },
});