'use client'

import { useState, useEffect } from 'react'
import ContactCard from '@/components/ContactCard'

interface Contact {
  _id: string
  name: string
  email: string
  message: string
  createdAt: string
}

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch('/api/get-contacts')
        if (response.ok) {
          const data = await response.json()
          setContacts(data.contacts)
        } else {
          throw new Error('Failed to fetch contacts')
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchContacts()
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Contact Submissions</h1>
      {contacts.length === 0 ? (
        <p className="text-gray-600 text-center">No contact submissions yet.</p>
      ) : (
        <div className="grid gap-6">
          {contacts.map((contact) => (
            <ContactCard key={contact._id} contact={contact} />
          ))}
        </div>
      )}
    </div>
  )
}

