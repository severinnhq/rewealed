import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, RefreshControl, Image, ScrollView, Dimensions, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, OrdersScreenProps } from '../types/navigation';
import { format } from 'date-fns';

type OrdersScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Orders'>;

interface Order {
  _id: string;
  sessionId: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  shippingType?: string;
  fulfilled?: boolean;
}

interface CarComparison {
  name: string;
  image: any;
  price: number;
}

const API_URL = 'https://rewealed.com/api/orders';
const CORVETTE_PRICE_EUR = 120000;
const MASERATI_PRICE_EUR = 118421; // Converted from 45,000,000 HUF
const LAMBORGHINI_PRICE_EUR = 200000;

const carComparisons: CarComparison[] = [
  { name: 'Maserati GranTurismo', image: require('../assets/maserati.png'), price: MASERATI_PRICE_EUR },
  { name: 'Corvette ZR1', image: require('../assets/corvette.png'), price: CORVETTE_PRICE_EUR },
  { name: 'Lamborghini', image: require('../assets/lambo.png'), price: LAMBORGHINI_PRICE_EUR },
];

const { width: SCREEN_WIDTH } = Dimensions.get('window');

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16);
}

export default function OrdersScreen({ navigation }: OrdersScreenProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalAmountEUR, setTotalAmountEUR] = useState(0);
  const [currentCarIndex, setCurrentCarIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      // First, get the challenge
      const challengeResponse = await fetch(`${API_URL}?`);
      const challengeData = await challengeResponse.json();
      const challenge = challengeData.challenge;

      // Generate the response
      const response = simpleHash(challenge + 'rewealed_secret');

      // Now fetch the orders with the challenge-response
      const ordersResponse = await fetch(`${API_URL}?challenge=${challenge}&response=${response}`);

      if (!ordersResponse.ok) {
        throw new Error(`HTTP error! status: ${ordersResponse.status}`);
      }
      
      const data = await ordersResponse.json();
      setOrders(data);
      
      // Calculate total amount in EUR
      const total = data.reduce((sum: number, order: Order) => {
        // Assuming all amounts are in USD, convert to EUR
        return sum + (order.amount * 0.85); // Using a fixed exchange rate for simplicity
      }, 0);
      setTotalAmountEUR(total);
      
      setError(null);
    } catch (error) {
      console.error('Error fetching orders:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      setError(`Failed to fetch orders. ${errorMessage}`);
      Alert.alert('Error', `Failed to fetch orders. ${errorMessage}`);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
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

  const renderOrderItem = ({ item }: { item: Order }) => (
    <TouchableOpacity
      style={[
        styles.orderItem,
        item.shippingType?.toLowerCase().includes('express') && styles.expressShipping
      ]}
      onPress={() => navigation.navigate('OrderDetail', { orderId: item._id })}
    >
      <Text style={styles.orderTitle}>Order ID: {item.sessionId}</Text>
      <Text>Amount: €{(item.amount * 0.85).toFixed(2)} EUR</Text>
      <Text>Status: {item.status}</Text>
      <Text>Created: {formatCreatedDate(item.createdAt)}</Text>
      {item.shippingType && <Text>Shipping: {item.shippingType}</Text>}
      {item.fulfilled !== undefined && <Text>Fulfilled: {item.fulfilled ? 'Yes' : 'No'}</Text>}
    </TouchableOpacity>
  );

  const renderComparison = (car: CarComparison, index: number) => {
    const progressPercentage = (totalAmountEUR / car.price) * 100;

    return (
      <View key={index} style={styles.comparisonContainer}>
        <Image 
          source={car.image}
          style={car.name === 'Lamborghini' ? styles.lamboImage : styles.carImage} 
          resizeMode="contain"
        />
        <View style={styles.progressContainer}>
          <Text style={styles.totalText}>Total: €{totalAmountEUR.toFixed(2)} EUR</Text>
          <Text style={styles.progressText}>
            {progressPercentage.toFixed(2)}% of {car.name}
          </Text>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${Math.min(progressPercentage, 100)}%` }]} />
          </View>
          <Text style={styles.progressRatioText}>
            €{totalAmountEUR.toFixed(2)} / €{car.price.toFixed(2)}
          </Text>
        </View>
      </View>
    );
  };

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const index = Math.round(contentOffset.x / SCREEN_WIDTH);
    setCurrentCarIndex(index);
  }, [SCREEN_WIDTH]);

  const scrollToIndex = (index: number) => {
    scrollViewRef.current?.scrollTo({ x: index * SCREEN_WIDTH, animated: true });
  };

  if (loading && !refreshing) {
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
      <View style={styles.comparisonWrapper}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          decelerationRate="fast"
          snapToInterval={SCREEN_WIDTH}
          snapToAlignment="center"
        >
          {carComparisons.map((car, index) => renderComparison(car, index))}
        </ScrollView>
        <View style={styles.paginationContainer}>
          {carComparisons.map((_, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.paginationDot, index === currentCarIndex && styles.paginationDotActive]}
              onPress={() => scrollToIndex(index)}
            />
          ))}
        </View>
      </View>
      {orders.length > 0 ? (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item._id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
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
    backgroundColor: '#f0f0f0',
  },
  comparisonContainer: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    width: SCREEN_WIDTH,
    paddingVertical: 10,
    paddingBottom: 30,
  },
  carImage: {
    width: '100%',
    height: 120,
    marginBottom: 8,
  },
  lamboImage: {
    width: '140%',
    height: 120,
    marginLeft: 0,
    marginBottom: 8,
  },
  progressContainer: {
    width: '100%',
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
    textAlign: 'center',
  },
  progressText: {
    fontSize: 13,
    marginBottom: 2,
    textAlign: 'center',
  },
  progressBarContainer: {
    height: 12,
    backgroundColor: '#ecebef',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 4,
    width: '80%',
    alignSelf: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#050120',
    borderRadius: 6,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  progressRatioText: {
    fontSize: 11,
    textAlign: 'center',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#ffffff',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#050120',
  },
  orderItem: {
    backgroundColor: '#ffffff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
  },
  expressShipping: {
    backgroundColor: '#fff9c4',
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
  comparisonWrapper: {
    position: 'relative',
    backgroundColor: '#ffffff',
  },
});

