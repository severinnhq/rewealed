import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db("webstore")
    const orders = await db.collection("orders").find({}).sort({ orderDate: -1 }).toArray()

    return NextResponse.json(orders)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ message: 'Error fetching orders' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { orderId, fulfilled } = await request.json()
    const client = await clientPromise
    const db = client.db("webstore")
    
    const result = await db.collection("orders").updateOne(
      { _id: new ObjectId(orderId) },
      { $set: { fulfilled: fulfilled } }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Order updated successfully' })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ message: 'Error updating order' }, { status: 500 })
  }
}

