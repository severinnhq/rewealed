import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OrdersScreen from './screens/OrdersScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Orders" 
          component={OrdersScreen} 
          options={{ title: 'Admin: Order Management' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

