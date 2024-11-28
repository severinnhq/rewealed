import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

interface CompactCartItem {
  id: string
  size: string
  quantity: number
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
      const session = event.data.object as Stripe.Checkout.Session

      try {
        await saveOrderToDatabase(session)
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

async function saveOrderToDatabase(session: Stripe.Checkout.Session) {
  const client = await clientPromise
  const db = client.db("webstore")

  const cartItemsSummary = JSON.parse(session.metadata?.cartItemsSummary || '[]') as CompactCartItem[]
  const shippingDetails = session.shipping_details

  // Fetch full product details from the database
  const productIds = cartItemsSummary.map(item => item.id)
  const products = await db.collection("products").find({ _id: { $in: productIds.map(id => new ObjectId(id)) } }).toArray()

  const orderItems = cartItemsSummary.map(item => {
    const product = products.find(p => p._id.toString() === item.id)
    return {
      productId: item.id,
      name: product?.name,
      price: product?.salePrice || product?.price,
      quantity: item.quantity,
      size: item.size,
    }
  })

  const order = {
    stripeSessionId: session.id,
    customerEmail: session.customer_details?.email,
    orderItems,
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
    totalAmount: session.amount_total ? session.amount_total / 100 : 0,
    currency: session.currency,
    paymentStatus: session.payment_status,
    createdAt: new Date(),
  }

  await db.collection("orders").insertOne(order)
}

export const config = {
  api: {
    bodyParser: false,
  },
}

