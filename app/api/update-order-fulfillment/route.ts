import { NextRequest, NextResponse } from 'next/server'
import { MongoClient, ObjectId } from 'mongodb'

const mongoUri = process.env.MONGODB_URI!

export async function POST(req: NextRequest) {
  const { orderId, fulfilled } = await req.json()

  if (!orderId || typeof fulfilled !== 'boolean') {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
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
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating order fulfillment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  } finally {
    await client.close()
  }
}

