import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("webstore")
    
    // Check if email already exists
    const existingSubscriber = await db.collection("subscribers").findOne({ email })
    
    if (existingSubscriber) {
      return NextResponse.json({ message: 'Email already subscribed' }, { status: 200 })
    }

    // Insert new subscriber
    await db.collection("subscribers").insertOne({
      email,
      subscribedAt: new Date(),
    })

    return NextResponse.json({ message: 'Subscribed successfully' }, { status: 201 })
  } catch (error) {
    console.error('Subscription error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

