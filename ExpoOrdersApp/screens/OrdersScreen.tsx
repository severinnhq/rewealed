import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, RefreshControl, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { format } from 'date-fns';
import CryptoJS from 'crypto-js';
import { RootStackParamList } from '../App';

type OrdersScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Orders'>;

interface Order {
  _id: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
}

const OrdersScreen: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation<OrdersScreenNavigationProp>();

  const fetchOrders = useCallback(async () => {
    try {
      setError(null);
      // Step 1: Get the challenge
      const challengeResponse = await fetch('https://rewealed.com/api/orders');
      if (!challengeResponse.ok) {
        throw new Error(`Challenge request failed with status ${challengeResponse.status}`);
      }
      const challengeData = await challengeResponse.json();
      if (!challengeData.challenge) {
        throw new Error('Challenge not received from the server');
      }
      const { challenge } = challengeData;

      // Step 2: Generate the response
      const secret = 'rewealed_secret';
      const response = CryptoJS.SHA256(challenge + secret).toString(CryptoJS.enc.Hex);

      // Step 3: Fetch orders with the challenge-response
      const ordersResponse = await fetch(`https://rewealed.com/api/orders?challenge=${challenge}&response=${response}`);
      if (!ordersResponse.ok) {
        throw new Error(`Orders request failed with status ${ordersResponse.status}`);
      }
      const fetchedOrders = await ordersResponse.json();

      if (Array.isArray(fetchedOrders)) {
        setOrders(fetchedOrders);
        if (fetchedOrders.length === 0) {
          setError('No orders found');
        }
      } else {
        console.error('Fetched orders is not an array:', fetchedOrders);
        setError('Invalid data received from server');
        setOrders([]);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      setOrders([]);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  }, [fetchOrders]);

  const renderOrderItem = ({ item }: { item: Order }) => (
    <TouchableOpacity
      style={styles.orderItem}
      onPress={() => navigation.navigate('OrderDetail', { orderId: item._id })}
    >
      <Text style={styles.orderAmount}>{item.currency} {item.amount.toFixed(2)}</Text>
      <Text style={styles.orderStatus}>{item.status}</Text>
      <Text style={styles.orderDate}>{format(new Date(item.createdAt), 'MMM d, yyyy HH:mm')}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchOrders}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : orders.length === 0 ? (
        <Text style={styles.noOrders}>No orders found</Text>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item._id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  orderItem: {
    backgroundColor: 'white',
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  orderAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  orderStatus: {
    fontSize: 14,
    color: 'gray',
    marginTop: 5,
  },
  orderDate: {
    fontSize: 12,
    color: 'gray',
    marginTop: 5,
  },
  noOrders: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default OrdersScreen;

