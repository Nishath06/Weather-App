import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PopularCities.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

function PopularCities({ onCitySelect }) {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPopularCities();
  }, []);

  const fetchPopularCities = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/weather/cities`);
      setCities(response.data.cities);
    } catch (err) {
      console.error('Failed to fetch popular cities:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="popular-cities">
        <h2>Popular Cities</h2>
        <div className="loading-cities">Loading cities...</div>
      </div>
    );
  }

  return (
    <div className="popular-cities">
      <h2>Popular Cities</h2>
      <div className="cities-grid">
        {cities.map((city, index) => (
          <div
            key={index}
            className="city-card"
            onClick={() => onCitySelect(city.city)}
          >
            <div className="city-header">
              <h3>{city.city}</h3>
              <span className="country-code">{city.country}</span>
            </div>
            <div className="city-weather">
              <img
                src={`https://openweathermap.org/img/wn/${city.icon}@2x.png`}
                alt={city.description}
                className="city-icon"
              />
              <div className="city-temp">{Math.round(city.temperature)}°C</div>
            </div>
            <div className="city-description">{city.description}</div>
            <div className="city-details">
              <span>💧 {city.humidity}%</span>
              <span>🌬️ {city.wind_speed} m/s</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PopularCities;
