import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { useEvent } from '../../context/EventContext';

export default function EventListScreen() {
  const { events } = useEvent();

  return (
    <View style={{ padding: 20 }}>
      {events.length === 0 ? (
        <Text>No events created.</Text>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{ marginBottom: 15, padding: 10, borderWidth: 1, borderRadius: 10 }}>
              <Text style={{ fontWeight: 'bold' }}>{item.title}</Text>
              <Text>{item.date} at {item.time}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}
