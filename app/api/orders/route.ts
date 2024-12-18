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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  const client = new MongoClient(mongoUri);

  try {
    await client.connect();
    const db = client.db('webstore');
    const ordersCollection = db.collection('orders');

    let orders: Order[];

    if (id) {
      // Fetch a single order
      const order = await ordersCollection.findOne({ _id: new ObjectId(id) });
      orders = order ? [order as Order] : [];
    } else {
      // Fetch all orders
      const fetchedOrders = await ordersCollection.find().sort({ createdAt: -1 }).toArray();
      
      // Validate and cast each order
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

