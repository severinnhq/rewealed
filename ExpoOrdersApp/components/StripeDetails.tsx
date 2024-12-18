import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StripeDetails as StripeDetailsType } from '../types/Order';

interface StripeDetailsProps {
  details: StripeDetailsType;
}

export default function StripeDetails({ details }: StripeDetailsProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Stripe Details</Text>
      <Text>Payment ID: {details.paymentId}</Text>
      <Text>Customer ID: {details.customerId || 'Guest User'}</Text>
      <Text>Payment Method ID: {details.paymentMethodId || 'N/A'}</Text>
      <Text>Payment Method Fingerprint: {details.paymentMethodFingerprint || 'N/A'}</Text>
      <Text>Risk Score: {details.riskScore !== null ? details.riskScore : 'N/A'}</Text>
      <Text>Risk Level: {details.riskLevel || 'N/A'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

