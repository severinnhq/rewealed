import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import clientPromise from '@/lib/mongodb'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

interface CartItem {
  id: string
  name: string
  size: string
  quantity: number
  price: number
  image: string
}

interface ExtendedCheckoutSession extends Stripe.Checkout.Session {
  shipping_rate?: {
    display_name?: string;
  };
}

export async function POST(req: NextRequest) {
  if (req.method === 'POST') {
    const body = await req.text()
    const sig = req.headers.get('stripe-signature')!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
    } catch (err) {
      console.error(`Webhook Error: ${err instanceof Error ? err.message : 'Unknown error'}`)
      return NextResponse.json({ error: 'Webhook error' }, { status: 400 })
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as ExtendedCheckoutSession

      try {
        await saveOrderToDatabase(session)
        console.log('Order saved successfully')
        return NextResponse.json({ received: true })
      } catch (err) {
        console.error('Error saving order to database:', err)
        return NextResponse.json({ error: 'Error saving order' }, { status: 500 })
      }
    }

    return NextResponse.json({ received: true })
  } else {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
  }
}

async function saveOrderToDatabase(session: ExtendedCheckoutSession) {
  const client = await clientPromise
  const db = client.db("webstore")

  const cartItemsSummary = JSON.parse(session.metadata?.cartItemsSummary || '[]') as CartItem[]
  const shippingDetails = session.shipping_details
  const billingDetails = session.customer_details

  const shippingRateName = session.shipping_rate?.display_name?.toLowerCase() || '';
  const shippingType = shippingRateName.includes('express') ? 'Express' : 'Standard';

  const order = {
    stripeSessionId: session.id,
    customerName: billingDetails?.name || '',
    customerEmail: billingDetails?.email || '',
    orderItems: cartItemsSummary,
    totalAmount: session.amount_total ? session.amount_total / 100 : 0,
    shippingAddress: {
      name: shippingDetails?.name,
      address: {
        line1: shippingDetails?.address?.line1,
        line2: shippingDetails?.address?.line2,
        city: shippingDetails?.address?.city,
        state: shippingDetails?.address?.state,
        postalCode: shippingDetails?.address?.postal_code,
        country: shippingDetails?.address?.country,
      },
    },
    billingAddress: {
      name: billingDetails?.name,
      address: {
        line1: billingDetails?.address?.line1,
        line2: billingDetails?.address?.line2,
        city: billingDetails?.address?.city,
        state: billingDetails?.address?.state,
        postalCode: billingDetails?.address?.postal_code,
        country: billingDetails?.address?.country,
      },
    },
    paymentStatus: session.payment_status,
    paymentMethod: session.payment_method_types?.[0] || 'Unknown',
    orderDate: new Date(),
    fulfilled: false,
    shippingType: shippingType,
  }

  const result = await db.collection("orders").insertOne(order)
  console.log(`Order inserted with ID: ${result.insertedId}`)

  return result
}

export const config = {
  api: {
    bodyParser: false,
  },
}

