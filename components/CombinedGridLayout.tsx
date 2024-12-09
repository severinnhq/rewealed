'use client'

import React, { useState } from 'react'
import { Card } from "@/components/ui/card"
import Image from "next/image"
import { ChevronDown, ChevronUp } from 'lucide-react'

export default function CreativeMobileGrid() {
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleExpand = () => setIsExpanded(!isExpanded)

  const ExpandArrow = () => (
    <div 
      className={`absolute left-1/2 transform -translate-x-1/2 cursor-pointer bg-background rounded-full p-2 shadow-lg z-20 transition-all duration-500 ease-in-out ${isExpanded ? 'bottom-4' : 'top-[calc(33%-2rem)]'}`}
      onClick={toggleExpand}
    >
      {isExpanded ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
    </div>
  )

  return (
    <div className="w-full p-4 relative">
      {/* Desktop layout (1280px and above) */}
      <div className={`hidden xl:block relative ${isExpanded ? 'h-[1600px]' : 'h-[533px]'} transition-all duration-500 ease-in-out overflow-hidden`}>
        <div className={`grid gap-4 grid-cols-10 grid-rows-[repeat(20,minmax(40px,auto))] absolute inset-0 transition-all duration-500 ease-in-out ${isExpanded ? 'translate-y-0' : 'translate-y-0'}`}>
          <div className={`absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background z-10 pointer-events-none transition-opacity duration-500 ease-in-out ${isExpanded ? 'opacity-0' : 'opacity-100'}`} style={{ height: '100%', maskImage: 'linear-gradient(to bottom, black 33%, transparent 33%)' }}></div>
          <Card className="col-span-3 row-span-6 bg-primary relative p-0 rounded-xl overflow-hidden">
            <Image src="/uploads/reviews/review1.png" alt="" fill className="object-cover" />
          </Card>
          <Card className="col-span-3 row-span-4 bg-secondary relative p-0 rounded-xl overflow-hidden">
            <Image src="/uploads/reviews/review2.png" alt="" fill className="object-cover" />
          </Card>
          <Card className="col-span-2 row-span-5 bg-accent relative p-0 rounded-xl overflow-hidden">
            <Image src="/uploads/reviews/review3.png" alt="" fill className="object-cover" />
          </Card>
          <Card className="col-span-2 row-span-5 bg-muted relative p-0 rounded-xl overflow-hidden">
            <Image src="/uploads/reviews/review4.png" alt="" fill className="object-cover" />
          </Card>
          <Card className="col-span-3 row-span-6 bg-primary relative p-0 rounded-xl overflow-hidden">
            <Image src="/uploads/reviews/review5.png" alt="" fill className="object-cover" />
          </Card>
          <Card className="col-span-4 row-span-5 bg-secondary relative p-0 rounded-xl overflow-hidden">
            <Image src="/uploads/reviews/review6.png" alt="" fill className="object-cover" />
          </Card>
          <Card className="col-span-3 row-span-4 bg-accent relative p-0 rounded-xl overflow-hidden">
            <Image src="/uploads/reviews/review7.png" alt="" fill className="object-cover" />
          </Card>
          <Card className="col-span-2 row-span-5 row-start-11 bg-primary relative p-0 rounded-xl overflow-hidden">
            <Image src="/uploads/reviews/review8.png" alt="" fill className="object-cover" />
          </Card>
          <Card className="col-span-3 row-span-4 row-start-11 bg-secondary relative p-0 rounded-xl overflow-hidden">
            <Image src="/uploads/reviews/review9.png" alt="" fill className="object-cover" />
          </Card>
          <Card className="col-span-2 row-span-4 row-start-11 bg-accent relative p-0 rounded-xl overflow-hidden">
            <Image src="/uploads/reviews/review10.png" alt="" fill className="object-cover" />
          </Card>
          <Card className="col-span-3 row-span-5 row-start-11 bg-muted relative p-0 rounded-xl overflow-hidden">
            <Image src="/uploads/reviews/review11.png" alt="" fill className="object-cover" />
          </Card>
          <Card className="col-span-5 row-span-6 row-start-15 bg-primary relative p-0 rounded-xl overflow-hidden">
            <Image src="/uploads/reviews/review12.png" alt="" fill className="object-cover" />
          </Card>
          <Card className="col-span-2 row-span-5 row-start-15 bg-secondary relative p-0 rounded-xl overflow-hidden">
            <Image src="/uploads/reviews/review13.png" alt="" fill className="object-cover" />
          </Card>
          <Card className="col-span-3 row-span-5 row-start-15 bg-accent relative p-0 rounded-xl overflow-hidden">
            <Image src="/uploads/reviews/review14.png" alt="" fill className="object-cover" />
          </Card>
        </div>
      </div>

      {/* Large Tablet layout (1024px to 1279px) */}
      <div className={`hidden lg:grid xl:hidden gap-3 grid-cols-12 ${isExpanded ? 'auto-rows-[minmax(100px,auto)]' : 'grid-rows-[repeat(4,minmax(100px,auto))]'} ${isExpanded ? 'h-auto' : 'h-[400px]'} transition-all duration-500 ease-in-out overflow-hidden`}>
        <div className={`absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none ${isExpanded ? 'hidden' : ''}`}></div>
        <Card className="col-span-4 row-span-2 bg-primary relative p-0 rounded-xl overflow-hidden">
          <Image src="/uploads/reviews/review15.png" alt="" fill className="object-cover" />
        </Card>
        <Card className="col-span-4 row-span-2 bg-secondary relative p-0 rounded-xl overflow-hidden">
          <Image src="/uploads/reviews/review16.png" alt="" fill className="object-cover" />
        </Card>
        <Card className="col-span-4 row-span-2 bg-accent relative p-0 rounded-xl overflow-hidden">
          <Image src="/uploads/reviews/review17.png" alt="" fill className="object-cover" />
        </Card>
        <Card className="col-span-3 row-span-2 bg-muted relative p-0 rounded-xl overflow-hidden">
          <Image src="/uploads/reviews/review18.png" alt="" fill className="object-cover" />
        </Card>
        <Card className="col-span-3 row-span-2 bg-primary relative p-0 rounded-xl overflow-hidden">
          <Image src="/uploads/reviews/review19.png" alt="" fill className="object-cover" />
        </Card>
        <Card className="col-span-3 row-span-2 bg-secondary relative p-0 rounded-xl overflow-hidden">
          <Image src="/uploads/reviews/review20.png" alt="" fill className="object-cover" />
        </Card>
        <Card className="col-span-3 row-span-2 bg-accent relative p-0 rounded-xl overflow-hidden">
          <Image src="/uploads/reviews/review21.png" alt="" fill className="object-cover" />
        </Card>
        <Card className="col-span-6 row-span-2 bg-muted relative p-0 rounded-xl overflow-hidden">
          <Image src="/uploads/reviews/review22.png" alt="" fill className="object-cover" />
        </Card>
        <Card className="col-span-6 row-span-2 bg-primary relative p-0 rounded-xl overflow-hidden">
          <Image src="/uploads/reviews/review23.png" alt="" fill className="object-cover" />
        </Card>
        <Card className="col-span-4 row-span-2 bg-secondary relative p-0 rounded-xl overflow-hidden">
          <Image src="/uploads/reviews/review24.png" alt="" fill className="object-cover" />
        </Card>
        <Card className="col-span-4 row-span-2 bg-accent relative p-0 rounded-xl overflow-hidden">
          <Image src="/uploads/reviews/review25.png" alt="" fill className="object-cover" />
        </Card>
        <Card className="col-span-4 row-span-2 bg-muted relative p-0 rounded-xl overflow-hidden">
          <Image src="/uploads/reviews/review26.png" alt="" fill className="object-cover" />
        </Card>
      </div>

      {/* Medium Tablet layout (768px to 1023px) */}
      <div className={`hidden md:grid lg:hidden gap-3 grid-cols-8 ${isExpanded ? 'auto-rows-[minmax(90px,auto)]' : 'grid-rows-[repeat(3,minmax(90px,auto))]'} ${isExpanded ? 'h-auto' : 'h-[270px]'} transition-all duration-500 ease-in-out overflow-hidden`}>
        <div className={`absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none ${isExpanded ? 'hidden' : ''}`}></div>
        <Card className="col-span-4 row-span-2 bg-primary relative p-0 rounded-xl overflow-hidden">
          <Image src="/uploads/reviews/review27.png" alt="" fill className="object-cover" />
        </Card>
        <Card className="col-span-4 row-span-2 bg-secondary relative p-0 rounded-xl overflow-hidden">
          <Image src="/uploads/reviews/review28.png" alt="" fill className="object-cover" />
        </Card>
        <Card className="col-span-2 row-span-2 bg-accent relative p-0 rounded-xl overflow-hidden">
          <Image src="/uploads/reviews/review29.png" alt="" fill className="object-cover" />
        </Card>
        <Card className="col-span-2 row-span-2 bg-muted relative p-0 rounded-xl overflow-hidden">
          <Image src="/uploads/reviews/review30.png" alt="" fill className="object-cover" />
        </Card>
        <Card className="col-span-2 row-span-2 bg-primary relative p-0 rounded-xl overflow-hidden">
          <Image src="/uploads/reviews/review31.png" alt="" fill className="object-cover" />
        </Card>
        <Card className="col-span-2 row-span-2 bg-secondary relative p-0 rounded-xl overflow-hidden">
          <Image src="/uploads/reviews/review32.png" alt="" fill className="object-cover" />
        </Card>
        <Card className="col-span-3 row-span-2 bg-accent relative p-0 rounded-xl overflow-hidden">
          <Image src="/uploads/reviews/review33.png" alt="" fill className="object-cover" />
        </Card>
        <Card className="col-span-3 row-span-2 bg-muted relative p-0 rounded-xl overflow-hidden">
          <Image src="/uploads/reviews/review34.png" alt="" fill className="object-cover" />
        </Card>
        <Card className="col-span-2 row-span-2 bg-primary relative p-0 rounded-xl overflow-hidden">
          <Image src="/uploads/reviews/review35.png" alt="" fill className="object-cover" />
        </Card>
      </div>

      {/* Small Tablet layout (640px to 767px) */}
      <div className={`hidden sm:grid md:hidden gap-3 grid-cols-6 ${isExpanded ? 'auto-rows-[minmax(80px,auto)]' : 'grid-rows-[repeat(3,minmax(80px,auto))]'} ${isExpanded ? 'h-auto' : 'h-[240px]'} transition-all duration-500 ease-in-out overflow-hidden`}>
        <div className={`absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none ${isExpanded ? 'hidden' : ''}`}></div>
        <Card className="col-span-3 row-span-2 bg-primary relative p-0 rounded-xl overflow-hidden">
          <Image src="/uploads/reviews/review37.png" alt="" fill className="object-cover" />
        </Card>
        <Card className="col-span-3 row-span-2 bg-secondary relative p-0 rounded-xl overflow-hidden">
          <Image src="/uploads/reviews/review38.png" alt="" fill className="object-cover" />
        </Card>
        <Card className="col-span-2 row-span-2 bg-accent relative p-0 rounded-xl overflow-hidden">
          <Image src="/uploads/reviews/review39.png" alt="" fill className="object-cover" />
        </Card>
        <Card className="col-span-2 row-span-2 bg-muted relative p-0 rounded-xl overflow-hidden">
          <Image src="/uploads/reviews/review40.png" alt="" fill className="object-cover" />
        </Card>
        <Card className="col-span-2 row-span-2 bg-primary relative p-0 rounded-xl overflow-hidden">
          <Image src="/uploads/reviews/review41.png" alt="" fill className="object-cover" />
        </Card>
        <Card className="col-span-3 row-span-2 bg-secondary relative p-0 rounded-xl overflow-hidden">
          <Image src="/uploads/reviews/review42.png" alt="" fill className="object-cover" />
        </Card>
        <Card className="col-span-3 row-span-2 bg-accent relative p-0 rounded-xl overflow-hidden">
          <Image src="/uploads/reviews/review43.png" alt="" fill className="object-cover" />
        </Card>
        <Card className="col-span-2 row-span-2 bg-muted relative p-0 rounded-xl overflow-hidden">
          <Image src="/uploads/reviews/review44.png" alt="" fill className="object-cover" />
        </Card>
        <Card className="col-span-2 row-span-2 bg-primary relative p-0 rounded-xl overflow-hidden">
          <Image src="/uploads/reviews/review45.png" alt="" fill className="object-cover" />
        </Card>
        <Card className="col-span-2 row-span-2 bg-secondary relative p-0 rounded-xl overflow-hidden">
          <Image src="/uploads/reviews/review46.png" alt="" fill className="object-cover" />
        </Card>
      </div>

      {/* Mobile layout (below 640px) */}
      <div className={`sm:hidden grid gap-4 grid-cols-12 ${isExpanded ? 'auto-rows-[minmax(60px,auto)]' : 'grid-rows-[repeat(4,minmax(60px,auto))]'} ${isExpanded ? 'h-auto' : 'h-[240px]'} transition-all duration-500 ease-in-out overflow-hidden`}>
        <div className={`absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none ${isExpanded ? 'hidden' : ''}`}></div>
        <Card className="col-span-12 row-span-3 bg-primary relative p-0 rounded-[2rem] overflow-hidden">
          <Image src="/uploads/reviews/review48.png" alt="" fill className="object-cover" />
        </Card>
        <Card className="col-span-7 row-span-2 bg-secondary relative p-0 rounded-[2rem] overflow-hidden">
          <Image src="/uploads/reviews/review49.png" alt="" fill className="object-cover" />
        </Card>
        <Card className="col-span-5 row-span-2 bg-accent relative p-0 rounded-[2rem] overflow-hidden">
          <Image src="/uploads/reviews/review50.png" alt="" fill className="object-cover" />
        </Card>
        <Card className="col-span-5 row-span-2 bg-muted relative p-0 rounded-[2rem] overflow-hidden">
          <Image src="/uploads/reviews/review51.png" alt="" fill className="object-cover" />
        </Card>
        <Card className="col-span-7 row-span-2 bg-primary relative p-0 rounded-[2rem] overflow-hidden">
          <Image src="/uploads/reviews/review52.png" alt="" fill className="object-cover" />
        </Card>
        <Card className="col-span-6 row-span-2 bg-secondary relative p-0 rounded-[2rem] overflow-hidden">
          <Image src="/uploads/reviews/review53.png" alt="" fill className="object-cover" />
        </Card>
        <Card className="col-span-6 row-span-2 bg-accent relative p-0 rounded-[2rem] overflow-hidden">
          <Image src="/uploads/reviews/review54.png" alt="" fill className="object-cover" />
        </Card>
      </div>
      <ExpandArrow />
    </div>
  )
}

