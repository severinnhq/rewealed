import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import { Check, X } from 'lucide-react-native';

interface OrderFulfillmentCheckboxProps {
  orderId: string;
  initialFulfilled: boolean;
  onToggle: (orderId: string, fulfilled: boolean) => void;
}

export function OrderFulfillmentCheckbox({ orderId, initialFulfilled, onToggle }: OrderFulfillmentCheckboxProps) {
  const [fulfilled, setFulfilled] = useState(initialFulfilled);

  const handleToggle = async () => {
    const newFulfilled = !fulfilled;
    setFulfilled(newFulfilled);
    onToggle(orderId, newFulfilled);
  };

  return (
    <TouchableOpacity onPress={handleToggle} style={styles.checkbox}>
      <View style={[
        styles.badge,
        fulfilled ? styles.fulfilledBadge : styles.unfulfilledBadge
      ]}>
        {fulfilled ? (
          <>
            <Check size={16} color="#4CAF50" />
            <Text style={styles.badgeText}>Fulfilled</Text>
          </>
        ) : (
          <>
            <X size={16} color="#F44336" />
            <Text style={styles.badgeText}>Unfulfilled</Text>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  checkbox: {
    padding: 4,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  fulfilledBadge: {
    backgroundColor: '#E8F5E9',
  },
  unfulfilledBadge: {
    backgroundColor: '#FFEBEE',
  },
  badgeText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '600',
  },
});

