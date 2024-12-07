import { NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI 
const client = new MongoClient(uri as string)

export async function POST(request: Request) {
  const { email, productId, productName } = await request.json()

  try {
    await client.connect()
    const database = client.db('webstore')
    const notifyCollection = database.collection('notify')

    // Check if the email already exists for this product
    const existingNotification = await notifyCollection.findOne({ email, productId })

    if (existingNotification) {
      return NextResponse.json({ message: 'You are already subscribed to notifications for this product.' }, { status: 400 })
    }

    const result = await notifyCollection.insertOne({
      email,
      productId,
      productName,
      createdAt: new Date()
    })

    return NextResponse.json({ message: 'Email saved successfully', id: result.insertedId }, { status: 200 })
  } catch (error) {
    console.error('Error saving email:', error)
    return NextResponse.json({ message: 'Error saving email' }, { status: 500 })
  } finally {
    await client.close()
  }
}

