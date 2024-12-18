import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type OrdersScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Orders'>;

interface Order {
  _id: string;
  sessionId: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
}

// Updated API URL to match your domain exactly
const API_URL = 'https://rewealed.com/api/orders';
const API_KEY = '0ccdf3e234516d4ff02ff87937ff0506b56cd1068fad70732baf1ff480dde343';

export default function OrdersScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation<OrdersScreenNavigationProp>();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        redirect: 'follow',
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Data received:', data);
      
      setOrders(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to fetch orders. Please try again.');
      Alert.alert('Error', 'Failed to fetch orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderOrderItem = ({ item }: { item: Order }) => (
    <TouchableOpacity
      style={styles.orderItem}
      onPress={() => navigation.navigate('OrderDetail', { orderId: item._id })}
    >
      <Text style={styles.orderTitle}>Order ID: {item.sessionId}</Text>
      <Text>Amount: {item.amount.toFixed(2)} {item.currency.toUpperCase()}</Text>
      <Text>Status: {item.status}</Text>
      <Text>Created: {new Date(item.createdAt).toLocaleString()}</Text>
    </TouchableOpacity>
  );

  if (loading) {
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

