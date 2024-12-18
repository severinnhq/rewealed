import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Address } from '../types/Order';

interface AddressDisplayProps {
  address: Address;
  name: string;
}

export default function AddressDisplay({ address, name }: AddressDisplayProps) {
  return (
    <View style={styles.container}>
      <Text>{name}</Text>
      <Text>{address.line1}</Text>
      {address.line2 && <Text>{address.line2}</Text>}
      <Text>{address.city}, {address.state} {address.postal_code}</Text>
      <Text>{address.country}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
});

