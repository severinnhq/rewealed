'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function SuccessPage() {
  const router = useRouter()

  useEffect(() => {
    // Clear the cart
    localStorage.removeItem('cartItems')
  }, [])

  return (
    <div className="container mx-auto p-4 h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Order Successful!</CardTitle>
          <CardDescription className="text-center">Thank you for your purchase</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center mb-4">
            Your order has been successfully placed. We'll send you an email with the order details and tracking information once your package has shipped.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={() => router.push('/')} className="w-full">
            Return to Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

