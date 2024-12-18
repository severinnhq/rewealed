import { NextRequest, NextResponse } from 'next/server'
import { MongoClient, ObjectId } from 'mongodb'

const mongoUri = process.env.MONGODB_URI!

export async function POST(req: NextRequest) {
  // Add CORS headers
  const headers = new Headers({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return new NextResponse(null, { headers });
  }

  const { orderId, fulfilled } = await req.json()

  if (!orderId || typeof fulfilled !== 'boolean') {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400, headers })
  }

  const client = new MongoClient(mongoUri)

  try {
    await client.connect()
    const db = client.db('webstore')
    const ordersCollection = db.collection('orders')

    const result = await ordersCollection.updateOne(
      { _id: new ObjectId(orderId) },
      { $set: { fulfilled: fulfilled } }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404, headers })
    }

    return NextResponse.json({ success: true }, { headers })
  } catch (error) {
    console.error('Error updating order fulfillment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers })
  } finally {
    await client.close()
  }
}

