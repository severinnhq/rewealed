import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

const mongoUri = process.env.MONGODB_URI as string;
const API_KEY = process.env.API_KEY as string;

export async function GET(req: NextRequest) {
  // Check for API key
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${API_KEY}`) {
    // Return a custom 404-like HTML response
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
      <body class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div class="text-center">
          <h1 class="text-6xl font-bold text-gray-800 mb-4">404</h1>
          <p class="text-2xl text-gray-600 mb-8">Oops! Page not found</p>
          <p class="text-lg text-gray-500 mb-8">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          <a href="/" class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
            Continue Shopping
          </a>
        </div>
      </body>
      </html>
      `,
      {
        status: 404,
        headers: {
          'Content-Type': 'text/html',
        },
      }
    );
  }

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

