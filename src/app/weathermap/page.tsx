"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Search } from "lucide-react";
import axios from "axios";
import Header from "@/components/functions/Header";

// Dynamically import MapContainer from react-leaflet to prevent SSR errors
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
import { useMap } from "react-leaflet";
import L from "leaflet";

// Custom icon for the weather overlay marker
function getWeatherIcon(condition: string) {
  switch (condition) {
    case "Clear":
      return "☀️"; // Sun icon for clear weather
    case "Clouds":
      return "☁️"; // Cloud icon for cloudy weather
    case "Rain":
      return "🌧️"; // Rainy cloud icon for rain
    case "Snow":
      return "❄️"; // Snowflake icon for snow
    case "Thunderstorm":
      return "⛈️"; // Thunderstorm icon
    case "Drizzle":
      return "🌦️"; // Drizzle icon
    case "Mist":
    case "Smoke":
    case "Haze":
    case "Fog":
      return "🌫️"; // Fog icon for mist/fog
    default:
      return "🌤️"; // Default partly cloudy icon
  }
}

// Function to generate random points within a radius (in kilometers) around a central latLng
function generateRandomPoints(lat: number, lng: number, numPoints: number, radius: number): [number, number][] {
  const points: [number, number][] = [];
  for (let i = 0; i < numPoints; i++) {
    const randomDistance = Math.random() * radius; // Random distance within the radius
    const randomAngle = Math.random() * 2 * Math.PI; // Random angle

    const deltaLat = (randomDistance / 111.32) * Math.cos(randomAngle); // 1 degree lat = ~111.32 km
    const deltaLng = (randomDistance / (111.32 * Math.cos(lat * (Math.PI / 180)))) * Math.sin(randomAngle); // Adjust for longitude

    points.push([lat + deltaLat, lng + deltaLng]);
  }
  return points;
}

// Helper component to update the map's center position when the location changes
function UpdateMapCenter({ latLng }: { latLng: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(latLng, 10);
  }, [latLng, map]);

  return null;
}

// Helper component to display weather overlays on multiple points in the map
function WeatherOverlay({
  points,
  weatherCondition,
}: {
  points: [number, number][];
  weatherCondition: string;
}) {
  const map = useMap();
  useEffect(() => {
    if (!points || points.length === 0) return;

    const weatherIcon = getWeatherIcon(weatherCondition);

    // Create markers for each point in the radius
    const markers = points.map((point) => {
      const overlayDiv = L.divIcon({
        className: "custom-overlay",
        html: `<div class="weather-icon-overlay text-4xl">${weatherIcon}</div>`,
      });
      return L.marker(point, { icon: overlayDiv }).addTo(map);
    });

    // Clean up markers when the component unmounts or updates
    return () => {
      markers.forEach((marker) => map.removeLayer(marker));
    };
  }, [points, weatherCondition, map]);

  return null;
}

export default function WeatherMapPage() {
  const [location, setLocation] = useState("New York");
  const [latLng, setLatLng] = useState<[number, number]>([40.7128, -74.006]);
  interface WeatherData {
    coord: {
      lat: number;
      lon: number;
    };
    weather: {
      main: string;
    }[];
    name: string;
  }

  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [points, setPoints] = useState<[number, number][]>([]);

  const API_KEY = "904b3b12ba092ce98a74445951383a6d"; // Replace with your actual OpenWeatherMap API key

  useEffect(() => {
    fetchWeather();
  }, [location]);

  const fetchWeather = async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=imperial&appid=${API_KEY}`
      );
      const data = response.data;
      setLatLng([data.coord.lat, data.coord.lon]);
      setWeatherData(data);

      // Generate points within a 10 km radius
      const generatedPoints = generateRandomPoints(data.coord.lat, data.coord.lon, 10, 35);
      setPoints(generatedPoints);
    } catch (err) {
      console.error("Error fetching weather data:", err);
    }
  };

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center justify-center">
        <div className="w-full max-w-7xl space-y-4">
          {/* Weather Information Card */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl font-bold flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
                <span className="mb-2 sm:mb-0">Weather Forecast</span>
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <Input
                    placeholder="Enter location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="max-w-full sm:max-w-xs"
                  />
                  <Button size="icon" onClick={fetchWeather}>
                    <Search className="h-4 w-4" />
                    <span className="sr-only">Search</span>
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weatherData && (
                  <>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-5 w-5 text-gray-500" />
                      <span className="text-lg sm:text-xl font-semibold">{weatherData.name}</span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Map Card */}
          <Card className="w-full">
            <CardContent className="p-0">
              <div className="h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]">
                <MapContainer
                  center={latLng}
                  zoom={10}
                  style={{ height: "100%", width: "100%" }}
                  scrollWheelZoom={false}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <UpdateMapCenter latLng={latLng} />
                  {weatherData && (
                    <WeatherOverlay
                      points={points}
                      weatherCondition={weatherData.weather[0].main}
                    />
                  )}
                </MapContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
