import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const mongoUri = process.env.MONGODB_URI!;

export async function POST(request: Request) {
  const client = new MongoClient(mongoUri);

  try {
    await client.connect();
    const db = client.db('webstore');
    const pushTokensCollection = db.collection('push_tokens');

    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 400 });
    }

    await pushTokensCollection.updateOne(
      { token },
      { $set: { token, updatedAt: new Date() } },
      { upsert: true }
    );

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Failed to register push token:', error);
    return NextResponse.json({ error: 'Failed to register push token' }, { status: 500 });
  } finally {
    await client.close();
  }
}

