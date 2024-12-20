import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../App';
import { format } from 'date-fns';

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
  billingDetails?: {
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
  shippingType?: string;
  stripeDetails?: {
    paymentId: string;
    customerId: string | null;
    paymentMethodId: string | null;
    paymentMethodFingerprint: string | null;
    riskScore: number | null;
    riskLevel: string | null;
  };
  fulfilled?: boolean;
}

interface OrderDetailScreenProps {
  route: OrderDetailRouteProp;
}

export default function OrderDetailScreen({ route }: OrderDetailScreenProps) {
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const { orderId } = route.params;

  useEffect(() => {
    fetchOrderDetail();
  }, []);

  const fetchOrderDetail = async () => {
    try {
      const response = await fetch(`https://rewealed.com/api/orders?id=${orderId}`);
      const data = await response.json();
      setOrder(data[0]); // Assuming the API returns an array with a single order
    } catch (error) {
      console.error('Error fetching order detail:', error);
    } finally {
      setLoading(false);
    }
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

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!order) {
    return <Text style={styles.centered}>Order not found</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={[styles.card, order.shippingType?.toLowerCase().includes('express') && styles.expressShipping]}>
        <Text style={styles.title}>Order ID: {order.sessionId}</Text>
        <Text style={styles.subtitle}>Status: {order.status}</Text>
        <Text style={styles.subtitle}>Amount: {order.amount.toFixed(2)} {order.currency.toUpperCase()}</Text>
        <Text style={styles.subtitle}>Created: {formatCreatedDate(order.createdAt)}</Text>
        {order.shippingType && <Text style={styles.subtitle}>Shipping Type: {order.shippingType}</Text>}
        {order.fulfilled !== undefined && <Text style={styles.subtitle}>Fulfilled: {order.fulfilled ? 'Yes' : 'No'}</Text>}

        <Text style={styles.sectionTitle}>Items</Text>
        {order.items.map((item, index) => (
          <View key={index} style={styles.item}>
            <Text>{item.n} - {item.s}</Text>
            <Text>Quantity: {item.q}</Text>
            <Text>Price: {item.p.toFixed(2)} {order.currency.toUpperCase()}</Text>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Shipping Details</Text>
        <View style={styles.addressBlock}>
          <Text>{order.shippingDetails.name}</Text>
          <Text>{order.shippingDetails.address.line1}</Text>
          {order.shippingDetails.address.line2 && <Text>{order.shippingDetails.address.line2}</Text>}
          <Text>{order.shippingDetails.address.city}, {order.shippingDetails.address.state} {order.shippingDetails.address.postal_code}</Text>
          <Text>{order.shippingDetails.address.country}</Text>
        </View>

        {order.billingDetails && (
          <>
            <Text style={styles.sectionTitle}>Billing Details</Text>
            <View style={styles.addressBlock}>
              <Text>{order.billingDetails.name}</Text>
              <Text>{order.billingDetails.address.line1}</Text>
              {order.billingDetails.address.line2 && <Text>{order.billingDetails.address.line2}</Text>}
              <Text>{order.billingDetails.address.city}, {order.billingDetails.address.state} {order.billingDetails.address.postal_code}</Text>
              <Text>{order.billingDetails.address.country}</Text>
            </View>
          </>
        )}

        {order.stripeDetails && (
          <>
            <Text style={styles.sectionTitle}>Stripe Details</Text>
            <Text>Payment ID: {order.stripeDetails.paymentId}</Text>
            <Text>Customer ID: {order.stripeDetails.customerId || 'Guest User'}</Text>
            <Text>Payment Method ID: {order.stripeDetails.paymentMethodId || 'N/A'}</Text>
            <Text>Payment Method Fingerprint: {order.stripeDetails.paymentMethodFingerprint || 'N/A'}</Text>
            <Text>Risk Score: {order.stripeDetails.riskScore !== null ? order.stripeDetails.riskScore : 'N/A'}</Text>
            <Text>Risk Level: {order.stripeDetails.riskLevel || 'N/A'}</Text>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  expressShipping: {
    backgroundColor: '#fff9c4',
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
    backgroundColor: '#ffffff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  addressBlock: {
    marginBottom: 10,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

