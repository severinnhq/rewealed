import { NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'

const mongoUri = process.env.MONGODB_URI!

export async function GET() {
  const client = new MongoClient(mongoUri)
  try {
    await client.connect()
    const db = client.db('webstore')
    const ordersCollection = db.collection('orders')

    const orders = await ordersCollection
      .find()
      .sort({ createdAt: -1 })
      .toArray()

    // Log the orders being sent
    console.log('Sending orders:', JSON.stringify(orders, null, 2))

    return NextResponse.json(orders)
  } catch (error) {
    console.error('Failed to fetch orders:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  } finally {
    await client.close()
  }
}

