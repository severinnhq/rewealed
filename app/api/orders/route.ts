import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

const mongoUri = process.env.MONGODB_URI as string;

export async function GET(req: NextRequest) {
  const client = new MongoClient(mongoUri);

  try {
    await client.connect();
    const db = client.db('webstore');
    const ordersCollection = db.collection('orders');

    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (id) {
      // Fetch a single order
      const order = await ordersCollection.findOne({ _id: new ObjectId(id) });
      if (order) {
        return NextResponse.json(order);
      } else {
        return NextResponse.json({ message: 'Order not found' }, { status: 404 });
      }
    } else {
      // Fetch all orders
      const orders = await ordersCollection.find().sort({ createdAt: -1 }).toArray();
      return NextResponse.json(orders);
    }
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  } finally {
    await client.close();
  }
}

