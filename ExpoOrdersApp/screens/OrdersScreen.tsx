import React, { useEffect, useState, useCallback } from 'react';
import { ScrollView, View, Text, StyleSheet, RefreshControl, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OrderCard from '../components/OrderCard';
import { Order } from '../types/Order';
import { API_URL } from '../utils/config';

export default function OrdersScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('Fetching orders from:', API_URL);
      const response = await fetch(API_URL);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Fetched orders:', data.length);
      setOrders(data);
    } catch (e) {
      console.error('Error fetching orders:', e);
      setError(`Failed to fetch orders. ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    const intervalId = setInterval(fetchOrders, 60 * 1000); // Check every minute
    return () => clearInterval(intervalId);
  }, [fetchOrders]);

  const showExpoToken = async () => {
    const token = await AsyncStorage.getItem('expoPushToken');
    if (token) {
      Alert.alert('Expo Push Token', token);
    } else {
      Alert.alert('Token Not Found', 'Expo Push Token is not stored in AsyncStorage');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <Text>Loading orders...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text>{error}</Text>
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text>No orders found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Button title="Show Expo Token" onPress={showExpoToken} />
      <ScrollView 
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={fetchOrders} />
        }
      >
        {orders.map((order) => (
          <OrderCard key={order._id.toString()} order={order} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

