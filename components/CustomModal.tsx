import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface CustomModalProps {
  isOpen: boolean
  onClose: () => void
  message: string
}


const CustomModal: React.FC<CustomModalProps> = ({ isOpen, onClose, message }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white rounded-lg shadow-xl overflow-hidden max-w-md w-full"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Attention</h3>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="mb-6">
                <p className="text-gray-700">{message}</p>
              </div>
              <div className="flex justify-end">
                <Button onClick={onClose}>Got it</Button>
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 h-1 w-full" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default CustomModal

