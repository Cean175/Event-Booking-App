import React from 'react';
import { View, Text } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useEvent } from '../../context/EventContext';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../navigation/StackNavigator';

type EventDetailsRouteProp = RouteProp<RootStackParamList, 'EventDetails'>;

export default function EventDetailsScreen() {
  const { params } = useRoute<EventDetailsRouteProp>();
  const { events } = useEvent();

  const event = events.find((e) => e.id === params.eventId);

  if (!event) {
    return <Text style={{ padding: 20 }}>Event not found.</Text>;
  }

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold' }}>{event.title}</Text>
      <Text style={{ fontSize: 16, marginVertical: 10 }}>{event.description}</Text>
      <Text style={{ fontSize: 16 }}>📅 Date: {event.date}</Text>
      <Text style={{ fontSize: 16 }}>🕒 Start: {event.startTime}</Text>
      <Text style={{ fontSize: 16 }}>🕔 End: {event.endTime}</Text>
      <Text style={{ fontSize: 16, marginTop: 10, fontStyle: 'italic' }}>
        ⏳ {event.duration}
      </Text>
    </View>
  );
}
