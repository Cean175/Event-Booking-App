import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useEvent } from '../../context/EventContext';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/StackNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'EventList'>;

export default function EventListScreen() {
  const { events } = useEvent();
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={{ padding: 20 }}>
      {events.length === 0 ? (
        <Text>No events created.</Text>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigation.navigate('EventDetails', { eventId: item.id })}
              style={{
                marginBottom: 15,
                padding: 10,
                borderWidth: 1,
                borderRadius: 10,
              }}
            >
              <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{item.title}</Text>
              <Text>{item.date} at {item.startTime} - {item.endTime}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}
