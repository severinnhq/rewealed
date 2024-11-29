import Link from 'next/link'
import { Facebook, Instagram, Twitter } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Shop</h3>
            <ul className="space-y-2">
              <li><Link href="/products/new-arrivals" className="hover:text-gray-300">New Arrivals</Link></li>
              <li><Link href="/products/best-sellers" className="hover:text-gray-300">Best Sellers</Link></li>
              <li><Link href="/products/sale" className="hover:text-gray-300">Sale</Link></li>
              <li><Link href="/products/collections" className="hover:text-gray-300">Collections</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">About</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="hover:text-gray-300">Our Story</Link></li>
              <li><Link href="/careers" className="hover:text-gray-300">Careers</Link></li>
              <li><Link href="/sustainability" className="hover:text-gray-300">Sustainability</Link></li>
              <li><Link href="/press" className="hover:text-gray-300">Press</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li><Link href="/contact" className="hover:text-gray-300">Contact Us</Link></li>
              <li><Link href="/shipping" className="hover:text-gray-300">Shipping</Link></li>
              <li><Link href="/returns" className="hover:text-gray-300">Returns</Link></li>
              <li><Link href="/faq" className="hover:text-gray-300">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="mb-4">Stay up to date with our latest offers and news</p>
            <form className="flex space-x-2">
              <Input type="email" placeholder="Your email" className="bg-gray-800 text-white border-gray-700" />
              <Button type="submit" variant="outline" className="bg-white text-black hover:bg-gray-200">Subscribe</Button>
            </form>
            <div className="mt-6 flex space-x-4">
              <a href="#" className="text-white hover:text-gray-300">
                <Facebook size={24} />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-white hover:text-gray-300">
                <Instagram size={24} />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="text-white hover:text-gray-300">
                <Twitter size={24} />
                <span className="sr-only">Twitter</span>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-sm">
          <p>&copy; 2024 Your Company Name. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

