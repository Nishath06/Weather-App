import React from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './ForecastChart.css';

function ForecastChart({ forecast }) {
  // Process forecast data for charts
  const processedData = forecast.forecast.slice(0, 40).map(item => ({
    time: new Date(item.datetime).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit'
    }),
    temperature: Math.round(item.temperature),
    feels_like: Math.round(item.feels_like),
    humidity: item.humidity,
    wind_speed: item.wind_speed,
    description: item.description
  }));

  // Get daily forecast (one per day)
  const dailyForecast = [];
  const seenDates = new Set();
  
  forecast.forecast.forEach(item => {
    const date = new Date(item.datetime).toDateString();
    if (!seenDates.has(date) && dailyForecast.length < 5) {
      seenDates.add(date);
      dailyForecast.push({
        date: new Date(item.datetime).toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric'
        }),
        temp_max: Math.round(item.temp_max),
        temp_min: Math.round(item.temp_min),
        description: item.description,
        icon: item.icon,
        humidity: item.humidity,
        wind_speed: item.wind_speed
      });
    }
  });

  return (
    <div className="forecast-section">
      <h2>5-Day Forecast for {forecast.city}</h2>

      {/* Daily Cards */}
      <div className="daily-forecast">
        {dailyForecast.map((day, index) => (
          <div key={index} className="day-card">
            <div className="day-date">{day.date}</div>
            <img
              src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
              alt={day.description}
              className="day-icon"
            />
            <div className="day-description">{day.description}</div>
            <div className="day-temp">
              <span className="temp-max">{day.temp_max}°</span>
              <span className="temp-separator">/</span>
              <span className="temp-min">{day.temp_min}°</span>
            </div>
            <div className="day-details">
              <div>💧 {day.humidity}%</div>
              <div>🌬️ {day.wind_speed} m/s</div>
            </div>
          </div>
        ))}
      </div>

      {/* Temperature Chart */}
      <div className="chart-container">
        <h3>Temperature Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={processedData}>
            <defs>
              <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#667eea" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#667eea" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis
              dataKey="time"
              stroke="#666"
              tick={{ fontSize: 12 }}
              interval={3}
            />
            <YAxis
              stroke="#666"
              tick={{ fontSize: 12 }}
              label={{ value: '°C', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #ddd',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="temperature"
              stroke="#667eea"
              fillOpacity={1}
              fill="url(#colorTemp)"
              name="Temperature"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Humidity & Wind Chart */}
      <div className="chart-container">
        <h3>Humidity & Wind Speed</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={processedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis
              dataKey="time"
              stroke="#666"
              tick={{ fontSize: 12 }}
              interval={3}
            />
            <YAxis
              yAxisId="left"
              stroke="#666"
              tick={{ fontSize: 12 }}
              label={{ value: '%', angle: -90, position: 'insideLeft' }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#666"
              tick={{ fontSize: 12 }}
              label={{ value: 'm/s', angle: 90, position: 'insideRight' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #ddd',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="humidity"
              stroke="#2ecc71"
              strokeWidth={2}
              dot={{ r: 3 }}
              name="Humidity (%)"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="wind_speed"
              stroke="#3498db"
              strokeWidth={2}
              dot={{ r: 3 }}
              name="Wind Speed (m/s)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ForecastChart;
