"use client";
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Droplets, Sun, Wind, Search, MapPin } from "lucide-react";
import axios from 'axios';

// Define types for the API response
interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: {
    description: string;
  }[];
  wind: {
    speed: number;
  };
}

const Searchwea: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>(''); // search query is a string
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null); // weather data or null
  const [isLoaded, setIsLoaded] = useState<boolean>(false); // boolean state for animation
  const [error, setError] = useState<string | null>(null); // error message or null

  const API_KEY = '904b3b12ba092ce98a74445951383a6d';  // Replace with your actual API key

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const fetchWeather = async (url: string) => {
    try {
      const response = await axios.get(url);
      setWeatherData(response.data);
      setError(null);
    } catch {
      setError("City not found or API error");
    }
  };

  // Function to fetch weather by city or zip code
  const handleSearch = () => {
    if (!searchQuery) {
      setError("Please enter a valid city or zip code");
      return;
    }
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${searchQuery}&units=imperial&appid=${API_KEY}`;
    fetchWeather(url);
  };

  // Function to fetch weather by geolocation
  const handleLocationSearch = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=imperial&appid=${API_KEY}`;
        fetchWeather(url);
      },
      () => {
        setError("Unable to retrieve your location");
      }
    );
  };

  return (
    <div>
      <section
        className={`text-center mb-12 transition-all duration-1000 delay-300 ${
          isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}
      >
        <h1 className="text-3xl md:text-4xl font-bold text-blue-800 mb-4">
          Your Weather, Anytime, Anywhere
        </h1>
        <p className="text-lg md:text-xl text-blue-600 mb-8">
          Get accurate weather forecasts for any location
        </p>

        {/* Input search and Geolocation buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <Input
            type="text"
            placeholder="Enter a city or zip code"
            className="w-full max-w-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button className="w-full sm:w-auto" onClick={handleSearch}>
            <Search className="mr-2 h-4 w-4" /> Search
          </Button>
          <Button className="w-full sm:w-auto" onClick={handleLocationSearch}>
            <MapPin className="mr-2 h-4 w-4" /> Use My Location
          </Button>
        </div>

        {error && <p className="text-red-600 mt-4">{error}</p>}
      </section>

      {/* Weather Display Section */}
      {weatherData && (
        <section
          className={`mb-12 transition-all duration-1000 delay-500 ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <h2 className="text-2xl font-semibold text-blue-800 mb-4">Current Weather</h2>
          <Card className="bg-white bg-opacity-50 backdrop-blur-md transform transition duration-500 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start sm:justify-between">
                <div className="text-center sm:text-left mb-4 sm:mb-0">
                  <h3 className="text-2xl sm:text-3xl font-bold text-blue-800">
                    {weatherData.name}
                  </h3>
                  <p className="text-lg sm:text-xl text-blue-600">
                    {weatherData.weather[0].description}
                  </p>
                </div>
                <div className="text-center sm:text-right">
                  <p className="text-4xl sm:text-5xl font-bold text-blue-800">
                    {Math.round(weatherData.main.temp)}°F
                  </p>
                  <p className="text-blue-600">
                    Feels like {Math.round(weatherData.main.feels_like)}°F
                  </p>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div>
                  <Wind className="h-8 w-8 mx-auto text-blue-500" />
                  <p className="mt-2 text-blue-800">Wind</p>
                  <p className="font-semibold">{Math.round(weatherData.wind.speed)} mph</p>
                </div>
                <div>
                  <Droplets className="h-8 w-8 mx-auto text-blue-500" />
                  <p className="mt-2 text-blue-800">Humidity</p>
                  <p className="font-semibold">{weatherData.main.humidity}%</p>
                </div>
                <div>
                  <Sun className="h-8 w-8 mx-auto text-blue-500" />
                  <p className="mt-2 text-blue-800">UV Index</p>
                  <p className="font-semibold">N/A</p> {/* OpenWeatherMap free API doesn't have UV Index */}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      )}
    </div>
  );
};

export default Searchwea;
