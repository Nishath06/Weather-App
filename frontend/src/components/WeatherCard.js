import React from 'react';
import { WiDaySunny, WiRain, WiCloudy, WiSnow, WiThunderstorm, WiFog } from 'react-icons/wi';
import { FiWind, FiDroplet, FiEye, FiSunrise, FiSunset } from 'react-icons/fi';
import './WeatherCard.css';

function WeatherCard({ weather }) {
  const getWeatherIcon = (iconCode) => {
    const iconMap = {
      '01d': <WiDaySunny />,
      '01n': <WiDaySunny />,
      '02d': <WiCloudy />,
      '02n': <WiCloudy />,
      '03d': <WiCloudy />,
      '03n': <WiCloudy />,
      '04d': <WiCloudy />,
      '04n': <WiCloudy />,
      '09d': <WiRain />,
      '09n': <WiRain />,
      '10d': <WiRain />,
      '10n': <WiRain />,
      '11d': <WiThunderstorm />,
      '11n': <WiThunderstorm />,
      '13d': <WiSnow />,
      '13n': <WiSnow />,
      '50d': <WiFog />,
      '50n': <WiFog />,
    };
    return iconMap[iconCode] || <WiDaySunny />;
  };

  const formatTime = (isoString) => {
    return new Date(isoString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="weather-card">
      <div className="weather-main">
        <div className="weather-icon">
          {getWeatherIcon(weather.icon)}
        </div>
        <div className="weather-info">
          <h2>{weather.city}, {weather.country}</h2>
          <div className="temperature">{Math.round(weather.temperature)}°C</div>
          <div className="description">{weather.description}</div>
          <div className="feels-like">Feels like {Math.round(weather.feels_like)}°C</div>
        </div>
      </div>

      <div className="weather-details">
        <div className="detail-item">
          <FiWind className="detail-icon" />
          <div className="detail-info">
            <div className="detail-label">Wind Speed</div>
            <div className="detail-value">{weather.wind_speed} m/s</div>
          </div>
        </div>

        <div className="detail-item">
          <FiDroplet className="detail-icon" />
          <div className="detail-info">
            <div className="detail-label">Humidity</div>
            <div className="detail-value">{weather.humidity}%</div>
          </div>
        </div>

        <div className="detail-item">
          <FiEye className="detail-icon" />
          <div className="detail-info">
            <div className="detail-label">Visibility</div>
            <div className="detail-value">{(weather.visibility / 1000).toFixed(1)} km</div>
          </div>
        </div>

        <div className="detail-item">
          <FiSunrise className="detail-icon" />
          <div className="detail-info">
            <div className="detail-label">Sunrise</div>
            <div className="detail-value">{formatTime(weather.sunrise)}</div>
          </div>
        </div>

        <div className="detail-item">
          <FiSunset className="detail-icon" />
          <div className="detail-info">
            <div className="detail-label">Sunset</div>
            <div className="detail-value">{formatTime(weather.sunset)}</div>
          </div>
        </div>

        <div className="detail-item">
          <div className="detail-icon">🌡️</div>
          <div className="detail-info">
            <div className="detail-label">Pressure</div>
            <div className="detail-value">{weather.pressure} hPa</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WeatherCard;
