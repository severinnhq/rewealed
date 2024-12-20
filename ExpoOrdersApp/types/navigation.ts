import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Orders: undefined;
  OrderDetail: { orderId: string };
  // Add other screen names and their params here
};

export type OrdersScreenProps = NativeStackScreenProps<RootStackParamList, 'Orders'>;
export type OrderDetailScreenProps = NativeStackScreenProps<RootStackParamList, 'OrderDetail'>;
