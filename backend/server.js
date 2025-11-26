const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Configuration
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/';

// MongoDB connection
let db;
let weatherCollection;

MongoClient.connect(MONGO_URI)
  .then(client => {
    console.log('✓ Connected to MongoDB');
    db = client.db('weather_db');
    weatherCollection = db.collection('weather_data');
  })
  .catch(err => {
    console.log('✗ MongoDB connection failed:', err.message);
    console.log('✓ Running without MongoDB - data will not be persisted');
  });

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Weather Forecasting API',
    status: 'running',
    version: '1.0.0',
    endpoints: [
      '/api/weather/current',
      '/api/weather/forecast',
      '/api/weather/history',
      '/api/weather/cities',
      '/api/weather/alerts'
    ]
  });
});

// Get current weather
app.get('/api/weather/current', async (req, res) => {
  try {
    const { city } = req.query;

    if (!city) {
      return res.status(400).json({ error: 'City parameter is required' });
    }

    if (!OPENWEATHER_API_KEY) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    const response = await axios.get(`${OPENWEATHER_BASE_URL}/weather`, {
      params: {
        q: city,
        appid: OPENWEATHER_API_KEY,
        units: 'metric'
      }
    });

    const data = response.data;

    const weatherData = {
      city: data.name,
      country: data.sys.country,
      temperature: data.main.temp,
      feels_like: data.main.feels_like,
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      wind_speed: data.wind.speed,
      wind_direction: data.wind.deg || 0,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      clouds: data.clouds.all,
      visibility: data.visibility || 0,
      timestamp: new Date().toISOString(),
      sunrise: new Date(data.sys.sunrise * 1000).toISOString(),
      sunset: new Date(data.sys.sunset * 1000).toISOString()
    };

    // Store in database if available
    if (weatherCollection) {
      try {
        await weatherCollection.insertOne({
          ...weatherData,
          type: 'current',
          query_time: new Date()
        });
      } catch (dbError) {
        console.error('Database insert error:', dbError.message);
      }
    }

    res.json(weatherData);
  } catch (error) {
    console.error('Current weather error:', error.message);
    if (error.response) {
      res.status(error.response.status).json({ 
        error: error.response.data.message || 'City not found or API error' 
      });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Get forecast
app.get('/api/weather/forecast', async (req, res) => {
  try {
    const { city } = req.query;

    if (!city) {
      return res.status(400).json({ error: 'City parameter is required' });
    }

    if (!OPENWEATHER_API_KEY) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    const response = await axios.get(`${OPENWEATHER_BASE_URL}/forecast`, {
      params: {
        q: city,
        appid: OPENWEATHER_API_KEY,
        units: 'metric'
      }
    });

    const data = response.data;

    const forecastList = data.list.map(item => ({
      datetime: item.dt_txt,
      temperature: item.main.temp,
      feels_like: item.main.feels_like,
      temp_min: item.main.temp_min,
      temp_max: item.main.temp_max,
      humidity: item.main.humidity,
      pressure: item.main.pressure,
      wind_speed: item.wind.speed,
      description: item.weather[0].description,
      icon: item.weather[0].icon,
      clouds: item.clouds.all,
      pop: (item.pop || 0) * 100
    }));

    const forecastData = {
      city: data.city.name,
      country: data.city.country,
      forecast: forecastList,
      timestamp: new Date().toISOString()
    };

    // Store in database if available
    if (weatherCollection) {
      try {
        await weatherCollection.insertOne({
          ...forecastData,
          type: 'forecast',
          query_time: new Date()
        });
      } catch (dbError) {
        console.error('Database insert error:', dbError.message);
      }
    }

    res.json(forecastData);
  } catch (error) {
    console.error('Forecast error:', error.message);
    if (error.response) {
      res.status(error.response.status).json({ 
        error: error.response.data.message || 'City not found or API error' 
      });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Get weather history
app.get('/api/weather/history', async (req, res) => {
  try {
    const { city, limit = 10 } = req.query;

    if (!city) {
      return res.status(400).json({ error: 'City parameter is required' });
    }

    if (!weatherCollection) {
      return res.json({
        city,
        count: 0,
        history: [],
        message: 'Database not available'
      });
    }

    const history = await weatherCollection
      .find(
        { 
          city: new RegExp(city, 'i'),
          type: 'current'
        },
        { projection: { _id: 0 } }
      )
      .sort({ query_time: -1 })
      .limit(parseInt(limit))
      .toArray();

    res.json({
      city,
      count: history.length,
      history
    });
  } catch (error) {
    console.error('History error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get popular cities weather
app.get('/api/weather/cities', async (req, res) => {
  try {
    const cities = ['London', 'New York', 'Tokyo', 'Paris', 'Sydney', 'Dubai', 'Mumbai', 'Singapore'];
    const weatherData = [];

    for (const city of cities) {
      try {
        const response = await axios.get(`${OPENWEATHER_BASE_URL}/weather`, {
          params: {
            q: city,
            appid: OPENWEATHER_API_KEY,
            units: 'metric'
          },
          timeout: 5000
        });

        const data = response.data;
        weatherData.push({
          city: data.name,
          country: data.sys.country,
          temperature: data.main.temp,
          description: data.weather[0].description,
          icon: data.weather[0].icon,
          humidity: data.main.humidity,
          wind_speed: data.wind.speed
        });
      } catch (error) {
        console.error(`Error fetching ${city}:`, error.message);
      }
    }

    res.json({ cities: weatherData });
  } catch (error) {
    console.error('Cities error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Check weather alerts
app.post('/api/weather/alerts', async (req, res) => {
  try {
    const { city, email } = req.body;

    if (!city) {
      return res.status(400).json({ error: 'City is required' });
    }

    const response = await axios.get(`${OPENWEATHER_BASE_URL}/weather`, {
      params: {
        q: city,
        appid: OPENWEATHER_API_KEY,
        units: 'metric'
      }
    });

    const weatherData = response.data;
    const alerts = [];
    const temp = weatherData.main.temp;
    const windSpeed = weatherData.wind.speed;

    // Check for extreme conditions
    if (temp > 35) {
      alerts.push({
        type: 'heat',
        severity: 'high',
        message: `Extreme heat warning: ${temp}°C`
      });
    } else if (temp < 0) {
      alerts.push({
        type: 'cold',
        severity: 'high',
        message: `Freezing temperature: ${temp}°C`
      });
    }

    if (windSpeed > 20) {
      alerts.push({
        type: 'wind',
        severity: 'medium',
        message: `High wind speed: ${windSpeed} m/s`
      });
    }

    res.json({
      city,
      alerts,
      alert_count: alerts.length
    });
  } catch (error) {
    console.error('Alerts error:', error.message);
    if (error.response && error.response.status === 404) {
      res.status(404).json({ error: 'City not found' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
});

module.exports = app;
