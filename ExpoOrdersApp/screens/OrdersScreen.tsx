import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { format } from 'date-fns/format';

type OrdersScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Orders'>;

interface Order {
  _id: string;
  sessionId: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  shippingType?: string;
}

const API_URL = 'https://rewealed.com/api/orders';

// Simple hash function
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16);
}

export default function OrdersScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation<OrdersScreenNavigationProp>();

  const fetchOrders = async () => {
    try {
      setLoading(true);

      // First, get the challenge
      const challengeResponse = await fetch(`${API_URL}?`);
      const challengeData = await challengeResponse.json();
      const challenge = challengeData.challenge;

      // Generate the response
      const response = simpleHash(challenge + 'rewealed_secret');

      // Now fetch the orders with the challenge-response
      const ordersResponse = await fetch(`${API_URL}?challenge=${challenge}&response=${response}`);

      if (!ordersResponse.ok) {
        throw new Error(`HTTP error! status: ${ordersResponse.status}`);
      }
      
      const data = await ordersResponse.json();
      setOrders(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching orders:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      setError(`Failed to fetch orders. ${errorMessage}`);
      Alert.alert('Error', `Failed to fetch orders. ${errorMessage}`);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const formatCreatedDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return format(date, "yyyy-MM-dd HH:mm:ss");
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  const renderOrderItem = ({ item }: { item: Order }) => (
    <TouchableOpacity
      style={[
        styles.orderItem,
        item.shippingType?.toLowerCase().includes('express') && styles.expressShipping
      ]}
      onPress={() => navigation.navigate('OrderDetail', { orderId: item._id })}
    >
      <Text style={styles.orderTitle}>Order ID: {item.sessionId}</Text>
      <Text>Amount: {item.amount.toFixed(2)} {item.currency.toUpperCase()}</Text>
      <Text>Status: {item.status}</Text>
      <Text>Created: {formatCreatedDate(item.createdAt)}</Text>
      {item.shippingType && <Text>Shipping: {item.shippingType}</Text>}
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <Text>Loading orders...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchOrders}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {orders.length > 0 ? (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item._id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      ) : (
        <Text style={styles.noOrders}>No orders found.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  orderItem: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
  },
  expressShipping: {
    backgroundColor: '#fff9c4',
  },
  orderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  retryButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#007AFF',
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  noOrders: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});

