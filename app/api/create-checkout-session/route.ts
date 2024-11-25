import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia', // Use the latest API version
});

export async function POST(request: Request) {
  try {
    const { items, shippingAddress } = await request.json();

    const client = await clientPromise;
    const db = client.db("clothingstore");

    const lineItems = await Promise.all(items.map(async (item: any) => {
      const product = await db.collection("products").findOne({ _id: new ObjectId(item.product._id) });
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: product!.name,
            images: [product!.image],
          },
          unit_amount: product!.price * 100, // Stripe expects amounts in cents
        },
        quantity: item.quantity,
      };
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/cancel`,
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'AU'], // Add more country codes as needed
      },
      metadata: {
        shippingAddress: JSON.stringify(shippingAddress),
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json({ error: 'Error creating checkout session' }, { status: 500 });
  }
}

