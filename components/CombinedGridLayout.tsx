import React from 'react'

export default function ResponsiveBentoGrid() {
  return (
    <div className="w-full p-4">
      {/* Desktop layout (1024px and above) */}
      <div className="hidden lg:grid gap-4 grid-cols-10" style={{
        height: 'calc(480vw / 3)',
        gridTemplateRows: 'repeat(40, 1fr)'
      }}>
        <div className="col-span-4 row-span-6 bg-primary rounded-lg shadow-md flex items-center justify-center text-2xl text-primary-foreground">1</div>
        <div className="col-span-3 row-span-5 bg-secondary rounded-lg shadow-md flex items-center justify-center text-2xl text-secondary-foreground">2</div>
        <div className="col-span-3 row-span-6 bg-accent rounded-lg shadow-md flex items-center justify-center text-2xl text-accent-foreground">3</div>
        <div className="col-span-3 row-span-5 bg-muted rounded-lg shadow-md flex items-center justify-center text-2xl text-muted-foreground">4</div>
        <div className="col-span-2 row-span-4 bg-primary rounded-lg shadow-md flex items-center justify-center text-2xl text-primary-foreground">5</div>
        <div className="col-span-2 row-span-4 bg-secondary rounded-lg shadow-md flex items-center justify-center text-2xl text-secondary-foreground">6</div>
        <div className="col-span-3 row-span-4 bg-accent rounded-lg shadow-md flex items-center justify-center text-2xl text-accent-foreground">7</div>
        <div className="col-span-3 row-span-6 bg-muted rounded-lg shadow-md flex items-center justify-center text-2xl text-muted-foreground">8</div>
        <div className="col-span-3 row-span-4 bg-primary rounded-lg shadow-md flex items-center justify-center text-2xl text-primary-foreground">9</div>
        <div className="col-span-2 row-span-5 bg-secondary rounded-lg shadow-md flex items-center justify-center text-2xl text-secondary-foreground">10</div>
        <div className="col-span-2 row-span-5 bg-accent rounded-lg shadow-md flex items-center justify-center text-2xl text-accent-foreground">11</div>
        <div className="col-span-3 row-span-6 bg-muted rounded-lg shadow-md flex items-center justify-center text-2xl text-muted-foreground">12</div>
        <div className="col-span-4 row-span-5 bg-primary rounded-lg shadow-md flex items-center justify-center text-2xl text-primary-foreground">13</div>
        <div className="col-span-3 row-span-4 bg-secondary rounded-lg shadow-md flex items-center justify-center text-2xl text-secondary-foreground">14</div>
      </div>

      {/* Tablet and Mobile layout (below 1024px) */}
      <div className="lg:hidden grid gap-4 grid-cols-4 auto-rows-[minmax(120px,auto)]">
        <div className="col-span-2 row-span-2 bg-primary rounded-lg shadow-md flex items-center justify-center text-2xl text-primary-foreground">1</div>
        <div className="col-span-2 bg-secondary rounded-lg shadow-md flex items-center justify-center text-2xl text-secondary-foreground">2</div>
        <div className="col-span-2 bg-accent rounded-lg shadow-md flex items-center justify-center text-2xl text-accent-foreground">3</div>
        <div className="col-span-2 row-span-2 bg-muted rounded-lg shadow-md flex items-center justify-center text-2xl text-muted-foreground">4</div>
        <div className="bg-primary rounded-lg shadow-md flex items-center justify-center text-2xl text-primary-foreground">5</div>
        <div className="bg-secondary rounded-lg shadow-md flex items-center justify-center text-2xl text-secondary-foreground">6</div>
        <div className="col-span-2 bg-accent rounded-lg shadow-md flex items-center justify-center text-2xl text-accent-foreground">7</div>
        <div className="col-span-2 bg-muted rounded-lg shadow-md flex items-center justify-center text-2xl text-muted-foreground">8</div>
        <div className="col-span-2 bg-primary rounded-lg shadow-md flex items-center justify-center text-2xl text-primary-foreground">9</div>
        <div className="bg-secondary rounded-lg shadow-md flex items-center justify-center text-2xl text-secondary-foreground">10</div>
        <div className="bg-accent rounded-lg shadow-md flex items-center justify-center text-2xl text-accent-foreground">11</div>
        <div className="col-span-2 bg-muted rounded-lg shadow-md flex items-center justify-center text-2xl text-muted-foreground">12</div>
        <div className="col-span-2 bg-primary rounded-lg shadow-md flex items-center justify-center text-2xl text-primary-foreground">13</div>
        <div className="col-span-2 bg-secondary rounded-lg shadow-md flex items-center justify-center text-2xl text-secondary-foreground">14</div>
      </div>
    </div>
  )
}

