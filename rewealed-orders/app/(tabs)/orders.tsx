import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';

interface Order {
  _id: string;
  sessionId: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  shippingType: string;
}

export default function OrdersScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      // Replace with your actual API endpoint
      const response = await axios.get('https://your-api-endpoint.com/api/orders');
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  const renderOrderItem = ({ item }: { item: Order }) => (
    <View style={styles.orderCard}>
      <Text style={styles.orderId}>Order ID: {item.sessionId}</Text>
      <Text style={styles.orderStatus}>Status: {item.status}</Text>
      <Text>Amount: {item.amount.toFixed(2)} {item.currency.toUpperCase()}</Text>
      <Text>Created: {new Date(item.createdAt).toLocaleString()}</Text>
      <Text>Shipping Type: {item.shippingType || 'N/A'}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
  },
  orderCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  orderStatus: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4a4a4a',
    marginBottom: 8,
  },
});

