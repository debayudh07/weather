"use client"

import { useState, useEffect } from "react"
import Searchwea from "@/components/functions/Searchwea"

import Dayforecast from "@/components/functions/Dayforecast"
import Footer from "@/components/functions/footer"
import Header from "@/components/functions/Header"

export default function WeatherHomepage() {

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className={`flex flex-col min-h-screen bg-gradient-to-b from-blue-100 to-blue-200 transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <Searchwea />

    
        <Dayforecast />

      </main>

      <Footer />
    </div>
  )
}

