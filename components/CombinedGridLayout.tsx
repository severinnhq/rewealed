'use client'

import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from 'lucide-react'

const ReviewSection = () => {
  const [isExpanded, setIsExpanded] = useState(false)
  const topRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isExpanded && topRef.current) {
      const yOffset = -80;
      const y = topRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, [isExpanded])

  const handleExpandClick = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div ref={topRef} id="review-section" className="relative w-full max-w-7xl mx-auto px-4 pt-0">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-2xl lg:text-3xl flex flex-col md:flex-row items-center justify-center relative font-normal">
          <div className="relative flex flex-col md:flex-row items-center">
            <span className="md:absolute md:right-full md:pr-3 text-2xl md:text-xl lg:text-2xl mb-0.5 md:mb-0 font-medium">The</span>
            <div className="relative w-48 h-12 md:w-40 md:h-10 lg:w-48 lg:h-12 my-0.5 md:my-0">
              <Image 
                src="/blacklogo.png" 
                alt="Logo" 
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="md:absolute md:left-full md:pl-3 text-2xl md:text-xl lg:text-2xl mt-0.5 md:mt-0 font-medium">effect</span>
          </div>
        </h2>
      </div>
      {/* Added padding-top here */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 lg:p-12 relative overflow-hidden pt-20">
        {/* Mobile layout */}
        <div className="sm:hidden relative overflow-hidden">
          <div className={`grid grid-cols-10 gap-2 auto-rows-[minmax(80px,auto)] transition-all duration-1000 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isExpanded ? 'h-[1400px]' : 'h-[400px]'}`}>
            <div className="col-span-10 row-span-2 relative overflow-hidden rounded-lg transition-transform hover:scale-[1.02] shadow-lg">
              <Image src="/uploads/reviews/optimized-review1.png" alt="Review 10" fill className="object-cover" />
            </div>
            <div className="col-span-5 row-span-2 relative overflow-hidden rounded-lg transition-transform hover:scale-[1.02] shadow-lg">
              <Image src="/uploads/reviews/optimized-review10.png" alt="Review 1" fill className="object-cover" />
            </div>
            <div className="col-span-5 row-span-2 relative overflow-hidden rounded-lg transition-transform hover:scale-[1.02] shadow-lg">
              <Image src="/uploads/reviews/optimized-review2.png" alt="Review 2" fill className="object-cover" />
            </div>
            {isExpanded && (
              <>
                <div className="col-span-6 row-span-2 relative overflow-hidden rounded-lg transition-transform hover:scale-[1.02] shadow-lg">
                  <Image src="/uploads/reviews/optimized-review3.png" alt="Review 3" fill className="object-cover" />
                </div>
                <div className="col-span-4 row-span-2 relative overflow-hidden rounded-lg transition-transform hover:scale-[1.02] shadow-lg">
                  <Image src="/uploads/reviews/optimized-review11.png" alt="Review 4" fill className="object-cover" />
                </div>
                <div className="col-span-5 row-span-2 relative overflow-hidden rounded-lg transition-transform hover:scale-[1.02] shadow-lg">
                  <Image src="/uploads/reviews/optimized-review5.png" alt="Review 5" fill className="object-cover" />
                </div>
                <div className="col-span-5 row-span-2 relative overflow-hidden rounded-lg transition-transform hover:scale-[1.02] shadow-lg">
                  <Image src="/uploads/reviews/optimized-review6.png" alt="Review 6" fill className="object-cover" />
                </div>
                <div className="col-span-10 row-span-4 relative overflow-hidden rounded-lg transition-transform hover:scale-[1.02] shadow-lg">
                  <Image src="/uploads/reviews/optimized-review9.png" alt="Review 9" fill className="object-cover" />
                </div>
              </>
            )}
          </div>
          {!isExpanded && (
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white via-white to-transparent pointer-events-none" />
          )}
        </div>

        {/* Tablet layout */}
        <div className="hidden sm:block lg:hidden relative overflow-hidden">
          <div className={`grid grid-cols-12 gap-3 auto-rows-[minmax(120px,auto)] transition-all duration-1000 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isExpanded ? 'h-[2200px]' : 'h-[800px]'}`}>
            <div className="col-span-12 row-span-4 relative overflow-hidden rounded-lg transition-transform hover:scale-[1.02] shadow-lg">
              <Image src="/uploads/reviews/optimized-review1.png" alt="Review 1" fill className="object-cover" />
            </div>
            <div className="col-span-5 row-span-3 relative overflow-hidden rounded-lg transition-transform hover:scale-[1.02] shadow-lg">
              <Image src="/uploads/reviews/optimized-review2.png" alt="Review 2" fill className="object-cover" />
            </div>
            <div className="col-span-7 row-span-3 relative overflow-hidden rounded-lg transition-transform hover:scale-[1.02] shadow-lg">
              <Image src="/uploads/reviews/optimized-review11.png" alt="Review 3" fill className="object-cover" />
            </div>
            <div className="col-span-7 row-span-3 relative overflow-hidden rounded-lg transition-transform hover:scale-[1.02] shadow-lg">
              <Image src="/uploads/reviews/optimized-review4.png" alt="Review 4" fill className="object-cover" />
            </div>
            <div className="col-span-5 row-span-3 relative overflow-hidden rounded-lg transition-transform hover:scale-[1.02] shadow-lg">
              <Image src="/uploads/reviews/optimized-review5.png" alt="Review 5" fill className="object-cover" />
            </div>
            {isExpanded && (
              <>
                <div className="col-span-12 row-span-4 relative overflow-hidden rounded-lg transition-transform hover:scale-[1.02] shadow-lg">
                  <Image src="/uploads/reviews/optimized-review9.png" alt="Review 6" fill className="object-cover" />
                </div>
                <div className="col-span-6 row-span-3 relative overflow-hidden rounded-lg transition-transform hover:scale-[1.02] shadow-lg">
                  <Image src="/uploads/reviews/optimized-review7.png" alt="Review 7" fill className="object-cover" />
                </div>
                <div className="col-span-6 row-span-3 relative overflow-hidden rounded-lg transition-transform hover:scale-[1.02] shadow-lg">
                  <Image src="/uploads/reviews/optimized-review14.png" alt="Review 8" fill className="object-cover" />
                </div>
                <div className="col-span-8 row-span-3 relative overflow-hidden rounded-lg transition-transform hover:scale-[1.02] shadow-lg">
                  <Image src="/uploads/reviews/optimized-review9.png" alt="Review 9" fill className="object-cover" />
                </div>
                <div className="col-span-4 row-span-3 relative overflow-hidden rounded-lg transition-transform hover:scale-[1.02] shadow-lg">
                  <Image src="/uploads/reviews/optimized-review1.png" alt="Review 10" fill className="object-cover" />
                </div>
              </>
            )}
          </div>
          {!isExpanded && (
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white via-white to-transparent pointer-events-none" />
          )}
        </div>

        {/* Desktop layout */}
        <div className="hidden lg:block relative overflow-hidden">
          <div className={`grid grid-cols-12 gap-3 auto-rows-[minmax(100px,auto)] transition-all duration-1000 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isExpanded ? 'h-[2000px]' : 'h-[600px]'}`}>
            <div className="col-span-8 row-span-4 relative overflow-hidden rounded-lg transition-transform hover:scale-[1.02] shadow-lg">
              <Image src="/uploads/reviews/optimized-review1.png" alt="Review 1" fill className="object-cover" />
            </div>
            <div className="col-span-4 row-span-2 relative overflow-hidden rounded-lg transition-transform hover:scale-[1.02] shadow-lg">
              <Image src="/uploads/reviews/optimized-review2.png" alt="Review 2" fill className="object-cover" />
            </div>
            <div className="col-span-4 row-span-2 relative overflow-hidden rounded-lg transition-transform hover:scale-[1.02] shadow-lg">
              <Image src="/uploads/reviews/optimized-review3.png" alt="Review 3" fill className="object-cover" />
            </div>
            <div className="col-span-6 row-span-3 relative overflow-hidden rounded-lg transition-transform hover:scale-[1.02] shadow-lg">
              <Image src="/uploads/reviews/optimized-review4.png" alt="Review 4" fill className="object-cover" />
            </div>
            <div className="col-span-6 row-span-3 relative overflow-hidden rounded-lg transition-transform hover:scale-[1.02] shadow-lg">
              <Image src="/uploads/reviews/optimized-review5.png" alt="Review 5" fill className="object-cover" />
            </div>
            {isExpanded && (
              <>
                <div className="col-span-4 row-span-2 relative overflow-hidden rounded-lg transition-transform hover:scale-[1.02] shadow-lg">
                  <Image src="/uploads/reviews/optimized-review7.png" alt="Review 7" fill className="object-cover" />
                </div>
                <div className="col-span-8 row-span-4 relative overflow-hidden rounded-lg transition-transform hover:scale-[1.02] shadow-lg">
                  <Image src="/uploads/reviews/optimized-review6.png" alt="Review 6" fill className="object-cover" />
                </div>
                <div className="col-span-4 row-span-2 relative overflow-hidden rounded-lg transition-transform hover:scale-[1.02] shadow-lg">
                  <Image src="/uploads/reviews/optimized-review14.png" alt="Review 8" fill className="object-cover" />
                </div>
                <div className="col-span-6 row-span-3 relative overflow-hidden rounded-lg transition-transform hover:scale-[1.02] shadow-lg">
                  <Image src="/uploads/reviews/optimized-review9.png" alt="Review 9" fill className="object-cover" />
                </div>
                <div className="col-span-6 row-span-3 relative overflow-hidden rounded-lg transition-transform hover:scale-[1.02] shadow-lg">
                  <Image src="/uploads/reviews/optimized-review10.png" alt="Review 10" fill className="object-cover" />
                </div>
                <div className="col-span-4 row-span-2 relative overflow-hidden rounded-lg transition-transform hover:scale-[1.02] shadow-lg">
                  <Image src="/uploads/reviews/optimized-review12.png" alt="Review 1" fill className="object-cover" />
                </div>
                <div className="col-span-4 row-span-2 relative overflow-hidden rounded-lg transition-transform hover:scale-[1.02] shadow-lg">
                  <Image src="/uploads/reviews/optimized-review13.png" alt="Review 2" fill className="object-cover" />
                </div>
                <div className="col-span-4 row-span-2 relative overflow-hidden rounded-lg transition-transform hover:scale-[1.02] shadow-lg">
                  <Image src="/uploads/reviews/optimized-review11.png" alt="Review 3" fill className="object-cover" />
                </div>
              </>
            )}
          </div>
          {!isExpanded && (
            <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-white via-white to-transparent pointer-events-none" />
          )}
        </div>

        {/* Expand/Collapse button */}
        <Button
          onClick={handleExpandClick}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white text-gray-900 hover:bg-gray-100 px-6 py-2.5 rounded-full flex items-center space-x-2 z-20 shadow-xl shadow-top-md"
        >
          <span className="font-medium text-sm">{isExpanded ? 'Show Less' : 'Show More'}</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  )
}

export default ReviewSection

