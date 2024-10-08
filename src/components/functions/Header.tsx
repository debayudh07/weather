import Link from 'next/link'
import React from 'react'
import { useState } from 'react'
import { Cloud, Menu , X } from "lucide-react"
const Header = () => {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  React.useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div>
      <header className="sticky top-0 z-50 transition-all duration-300 ease-in-out">
        <div className={`container mx-auto px-4 ${isLoaded ? 'translate-y-0' : '-translate-y-full'}`}>
          <nav className="flex items-center justify-between h-16 bg-white bg-opacity-90 backdrop-blur-md shadow-sm rounded-b-lg md:rounded-lg my-2">
            <Link href="/" className="flex items-center space-x-2 ml-4">
              <Cloud className="h-8 w-8 text-blue-500" />
              <span className="text-xl font-bold text-blue-800">WeatherApp</span>
            </Link>
            <div className="hidden md:flex space-x-4 mr-4">
              <Link href="/" className="text-blue-600 hover:text-blue-800 transition-colors">Home</Link>
              <Link href="/forecast" className="text-blue-600 hover:text-blue-800 transition-colors">Forecast</Link>
              <Link href="/maps" className="text-blue-600 hover:text-blue-800 transition-colors">Maps</Link>
              <Link href="/about" className="text-blue-600 hover:text-blue-800 transition-colors">About</Link>
            </div>
            <button onClick={toggleMenu} className="md:hidden text-blue-600 hover:text-blue-800 mr-4">
              <Menu className="h-6 w-6" />
            </button>
          </nav>
        </div>
      </header>


      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white bg-opacity-90 backdrop-blur-md md:hidden">
          <div className="container mx-auto px-4 py-6">
            <div className="flex justify-end">
              <button onClick={toggleMenu} className="text-blue-600 hover:text-blue-800">
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="mt-8">
              <ul className="space-y-4">
                <li><Link href="/" className="block text-2xl text-blue-600 hover:text-blue-800 transition-colors" onClick={toggleMenu}>Home</Link></li>
                <li><Link href="/forecast" className="block text-2xl text-blue-600 hover:text-blue-800 transition-colors" onClick={toggleMenu}>Forecast</Link></li>
                <li><Link href="/maps" className="block text-2xl text-blue-600 hover:text-blue-800 transition-colors" onClick={toggleMenu}>Maps</Link></li>
                <li><Link href="/about" className="block text-2xl text-blue-600 hover:text-blue-800 transition-colors" onClick={toggleMenu}>About</Link></li>
              </ul>
            </nav>
          </div>
        </div>
      )}
    </div>
  )
}

export default Header
