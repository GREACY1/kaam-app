import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from './src/screens/LoginScreen';
import WorkerHomeScreen from './src/screens/WorkerHomeScreen';
import CustomerHomeScreen from './src/screens/CustomerHomeScreen';
import PostJobScreen from './src/screens/PostJobScreen';
import ChatScreen from './src/screens/ChatScreen';
import RatingScreen from './src/screens/RatingScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="WorkerHome" component={WorkerHomeScreen} />
        <Stack.Screen name="CustomerHome" component={CustomerHomeScreen} />
        <Stack.Screen name="PostJob" component={PostJobScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="Rating" component={RatingScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}