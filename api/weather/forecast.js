// Transform OpenWeatherMap response to Open-Meteo format
function transformToOpenMeteoFormat(owmData) {
  if (!owmData || !owmData.list || owmData.list.length === 0) {
    throw new Error('Invalid weather data received');
  }

  const currentWeather = owmData.list[0];
  const currentMain = currentWeather.main;
  const currentWeather0 = currentWeather.weather[0];
  
  // Map OpenWeatherMap weather codes to Open-Meteo weather codes
  const mapWeatherCode = (owmCode) => {
    // OpenWeatherMap uses codes like 800 (clear), 801-804 (clouds), 500-531 (rain), etc.
    // Open-Meteo uses WMO codes: 0 (clear), 1-3 (partly cloudy), 61-67 (rain), etc.
    if (owmCode === 800) return 0; // Clear sky
    if (owmCode >= 801 && owmCode <= 802) return 2; // Partly cloudy
    if (owmCode >= 803 && owmCode <= 804) return 3; // Overcast
    if (owmCode >= 500 && owmCode <= 531) return 61; // Rain
    if (owmCode >= 600 && owmCode <= 622) return 71; // Snow
    if (owmCode >= 200 && owmCode <= 232) return 95; // Thunderstorm
    if (owmCode >= 701 && owmCode <= 781) return 45; // Fog
    return 0; // Default to clear
  };

  // Group by day for daily forecast
  const dailyData = {};
  owmData.list.forEach(item => {
    const date = new Date(item.dt * 1000).toISOString().split('T')[0];
    if (!dailyData[date]) {
      dailyData[date] = {
        temps: [],
        weather_codes: [],
        precipitation: [],
        sunrise: item.sys?.sunrise,
        sunset: item.sys?.sunset
      };
    }
    dailyData[date].temps.push(item.main.temp);
    dailyData[date].weather_codes.push(mapWeatherCode(item.weather[0].id));
    dailyData[date].precipitation.push(item.pop * 100); // Probability of precipitation
  });

  const dates = Object.keys(dailyData).slice(0, 7);
  const daily = {
    time: dates,
    weather_code: dates.map(date => Math.max(...dailyData[date].weather_codes)),
    temperature_2m_max: dates.map(date => Math.max(...dailyData[date].temps)),
    temperature_2m_min: dates.map(date => Math.min(...dailyData[date].temps)),
    sunrise: dates.map(date => dailyData[date].sunrise ? new Date(dailyData[date].sunrise * 1000).toISOString() : ''),
    sunset: dates.map(date => dailyData[date].sunset ? new Date(dailyData[date].sunset * 1000).toISOString() : ''),
    uv_index_max: dates.map(() => 5), // Default UV index (OWM doesn't provide this in free tier)
    precipitation_probability_max: dates.map(date => Math.max(...dailyData[date].precipitation))
  };

  // Hourly data (next 24 hours from 3-hour intervals)
  const hourlyData = owmData.list.slice(0, 8); // 8 * 3 = 24 hours
  const hourly = {
    time: hourlyData.map(item => new Date(item.dt * 1000).toISOString()),
    temperature_2m: hourlyData.map(item => item.main.temp),
    precipitation_probability: hourlyData.map(item => item.pop * 100),
    weather_code: hourlyData.map(item => mapWeatherCode(item.weather[0].id)),
    wind_speed_10m: hourlyData.map(item => item.wind.speed)
  };

  // Current weather
  const current = {
    time: new Date(currentWeather.dt * 1000).toISOString(),
    temperature_2m: currentMain.temp,
    relative_humidity_2m: currentMain.humidity,
    apparent_temperature: currentMain.feels_like,
    precipitation: currentWeather.rain?.['3h'] || currentWeather.snow?.['3h'] || 0,
    weather_code: mapWeatherCode(currentWeather0.id),
    cloud_cover: currentWeather.clouds.all,
    wind_speed_10m: currentWeather.wind.speed,
    wind_direction_10m: currentWeather.wind.deg
  };

  return {
    latitude: owmData.city.coord.lat,
    longitude: owmData.city.coord.lon,
    timezone: 'auto',
    current,
    hourly,
    daily
  };
}

export default async function handler(req, res) {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: 'Latitude and longitude are required' });
  }

  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }

    const data = await response.json();
    const transformedData = transformToOpenMeteoFormat(data);
    res.status(200).json({ success: true, data: transformedData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
