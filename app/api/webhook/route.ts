import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { MongoClient, ObjectId } from 'mongodb'
import { Expo } from 'expo-server-sdk'

interface StripeDetails {
  paymentId: string;
  customerId: string | null;
  paymentMethodId: string | null;
  paymentMethodFingerprint: string | null | undefined;
  riskScore: number | null | undefined;
  riskLevel: string | null | undefined;
}

interface OrderItem {
  n: string; // name
  s: string; // size
  q: number; // quantity
  p: number; // price
}

interface Order {
  _id?: ObjectId;
  sessionId: string;
  customerId: string | Stripe.Customer | Stripe.DeletedCustomer | null;
  amount: number;
  currency: string | null;
  status: Stripe.Checkout.Session.PaymentStatus;
  items: OrderItem[];
  shippingDetails: Stripe.Checkout.Session.ShippingDetails | null;
  billingDetails: Stripe.Charge.BillingDetails | null;
  shippingType: string;
  stripeDetails: StripeDetails | null;
  createdAt: Date;
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
})

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!
const mongoUri = process.env.MONGODB_URI!

let cachedClient: MongoClient | null = null
const expo = new Expo()

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
        const order = await saveOrder(session)
        if (order) {
          await sendPushNotification(order)
        }
        break
      // ... other event handlers ...
    }
  } catch (err) {
    console.error('Error processing webhook event:', err)
    return NextResponse.json({ error: 'Error processing webhook event' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}

async function saveOrder(session: Stripe.Checkout.Session): Promise<Order> {
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

  // Retrieve billing details and additional Stripe data
  let billingDetails: Stripe.Charge.BillingDetails | null = null
  let stripeDetails: StripeDetails | null = null
  if (session.payment_intent && typeof session.payment_intent === 'string') {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent, {
        expand: ['latest_charge', 'payment_method', 'customer']
      })
      if (paymentIntent.latest_charge && typeof paymentIntent.latest_charge !== 'string') {
        billingDetails = paymentIntent.latest_charge.billing_details
      }
      stripeDetails = {
        paymentId: paymentIntent.id,
        customerId: paymentIntent.customer && typeof paymentIntent.customer === 'object' ? paymentIntent.customer.id : null,
        paymentMethodId: paymentIntent.payment_method && typeof paymentIntent.payment_method === 'object' ? paymentIntent.payment_method.id : null,
        paymentMethodFingerprint: paymentIntent.payment_method && typeof paymentIntent.payment_method === 'object' && paymentIntent.payment_method.card ? paymentIntent.payment_method.card.fingerprint : null,
        riskScore: paymentIntent.latest_charge && typeof paymentIntent.latest_charge === 'object' && paymentIntent.latest_charge.outcome ? paymentIntent.latest_charge.outcome.risk_score : null,
        riskLevel: paymentIntent.latest_charge && typeof paymentIntent.latest_charge === 'object' && paymentIntent.latest_charge.outcome ? paymentIntent.latest_charge.outcome.risk_level : null
      }
    } catch (error) {
      console.error('Error retrieving payment details:', error)
    }
  }

  const order: Omit<Order, '_id'> = {
    sessionId: session.id,
    customerId: session.customer,
    amount: session.amount_total != null ? session.amount_total / 100 : 0,
    currency: session.currency ?? null,
    status: session.payment_status,
    items: JSON.parse(session.metadata?.cartItemsSummary || '[]') as OrderItem[],
    shippingDetails: session.shipping_details ?? null,
    billingDetails: billingDetails,
    shippingType: shippingType,
    stripeDetails: stripeDetails,
    createdAt: new Date()
  }

  try {
    const result = await ordersCollection.insertOne(order)
    console.log(`Order saved with ID: ${result.insertedId}`)
    return { ...order, _id: result.insertedId }
  } catch (err) {
    console.error('Error saving order to database:', err)
    throw err
  }
}

async function sendPushNotification(order: Order) {
  const client = await connectToDatabase()
  const db = client.db('webstore')
  const pushTokensCollection = db.collection('push_tokens')

  const pushTokens = await pushTokensCollection.find({}).toArray()

  for (const { token } of pushTokens) {
    if (!Expo.isExpoPushToken(token)) {
      console.error(`Push token ${token} is not a valid Expo push token`)
      continue
    }

    const message = {
      to: token,
      sound: 'default',
      title: 'New Order Received',
      body: `Order ID: ${order._id ? order._id.toString() : 'Unknown'}, Amount: ${order.amount} ${order.currency}`,
      data: { orderId: order._id ? order._id.toString() : 'Unknown' },
    }

    try {
      const ticket = await expo.sendPushNotificationsAsync([message])
      console.log('Push notification sent:', ticket)
    } catch (error) {
      console.error('Error sending push notification:', error)
    }
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}

