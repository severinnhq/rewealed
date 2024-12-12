'use client'

import { useState } from 'react'
import { Checkbox } from "@/components/ui/checkbox"
import { Check, X } from 'lucide-react'
import { ConfirmDialog } from './ConfirmDialog'

interface OrderFulfillmentCheckboxProps {
  orderId: string
  initialFulfilled: boolean
}

export function OrderFulfillmentCheckbox({ orderId, initialFulfilled }: OrderFulfillmentCheckboxProps) {
  const [isFulfilled, setIsFulfilled] = useState(initialFulfilled)
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [pendingChange, setPendingChange] = useState<boolean | null>(null)

  const handleFulfillmentChange = async (checked: boolean) => {
    setPendingChange(checked)
    setIsConfirmDialogOpen(true)
  }

  const confirmChange = async () => {
    if (pendingChange === null) return

    setIsFulfilled(pendingChange)
    try {
      const response = await fetch('/api/update-order-fulfillment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId, fulfilled: pendingChange }),
      })
      if (!response.ok) {
        throw new Error('Failed to update order fulfillment')
      }
    } catch (error) {
      console.error('Error updating order fulfillment:', error)
      setIsFulfilled(!pendingChange) // Revert the state if the API call fails
    }
    setIsConfirmDialogOpen(false)
    setPendingChange(null)
  }

  const cancelChange = () => {
    setIsConfirmDialogOpen(false)
    setPendingChange(null)
  }

  return (
    <>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={`fulfillment-${orderId}`}
          checked={isFulfilled}
          onCheckedChange={handleFulfillmentChange}
          className="sr-only"
        />
        <label
          htmlFor={`fulfillment-${orderId}`}
          className={`flex items-center justify-center w-8 h-8 rounded-full ${
            isFulfilled ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {isFulfilled ? (
            <Check className="w-6 h-6 text-white" />
          ) : (
            <X className="w-6 h-6 text-white" />
          )}
        </label>
      </div>
      <ConfirmDialog
        isOpen={isConfirmDialogOpen}
        onClose={cancelChange}
        onConfirm={confirmChange}
        title="Confirm Fulfillment Status Change"
        description={`Are you sure you want to mark this order as ${pendingChange ? 'fulfilled' : 'unfulfilled'}?`}
      />
    </>
  )
}

