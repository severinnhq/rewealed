import { Metadata } from 'next'
import { parseISO, format } from 'date-fns'
import { OrderFulfillmentCheckbox } from '@/components/OrderFulfillmentCheckbox'
import { MongoClient, ObjectId } from 'mongodb'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Admin: Order Management',
}

const mongoUri = process.env.MONGODB_URI!
const ORDERS_PER_PAGE = 10

interface OrderItem {
  id: string
  n: string
  s: string
  q: number
  p: number
}

interface Address {
  city: string
  country: string
  line1: string
  line2: string | null
  postal_code: string
  state: string
}

interface ShippingDetails {
  address: Address
  name: string
}

interface BillingDetails {
  address: Address
  name: string
}

interface StripeDetails {
  paymentId: string
  customerId: string | null
  paymentMethodId: string | null
  paymentMethodFingerprint: string | null
  riskScore: number | null
  riskLevel: string | null
}

interface Order {
  _id: ObjectId
  sessionId: string
  amount: number
  currency?: string
  status: string
  items?: OrderItem[]
  shippingDetails?: ShippingDetails
  billingDetails?: BillingDetails
  shippingType?: string
  stripeDetails?: StripeDetails
  createdAt?: Date | string
  fulfilled?: boolean
}

async function getOrders(page: number): Promise<{ orders: Order[], totalPages: number }> {
  const client = new MongoClient(mongoUri)
  try {
    await client.connect()
    const db = client.db('webstore')
    const ordersCollection = db.collection('orders')

    const totalOrders = await ordersCollection.countDocuments()
    const totalPages = Math.ceil(totalOrders / ORDERS_PER_PAGE)

    const orders = await ordersCollection
      .find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * ORDERS_PER_PAGE)
      .limit(ORDERS_PER_PAGE)
      .toArray()

    return { orders: orders as Order[], totalPages }
  } catch (error) {
    console.error('Failed to fetch orders:', error)
    return { orders: [], totalPages: 0 }
  } finally {
    await client.close()
  }
}

function formatCreatedDate(dateString?: string | Date): string {
  if (!dateString) return 'Date not available'
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString
    const utcDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000)
    const gmt1Time = new Date(utcDate.getTime() + 60 * 60 * 1000)
    return format(gmt1Time, "yyyy-MM-dd HH:mm:ss 'GMT+1'")
  } catch (error) {
    console.error('Error formatting date:', error)
    return 'Invalid date'
  }
}

function areAddressesSame(shipping?: ShippingDetails, billing?: BillingDetails): boolean {
  if (!shipping || !billing) return false
  const shippingAddress = shipping.address
  const billingAddress = billing.address
  return (
    shippingAddress.line1 === billingAddress.line1 &&
    shippingAddress.line2 === billingAddress.line2 &&
    shippingAddress.city === billingAddress.city &&
    shippingAddress.state === billingAddress.state &&
    shippingAddress.postal_code === billingAddress.postal_code &&
    shippingAddress.country === billingAddress.country
  )
}

function AddressDisplay({ address, name }: { address: Address; name: string }) {
  return (
    <>
      <p>{name}</p>
      <p>{address.line1}</p>
      {address.line2 && <p>{address.line2}</p>}
      <p>{address.city}, {address.state} {address.postal_code}</p>
      <p>{address.country}</p>
    </>
  )
}

