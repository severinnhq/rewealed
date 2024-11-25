'use client';

import { useEffect, useState } from 'react';
// import { useSearchParams } from 'next/navigation';

export default function SuccessPage() {
  const [orderDetails, setOrderDetails] = useState<any>(null);
  // const searchParams = useSearchParams();
  // const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');
    if (sessionId) {
      fetchOrderDetails(sessionId);
    }
  }, []);

  const fetchOrderDetails = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/order-details?session_id=${sessionId}`);
      const data = await response.json();
      setOrderDetails(data);
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  };

  if (!orderDetails) {
    return <div>Loading order details...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Order Successful!</h1>
      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
        <strong className="font-bold">Thank you for your purchase!</strong>
        <span className="block sm:inline"> Your order has been successfully placed.</span>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Order Details</h2>
        <p><strong>Order ID:</strong> {orderDetails.orderId}</p>
        <p><strong>Total Amount:</strong> ${orderDetails.amount / 100}</p>
        <p><strong>Shipping Address:</strong></p>
        <address>
          {orderDetails.shippingAddress.name}<br />
          {orderDetails.shippingAddress.address}<br />
          {orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state} {orderDetails.shippingAddress.postalCode}<br />
          {orderDetails.shippingAddress.country}
        </address>
      </div>
    </div>
  );
}

