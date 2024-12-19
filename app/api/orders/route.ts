import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import { Expo } from 'expo-server-sdk';
import crypto from 'crypto';

const mongoUri = process.env.MONGODB_URI!;
const expo = new Expo();

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
  shippingDetails?: {
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
  createdAt: Date;
  shippingType?: string;
}

function generateChallenge(): string {
  return crypto.randomBytes(16).toString('hex');
}

function simpleHash(str: string): string {
  return crypto.createHash('sha256').update(str).digest('hex');
}

function verifyResponse(challenge: string, response: string): boolean {
  const expectedResponse = simpleHash(challenge + 'rewealed_secret');
  return response === expectedResponse;
}

async function sendPushNotification(pushToken: string) {
  const messages = [{
    to: pushToken,
    sound: 'default',
    title: 'New Order',
    body: 'A new order has been placed!',
    data: { type: 'new_order' },
  }];

  try {
    await expo.sendPushNotificationsAsync(messages);
  } catch (error) {
    console.error('Error sending push notification:', error);
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const challenge = searchParams.get('challenge');
  const response = searchParams.get('response');
  const id = searchParams.get('id');

  // If there's no challenge or response, generate a new challenge
  if (!challenge && !response) {
    const newChallenge = generateChallenge();
    return NextResponse.json({ challenge: newChallenge }, { status: 200 });
  }

  // Verify the challenge-response
  if (!challenge || !response || !verifyResponse(challenge, response)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const client = new MongoClient(mongoUri);

  try {
    await client.connect();
    const db = client.db('webstore');
    const ordersCollection = db.collection('orders');

    let orders: Order[];

    if (id) {
      const order = await ordersCollection.findOne({ _id: new ObjectId(id) });
      orders = order ? [order as Order] : [];
    } else {
      const fetchedOrders = await ordersCollection.find().sort({ createdAt: -1 }).toArray();
      
      orders = fetchedOrders.filter((order): order is Order => {
        return (
          typeof order.sessionId === 'string' &&
          typeof order.amount === 'number' &&
          typeof order.currency === 'string' &&
          typeof order.status === 'string' &&
          order.createdAt instanceof Date
        );
      });
    }

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  } finally {
    await client.close();
  }
}

export async function POST(request: Request) {
  const { pushToken } = await request.json();
  
  if (!pushToken) {
    return NextResponse.json({ error: 'Push token is required' }, { status: 400 });
  }

  const client = new MongoClient(mongoUri);

  try {
    await client.connect();
    const db = client.db('webstore');
    const ordersCollection = db.collection('orders');

    const changeStream = ordersCollection.watch();

    changeStream.on('change', async (change) => {
      if (change.operationType === 'insert') {
        await sendPushNotification(pushToken);
      }
    });

    return NextResponse.json({ message: 'Webhook registered successfully' });
  } catch (error) {
    console.error('Failed to register webhook:', error);
    return NextResponse.json({ error: 'Failed to register webhook' }, { status: 500 });
  }
}

