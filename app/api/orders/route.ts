import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

const mongoUri = process.env.MONGODB_URI as string;
const API_KEY = process.env.API_KEY as string;

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  // Check for API key
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${API_KEY}`) {
    console.log('Unauthorized access attempt');
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const client = new MongoClient(mongoUri);

  try {
    await client.connect();
    const db = client.db('webstore');
    const ordersCollection = db.collection('orders');

    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (id) {
      const order = await ordersCollection.findOne({ _id: new ObjectId(id) });
      if (order) {
        return new NextResponse(JSON.stringify(order), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } else {
        return new NextResponse(JSON.stringify({ message: 'Order not found' }), {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }
    } else {
      const orders = await ordersCollection.find().sort({ createdAt: -1 }).toArray();
      return new NextResponse(JSON.stringify(orders), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  } catch (error) {
    console.error('Error in API route:', error);
    return new NextResponse(JSON.stringify({ message: 'Internal Server Error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } finally {
    await client.close();
  }
}

