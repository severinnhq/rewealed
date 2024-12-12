import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { MongoClient } from 'mongodb'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
})

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!
const mongoUri = process.env.MONGODB_URI!

let cachedClient: MongoClient | null = null

async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient
  }

  const client = new MongoClient(mongoUri)
  await client.connect()
  cachedClient = client
  return client
}

export async function POST(req: NextRequest) {
  const buf = await req.arrayBuffer()
  const rawBody = Buffer.from(buf)
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 })
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session
        await saveOrder(session)
        break
      // ... other event handlers ...
    }
  } catch (err) {
    console.error('Error processing webhook event:', err)
    return NextResponse.json({ error: 'Error processing webhook event' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}

async function saveOrder(session: Stripe.Checkout.Session) {
  console.log('Saving order:', session.id)

  const client = await connectToDatabase()
  const db = client.db('webstore')
  const ordersCollection = db.collection('orders')

  let shippingType = 'Unknown'
  if (session.shipping_cost && typeof session.shipping_cost.shipping_rate === 'string') {
    try {
      const shippingRateId = session.shipping_cost.shipping_rate
      const shippingRateDetails = await stripe.shippingRates.retrieve(shippingRateId)
      shippingType = shippingRateDetails.display_name || 'Unknown'
    } catch (error) {
      console.error('Error retrieving shipping rate details:', error)
    }
  }

  const order = {
    sessionId: session.id,
    customerId: session.customer,
    amount: session.amount_total ? session.amount_total / 100 : 0,
    currency: session.currency,
    status: session.payment_status,
    items: JSON.parse(session.metadata?.cartItemsSummary || '[]'),
    shippingDetails: session.shipping_details,
    shippingType: shippingType,
    createdAt: new Date()
  }

  try {
    const result = await ordersCollection.insertOne(order)
    console.log(`Order saved with ID: ${result.insertedId}`)
  } catch (err) {
    console.error('Error saving order to database:', err)
    throw err
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}

