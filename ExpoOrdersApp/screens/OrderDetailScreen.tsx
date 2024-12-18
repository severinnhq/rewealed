import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../App';

type OrderDetailRouteProp = RouteProp<RootStackParamList, 'OrderDetail'>;

interface OrderDetail {
  _id: string;
  sessionId: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  items: Array<{
    n: string;
    s: string;
    q: number;
    p: number;
  }>;
  shippingDetails: {
    name: string;
    address: {
      line1: string;
      line2: string | null;
      city: string;
      state: string;
      postal_code: string;
      country: string;
    };
  };
}

interface OrderDetailScreenProps {
  route: OrderDetailRouteProp;
}

export default function OrderDetailScreen({ route }: OrderDetailScreenProps) {
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const { orderId } = route.params;

  useEffect(() => {
    fetchOrderDetail();
  }, []);

  const fetchOrderDetail = async () => {
    try {
      const response = await fetch(`https://rewealed.com/api/orders?id=${orderId}`);
      const data = await response.json();
      setOrder(data);
    } catch (error) {
      console.error('Error fetching order detail:', error);
    }
  };

  if (!order) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Order ID: {order.sessionId}</Text>
      <Text style={styles.subtitle}>Status: {order.status}</Text>
      <Text style={styles.subtitle}>Amount: {order.amount.toFixed(2)} {order.currency.toUpperCase()}</Text>
      <Text style={styles.subtitle}>Created: {new Date(order.createdAt).toLocaleString()}</Text>

      <Text style={styles.sectionTitle}>Items</Text>
      {order.items.map((item, index) => (
        <View key={index} style={styles.item}>
          <Text>{item.n} - {item.s}</Text>
          <Text>Quantity: {item.q}</Text>
          <Text>Price: {item.p.toFixed(2)} {order.currency.toUpperCase()}</Text>
        </View>
      ))}

      <Text style={styles.sectionTitle}>Shipping Details</Text>
      <Text>{order.shippingDetails.name}</Text>
      <Text>{order.shippingDetails.address.line1}</Text>
      {order.shippingDetails.address.line2 && <Text>{order.shippingDetails.address.line2}</Text>}
      <Text>{order.shippingDetails.address.city}, {order.shippingDetails.address.state} {order.shippingDetails.address.postal_code}</Text>
      <Text>{order.shippingDetails.address.country}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
  },
  item: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});

