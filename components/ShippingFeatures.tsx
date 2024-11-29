import { Truck, RefreshCcw, ShieldCheck } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"

export function ShippingFeatures() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <Card className="w-full md:w-1/3 shadow-none">
          <CardContent className="flex flex-col items-center text-center p-6">
            <Truck className="h-12 w-12 mb-4" />
            <div>
              <h3 className="text-lg font-semibold">Free Shipping</h3>
              <p className="text-sm text-gray-600">On orders over $100</p>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full md:w-1/3 shadow-none">
          <CardContent className="flex flex-col items-center text-center p-6">
            <RefreshCcw className="h-12 w-12 mb-4" />
            <div>
              <h3 className="text-lg font-semibold">14-Day Size Change</h3>
              <p className="text-sm text-gray-600">Easy size exchanges</p>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full md:w-1/3 shadow-none">
          <CardContent className="flex flex-col items-center text-center p-6">
            <ShieldCheck className="h-12 w-12 mb-4" />
            <div>
              <h3 className="text-lg font-semibold">Secure Payments</h3>
              <p className="text-sm text-gray-600">100% protected checkout</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

