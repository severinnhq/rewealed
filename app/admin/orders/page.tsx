import { parseISO, format } from 'date-fns'
import { OrderFulfillmentCheckbox } from '@/components/OrderFulfillmentCheckbox'
import { MongoClient, ObjectId } from 'mongodb'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const mongoUri = process.env.MONGODB_URI!

interface OrderItem {
  id: string
  n: string
  s: string
  q: number
  p: number
}

interface ShippingDetails {
  address: {
    city: string
    country: string
    line1: string
    line2: string | null
    postal_code: string
    state: string
  }
  name: string
}

interface Order {
  _id: ObjectId
  sessionId: string
  amount: number
  currency?: string
  status: string
  items?: OrderItem[]
  shippingDetails?: ShippingDetails
  shippingType?: string
  createdAt?: Date | string
  fulfilled?: boolean
}

async function getOrders(): Promise<Order[]> {
  const client = new MongoClient(mongoUri)
  try {
    await client.connect()
    const db = client.db('webstore')
    const ordersCollection = db.collection('orders')
    const orders = await ordersCollection.find().sort({ createdAt: -1 }).toArray()
    return orders as Order[]
  } catch (error) {
    console.error('Failed to fetch orders:', error)
    return []
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

export default async function AdminOrders() {
  const orders = await getOrders()

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
                {order.shippingDetails ? (
                  <div>
                    <h3 className="font-semibold mb-2">Shipping Details</h3>
                    <p>{order.shippingDetails.name}</p>
                    <p>{order.shippingDetails.address.line1}</p>
                    {order.shippingDetails.address.line2 && <p>{order.shippingDetails.address.line2}</p>}
                    <p>{order.shippingDetails.address.city}, {order.shippingDetails.address.state} {order.shippingDetails.address.postal_code}</p>
                    <p>{order.shippingDetails.address.country}</p>
                  </div>
                ) : (
                  <p>No shipping details available for this order.</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

