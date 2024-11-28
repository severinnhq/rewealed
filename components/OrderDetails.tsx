import React from 'react'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

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

interface OrderDetailsProps {
  order: Order
  onClose: () => void
}

export function OrderDetails({ order, onClose }: OrderDetailsProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Order Details</h2>
        
        <section className="mb-6">
          <h3 className="text-xl font-semibold mb-2">General Information</h3>
          <p><strong>Order ID:</strong> {order.stripeSessionId}</p>
          <p><strong>Customer Name:</strong> {order.customerName}</p>
          <p><strong>Customer Email:</strong> {order.customerEmail}</p>
          <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleString()}</p>
          <p><strong>Total Amount:</strong> ${order.totalAmount.toFixed(2)}</p>
          <p><strong>Fulfilled:</strong> {order.fulfilled ? 'Yes' : 'No'}</p>
          <p><strong>Payment Status:</strong> {order.paymentStatus}</p>
          <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
        </section>

        <section className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Order Items</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.orderItems.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.size}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>${item.price.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>

        <section className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Shipping Address</h3>
          <AddressDisplay address={order.shippingAddress} />
        </section>

        <section className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Billing Address</h3>
          <AddressDisplay address={order.billingAddress} />
        </section>

        <Button onClick={onClose} className="w-full">Close</Button>
      </div>
    </div>
  )
}

function AddressDisplay({ address }: { address: Address }) {
  return (
    <div>
      <p>{address.name}</p>
      <p>{address.line1}</p>
      {address.line2 && <p>{address.line2}</p>}
      <p>{address.city}, {address.state} {address.postalCode}</p>
      <p>{address.country}</p>
    </div>
  )
}

