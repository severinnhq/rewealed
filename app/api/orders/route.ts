import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

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

  if (!challenge && !response) {
    const newChallenge = generateChallenge();
    return NextResponse.json({ challenge: newChallenge }, { status: 200 });
  }

  if (!challenge || !response || !verifyResponse(challenge, response)) {
    return new NextResponse(
      `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Access Denied</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-color: #f0f0f0;
          }
          .container {
            text-align: center;
            padding: 2rem;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          h1 {
            color: #e53e3e;
          }
          p {
            margin-bottom: 1rem;
          }
          a {
            display: inline-block;
            padding: 0.5rem 1rem;
            background-color: #3182ce;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            transition: background-color 0.3s ease;
          }
          a:hover {
            background-color: #2c5282;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Access Denied</h1>
          <p>You do not have permission to access this page.</p>
          <a href="/">Continue Shopping</a>
        </div>
      </body>
      </html>`,
      {
        status: 401,
        headers: { 'Content-Type': 'text/html' },
      }
    );
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

