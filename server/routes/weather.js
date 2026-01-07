import express from 'express';
import rateLimit from 'express-rate-limit';
import { weatherValidation } from '../middleware/validator.js';
import { AppError } from '../middleware/errorHandler.js';

const router = express.Router();

// Weather-specific rate limiting
const weatherLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute
  message: 'Too many weather requests, please try again later.'
});

// Fetch Weather by Coordinates
router.get('/forecast', weatherLimiter, weatherValidation, async (req, res, next) => {
  try {
    const { lat, lon } = req.query;
    
    if (!lat || !lon) {
      throw new AppError('Latitude and longitude are required', 400);
    }
    
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,precipitation_probability,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max&timezone=auto`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new AppError('Failed to fetch weather data', response.status);
    }
    
    const data = await response.json();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

// Geocoding API - City Search
router.get('/geocoding', weatherLimiter, weatherValidation, async (req, res, next) => {
  try {
    const { city } = req.query;
    
    if (!city) {
      throw new AppError('City name is required', 400);
    }
    
    // Sanitize city name
    const sanitizedCity = city.trim().substring(0, 100);
    
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(sanitizedCity)}&count=10&language=en&format=json`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new AppError('Failed to fetch geocoding data', response.status);
    }
    
    const data = await response.json();
    res.json({ success: true, data: data.results || [] });
  } catch (error) {
    next(error);
  }
});

// Prayer Times API
router.get('/prayer-times', weatherLimiter, weatherValidation, async (req, res, next) => {
  try {
    const { lat, lon } = req.query;
    
    if (!lat || !lon) {
      throw new AppError('Latitude and longitude are required', 400);
    }
    
    const url = `https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=2`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new AppError('Failed to fetch prayer times', response.status);
    }
    
    const data = await response.json();
    res.json({ success: true, data: data.data || null });
  } catch (error) {
    next(error);
  }
});

// Reverse Geocoding (OpenStreetMap Nominatim)
router.get('/reverse-geocoding', weatherLimiter, weatherValidation, async (req, res, next) => {
  try {
    const { lat, lon } = req.query;
    
    if (!lat || !lon) {
      throw new AppError('Latitude and longitude are required', 400);
    }
    
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'WeatherForecastApp/1.0'
      }
    });
    
    if (!response.ok) {
      throw new AppError('Failed to fetch location data', response.status);
    }
    
    const data = await response.json();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

export default router;
