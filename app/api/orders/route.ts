import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import crypto from 'crypto';

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
  return crypto.randomBytes(16).toString('hex');
}

function verifyResponse(challenge: string, response: string): boolean {
  const expectedResponse = crypto.createHash('sha256').update(challenge + 'rewealed_secret').digest('hex');
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

