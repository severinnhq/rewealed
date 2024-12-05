'use client'

import React, { useState, useEffect } from 'react'
import { X, Home, ShoppingBag, Mail, Instagram, Twitter } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const Menu: React.FC<MenuProps> = ({ isOpen, onClose }) => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const menuItems = [
    { name: 'Home', icon: Home, href: '/' },
    { name: 'Products', icon: ShoppingBag, href: '/products' },
    { name: 'Contact', icon: Mail, href: '/contact' },
  ]

  return (
    <div 
      className={`fixed inset-0 z-50 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
      aria-hidden={!isOpen}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className={`absolute inset-0 bg-black bg-opacity-50 transition-opacity ${isOpen ? 'opacity-100 cursor-close' : 'opacity-0'}`} 
          onClick={onClose}
          aria-label="Close menu"
        />
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: isOpen ? 0 : '-100%' }}
          transition={{ type: 'tween', ease: 'easeOut', duration: 0.3 }}
          className={`fixed inset-y-0 left-0 w-screen bg-white shadow-xl flex flex-col ${isMobile ? 'max-w-full' : 'max-w-md'}`}
        >
          <div className="h-full flex flex-col">
            <div className="flex-shrink-0 px-4 py-6 sm:px-6">
              <div className="flex items-start justify-between">
                <button
                  type="button"
                  className="-m-2 p-2 text-gray-400 hover:text-gray-500"
                  onClick={onClose}
                  aria-label="Close menu"
                >
                  <X size={24} aria-hidden="true" />
                </button>
              </div>
            </div>
            <div className="flex-1 px-4 sm:px-6 overflow-y-auto">
              <nav className="space-y-4 py-6">
                {menuItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center p-3 text-base font-medium text-gray-900 rounded-lg hover:bg-gray-100 group"
                    onClick={onClose}
                  >
                    <item.icon className="w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900" />
                    <span className="ml-3">{item.name}</span>
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex-shrink-0 px-4 py-6 sm:px-6">
              <div className="flex justify-center space-x-6">
                <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">TikTok</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                  </svg>
                </a>
                <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">Instagram</span>
                  <Instagram className="h-6 w-6" />
                </a>
                <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">Twitter</span>
                  <Twitter className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Menu

