'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from 'lucide-react'

const ReviewSection = () => {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleExpandClick = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div className="relative w-full">
      {/* Mobile layout */}
      <div className={`sm:hidden relative ${isExpanded ? 'h-[1600px]' : 'h-[800px]'} transition-all duration-1000 ease-[cubic-bezier(0.34,1.56,0.64,1)] overflow-hidden`}>
        <div className="grid gap-3 grid-cols-4 auto-rows-[minmax(100px,auto)] h-[1600px] absolute inset-0 transition-all duration-1000 ease-[cubic-bezier(0.34,1.56,0.64,1)]">
          <div 
            className={`absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background z-10 pointer-events-none transition-opacity duration-1000 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isExpanded ? 'opacity-0' : 'opacity-100'}`} 
            style={{ height: '100%', maskImage: 'linear-gradient(to bottom, black 40%, transparent 40%)' }}
          ></div>
          <Card className="col-span-2 row-span-2 bg-primary relative p-0 rounded-xl overflow-hidden">
            <Image src="/uploads/reviews/review1.png" alt="" fill className="object-cover" />
          </Card>
          <Card className="col-span-2 row-span-1 bg-secondary relative p-0 rounded-xl overflow-hidden">
            <Image src="/uploads/reviews/review2.png" alt="" fill className="object-cover" />
          </Card>
          <Card className="col-span-2 row-span-1 bg-accent relative p-0 rounded-xl overflow-hidden">
            <Image src="/uploads/reviews/review3.png" alt="" fill className="object-cover" />
          </Card>
          <Card className="col-span-4 row-span-1 bg-muted relative p-0 rounded-xl overflow-hidden">
            <Image src="/uploads/reviews/review4.png" alt="" fill className="object-cover" />
          </Card>
          <Card className="col-span-2 row-span-1 bg-primary relative p-0 rounded-xl overflow-hidden">
            <Image src="/uploads/reviews/review5.png" alt="" fill className="object-cover" />
          </Card>
          <Card className="col-span-2 row-span-1 bg-secondary relative p-0 rounded-xl overflow-hidden">
            <Image src="/uploads/reviews/review6.png" alt="" fill className="object-cover" />
          </Card>
          <Card className="col-span-4 row-span-2 bg-accent relative p-0 rounded-xl overflow-hidden">
            <Image src="/uploads/reviews/review7.png" alt="" fill className="object-cover" />
          </Card>
         
          <Card className="col-span-2 row-span-1 bg-primary relative p-0 rounded-xl overflow-hidden">
            <Image src="/uploads/reviews/review9.png" alt="" fill className="object-cover" />
          </Card>
          <Card className="col-span-2 row-span-1 bg-secondary relative p-0 rounded-xl overflow-hidden">
            <Image src="/uploads/reviews/review10.png" alt="" fill className="object-cover" />
          </Card>
        </div>
      </div>

      {/* Tablet layout */}
      <div className={`hidden sm:block lg:hidden relative ${isExpanded ? 'h-[2000px]' : 'h-[1000px]'} transition-all duration-1000 ease-[cubic-bezier(0.34,1.56,0.64,1)] overflow-hidden`}>
        <div className="grid gap-4 grid-cols-6 auto-rows-[minmax(120px,auto)] h-[2000px] absolute inset-0 transition-all duration-1000 ease-[cubic-bezier(0.34,1.56,0.64,1)]">
          <div 
            className={`absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background z-10 pointer-events-none transition-opacity duration-1000 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isExpanded ? 'opacity-0' : 'opacity-100'}`} 
            style={{ height: '100%', maskImage: 'linear-gradient(to bottom, black 40%, transparent 40%)' }}
          ></div>
          <Card className="col-span-4 row-span-2 bg-primary relative p-0 rounded-xl overflow-hidden">
            <Image src="/uploads/reviews/review1.png" alt="" fill className="object-cover" />
          </Card>
          <Card className="col-span-2 row-span-2 bg-secondary relative p-0 rounded-xl overflow-hidden">
            <Image src="/uploads/reviews/review2.png" alt="" fill className="object-cover" />
          </Card>
          <Card className="col-span-3 row-span-1 bg-accent relative p-0 rounded-xl overflow-hidden">
            <Image src="/uploads/reviews/review3.png" alt="" fill className="object-cover" />
          </Card>
          <Card className="col-span-3 row-span-1 bg-muted relative p-0 rounded-xl overflow-hidden">
            <Image src="/uploads/reviews/review4.png" alt="" fill className="object-cover" />
          </Card>
          <Card className="col-span-2 row-span-2 bg-primary relative p-0 rounded-xl overflow-hidden">
            <Image src="/uploads/reviews/review5.png" alt="" fill className="object-cover" />
          </Card>
          <Card className="col-span-4 row-span-2 bg-secondary relative p-0 rounded-xl overflow-hidden">
            <Image src="/uploads/reviews/review6.png" alt="" fill className="object-cover" />
          </Card>
          <Card className="col-span-3 row-span-2 bg-accent relative p-0 rounded-xl overflow-hidden">
            <Image src="/uploads/reviews/review7.png" alt="" fill className="object-cover" />
          </Card>
          <Card className="col-span-3 row-span-2 bg-muted relative p-0 rounded-xl overflow-hidden">
            <Image src="/uploads/reviews/review8.png" alt="" fill className="object-cover" />
          </Card>
          <Card className="col-span-3 row-span-1 bg-primary relative p-0 rounded-xl overflow-hidden">
            <Image src="/uploads/reviews/review9.png" alt="" fill className="object-cover" />
          </Card>
          <Card className="col-span-3 row-span-1 bg-secondary relative p-0 rounded-xl overflow-hidden">
            <Image src="/uploads/reviews/review10.png" alt="" fill className="object-cover" />
          </Card>
        </div>
      </div>

      {/* Desktop layout */}
      <div className={`hidden lg:block relative ${isExpanded ? 'h-[2000px]' : 'h-[1000px]'} transition-all duration-1000 ease-[cubic-bezier(0.34,1.56,0.64,1)] overflow-hidden`}>
        <div className="grid gap-4 grid-cols-8 auto-rows-[minmax(150px,auto)] h-[2000px] absolute inset-0 transition-all duration-1000 ease-[cubic-bezier(0.34,1.56,0.64,1)]">
          <div 
            className={`absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background z-10 pointer-events-none transition-opacity duration-1000 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isExpanded ? 'opacity-0' : 'opacity-100'}`} 
            style={{ height: '100%', maskImage: 'linear-gradient(to bottom, black 50%, transparent 50%)' }}
          ></div>
          <Card className="col-span-3 row-span-2 bg-primary relative p-0 rounded-xl overflow-hidden">
            <Image src="/uploads/reviews/review1.png" alt="" fill className="object-cover" />
          </Card>
          <Card className="col-span-3 row-span-2 bg-secondary relative p-0 rounded-xl overflow-hidden">
            <Image src="/uploads/reviews/review2.png" alt="" fill className="object-cover" />
          </Card>
          <Card className="col-span-2 row-span-1 bg-accent relative p-0 rounded-xl overflow-hidden">
            <Image src="/uploads/reviews/review3.png" alt="" fill className="object-cover" />
          </Card>
          <Card className="col-span-2 row-span-1 bg-muted relative p-0 rounded-xl overflow-hidden">
            <Image src="/uploads/reviews/review4.png" alt="" fill className="object-cover" />
          </Card>
          <Card className="col-span-2 row-span-2 bg-primary relative p-0 rounded-xl overflow-hidden">
            <Image src="/uploads/reviews/review5.png" alt="" fill className="object-cover" />
          </Card>
          <Card className="col-span-3 row-span-2 bg-secondary relative p-0 rounded-xl overflow-hidden">
            <Image src="/uploads/reviews/review6.png" alt="" fill className="object-cover" />
          </Card>
          <Card className="col-span-3 row-span-2 bg-accent relative p-0 rounded-xl overflow-hidden">
            <Image src="/uploads/reviews/review7.png" alt="" fill className="object-cover" />
          </Card>
          <Card className="col-span-4 row-span-1 bg-muted relative p-0 rounded-xl overflow-hidden">
            <Image src="/uploads/reviews/review8.png" alt="" fill className="object-cover" />
          </Card>
          <Card className="col-span-2 row-span-1 bg-primary relative p-0 rounded-xl overflow-hidden">
            <Image src="/uploads/reviews/review9.png" alt="" fill className="object-cover" />
          </Card>
          <Card className="col-span-2 row-span-1 bg-secondary relative p-0 rounded-xl overflow-hidden">
            <Image src="/uploads/reviews/review10.png" alt="" fill className="object-cover" />
          </Card>
        </div>
      </div>

      {/* Expand/Collapse button */}
      <Button
        onClick={handleExpandClick}
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-4 py-2 rounded-full flex items-center space-x-2 z-20"
      >
        <span>{isExpanded ? 'Show Less' : 'Show More'}</span>
        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </Button>
    </div>
  )
}

export default ReviewSection

