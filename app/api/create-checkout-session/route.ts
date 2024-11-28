import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-11-20.acacia',
})

// Helper function to get the correct base URL for images
function getImageBaseUrl() {
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000'
  }
  // For production on rewealed.com
  return 'https://rewealed.com'
}

export async function POST(request: Request) {
  const { cartItems } = await request.json()
  const baseUrl = getImageBaseUrl()

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: cartItems.map((item: any) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.product.name,
            // Use absolute URLs that are publicly accessible
            images: [`${baseUrl}/uploads/${item.product.mainImage}`],
            description: `Size: ${item.size}`,
          },
          unit_amount: item.product.salePrice 
            ? Math.round(item.product.salePrice * 100)
            : Math.round(item.product.price * 100),
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      shipping_address_collection: {
        allowed_countries: ['US', 'CA'],
      },
      success_url: `${baseUrl}/success`,
      cancel_url: `${baseUrl}/cancel`,
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (err: any) {
    console.error('Stripe session creation error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

