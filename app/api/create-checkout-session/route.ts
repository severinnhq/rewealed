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
  const cartItems: CartItem[] = await request.json()

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: cartItems.map((item) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.product.name,
            images: [`${process.env.NEXT_PUBLIC_BASE_URL}/uploads/${item.product.mainImage}`],
          },
          unit_amount: item.product.salePrice 
            ? Math.round(item.product.salePrice * 100)
            : Math.round(item.product.price * 100),
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (err: unknown) {
    console.error(err)
    return NextResponse.json({ error: err instanceof Error ? err.message : 'An unknown error occurred' }, { status: 500 })
  }
}

