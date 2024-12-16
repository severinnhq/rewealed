'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import SuccessModal from './SuccessModal'
import { Sora } from 'next/font/google'

const sora = Sora({ subsets: ['latin'] })

const ContactComponent: React.FC = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/submit-contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message }),
      })

      if (response.ok) {
        setName('')
        setEmail('')
        setMessage('')
        setIsSuccessModalOpen(true)
      } else {
        throw new Error('Failed to send message')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className={`bg-white px-4 mb-[4rem] md:mb-[8rem] ${sora.className}`}>
      <div className="max-w-6xl mx-auto px-4">
      <h1 className="text-4xl sm:text-5xl font-bold mb-[2rem] md:mb-[4rem] text-center uppercase tracking-wider">STILL HAVE ANY QUESTION?</h1>
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-20">
          {/* Image Section */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-start">
            <div className="w-full max-w-[300px] md:max-w-[400px] aspect-square relative overflow-hidden">
              <Image
                src="/uploads/contact.png"
                alt="Contact Image"
                layout="fill"
                objectFit="cover"
                className="rounded-[30%_70%_70%_30%_/_30%_30%_70%_70%]"
                draggable="false"
              />
            </div>
          </div>

          {/* Contact Form Section */}
          <div className="w-full lg:w-1/2">
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6 max-w-[500px] mx-auto lg:ml-auto">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                  required
                  className="w-full"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  required
                  className="w-full"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
                  required
                  className="w-full"
                  rows={6}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gray-900 text-white hover:bg-gray-800"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </div>
        </div>
      </div>
      <SuccessModal 
        isOpen={isSuccessModalOpen} 
        onClose={() => setIsSuccessModalOpen(false)} 
      />
    </section>
  )
}

export default ContactComponent

