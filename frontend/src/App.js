import React, { useState, useEffect } from 'react';
import './App.css';
import WeatherCard from './components/WeatherCard';
import ForecastChart from './components/ForecastChart';
import SearchBar from './components/SearchBar';
import PopularCities from './components/PopularCities';
import axios from 'axios';

const API_URL = ('https://vercel.com/nishath-j-ps-projects/weather-app-be/BsKbQZrJq21AE4rYWJtkrTJMSMZf').replace(/\/$/, '');

function App() {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedCity, setSelectedCity] = useState('London');

  useEffect(() => {
    fetchWeatherData(selectedCity);
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(() => {
      fetchWeatherData(selectedCity);
    }, 300000);
    
    return () => clearInterval(interval);
  }, [selectedCity]);

  const fetchWeatherData = async (city) => {
    setLoading(true);
    setError('');
    
    try {
      // Fetch current weather and forecast in parallel
      const [currentResponse, forecastResponse] = await Promise.all([
        axios.get(`${API_URL}/api/weather/current?city=${encodeURIComponent(city)}`),
        axios.get(`${API_URL}/api/weather/forecast?city=${encodeURIComponent(city)}`)
      ]);
      
      setCurrentWeather(currentResponse.data);
      setForecast(forecastResponse.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch weather data');
      setCurrentWeather(null);
      setForecast(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (city) => {
    setSelectedCity(city);
  };

  const handleCitySelect = (city) => {
    setSelectedCity(city);
  };

  return (
    <div className="App">
      <div className="container">
        <header className="header">
          <h1>Weather Dashboard</h1>
          <p>Real-time weather forecasting and analytics</p>
        </header>

        <SearchBar onSearch={handleSearch} />

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading weather data...</p>
          </div>
        ) : (
          <>
            {currentWeather && (
              <WeatherCard weather={currentWeather} />
            )}

            {forecast && (
              <ForecastChart forecast={forecast} />
            )}
          </>
        )}

        <PopularCities onCitySelect={handleCitySelect} />

        <footer className="footer">
          <p>Last updated: {new Date().toLocaleString()}</p>
          <p>Data provided by OpenWeatherMap</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
