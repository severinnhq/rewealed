import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Order } from '../types/Order';
import { formatCreatedDate } from '../utils/dateUtils';
import AddressDisplay from './AddressDisplay';
import StripeDetails from './StripeDetails';

interface OrderCardProps {
  order: Order;
}

export default function OrderCard({ order }: OrderCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={[
      styles.card,
      order.shippingType?.toLowerCase().includes('express') ? styles.expressShipping : null
    ]}>
      <View style={styles.header}>
        <Text style={styles.orderId}>Order ID: {order.sessionId}</Text>
        <Text style={[styles.status, { color: order.status === 'paid' ? 'green' : 'orange' }]}>
          {order.status}
        </Text>
      </View>
      <View style={styles.details}>
        <Text>Amount: {order.amount ? order.amount.toFixed(2) : 'N/A'} {order.currency?.toUpperCase() || 'N/A'}</Text>
        <Text>Created: {formatCreatedDate(order.createdAt)}</Text>
        <Text>Shipping Type: {order.shippingType || 'N/A'}</Text>
      </View>
      {order.items && order.items.length > 0 && (
        <View style={styles.items}>
          <Text style={styles.sectionTitle}>Items</Text>
          {order.items.map((item, index) => (
            <View key={index} style={styles.item}>
              <Text>{item.n} - {item.s}</Text>
              <Text>Quantity: {item.q}</Text>
              <Text>Price: {item.p ? item.p.toFixed(2) : 'N/A'} {order.currency?.toUpperCase() || 'N/A'}</Text>
            </View>
          ))}
        </View>
      )}
      {order.shippingDetails && (
        <View style={styles.shippingDetails}>
          <Text style={styles.sectionTitle}>Shipping Details</Text>
          <AddressDisplay address={order.shippingDetails.address} name={order.shippingDetails.name} />
        </View>
      )}
      <TouchableOpacity onPress={() => setExpanded(!expanded)} style={styles.expandButton}>
        <Text>{expanded ? 'Hide Additional Details' : 'Show Additional Details'}</Text>
      </TouchableOpacity>
      {expanded && (
        <View style={styles.expandedDetails}>
          {order.billingDetails && (
            <View style={styles.billingDetails}>
              <Text style={styles.sectionTitle}>Billing Details</Text>
              <AddressDisplay address={order.billingDetails.address} name={order.billingDetails.name} />
            </View>
          )}
          {order.stripeDetails && (
            <StripeDetails details={order.stripeDetails} />
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  expressShipping: {
    backgroundColor: '#FFFBEA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  orderId: {
    fontWeight: 'bold',
  },
  status: {
    fontWeight: 'bold',
  },
  details: {
    marginBottom: 10,
  },
  shippingDetails: {
    marginBottom: 15,
  },
  expandButton: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  expandedDetails: {
    marginTop: 10,
  },
  items: {
    marginBottom: 15,
  },
  item: {
    marginBottom: 10,
    paddingLeft: 10,
    borderLeftWidth: 2,
    borderLeftColor: '#e0e0e0',
  },
  billingDetails: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

