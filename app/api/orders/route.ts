import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import { Expo } from 'expo-server-sdk';

const mongoUri = process.env.MONGODB_URI!;
const expo = new Expo();

interface Address {
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

interface ShippingDetails {
  name: string;
  address: Address;
}

interface BillingDetails {
  name: string;
  address: Address;
}

interface StripeDetails {
  paymentId: string;
  customerId: string | null;
  paymentMethodId: string | null;
  paymentMethodFingerprint: string | null;
  riskScore: number | null;
  riskLevel: string | null;
}

interface Order {
  _id: ObjectId;
  sessionId: string;
  amount: number;
  currency: string;
  status: string;
  items?: Array<{
    n: string;
    s: string;
    q: number;
    p: number;
  }>;
  shippingDetails?: ShippingDetails;
  billingDetails?: BillingDetails;
  stripeDetails?: StripeDetails;
  createdAt: Date;
  shippingType?: string;
}

function generateChallenge(): string {
  return Math.random().toString(36).substring(2, 15);
}

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16);
}

function verifyResponse(challenge: string, response: string): boolean {
  const expectedResponse = simpleHash(challenge + 'rewealed_secret');
  return response === expectedResponse;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const challenge = searchParams.get('challenge');
  const response = searchParams.get('response');
  const acceptHeader = request.headers.get('accept');

  if (acceptHeader && acceptHeader.includes('text/html')) {
    return new NextResponse(
      `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>404 - Page Not Found</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="flex items-center justify-center h-screen bg-gray-100">
        <h1 class="text-4xl font-bold text-gray-700">404 - Page Not Found</h1>
      </body>
      </html>
      `,
      { headers: { 'Content-Type': 'text/html' } }
    );
  }

  if (!challenge || !response || !verifyResponse(challenge, response)) {
    return NextResponse.json({ error: 'Invalid verification' }, { status: 403 });
  }

  const client = new MongoClient(mongoUri);

  try {
    await client.connect();
    const db = client.db('webstore');
    const ordersCollection = db.collection<Order>('orders');

    const orders = await ordersCollection
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(
      orders.map((order) => ({
        ...order,
        shippingDetails: order.shippingDetails || 'No shipping details available',
        billingDetails: order.billingDetails || 'No billing details available',
        stripeDetails: order.stripeDetails || 'No Stripe details available',
      }))
    );
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  } finally {
    await client.close();
  }
}
