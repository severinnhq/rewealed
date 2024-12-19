import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import { sendPushNotification } from '../utils/pushNotifications';

const mongoUri = process.env.MONGODB_URI!;

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

  // If the request is from a browser (HTML), serve the HTML page
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
        <style>
          .bg-404::before {
            content: '404';
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 20vw;
            font-weight: bold;
            opacity: 0.1;
            z-index: -1;
          }
        </style>
      </head>
      <body class="bg-white flex items-center justify-center min-h-screen bg-404">
        <a href="/" class="text-2xl bg-black hover:bg-gray-800 text-white font-bold py-3 px-6 rounded transition duration-300 ease-in-out z-10">
          Continue Shopping
        </a>
      </body>
      </html>
      `,
      {
        headers: { 'Content-Type': 'text/html' },
        status: 404,
      }
    );
  }

  // Handle the challenge-response for API requests
  if (!challenge && !response) {
    const newChallenge = generateChallenge();
    return NextResponse.json({ challenge: newChallenge }, { status: 200 });
  }

  if (!challenge || !response || !verifyResponse(challenge, response)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const id = searchParams.get('id');

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
  const client = new MongoClient(mongoUri);

  try {
    await client.connect();
    const db = client.db('webstore');
    const ordersCollection = db.collection('orders');

    const newOrder = await request.json();
    const result = await ordersCollection.insertOne(newOrder);

    // Send push notification for new order
    const pushToken = process.env.EXPO_PUSH_TOKEN;
    if (pushToken) {
      await sendPushNotification(
        pushToken,
        'New Order Received',
        `Order ID: ${result.insertedId}`
      );
    }

    return NextResponse.json({ success: true, orderId: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error('Failed to create order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  } finally {
    await client.close();
  }
}

