import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import clientPromise from '../../../lib/mongodb';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia', // Use the latest API version
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.json({ error: 'Missing session_id' }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items'],
    });

    const client = await clientPromise;
    const db = client.db("clothingstore");

    const orderDetails = {
      orderId: session.id,
      amount: session.amount_total,
      shippingAddress: JSON.parse(session.metadata?.shippingAddress || '{}'),
      items: session.line_items?.data,
      paymentStatus: session.payment_status,
      createdAt: new Date(),
    };

    await db.collection("orders").insertOne(orderDetails);

    return NextResponse.json(orderDetails);
  } catch (error) {
    console.error('Error fetching order details:', error);
    return NextResponse.json({ error: 'Error fetching order details' }, { status: 500 });
  }
}

