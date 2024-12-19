import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, RefreshControl, StyleSheet, TouchableOpacity } from 'react-native';
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
  const navigation = useNavigation<OrdersScreenNavigationProp>();

  const fetchOrders = useCallback(async () => {
    try {
      // Step 1: Get the challenge
      const challengeResponse = await fetch('https://rewealed.com/api/orders');
      const { challenge } = await challengeResponse.json();

      // Step 2: Generate the response
      const secret = 'rewealed_secret';
      const response = CryptoJS.SHA256(challenge + secret).toString(CryptoJS.enc.Hex);

      // Step 3: Fetch orders with the challenge-response
      const ordersResponse = await fetch(`https://rewealed.com/api/orders?challenge=${challenge}&response=${response}`);
      const fetchedOrders = await ordersResponse.json();

      if (Array.isArray(fetchedOrders)) {
        setOrders(fetchedOrders);
      } else {
        console.error('Fetched orders is not an array:', fetchedOrders);
        setOrders([]);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
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
      {orders.length === 0 ? (
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
});

export default OrdersScreen;

