# Cloud-Based Real-Time Weather Forecasting Dashboard

A real-time weather analytics dashboard that fetches weather data from OpenWeatherMap API, processes it in the cloud, and displays live visual reports with interactive charts.

## Features

- **Real-time Weather Data**: Current weather conditions for any city
- **5-Day Forecast**: Detailed weather predictions with hourly breakdown
- **Interactive Charts**: Temperature, humidity, and wind speed visualizations
- **Popular Cities**: Quick access to weather in major cities worldwide
- **Auto-refresh**: Data updates every 5 minutes
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

### Frontend
- React.js
- Recharts (for data visualization)
- Axios (for API calls)
- React Icons

### Backend
- Flask (Python)
- OpenWeatherMap API
- MongoDB for data storage
- Flask-CORS for cross-origin requests

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- Python (v3.8 or higher)
- MongoDB Atlas account (or local MongoDB)
- OpenWeatherMap API key (free tier available)

### Get OpenWeatherMap API Key

1. Go to [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Navigate to API keys section
4. Generate a new API key
5. Copy the API key for configuration

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
venv\Scripts\activate  # On Windows
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

5. Configure your `.env` file:
```
OPENWEATHER_API_KEY=your-api-key-here
MONGO_URI=your-mongodb-connection-string
```

6. Run the backend:
```bash
python app.py
```

Backend will run on `http://localhost:5001`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update API URL in `.env` if needed

5. Run the frontend:
```bash
npm start
```

Frontend will run on `http://localhost:3000`

## API Endpoints

- `GET /api/weather/current?city=<city_name>` - Get current weather
- `GET /api/weather/forecast?city=<city_name>` - Get 5-day forecast
- `GET /api/weather/history?city=<city_name>` - Get historical data
- `GET /api/weather/cities` - Get weather for popular cities
- `POST /api/weather/alerts` - Check for extreme weather conditions

## Features Breakdown

### Current Weather Display
- Temperature (current and feels like)
- Weather description with icon
- Wind speed and direction
- Humidity percentage
- Atmospheric pressure
- Visibility
- Sunrise and sunset times

### 5-Day Forecast
- Daily high and low temperatures
- Weather conditions for each day
- Hourly temperature trends
- Humidity and wind speed charts

### Data Visualization
- Temperature trend area chart
- Humidity and wind speed line charts
- Interactive tooltips
- Responsive charts that adapt to screen size

### Popular Cities Widget
- Pre-loaded weather for major cities
- Quick access to global weather
- One-click city selection

## Cloud Deployment Options

### Backend Deployment

**AWS Lambda + API Gateway:**
```bash
# Install serverless framework
npm install -g serverless

# Deploy
serverless deploy
```

### Frontend Deployment

**Vercel:**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel
```

## MongoDB Setup

1. Create account on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier available)
3. Create a database user
4. Whitelist your IP address (or use 0.0.0.0/0 for all IPs)
5. Get connection string and add to `.env`

## Environment Variables

### Backend (.env)
```
OPENWEATHER_API_KEY=your-openweathermap-api-key
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/weather_db
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5001
```

## Future Enhancements

- Email/SMS alerts for extreme weather
- Weather maps integration
- Historical weather analysis
- Weather comparison between cities
- Favorite cities management
- Customizable weather widgets
- Air quality index
- UV index and health recommendations

## Troubleshooting

### API Key Issues
- Ensure your OpenWeatherMap API key is active (can take a few hours after creation)
- Check API key is correctly set in `.env` file

### CORS Errors
- Ensure Flask-CORS is installed
- Check backend is running on correct port

### Chart Not Displaying
- Verify Recharts is installed: `npm install recharts`
- Check browser console for errors

## License

MIT License
