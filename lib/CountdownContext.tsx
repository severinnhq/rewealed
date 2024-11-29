'use client'

import React, { createContext, useContext, useState } from 'react'

interface CountdownContextType {
  isCountdownActive: boolean
  setIsCountdownActive: (active: boolean) => void
}

const CountdownContext = createContext<CountdownContextType | undefined>(undefined)

export const CountdownProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isCountdownActive, setIsCountdownActive] = useState(false)

  return (
    <CountdownContext.Provider value={{ isCountdownActive, setIsCountdownActive }}>
      {children}
    </CountdownContext.Provider>
  )
}

export const useCountdown = () => {
  const context = useContext(CountdownContext)
  if (context === undefined) {
    throw new Error('useCountdown must be used within a CountdownProvider')
  }
  return context
}

