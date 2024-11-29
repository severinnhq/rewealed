import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
})

interface CartItem {
  product: {
    _id: string
    name: string
    price: number
    salePrice?: number
    mainImage: string
  }
  size: string
  quantity: number
}

export async function POST(request: NextRequest) {
  try {
    const cartItems: CartItem[] = await request.json()
    console.log('Received cart items:', JSON.stringify(cartItems, null, 2))

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      console.error('Invalid cart items:', cartItems)
      return NextResponse.json({ error: 'Invalid cart items' }, { status: 400 })
    }

    const lineItems = cartItems.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: `${item.product.name} (${item.size})`,
          images: [`${process.env.NEXT_PUBLIC_BASE_URL}/api/product-image?filename=${encodeURIComponent(item.product.mainImage)}`],
          metadata: {
            productId: item.product._id,
            size: item.size,
          },
        },
        unit_amount: item.product.salePrice 
          ? Math.round(item.product.salePrice * 100)
          : Math.round(item.product.price * 100),
      },
      quantity: item.quantity,
    }))

    console.log('Line items:', JSON.stringify(lineItems, null, 2))

    // Create a compact version of cart items for metadata
    const compactCartItems = cartItems.map(item => ({
      id: item.product._id,
      n: item.product.name,
      s: item.size,
      q: item.quantity,
      p: item.product.salePrice || item.product.price
    }))

    // Convert to JSON and truncate if necessary
    let cartItemsSummary = JSON.stringify(compactCartItems)
    if (cartItemsSummary.length > 500) {
      cartItemsSummary = cartItemsSummary.substring(0, 497) + '...'
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB'], // Add more countries as needed
      },
      metadata: {
        cartItemsSummary: cartItemsSummary
      },
    })

    console.log('Stripe session created:', session.id)
    return NextResponse.json({ sessionId: session.id })
  } catch (err: unknown) {
    console.error('Stripe session creation error:', err)
    if (err instanceof Stripe.errors.StripeError) {
      console.error('Stripe error details:', err.message, err.type, err.raw)
    }
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'An unknown error occurred' },
      { status: 500 }
    )
  }
}