function Pagination({ currentPage, totalPages }: { currentPage: number; totalPages: number }) {
  const pageNumbers = []
  const maxPagesToShow = 7

  if (totalPages <= maxPagesToShow) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i)
    }
  } else {
    if (currentPage <= 3) {
      for (let i = 1; i <= 5; i++) {
        pageNumbers.push(i)
      }
      pageNumbers.push('...')
      pageNumbers.push(totalPages)
    } else if (currentPage >= totalPages - 2) {
      pageNumbers.push(1)
      pageNumbers.push('...')
      for (let i = totalPages - 4; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      pageNumbers.push(1)
      pageNumbers.push('...')
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        pageNumbers.push(i)
      }
      pageNumbers.push('...')
      pageNumbers.push(totalPages)
    }
  }

  return (
    <div className="flex justify-center space-x-2 mt-8">
      {pageNumbers.map((number, index) => (
        number === '...' ? (
          <span key={index} className="px-3 py-2">...</span>
        ) : (
          <Link key={index} href={`/admin/orders?page=${number}`} passHref>
            <Button 
              variant={currentPage === number ? "default" : "outline"}
              className={`px-3 py-2 border ${
                currentPage === number 
                  ? 'border-2 border-black' 
                  : 'border-gray-200'
              }`}
            >
              {number}
            </Button>
          </Link>
        )
      ))}
    </div>
  )
}


export default async function AdminOrders({ 
  searchParams 
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const currentPage = Number(searchParams.page as string) || 1
  const { orders, totalPages } = await getOrders(currentPage)

  if (orders.length === 0) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Admin: Order Management</h1>
        <p>No orders found or there was an error fetching orders.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Admin: Order Management</h1>
      <div className="space-y-6">
        {orders.map((order) => (
          <Card key={order._id.toString()} 
                className={order.shippingType?.toLowerCase().includes('express') ? 'bg-yellow-50' : ''}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Order ID: {order.sessionId}</span>
                <Badge variant={order.status === 'paid' ? 'default' : 'secondary'}>
                  {order.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="flex justify-between items-center">
                  <div className="flex-grow">
                    <h3 className="font-semibold mb-2">Order Details</h3>
                    <p>Amount: {order.amount ? order.amount.toFixed(2) : 'N/A'} {order.currency?.toUpperCase() || 'N/A'}</p>
                    <p>Created: {formatCreatedDate(order.createdAt)}</p>
                    <p>Shipping Type: {order.shippingType || 'N/A'}</p>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    <OrderFulfillmentCheckbox 
                      orderId={order._id.toString()} 
                      initialFulfilled={order.fulfilled || false} 
                    />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Items</h3>
                  {order.items && order.items.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Size</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Price</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {order.items.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{item.n}</TableCell>
                            <TableCell>{item.s}</TableCell>
                            <TableCell>{item.q}</TableCell>
                            <TableCell>{item.p ? item.p.toFixed(2) : 'N/A'} {order.currency?.toUpperCase() || 'N/A'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p>No items available for this order.</p>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {order.shippingDetails && (
                    <div>
                      <h3 className="font-semibold mb-2">Shipping Details</h3>
                      <AddressDisplay address={order.shippingDetails.address} name={order.shippingDetails.name} />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold mb-2">Billing Details</h3>
                    {order.billingDetails ? (
                      areAddressesSame(order.shippingDetails, order.billingDetails) ? (
                        <p>Same as shipping</p>
                      ) : (
                        <AddressDisplay address={order.billingDetails.address} name={order.billingDetails.name} />
                      )
                    ) : (
                      <p>No billing details available for this order.</p>
                    )}
                  </div>
                </div>
                <Separator />
                {order.stripeDetails && (
                  <div>
                    <h3 className="font-semibold mb-2">Stripe Details</h3>
                    <p>Payment ID: {order.stripeDetails.paymentId}</p>
                    <p>Customer ID: {order.stripeDetails?.customerId || 'Guest User'}</p>
                    <p>Payment Method ID: {order.stripeDetails.paymentMethodId || 'N/A'}</p>
                    <p>Payment Method Fingerprint: {order.stripeDetails.paymentMethodFingerprint || 'N/A'}</p>
                    <p>Risk Score: {order.stripeDetails.riskScore !== null ? order.stripeDetails.riskScore : 'N/A'}</p>
                    <p>Risk Level: {order.stripeDetails.riskLevel || 'N/A'}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  )
}

