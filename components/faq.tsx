'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'

export default function FAQSection() {
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set())

  const faqs = [
    {
      question: "So, you're a startup?",
      answer: "Yes, we're a growing startup focused on innovation and customer success. We bring enterprise-grade solutions with the agility and personal touch of a startup. Our team is dedicated to pushing the boundaries of what's possible in our industry, always with our clients' needs at the forefront of our minds."
    },
    {
      question: "Is Genie right for me?",
      answer: "Genie is perfect for businesses looking to streamline their operations and scale efficiently. Whether you're a small team or a large enterprise, our platform adapts to your needs. We offer customizable solutions that grow with your business, ensuring you always have the tools you need to succeed in today's fast-paced market."
    },
    {
      question: "How do I sign up?",
      answer: "Signing up is simple! Just click the 'Get Started' button at the top of the page, fill in your details, and you'll be up and running in minutes. Our user-friendly onboarding process guides you through each step, ensuring you can start benefiting from Genie's features right away. If you need any assistance, our support team is always ready to help."
    },
    {
      question: "What's the onboarding like? Do you charge for implementation?",
      answer: "Our onboarding process is straightforward and guided by our expert team. We offer complimentary implementation support to ensure you get the most out of our platform. This includes personalized setup assistance, training sessions for your team, and ongoing support as you integrate Genie into your workflow. We believe in setting you up for success from day one, without any hidden costs."
    }
  ]

  const toggleItem = (index: number) => {
    setExpandedItems((prevItems) => {
      const newItems = new Set(prevItems)
      if (newItems.has(index)) {
        newItems.delete(index)
      } else {
        newItems.add(index)
      }
      return newItems
    })
  }

  return (
    <div className="max-w-6xl mx-auto px-4 mt-[4rem] mb-[4rem] md:mt-[8rem] md:mb-[8rem]">
      <h1 className="text-4xl sm:text-5xl font-bold mb-[1rem] md:mb-[1rem] text-center uppercase tracking-wider">STRAIGHT TO THE POINT</h1>
      <p className="text-center text-gray-600 mb-[4rem] text-lg mx-auto max-w-[600px] w-full px-4 sm:px-6 md:px-8">
  If you're new to Genie or looking to supercharge your current stack, this section will help you learn more about the platform and its features.
</p>

      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white rounded-lg overflow-hidden border border-gray-200"
          >
            <button
              onClick={() => toggleItem(index)}
              className="w-full px-10 py-3 flex justify-between items-center text-left"
            >
              <span className="font-medium text-md">{faq.question}</span>
              <Plus
                className={`h-6 w-6 transition-transform duration-200 ${
                  expandedItems.has(index) ? 'rotate-45' : ''
                }`}
              />
            </button>
            <div
              className={`px-10 transition-all duration-300 ease-in-out ${
                expandedItems.has(index)
                  ? 'max-h-80 opacity-100 py-3'
                  : 'max-h-0 opacity-0 py-0'
              }`}
            >
              <p className="text-gray-600 text-base leading-relaxed">{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

