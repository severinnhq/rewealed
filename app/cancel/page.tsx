'use client'

import { useRouter } from 'next/navigation'
import { XCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function CancelPage() {
  const router = useRouter()

  return (
    <div className="container mx-auto p-4 h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <XCircle className="w-16 h-16 text-red-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Order Cancelled</CardTitle>
          <CardDescription className="text-center">Your order was not completed</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center mb-4">
            We're sorry to see you go. If you experienced any issues during checkout or have any questions, please don't hesitate to contact our customer support.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          <Button onClick={() => router.push('/')} variant="outline" className="w-full">
            Return to Home
          </Button>
          <Button onClick={() => router.push('/cart')} className="w-full">
            Back to Cart
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

