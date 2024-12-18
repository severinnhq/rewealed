import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, RefreshControl } from 'react-native';
import OrderCard from '../components/OrderCard';
import { Order } from '../types/Order';
import { API_URL } from '../utils/config';

// const API_URL = 'https://your-ngrok-url.ngrok-free.app/api/orders'; // Update this with your actual ngrok URL

export default function OrdersScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('Fetching orders from:', API_URL);
      const response = await fetch(API_URL);
      
      const textResponse = await response.text();
      console.log('Raw response:', textResponse);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}, body: ${textResponse}`);
      }

      let data;
      try {
        data = JSON.parse(textResponse);
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        throw new Error(`Failed to parse JSON: ${parseError instanceof Error ? parseError.message : String(parseError)}`);
      }

      console.log('Parsed data:', JSON.stringify(data, null, 2));
      setOrders(data);
    } catch (e) {
      console.error('Error fetching orders:', e);
      setError(`Failed to fetch orders. ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

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
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={fetchOrders} />
      }
    >
      {orders.map((order) => (
        <OrderCard key={order._id.toString()} order={order} />
      ))}
    </ScrollView>
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

