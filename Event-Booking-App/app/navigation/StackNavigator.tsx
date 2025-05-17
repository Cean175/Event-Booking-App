import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AdminDashboardScreen from '../screens/Admin/AdminDashboardScreen';
import CreateEventScreen from '../screens/Admin/CreateEventScreen';
import EventListScreen from '../screens/Admin/EventListScreen';
import EventDetailsScreen from '../screens/Admin/EventDetailsScreen'; // ✅ Import this

export type RootStackParamList = {
  AdminDashboard: undefined;
  CreateEvent: undefined;
  EventList: undefined;
  EventDetails: { eventId: string }; // ✅ Add this
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function StackNavigator() {
  return (
    <Stack.Navigator initialRouteName="AdminDashboard">
      <Stack.Screen
        name="AdminDashboard"
        component={AdminDashboardScreen}
        options={{ title: 'Admin Dashboard' }}
      />
      <Stack.Screen
        name="CreateEvent"
        component={CreateEventScreen}
        options={{ title: 'Create Event' }}
      />
      <Stack.Screen
        name="EventList"
        component={EventListScreen}
        options={{ title: 'Event List' }}
      />
      <Stack.Screen
        name="EventDetails"
        component={EventDetailsScreen}
        options={{ title: 'Event Details' }} // ✅ Add title
      />
    </Stack.Navigator>
  );
}
