import { NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
const client = new MongoClient(uri as string)

export async function GET() {
  try {
    await client.connect()
    const database = client.db('webstore')
    const collection = database.collection('contacts')

    const contacts = await collection.find({}).sort({ createdAt: -1 }).toArray()

    return NextResponse.json({ success: true, contacts })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch contacts' }, { status: 500 })
  } finally {
    await client.close()
  }
}

