import { format } from 'date-fns'
import { Mail, Calendar } from 'lucide-react'

interface ContactCardProps {
  contact: {
    _id: string
    name: string
    email: string
    message: string
    createdAt: string
  }
}

export default function ContactCard({ contact }: ContactCardProps) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 transition-all duration-300 hover:shadow-lg">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{contact.name}</h2>
          <div className="flex items-center text-gray-600 mt-1">
            <Mail size={16} className="mr-2" />
            <p>{contact.email}</p>
          </div>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Calendar size={16} className="mr-2" />
          <span>{format(new Date(contact.createdAt), 'PPP')}</span>
        </div>
      </div>
      <p className="text-gray-800 whitespace-pre-wrap bg-gray-50 p-4 rounded-md">{contact.message}</p>
    </div>
  )
}

