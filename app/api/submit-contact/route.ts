import { NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
const client = new MongoClient(uri as string)

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json()

    await client.connect()
    const database = client.db('webstore')
    const collection = database.collection('contacts')

    const result = await collection.insertOne({
      name,
      email,
      message,
      createdAt: new Date()
    })

    return NextResponse.json({ success: true, id: result.insertedId })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ success: false, error: 'Failed to submit contact form' }, { status: 500 })
  } finally {
    await client.close()
  }
}

