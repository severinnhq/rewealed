'use client'

import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { OrderDetails } from "@/components/OrderDetails"

interface OrderItem {
  name: string
  quantity: number
  size: string
  price: number
}

interface Address {
  name: string
  line1: string
  line2?: string
  city: string
  state: string
  postalCode: string
  country: string
}

interface Order {
  _id: string
  stripeSessionId: string
  customerName: string
  customerEmail: string
  orderItems: OrderItem[]
  totalAmount: number
  orderDate: string
  fulfilled: boolean
  shippingAddress: Address
  billingAddress: Address
  paymentStatus: string
  paymentMethod: string
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders')
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      } else {
        console.error('Failed to fetch orders')
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFulfillmentChange = async (orderId: string, fulfilled: boolean) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId, fulfilled }),
      })

      if (response.ok) {
        setOrders(orders.map(order => 
          order._id === orderId ? { ...order, fulfilled } : order
        ))
      } else {
        console.error('Failed to update order fulfillment')
      }
    } catch (error) {
      console.error('Error updating order fulfillment:', error)
    }
  }

  if (isLoading) {
    return <div>Loading orders...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin: Order Management</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Fulfilled</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order._id}>
              <TableCell>{order.stripeSessionId}</TableCell>
              <TableCell>{order.customerName}</TableCell>
              <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
              <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
              <TableCell>
                <Checkbox
                  checked={order.fulfilled}
                  onCheckedChange={(checked: boolean) => handleFulfillmentChange(order._id, checked)}
                />
              </TableCell>
              <TableCell>
                <Button onClick={() => setSelectedOrder(order)}>
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {selectedOrder && (
        <OrderDetails order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </div>
  )
}

