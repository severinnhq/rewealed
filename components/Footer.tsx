import Image from 'next/image'
import Link from 'next/link'
import { Instagram, Twitter } from 'lucide-react'
import { useEffect } from 'react'

const TikTokIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
  </svg>
)

const Footer = () => {
  useEffect(() => {
    const smoothScroll = (e: MouseEvent) => {
      e.preventDefault();
      const target = e.target as HTMLAnchorElement;
      const id = target.getAttribute('href')?.slice(1);
      if (id) {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      }
    };

    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
      link.addEventListener('click', smoothScroll as EventListener);
    });

    return () => {
      links.forEach(link => {
        link.removeEventListener('click', smoothScroll as EventListener);
      });
    };
  }, []);

  return (
    <footer className="bg-gray-900 text-gray-300 py-12 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-4">
          <div className="mb-4">
            <Image
              src="/whitelogo.png"
              alt="Rewealed"
              width={150}
              height={50}
              className="w-auto h-auto"
            />
          </div>
          <p className="text-xl font-semibold">Not for everyone.</p>
          <div className="flex space-x-4">
            <Link href="https://www.tiktok.com/@rewealedapparel" className="hover:text-white transition-colors">
              <TikTokIcon />
            </Link>
            <Link href="https://www.instagram.com/rewealed" className="hover:text-white transition-colors">
              <Instagram size={20} />
            </Link>
            <Link href="https://www.x.com/rewealed" className="hover:text-white transition-colors">
              <Twitter size={20} />
            </Link>
          </div>
        </div>
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white">Quick Links</h4>
          <ul className="space-y-2">
            <li>
              <Link href="#hero" className="hover:text-white transition-colors">Home</Link>
            </li>
            <li>
              <Link href="#products" className="hover:text-white transition-colors">Products</Link>
            </li>
            <li>
              <Link href="#contact" className="hover:text-white transition-colors">Contact</Link>
            </li>
          </ul>
        </div>
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white">Policies</h4>
          <ul className="space-y-2">
            <li>
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link>
            </li>
            <li>
              <Link href="/refund" className="hover:text-white transition-colors">Refund Policy</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} Rewealed. All rights reserved.</p>
  
      </div>
    </footer>
  )
}

export default Footer

