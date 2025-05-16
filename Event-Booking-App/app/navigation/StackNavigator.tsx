import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AdminDashboardScreen from '../screens/Admin/AdminDashboardScreen';
import CreateEventScreen from '../screens/Admin/CreateEventScreen';
import EventListScreen from '../screens/Admin/EventListScreen';

export type RootStackParamList = {
  AdminDashboard: undefined;
  CreateEvent: undefined;
  EventList: undefined;
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
    </Stack.Navigator>
  );
}
