import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AdminDashboardScreen from '../Admin/AdminDashboardScreen';
import CreateEventScreen from '../Admin/CreateEventScreen';
import EventListScreen from '../Admin/EventListScreen';
import EventDetailsScreen from '../Admin/EventDetailsScreen';
import EventBookingScreen from '../screens/EventBookingScreen';
import AdminLogin from '../screens/AdminLogin';
import UserLogin from '../screens/UserLogin';

export type RootStackParamList = {
  AdminLogin: undefined;
  UserLogin: undefined;
  EventBooking: undefined;
  AdminDashboard: undefined;
  CreateEvent: undefined;
  EventList: undefined;
  EventDetails: { eventId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function StackNavigator() {
  return (
    <Stack.Navigator initialRouteName="EventBooking">
       <Stack.Screen
        name="AdminLogin"
        component={AdminLogin}
        options={{ title: 'Admin Login' }}
      />
       <Stack.Screen
        name="UserLogin"
        component={UserLogin}
        options={{ title: 'User Login' }}
      />
      <Stack.Screen
        name="EventPlanner"
        component={AdminDashboardScreen}
        options={{ title: 'Event Planner' }}
      />
      <Stack.Screen
        name="EventBooking"
        component={EventBookingScreen}
        options={{ title: 'Event Booking' }}
      />
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
        options={{ title: 'Event Details' }}
      />
    </Stack.Navigator>
  );
}
