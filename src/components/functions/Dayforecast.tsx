"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Cloud } from "lucide-react";
import axios from 'axios';

interface Forecast {
  day: string;
  tempMax: number;
  tempMin: number;
  icon: string;
}

const getDayName = (index: number) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = new Date().getDay();
  return days[(today + index) % 7];
}

const Dayforecast: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [forecastData, setForecastData] = useState<Forecast[]>([]);
  const [error, setError] = useState<string | null>(null);

  const API_KEY = '904b3b12ba092ce98a74445951383a6d';  // Replace with your actual OpenWeatherMap API key
  const city = 'Kolkata'; // You can change this to a dynamic city input or variable

  useEffect(() => {
    setIsLoaded(true);
    fetchForecast();
  }, []);

  const fetchForecast = async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${API_KEY}`
      );
      const dailyData = processForecastData(response.data.list);
      setForecastData(dailyData);
    } catch (err) {
      setError('Failed to fetch forecast data');
    }
  };

  // Function to process forecast data and extract one forecast per day
  const processForecastData = (data: any[]): Forecast[] => {
    const forecastByDay: Forecast[] = [];
    const noonForecasts = data.filter((item) => item.dt_txt.includes('12:00:00'));

    noonForecasts.slice(0, 5).forEach((item, index) => {
      forecastByDay.push({
        day: getDayName(index),
        tempMax: Math.round(item.main.temp_max),
        tempMin: Math.round(item.main.temp_min),
        icon: item.weather[0].icon, // OpenWeatherMap provides weather icons, you can use these
      });
    });

    return forecastByDay;
  };

  return (
    <div>
      <section
        className={`transition-all duration-1000 delay-700 ${
          isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}
      >
        <h2 className="text-2xl font-semibold text-blue-800 mb-4">5-Day Forecast</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {error && <p className="text-red-600">{error}</p>}
          {!error &&
            forecastData.map((forecast, index) => (
              <Card
                key={index}
                className="bg-white bg-opacity-50 backdrop-blur-md transform transition duration-500 hover:scale-105 hover:bg-opacity-75"
              >
                <CardContent className="p-4 text-center">
                  <p className="font-semibold text-blue-800">{forecast.day}</p>
                  <img
                    src={`http://openweathermap.org/img/wn/${forecast.icon}.png`}
                    alt="Weather Icon"
                    className="h-12 w-12 mx-auto my-2"
                  />
                  <p className="text-2xl font-bold text-blue-800">{forecast.tempMax}°F</p>
                  <p className="text-sm text-blue-600">{forecast.tempMin}°F</p>
                </CardContent>
              </Card>
            ))}
        </div>
      </section>
    </div>
  );
};

export default Dayforecast;
